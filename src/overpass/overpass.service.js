

/**
 * @class
 * Create osmOverpassAPI service instance
 */
class OverpassAPI{
    /**
     * @param {Object} $http angular $http service
     * @param {Object} $q  angular $q service
     * @param {Object} options
     */
    constructor($http, $q, options) {
        this.url = options.url;
        this.$http = $http;
        this.$q = $q;
    }
    /**
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
     * @return {Promise} $http.get
    */
    overpass(query) {
        var url = this.url;
        var deferred = this.$q.defer();
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        };
        this.$http.post(
            url,
            'data=' + encodeURIComponent(query),
            {headers: headers}
        ).then(function (data) {
            deferred.resolve(data.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    }
    /**
     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API/Overpass_QL#By_area_.28area.29
        By convention the area id can be calculated from an existing OSM way by adding 2400000000 to its OSM id, or in case of a relation by adding 3600000000 respectively. Note that area creation is subject to some extraction rules, i.e. not all ways/relations have an area counterpart (notably those that are tagged with area=no, and most multipolygons and that don't have a defined name=* will not be part of areas).
     * @param {String} type 'r'/'relation' or 'w'/'way'
     * @param {String/Number} osmId the id of the element
     * @return {Number} the area id
    */
    getAreaId(type, osmId) {
        var id;
        if (typeof osmId === 'string') {
            id = parseInt(osmId, 10);
        } else {
            id = osmId;
        }
        if (type === 'r' || type === 'relation') {
            return 3600000000 + id;
        } else if (type === 'w' || type === 'way') {
            return 2400000000 + id;
        }
    }
    overpassToGeoJSON(query, filter) {
        var deferred = this.$q.defer();
        var features = [];
        var relations = [];
        var result = {
            type: 'FeatureCollection',
            features: features,
            relations: relations
        };
        if (filter === undefined) {
            filter = function () {};
        }
        this.overpass(query).then(function (data) {
            //TODO check if data is XML or JSON, here it's JSON
            var node, feature, coordinates;
            var cache = {loaded:false};
            function getNodeById (id) {
                if (!cache.loaded) {
                    var tmp;
                    for (var i = 0; i < data.elements.length; i++) {
                        tmp = data.elements[i];
                        cache[tmp.id] = tmp;
                    }
                }
                return cache[id];
            }
            for (var i = 0; i < data.elements.length; i++) {
                node = data.elements[i];
                if (node.type === 'node') {
                    feature = {
                        type: 'Feature',
                        properties:node.tags,
                        id: node.id,
                        geometry: {
                            type:'Point',
                            coordinates: [node.lon, node.lat]
                        }
                    };
                    if (!filter(feature)) {
                        features.push(feature);
                    }
                } else if (node.type === 'way') {
                    coordinates = [];
                    feature = {
                        type: 'Feature',
                        properties:node.tags,
                        id: node.id,
                        geometry: {
                            type:'LineString',
                            coordinates: coordinates
                        }
                    };
                    for (var j = 0; j < node.nodes.length; j++) {
                        coordinates.push([
                            getNodeById(node.nodes[j]).lon,
                            getNodeById(node.nodes[j]).lat
                        ]);
                    }
                    if (!filter(feature)) {
                        features.push(feature);
                    }
                } else if (node.type === 'relation') {
                    result.relations.push({
                        ref: node.id,
                        tags: node.tags,
                        type: 'relation',
                        members: node.members
                    });
                }
            }
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
}

export default OverpassAPI;
