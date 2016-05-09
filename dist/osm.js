webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _oauth = __webpack_require__(15);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _api = __webpack_require__(17);

	var _api2 = _interopRequireDefault(_api);

	var _overpass = __webpack_require__(19);

	var _overpass2 = _interopRequireDefault(_overpass);

	var _taginfo = __webpack_require__(21);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	var _settings = __webpack_require__(23);

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_angular2.default.module('osm', [_settings2.default.name, _api2.default.name, _overpass2.default.name, _taginfo2.default.name, _oauth2.default.name]);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _oauth = __webpack_require__(16);

	var _oauth2 = _interopRequireDefault(_oauth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOAuthModule = angular.module('osm.oauth', []).factory('osmAuthService', _oauth2.default);

	exports.default = osmOAuthModule;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _osmAuth = __webpack_require__(3);

	var _osmAuth2 = _interopRequireDefault(_osmAuth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* @ngdoc service
	* @name osm.oauth.osmAuthService
	* @requires angular-osm.osmSettingsService
	* @description handle osm oauth
	*/
	function osmAuthService(options) {
	    if (options) {
	        if (options.oauth_secret && options.oauth_consumer_key) {
	            (0, _osmAuth2.default)(options);
	        }
	    }
	    this.logout = _osmAuth2.default.logout;
	    this.authenticated = _osmAuth2.default.authenticated;
	    this.authenticate = _osmAuth2.default.authenticate;
	    this.xhr = _osmAuth2.default.xhr;
	    this.options = _osmAuth2.default.options;
	}

	exports.default = osmAuthService;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _api = __webpack_require__(18);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmAPIModule = angular.module('osm.api', ['osm.settings']).factory('osmAPI', _api2.default);

	exports.default = osmAPIModule;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @ngdoc service
	 * @name osm.oauth.osmAuthService
	 * @param  {any} $base64
	 * @param  {any} $http
	 * @param  {any} $q
	 * @param  {any} osmSettingsService
	 */
	osmAPI.$inject = ['$base64', '$http', '$q', 'osmSettingsService'];
	function osmAPI($base64, $http, $q, osmSettingsService) {
	    var parseXml;
	    var parser;
	    var serializer = new XMLSerializer();

	    if (typeof window.DOMParser !== 'undefined') {
	        parser = new window.DOMParser();
	        parseXml = function parseXml(xmlStr) {
	            return parser.parseFromString(xmlStr, 'application/xml');
	        };
	    } else if (typeof window.ActiveXObject !== 'undefined') {
	        parseXml = function parseXml(xmlStr) {
	            var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
	            xmlDoc.async = 'false';
	            xmlDoc.loadXML(xmlStr);
	            return xmlDoc;
	        };
	    } else {
	        throw new Error('No XML parser found');
	    }

	    var service = {
	        validateCredentials: function validateCredentials() {
	            var deferred = $q.defer();
	            this.getUserDetails().then(function (data) {
	                var users = data.getElementsByTagName('user');
	                if (users.length > 0) {
	                    osmSettingsService.setUserID(users[0].id);
	                }
	                deferred.resolve(users.length > 0);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        },
	        setCredentials: function setCredentials(username, password) {
	            osmSettingsService.setUserName(username);
	            var credentials = $base64.encode(username + ':' + password);
	            osmSettingsService.setCredentials(credentials);
	            return credentials;
	        },
	        getCredentials: function getCredentials() {
	            return osmSettingsService.getCredentials();
	        },
	        getAuthorization: function getAuthorization() {
	            return 'Basic ' + osmSettingsService.getCredentials();
	        },
	        clearCredentials: function clearCredentials() {
	            osmSettingsService.setCredentials('');
	        },
	        parseXML: function parseXML(data) {
	            //bug: this return nothing with firefox ...
	            return parseXml(data);
	        },
	        getAuthenticated: function getAuthenticated(method, config) {
	            if (config === undefined) {
	                config = {};
	            }
	            config.headers = { Authorization: this.getAuthorization() };
	            return this.get(method, config);
	        },
	        get: function get(method, config) {
	            var deferred = $q.defer();
	            var self = this;
	            var url = osmSettingsService.getOSMAPI() + method;
	            $http.get(url, config).then(function (data) {
	                var contentType = data.headers()['content-type'];
	                var results;
	                if (contentType.indexOf('application/xml;') === 0) {
	                    results = self.parseXML(data.data);
	                } else if (contentType.indexOf('text/xml;') === 0) {
	                    results = self.parseXML(data.data);
	                } else {
	                    results = data.data;
	                }
	                deferred.resolve(results);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        put: function put(method, content, config) {
	            var deferred = $q.defer();
	            var self = this;

	            if (config === undefined) {
	                config = {};
	            }
	            config.headers = { Authorization: this.getAuthorization() };
	            var url = osmSettingsService.getOSMAPI() + method;
	            $http.put(url, content, config).then(function (data) {
	                var contentType = data.headers()['content-type'];
	                var results;
	                if (contentType.indexOf('application/xml;') === 0) {
	                    results = self.parseXML(data.data);
	                } else if (contentType.indexOf('text/xml;') === 0) {
	                    results = self.parseXML(data.data);
	                } else {
	                    results = data.data;
	                }
	                deferred.resolve(results);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        delete: function _delete(method, config) {
	            var deferred = $q.defer();
	            var self = this;

	            if (config === undefined) {
	                config = {};
	            }
	            config.headers = { Authorization: this.getAuthorization() };
	            config.url = osmSettingsService.getOSMAPI() + method;
	            config.method = 'delete';
	            $http(config).then(function (data) {
	                var contentType = data.headers()['content-type'];
	                var results;
	                if (contentType.indexOf('application/xml;') === 0) {
	                    results = self.parseXML(data.data);
	                } else if (contentType.indexOf('text/xml;') === 0) {
	                    results = self.parseXML(data.data);
	                } else {
	                    results = data.data;
	                }
	                deferred.resolve(results);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        createChangeset: function createChangeset(comment) {
	            var deferred = $q.defer();
	            var changeset = '<osm><changeset><tag k="created_by" v="OSM-Relation-Editor"/><tag k="comment" v="';
	            changeset += comment + '"/></changeset></osm>';
	            this.put('/0.6/changeset/create', changeset).then(function (data) {
	                osmSettingsService.setChangeset(data);
	                deferred.resolve(data);
	            });
	            return deferred.promise;
	        },
	        getLastOpenedChangesetId: function getLastOpenedChangesetId() {
	            var deferred = $q.defer();
	            var config = {
	                params: { user: osmSettingsService.getUserID(), open: true }
	            };
	            this.get('/0.6/changesets', config).then(function (data) {
	                var changesets = data.getElementsByTagName('changeset');
	                if (changesets.length > 0) {
	                    osmSettingsService.setChangeset(changesets[0].id);
	                    deferred.resolve(changesets[0].id);
	                } else {
	                    osmSettingsService.setChangeset();
	                    deferred.resolve();
	                }
	            });
	            return deferred.promise;
	        },
	        closeChangeset: function closeChangeset() {
	            var changeset = osmSettingsService.getChangeset();
	            var results = this.put('/0.6/changeset/' + changeset + '/close');
	            osmSettingsService.setChangeset();
	            return results;
	        },
	        getUserDetails: function getUserDetails() {
	            return this.getAuthenticated('/0.6/user/details');
	        },
	        getMap: function getMap(bbox) {
	            return this.get('/0.6/map?bbox=' + bbox);
	        },
	        updateNode: function updateNode(currentNode, updatedNode) {
	            //we need to do the diff and build the xml
	            //first try to find the node by id
	            var nodes = osmSettingsService.getNodes();
	            var node = nodes.getElementById(currentNode.properties.id);
	            var deferred = $q.defer(); //only for errors
	            if (node === null) {
	                deferred.reject({
	                    msg: 'can t find node',
	                    currentNode: currentNode,
	                    updatedNode: updatedNode,
	                    osmNode: node
	                });
	                return deferred.promise;
	            }
	            var tag;
	            node.setAttribute('changeset', osmSettingsService.getChangeset());
	            node.setAttribute('user', osmSettingsService.getUserName());
	            while (node.getElementsByTagName('tag')[0]) {
	                node.removeChild(node.getElementsByTagName('tag')[0]);
	            }
	            var osm = document.createElement('osm');
	            var value;
	            osm.appendChild(node);
	            for (var property in updatedNode.properties.tags) {
	                if (updatedNode.properties.tags.hasOwnProperty(property)) {
	                    value = updatedNode.properties.tags[property];
	                    if (value === undefined) {
	                        continue;
	                    }
	                    tag = document.createElement('tag');
	                    tag.setAttribute('k', property);
	                    tag.setAttribute('v', value);
	                    node.appendChild(tag);
	                }
	            }
	            var nodeType;
	            if (updatedNode.geometry.type === 'Polygon') {
	                nodeType = 'way';
	            } else if (updatedNode.geometry.type === 'Point') {
	                nodeType = 'node';
	            } else if (updatedNode.geometry.type === 'LineString') {
	                nodeType = 'way';
	            } else {
	                deferred.reject({
	                    msg: 'geojson type not supported',
	                    currentNode: currentNode,
	                    updatedNode: updatedNode,
	                    osmNode: node
	                });
	                return deferred.promise;
	            }
	            //put request !!
	            return this.put('/0.6/' + nodeType + '/' + currentNode.properties.id, osm.outerHTML);
	        },
	        createNode: function createNode(node) {
	            var newNode = '<osm><node changeset="CHANGESET" lat="LAT" lon="LNG">TAGS</node></osm>';
	            var tagTPL = '<tag k="KEY" v="VALUE"/>';
	            var tags = '';
	            var value;
	            newNode = newNode.replace('CHANGESET', osmSettingsService.getChangeset());
	            for (var property in node.tags) {
	                if (node.tags.hasOwnProperty(property)) {
	                    value = node.tags[property];
	                    if (value === undefined || value === null) {
	                        continue;
	                    } else {
	                        tags = tags + tagTPL.replace('KEY', property).replace('VALUE', node.tags[property]);
	                    }
	                }
	            }
	            newNode = newNode.replace('TAGS', tags);
	            newNode = newNode.replace('LNG', node.lng);
	            newNode = newNode.replace('LAT', node.lat);
	            console.log('create new node with ' + newNode);
	            return this.put('/0.6/node/create', newNode);
	        },
	        getMapGeoJSON: function getMapGeoJSON(bbox) {
	            var self = this;
	            var deferred = $q.defer();
	            self.getMap(bbox).then(function (xmlNodes) {
	                var geojsonNodes = self.getNodesInJSON(xmlNodes);
	                //TODO: load row node (xml)
	                /*                    var node;
	                                for (var i = 0; i < geojsonNodes.length; i++) {
	                                    node = geojsonNodes[i];
	                                    node.rawXMLNode = xmlNodes.getElementById(node.id.split('/')[1]);
	                                }*/
	                deferred.resolve(geojsonNodes);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        },
	        serialiseXmlToString: function serialiseXmlToString(xml) {
	            return serializer.serializeToString(xml);
	        },
	        getTagsFromChildren: function getTagsFromChildren(element) {
	            var children, tags;
	            tags = {};
	            for (var i = 0; i < element.children.length; i++) {
	                children = element.children[i];
	                if (children.tagName !== 'tag') {
	                    continue;
	                }
	                tags[children.getAttribute('k')] = children.getAttribute('v');
	            }
	            return tags;
	        },
	        getNameFromTags: function getNameFromTags(element) {
	            var children;
	            for (var i = 0; i < element.children.length; i++) {
	                children = element.children[i];
	                if (children.tagName !== 'tag') {
	                    continue;
	                }
	                if (children.getAttribute('k') === 'name') {
	                    return children.getAttribute('v');
	                }
	            }
	        },
	        relationXmlToGeoJSON: function relationXmlToGeoJSON(relationID, relationXML) {
	            var self = this;
	            var features = [];
	            var relations = [];
	            var result = {
	                type: 'FeatureCollection',
	                properties: {
	                    id: relationID
	                },
	                options: {},
	                members: [],
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
	                        role: m.getAttribute('role')
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
	                            geometry: {
	                                type: 'LineString',
	                                coordinates: coordinates
	                            }
	                        };
	                        for (var j = 0; j < memberElement.children.length; j++) {
	                            child = memberElement.children[j];
	                            if (child.tagName === 'nd') {
	                                node = relationXML.getElementById(child.getAttribute('ref'));
	                                coordinates.push([parseFloat(node.getAttribute('lon')), parseFloat(node.getAttribute('lat'))]);
	                            }
	                        }
	                        features.push(feature);
	                    } else if (memberElement.tagName === 'node') {
	                        feature = {
	                            type: 'Feature',
	                            properties: properties,
	                            id: m.getAttribute('ref'),
	                            geometry: {
	                                type: 'Point',
	                                coordinates: [parseFloat(memberElement.getAttribute('lon')), parseFloat(memberElement.getAttribute('lat'))]
	                            }
	                        };
	                        features.push(feature);
	                    } else if (memberElement.tagName === 'relation') {
	                        member.tags = properties;
	                    }
	                }
	            }
	            result.tags = self.getTagsFromChildren(relation);
	            return result;
	        },
	        encodeXML: function encodeXML(str) {
	            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
	        },
	        relationGeoJSONToXml: function relationGeoJSONToXml(relationGeoJSON) {
	            var i;
	            var pp = relationGeoJSON.properties;
	            var members = relationGeoJSON.members;
	            var settings = osmSettingsService;
	            var output = '<?xml version="1.0" encoding="UTF-8"?>\n';
	            output += '<osm version="0.6" generator="angular-osm 0.2" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">\n';
	            output += '  <relation id="' + pp.id + '" visible="' + pp.visible + '" ';
	            output += 'version="' + pp.version + '" ';
	            output += 'changeset="' + settings.getChangeset() + '" timestamp="' + new Date().toISOString() + '" ';
	            output += 'user="' + settings.getUserName() + '" uid="' + pp.uid + '">\n';

	            for (i = 0; i < members.length; i++) {
	                output += '    <member type="' + members[i].type + '" ';
	                output += 'ref="' + members[i].ref;
	                //role depends on the type of member
	                if (members[i].type === 'relation') {
	                    output += '" role="' + members[i].role + '"/>\n';
	                } else {
	                    output += '" role="' + members[i].role + '"/>\n';
	                }
	            }

	            var tags = relationGeoJSON.tags;
	            for (var k in tags) {
	                output += '    <tag k="' + k + '" v="' + this.encodeXML(tags[k]) + '"/>\n';
	            }
	            output += '  </relation>\n';
	            output += '</osm>';
	            return output;
	        },
	        sortRelationMembers: function sortRelationMembers(relationGeoJSON) {
	            //sort members
	            var members = relationGeoJSON.members;
	            var features = relationGeoJSON.features;
	            var sorted = [];
	            var f, i, m, j, k;
	            var first, last;
	            var insertBefore = function insertBefore(item) {
	                sorted.splice(0, 0, item);
	            };
	            var insertAfter = function insertAfter(item) {
	                sorted.push(item);
	            };
	            var getCoordinates = function getCoordinates(i) {
	                return features[i].geometry.coordinates;
	            };
	            var c, cfirst, clast, alreadySorted;
	            var foundFirst,
	                foundLast = false;
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
	                    clast = c[c.length - 1];
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
	                    last = c[c.length - 1];
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
	                    console.log('not found connected ways for ' + m.ref);
	                    console.log(cfirst);
	                    console.log(clast);
	                }
	            }
	            if (members.length === sorted.length) {
	                relationGeoJSON.members = sorted;
	                //Fix orders of features
	                //var features = relationGeoJSON.features;
	                var cache = { loaded: false };
	                var getFeatureById = function getFeatureById(id) {
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
	        },
	        getNodesInJSON: function getNodesInJSON(xmlNodes, flatProperties) {
	            osmSettingsService.setNodes(xmlNodes);
	            var options = {};
	            if (flatProperties !== undefined) {
	                options.flatProperties = flatProperties;
	            }
	            return osmtogeojson(xmlNodes, options);
	        },
	        yqlJSON: function yqlJSON(featuresURL) {
	            var deferred = $q.defer();
	            var url, config;
	            config = {
	                params: {
	                    q: 'select * from json where url=\'' + featuresURL + '\';',
	                    format: 'json'
	                }
	            };
	            url = 'http://query.yahooapis.com/v1/public/yql';
	            $http.get(url, config).then(function (data) {
	                if (data.data.query.results === null) {
	                    deferred.resolve([]);
	                } else {
	                    deferred.resolve(data.data.query.results.json);
	                }
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        },
	        getElementTypeFromFeature: function getElementTypeFromFeature(feature) {
	            var gtype = feature.geometry.type;
	            if (gtype === 'LineString') {
	                return 'way';
	            } else if (gtype === 'Point') {
	                return 'node';
	            } else {
	                console.error('not supported type ' + gtype);
	            }
	        }
	    };
	    return service;
	}

	exports.default = osmAPI;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _overpass = __webpack_require__(20);

	var _overpass2 = _interopRequireDefault(_overpass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOverpassModule = angular.module('osm.overpass', ['osm.settings']).factory('osmOverpassAPI', _overpass2.default);

	exports.default = osmOverpassModule;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});


	/**
	 * @ngdoc service
	 * @name overpassAPI
	 * @param  {any} $http
	 * @param  {any} $q
	 * @param  {any} osmSettingsService
	 */
	osmOverpassAPI.$inject = ['$http', '$q', 'osmSettingsService'];
	function osmOverpassAPI($http, $q, osmSettingsService) {
	    var service = {
	        overpass: function overpass(query) {
	            var url = osmSettingsService.getOverpassAPI();
	            var deferred = $q.defer();
	            var self = this;
	            var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
	            $http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        overpassToGeoJSON: function overpassToGeoJSON(query, filter) {
	            var deferred = $q.defer();
	            var features = [];
	            var relations = [];
	            var result = {
	                type: 'FeatureCollection',
	                features: features,
	                relations: relations
	            };
	            if (filter === undefined) {
	                filter = function filter() {};
	            }
	            this.overpass(query).then(function (data) {
	                //TODO check if data is XML or JSON, here it's JSON
	                var node, feature, coordinates;
	                var cache = { loaded: false };
	                function getNodeById(id) {
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
	                            properties: node.tags,
	                            id: node.id,
	                            geometry: {
	                                type: 'Point',
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
	                            properties: node.tags,
	                            id: node.id,
	                            geometry: {
	                                type: 'LineString',
	                                coordinates: coordinates
	                            }
	                        };
	                        for (var j = 0; j < node.nodes.length; j++) {
	                            coordinates.push([getNodeById(node.nodes[j]).lon, getNodeById(node.nodes[j]).lat]);
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
	    };
	    return service;
	}

	exports.default = osmOverpassAPI;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _taginfo = __webpack_require__(22);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmTagInfoModule = angular.module('osm.taginfo', []).factory('osmTagInfoAPI', _taginfo2.default);

	exports.default = osmTagInfoModule;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	osmTagInfoAPI.$inject = ['$http', '$q'];
	/**
	 * @ngdoc service
	 * @name osmTagInfoAPI
	 * @description integration of taginfo
	 * http://taginfo.openstreetmap.org/taginfo/apidoc
	 * @param  {any} $http
	 * @param  {any} $q
	 */
	function osmTagInfoAPI($http, $q) {
	    var service = {
	        get: function get(method, config) {
	            var deferred = $q.defer();
	            $http.get('https://taginfo.openstreetmap.org/api/4' + method, config).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key matches this query (substring match, optional).
	         */
	        getKeyCombinations: function getKeyCombinations(params) {
	            return this.get('/key/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyDistributionNodes: function getKeyDistributionNodes(params) {
	            return this.get('/key/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyDistributionWays: function getKeyDistributionWays(params) {
	            return this.get('/key/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyStats: function getKeyStats(params) {
	            return this.get('/key/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyValues
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            lang — Language for description (optional, default: 'en').
	            query — Only show results where the value matches this query (substring match, optional).
	         */
	        getKeyValues: function getKeyValues(params) {
	            return this.get('/key/values', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyWikiPages: function getKeyWikiPages(params) {
	            return this.get('/key/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysAll: function getKeysAll(params) {
	            return this.get('/keys/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysWikiPages: function getKeysWikiPages(params) {
	            return this.get('/keys/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWithoutWikiPage
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            english — Check for key wiki pages in any language (0, default) or in the English language (1).
	            min_count — How many tags with this key must there be at least to show up here? (default 10000).
	            query — Only show results where the key matches this query (substring match, optional).
	         */
	        getKeysWithoutWikiPage: function getKeysWithoutWikiPage(params) {
	            return this.get('/keys/without_wiki_page', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationRoles
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the role matches this query (substring match, optional).
	            rtype — Relation type (required).
	         */
	        getRelationRoles: function getRelationRoles(params) {
	            return this.get('/relation/roles', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationStats: function getRelationStats(params) {
	            return this.get('/relation/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationWikiPages: function getRelationWikiPages(params) {
	            return this.get('/relation/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationsAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the relation type matches this query (substring match, optional).
	         */
	        getRelationsAll: function getRelationsAll(params) {
	            return this.get('/relations/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyAndValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyAndValue: function getSearchByKeyAndValue(params) {
	            return this.get('/search/by_key_and_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyword
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyword: function getSearchByKeyword(params) {
	            return this.get('/search/by_keyword', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByRole
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Role to search for (substring search, required).
	         */
	        getSearchByRole: function getSearchByRole(params) {
	            return this.get('/search/by_role', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByValue: function getSearchByValue(params) {
	            return this.get('/search/by_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteInfo
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteInfo: function getSiteInfo(params) {
	            return this.get('/site/info', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteSources
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteSources: function getSiteSources(params) {
	            return this.get('/site/sources', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key or other_value matches this query (substring match, optional).
	            value — Tag value (required).
	         */
	        getTagCombinations: function getTagCombinations(params) {
	            return this.get('/tag/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagDistributionNodes: function getTagDistributionNodes(params) {
	            return this.get('/tag/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagDistributionWays: function getTagDistributionWays(params) {
	            return this.get('/tag/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagStats: function getTagStats(params) {
	            return this.get('/tag/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagWikiPages: function getTagWikiPages(params) {
	            return this.get('/tag/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagsPopular
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show tags matching this query (substring match in key and value, optional).
	         */
	        getTagsPopular: function getTagsPopular(params) {
	            return this.get('/tags/popular', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getWikiLanguages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getWikiLanguages: function getWikiLanguages(params) {
	            return this.get('/wiki/languages', { params: params });
	        }
	    };
	    return service;
	}
	exports.default = osmTagInfoAPI;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _settings = __webpack_require__(24);

	var _settings2 = _interopRequireDefault(_settings);

	var _ngstorage = __webpack_require__(14);

	var _ngstorage2 = _interopRequireDefault(_ngstorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmSettingsModule = angular.module('osm.settings', [_ngstorage2.default.name]).factory('osmSettingsService', _settings2.default);

	exports.default = osmSettingsModule;

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});


	/**
	 * @ngdoc service
	 * @name osmSettingsService
	 * @description provide service to access to settings
	 * @param  {any} $localStorage
	 */
	osmSettingsService.$inject = ['$localStorage'];
	function osmSettingsService($localStorage) {
	    return {
	        localStorage: $localStorage.$default({
	            userName: '',
	            userID: '',
	            credentials: '',
	            nodes: [],
	            changeset: '',
	            osmAPI: '',
	            overpassAPI: ''
	        }),
	        getUserName: function getUserName() {
	            return this.localStorage.userName;
	        },
	        setUserName: function setUserName(username) {
	            this.localStorage.userName = username;
	        },
	        getUserID: function getUserID() {
	            return this.localStorage.userID;
	        },
	        setUserID: function setUserID(userid) {
	            this.localStorage.userID = userid;
	        },
	        getCredentials: function getCredentials() {
	            return this.localStorage.credentials;
	        },
	        setCredentials: function setCredentials(credentials) {
	            this.localStorage.credentials = credentials;
	        },
	        getOSMAPI: function getOSMAPI() {
	            if (this.localStorage.osmAPI) {
	                return this.localStorage.osmAPI;
	            } else {
	                return 'http://api.openstreetmap.org/api';
	            }
	        },
	        setOSMAPI: function setOSMAPI(osmAPI) {
	            this.localStorage.osmAPI = osmAPI;
	        },
	        getOverpassAPI: function getOverpassAPI() {
	            if (this.localStorage.overpassAPI) {
	                return this.localStorage.overpassAPI;
	            } else {
	                //return 'http://api.openstreetmap.org/api';
	                return 'http://overpass-api.de/api/interpreter';
	            }
	        },
	        setOverpassAPI: function setOverpassAPI(overpassAPI) {
	            this.localStorage.overpassAPI = overpassAPI;
	        },
	        getNodes: function getNodes() {
	            return this.localStorage.nodes;
	        },
	        setNodes: function setNodes(nodes) {
	            this.localStorage.nodes = nodes;
	        },
	        getChangeset: function getChangeset() {
	            return this.localStorage.changeset;
	        },
	        setChangeset: function setChangeset(changeset) {
	            this.localStorage.changeset = changeset;
	        },
	        getOsmAuth: function getOsmAuth() {
	            return this.localStorage.osmAuth;
	        },
	        setOsmAuth: function setOsmAuth(options) {
	            return this.localStorage.osmAuth = options;
	        }
	    };
	}

	exports.default = osmSettingsService;

/***/ }
]);