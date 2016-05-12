/**
 * @ngdoc service
 * @name osm.utils.osmUtilsService
 */
function osmUtilsService($http, osmSettingsService, osmx2js) {

    /**
     * @ngdoc method
     * @name relationToGeoJSON
     * @methodOf osm.utils.osmUtilsService
     * @param {Number} relationId id of the relation
     * @param {Object} relation json object
     * @return {Object} geojson
     */
    this.relationToGeoJSON = function(relationID, relation) {
        var self = this;
        var features = [];
        var relations = [];
        var result = {
            type: 'FeatureCollection',
            properties: {
                id: relationID
            },
            options: {},
            members:[],
            features: features,
            relations: relations
        };
        var relation = relationXML.getElementById(relationID);
        //bug: relation is null because firefox return an error
        result.properties.visible = relation.getAttribute('visible');
        result.properties.version = relation.getAttribute('version');
        result.properties.changeset = relation.getAttribute('changeset');
        result.properties.timestamp = relation.getAttribute('timestamp');
        result.properties.user = relation.getAttribute('user');
        result.properties.uid = relation.getAttribute('uid');
        var m, i;
        var child, node, properties, coordinates, feature, member, memberElement;
        for (i = 0; i < relation.children.length; i++) {
            m = relation.children[i];
            if (m.tagName === 'member') {
                //<member type="way" ref="148934766" role=""/>
                member = {
                    type: m.getAttribute('type'),
                    ref: m.getAttribute('ref'),
                    role: m.getAttribute('role'),
                };
                result.members.push(member);
                //get relationXML for this member
                memberElement = relationXML.getElementById(m.getAttribute('ref'));
                /*
                <way id="148934766" visible="true" version="5" changeset="13626362" timestamp="2012-10-25T11:48:27Z" user="Metacity" uid="160224">
                    <nd ref="1619955810"/>
                    ...
                    <tag k="access" v="yes"/>
                    ...
                </way>
                    */
                //get tags -> geojson properties
                properties = self.getTagsFromChildren(memberElement);
                member.name = properties.name;
                if (memberElement.tagName === 'way') {
                    coordinates = [];
                    feature = {
                        type: 'Feature',
                        properties: properties,
                        id: m.getAttribute('ref'),
                        geometry:{
                            type:'LineString',
                            coordinates:coordinates
                        }
                    };
                    for (var j = 0; j < memberElement.children.length; j++) {
                        child = memberElement.children[j];
                        if (child.tagName === 'nd') {
                            node = relationXML.getElementById(child.getAttribute('ref'));
                            coordinates.push([
                                parseFloat(node.getAttribute('lon')),
                                parseFloat(node.getAttribute('lat'))
                            ]);
                        }
                    }
                    features.push(feature);
                }else if (memberElement.tagName === 'node') {
                    feature = {
                        type: 'Feature',
                        properties: properties,
                        id: m.getAttribute('ref'),
                        geometry:{
                            type:'Point',
                            coordinates:[
                                parseFloat(memberElement.getAttribute('lon')),
                                parseFloat(memberElement.getAttribute('lat'))
                            ]
                        }
                    };
                    features.push(feature);
                }else if (memberElement.tagName === 'relation') {
                    member.tags = properties;
                }
            }
        }
        result.tags = self.getTagsFromChildren(relation);
        return result;
    };

    /**
     * @ngdoc method
     * @name encodeXML
     * @methodOf osm.utils.osmUtilsService
     * @param {string} str the string to encode
     * @return {string} the encoded string
     */
    this.encodeXML = function (str) {
        return str.replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&apos;');
    };
    /**
     * @ngdoc method
     * @name relationGeoJSONToXml
     * @methodOf osm.utils.osmUtilsService
     * @param {Object} relationGeoJSON geojson
     * @return {string} relation as xml
     */
    this.relationGeoJSONToXml = function(relationGeoJSON) {
        var i;
        var pp = relationGeoJSON.properties;
        var members = relationGeoJSON.members;
        var settings = osmSettingsService;
        var output = '<?xml version="1.0" encoding="UTF-8"?>\n';
        output += '<osm version="0.6" generator="angular-osm 0.2" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">\n';
        output += '  <relation id="'+ pp.id + '" visible="' + pp.visible + '" ';
        output += 'version="' + pp.version + '" ';
        output += 'changeset="'+settings.getChangeset() +'" timestamp="' + new Date().toISOString() + '" ';
        output += 'user="' + settings.getUserName() + '" uid="' + pp.uid + '">\n';

        for (i = 0; i < members.length; i++) {
            output += '    <member type="'+ members[i].type +'" ';
            output += 'ref="'+members[i].ref;
            //role depends on the type of member
            if (members[i].type === 'relation') {
                output += '" role="'+ members[i].role+'"/>\n';
            }else{
                output += '" role="'+ members[i].role+'"/>\n';
            }
        }

        var tags = relationGeoJSON.tags;
        for (var k in tags) {
            output += '    <tag k="'+ k +'" v="'+ this.encodeXML(tags[k]) +'"/>\n';
        }
        output += '  </relation>\n';
        output += '</osm>';
        return output;
    };
    /**
     * @ngdoc method
     * @name sortRelationMembers
     * @methodOf osm.utils.osmUtilsService
     * @param {Object} relationGeoJSON geojson
     * @return {Object} relation as geojson sorted
     */
    this.sortRelationMembers = function(relationGeoJSON) {
        //sort members
        var members = relationGeoJSON.members;
        var features = relationGeoJSON.features;
        var sorted = [];
        var f,i,m,j,k;
        var first, last;
        var insertBefore = function(item) {
            sorted.splice(0, 0, item);
        };
        var insertAfter = function(item) {
            sorted.push(item);
        };
        var getCoordinates = function(i) {
            return features[i].geometry.coordinates;
        };
        var c, cfirst, clast, alreadySorted;
        var foundFirst, foundLast = false;
        for (i = 0; i < members.length; i++) {
            m = members[i];
            if (m.type !== 'way') {
                sorted.push(m);
                continue;
            }
            //check if the member is already in
            alreadySorted = false;
            for (k = 0; k < sorted.length; k++) {
                if (sorted[k].ref === m.ref) {
                    alreadySorted = true;
                }
            }
            if (alreadySorted) {
                continue;
            }
            if (sorted.length === 0) {
                sorted.push(m);
                c = getCoordinates(i);
                cfirst = c[0];
                clast = c[c.length-1];
            }
//                    console.log('cfirst ' +cfirst);
//                    console.log('clast '+ clast);
            foundFirst = foundLast = false;
            for (j = 0; j < features.length; j++) {
                f = features[j];
                if (f.geometry.type !== 'LineString') {
                    continue;
                }
                alreadySorted = false;
                for (k = 0; k < sorted.length; k++) {
                    if (sorted[k].ref === f.id) {
                        alreadySorted = true;
                    }
                }
                if (alreadySorted) {
                    continue;
                }

                c = getCoordinates(j);
                first = c[0];
                last = c[c.length-1];
                if (cfirst[0] === last[0] && cfirst[1] === last[1]) {
                    insertBefore(members[j]);
                    cfirst = first;
                    foundFirst = true;
                    continue;
                }
                if (clast[0] === first[0] && clast[1] === first[1]) {
                    insertAfter(members[j]);
                    clast = last;
                    foundLast = true;
                    continue;
                }
                //weird; order of linestring coordinates is not stable
                if (cfirst[0] === first[0] && cfirst[1] === first[1]) {
                    insertBefore(members[j]);
                    cfirst = last;
                    foundFirst = true;
                    continue;
                }
                if (clast[0] === last[0] && clast[1] === last[1]) {
                    insertAfter(members[j]);
                    clast = first;
                    foundLast = true;
                    continue;
                }
            }
            if (!foundFirst && !foundLast) {
                //cas du rond point ... ?
                console.log('not found connected ways for '+m.ref);
                console.log(cfirst);
                console.log(clast);
            }
        }
        if (members.length === sorted.length) {
            relationGeoJSON.members = sorted;
            //Fix orders of features
            //var features = relationGeoJSON.features;
            var cache = {loaded:false};
            var getFeatureById = function(id) {
                if (!cache.loaded) {
                    for (var i = 0; i < features.length; i++) {
                        cache[features[i].id] = features[i];
                    }
                }
                return cache[id];
            };
            relationGeoJSON.features = [];
            for (var l = 0; l < sorted.length; l++) {
                relationGeoJSON.features.push(getFeatureById(sorted[l].ref));
            }
            //feature order fixed
        } else {
            console.error('can t sort this relation');
        }
        return relationGeoJSON;
    };
    this.x2js = osmx2js;
    this.xml2js = function (xml_str) {
        return osmx2js.xml2js(xml_str)
    };
    this.js2xml = function (json) {
        return osmx2js.js2xml(json);
    };
    /**
     * @ngdoc method
     * @name yqlJSON
     * @methodOf osm.utils.osmUtilsService
     * @param {string} featuresURL url of the geojson you want to get
     * @return {Promise} $http response
     */
    this.yqlJSON = function(featuresURL) {
        var deferred = $q.defer();
        var url, config;
        config = {
            params: {
                q: 'select * from json where url=\'' + featuresURL + '\';',
                format: 'json'
            }
        };
        url = 'http://query.yahooapis.com/v1/public/yql';
        $http.get(url, config).then(
            function(data) {
                if (data.data.query.results === null) {
                    deferred.resolve([]);
                }else{
                    deferred.resolve(data.data.query.results.json);
                }
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name getElementTypeFromFeature
     * @methodOf osm.utils.osmUtilsService
     * @param {string} feature geojson feature
     * @return {string} type 'node' or 'way'
     */
    this.getElementTypeFromFeature = function(feature) {
        var gtype = feature.geometry.type;
        if (gtype === 'LineString') {
            return 'way';
        } else if (gtype === 'Point') {
            return 'node';
        } else {
            console.error('not supported type ' + gtype);
        }
    };
}
export default osmUtilsService;
