

/**
 * @ngdoc service
 * @name overpassAPI
 * @param  {any} $http
 * @param  {any} $q
 * @param  {any} osmSettingsService
 */
function osmOverpassAPI($http, $q, osmSettingsService, options) {
    this.overpass = function (query) {
        var url = this.url;
        var deferred = $q.defer();
        var self = this;
        var headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
        $http.post(
            url,
            'data=' + encodeURIComponent(query),
            {headers: headers}
        ).then(function (data) {
            deferred.resolve(data.data);
        }, function (data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    this.overpassToGeoJSON = function (query, filter) {
        var deferred = $q.defer();
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
            };
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
    };
}

export default osmOverpassAPI;
