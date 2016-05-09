

/**
 * @ngdoc service
 * @name overpassAPI 
 * @param  {any} $base64
 * @param  {any} $http
 * @param  {any} $q
 * @param  {any} osmSettingsService
 */
overpassAPI.$inject = ['$base64', '$http', '$q', 'osmSettingsService'];
function overpassAPI($base64, $http, $q, osmSettingsService) {
    var parseXml;
    var parser;

    if (typeof window.DOMParser !== 'undefined') {
        parser = new window.DOMParser();
        parseXml = function(xmlStr) {
            return parser.parseFromString(xmlStr, 'application/xml');
        };
    } else if (typeof window.ActiveXObject !== 'undefined') {
        parseXml = function(xmlStr) {
            var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        throw new Error('No XML parser found');
    }

    var service = {
        overpass: function(query){
            var url = osmSettingsService.getOverpassAPI();
            var deferred = $q.defer();
            var self = this;
            var headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
            $http.post(
                url,
                'data='+encodeURIComponent(query),
                {headers: headers}
            ).then(function(data){
                if (typeof data.data === 'object'){
                    deferred.resolve(data.data);
                }else{
                    deferred.resolve(self.parseXML(data.data));
                }
            },function(data) {
                deferred.reject(data);
            });
            return deferred.promise;
        },
        overpassToGeoJSON: function(query, filter){
            var deferred = $q.defer();
            var features = [];
            var relations = [];
            var result = {
                type: 'FeatureCollection',
                features: features,
                relations: relations
            };
            this.overpass(query).then(function(data){
                //TODO check if data is XML or JSON, here it's JSON
                var node, feature, coordinates;
                var cache = {loaded:false};
                var getNodeById = function(id){
                    if (!cache.loaded){
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
                    if (node.type === 'node'){
                        feature = {
                            type: 'Feature',
                            properties:node.tags,
                            id: node.id,
                            geometry: {
                                type:'Point',
                                coordinates: [node.lon, node.lat]
                            }
                        };
                        if (!filter(feature)){
                            features.push(feature);
                        }
                    }else if (node.type === 'way'){
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
                        if (!filter(feature)){
                            features.push(feature);
                        }
                    }else if (node.type === 'relation'){
                        result.relations.push({
                            ref: node.id,
                            tags: node.tags,
                            type: 'relation',
                            members: node.members
                        });
                    }
                }
                deferred.resolve(result);
            }, function(error){
                deferred.reject(error);
            });
            return deferred.promise;
        }
    };
    return service;
}

export default overpassAPI;
