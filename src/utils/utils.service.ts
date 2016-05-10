/**
 * @ngdoc service
 * @name osm.oauth.osmAuthService
 * @param  {any} $base64
 * @param  {any} $http
 * @param  {any} $q
 * @param  {any} osmSettingsService
 */
function osmUtils() {

    /**
     * @ngdoc method
     * @name parseXml
     * @methodOf osm.utils.osmUtils
     * @param {string} content
     * @returns {Document} xml document
     */
    var serializer = new XMLSerializer();

    if (typeof window.DOMParser !== 'undefined') {
        let parser = new window.DOMParser();
        this.parseXml = function parseXml(xmlStr) {
            return parser.parseFromString(xmlStr, 'application/xml');
        };
    } else if (typeof window.ActiveXObject !== 'undefined') {
        this.parseXml = function parseXml(xmlStr) {
            var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
            xmlDoc.async = 'false';
            xmlDoc.loadXML(xmlStr);
            return xmlDoc;
        };
    } else {
        throw new Error('No XML parser found');
    }

    /**
     * @ngdoc method
     * @name getNodesInJSON
     * @methodOf osm.utils.osmUtils
     * @param {string} xmlNodes
     * @param {string} flatProperties
     * If true, the resulting GeoJSON feature's properties will be a simple
     * key-value list instead of a structured json object (with separate tags and metadata).
     * default: false
     * @returns {string} geojson
     */
    this.getNodesInJSON = function (xmlNodes, flatProperties){
        osmSettingsService.setNodes(xmlNodes);
        var options = {};
        if (flatProperties !== undefined){
            options.flatProperties = flatProperties;
        }
        return osmtogeojson(xmlNodes, options);
    };

    /**
     * @ngdoc method
     * @name yqlJSON
     * @methodOf osm.utils.osmUtils
     * @param {string} featuresURL
     * @returns {Promise} JSON url content
     */
    this.yqlJSON = function (featuresURL){
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
            function(data){
                if (data.data.query.results === null){
                    deferred.resolve([]);
                }else{
                    deferred.resolve(data.data.query.results.json);
                }
            }, function(error){
                deferred.reject(error);
            });
        return deferred.promise;
    };

    /**
     * @ngdoc method
     * @name getElementTypeFromFeature
     * @methodOf osm.utils.osmUtils
     * @param {Object} feature
     * @returns {string} 'way' or 'node'
     */
    this.getElementTypeFromFeature = function (feature){
        var gtype = feature.geometry.type;
        if (gtype === 'LineString'){
            return 'way';
        } else if (gtype === 'Point'){
            return 'node';
        } else {
            console.error('not supported type '+gtype);
        }
    };

    /**
     * @ngdoc method
     * @name relationGeoJSONToXml
     * @methodOf osm.utils.osmUtils
     * @param {Object} relationGeoJSON
     * @returns {string} osm xml
     */
    this.relationGeoJSONToXml = function (relationGeoJSON){
        var i;
        var pp = relationGeoJSON.properties;
        var members = relationGeoJSON.members;
        var settings = osmSettingsService;
        var output = '<?xml version="1.0" encoding="UTF-8"?>\n';
        output += '<osm version="0.6" generator="angular-osm 0.2" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">\n';
        output += '  <relation id="'+ pp.id + '" visible="' + pp.visible + '" ';
        output += 'version="' + pp.version + '" ';
        output += 'changeset="' + settings.getChangeset() + '" timestamp="' + new Date().toISOString() + '" ';
        output += 'user="' + settings.getUserName() + '" uid="' + pp.uid + '">\n';

        for (i = 0; i < members.length; i++) {
            output += '    <member type="'+ members[i].type +'" ';
            output += 'ref="'+members[i].ref;
            //role depends on the type of member
            if (members[i].type === 'relation'){
                output += '" role="' + members[i].role + '"/>\n';
            }else{
                output += '" role="' + members[i].role + '"/>\n';
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

}