webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../typings/browser.d.ts"/>
	"use strict";
	var angular_1 = __webpack_require__(1);
	var oauth_1 = __webpack_require__(15);
	var api_1 = __webpack_require__(17);
	var overpass_1 = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./overpass/overpass\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	var taginfo_1 = __webpack_require__(19);
	var settings_1 = __webpack_require__(21);
	angular_1["default"].module('osm', [
	    settings_1["default"].name,
	    api_1["default"].name,
	    overpass_1["default"].name,
	    taginfo_1["default"].name,
	    oauth_1["default"].name
	]);


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

	"use strict";
	var oauth_service_1 = __webpack_require__(16);
	var osmOAuthModule = angular.module('osm.oauth', [])
	    .factory('osmAuthService', oauth_service_1["default"])
	    .provider('osmAuthService', function osmAuthServiceProvider() {
	    this.options = {};
	    this.$get = function osmAuthServiceFactory() {
	        return new oauth_service_1["default"](this.options);
	    };
	});
	exports.__esModule = true;
	exports["default"] = osmOAuthModule;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var osm_auth_1 = __webpack_require__(3);
	//TODO: write a provider to configure the service and provide options
	/**
	* @ngdoc service
	* @name osm.oauth.osmAuthService
	* @requires angular-osm.osmSettingsService
	* @description handle osm oauth
	*/
	function osmAuthService(options) {
	    if (options) {
	        if (options.oauth_secret && options.oauth_consumer_key) {
	            this.auth = osm_auth_1["default"](options);
	        }
	    }
	    this.logout = function () {
	        return this.auth.logout();
	    };
	    this.authenticated = function () {
	        return this.auth.authenticated();
	    };
	    this.authenticate = function (callback) {
	        return this.auth.authenticate(callback);
	    };
	    this.xhr = function (options) {
	        return this.auth.xhr(options);
	    };
	    this.options = function (options) {
	        if (this.auth) {
	            this.auth.options(options);
	        }
	        else {
	            this.auth = osm_auth_1["default"](options);
	        }
	    };
	}
	exports.__esModule = true;
	exports["default"] = osmAuthService;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var api_service_1 = __webpack_require__(18);
	var osmAPIModule = angular.module('osm.api', ['osm.settings'])
	    .factory('osmAPI', api_service_1["default"]);
	exports.__esModule = true;
	exports["default"] = osmAPIModule;


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * @ngdoc service
	 * @name osm.oauth.osmAuthService
	 * @param  {any} $base64
	 * @param  {any} $http
	 * @param  {any} $q
	 * @param  {any} osmSettingsService
	 */
	osmAPI.$inject = ['$base64', '$http', '$q', 'osmSettingsService'];
	function osmAPI($base64, $http, $q, osmSettingsService, osmUtils) {
	    var service = {
	        /**
	         * @ngdoc method
	         * @name validateCredentials
	         * @methodOf osm.api.osmAPI
	         * @description in the case you don't want to use osm.oauth
	         * @returns {Promise} true/false
	         */
	        validateCredentials: function () {
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
	        /**
	         * @ngdoc method
	         * @name setCredentials
	         * @param {string} username
	         * @param {string} password
	         * @methodOf osm.api.osmAPI
	         * @description store the credentials in the settings service
	         * @returns {string} credentials encoded as base64
	         */
	        setCredentials: function (username, password) {
	            osmSettingsService.setUserName(username);
	            var credentials = $base64.encode(username + ':' + password);
	            osmSettingsService.setCredentials(credentials);
	            return credentials;
	        },
	        /**
	         * @ngdoc method
	         * @name setCredentials
	         * @methodOf osm.api.osmAPI
	         * @description get the credentials from the settings
	         * @returns {string} credentials encoded as base64
	         */
	        getCredentials: function () {
	            return osmSettingsService.getCredentials();
	        },
	        /**
	         * @ngdoc method
	         * @name getAuthorization
	         * @methodOf osm.api.osmAPI
	         * @description get the credentials from the settings
	         * @returns {string} credentials encoded as base64
	         */
	        getAuthorization: function () {
	            return 'Basic ' + osmSettingsService.getCredentials();
	        },
	        /**
	         * @ngdoc method
	         * @name clearCredentials
	         * @methodOf osm.api.osmAPI
	         * @description remove credentials from the settings
	         */
	        clearCredentials: function () {
	            osmSettingsService.setCredentials('');
	        },
	        /**
	         * @ngdoc method
	         * @name getAuthenticated
	         * @methodOf osm.api.osmAPI
	         * @param {string} method path of the API, /foo/bar
	         * @param {Object} config $http config
	         * @returns {Promise} result of the get call
	         */
	        getAuthenticated: function (method, config) {
	            if (config === undefined) {
	                config = {};
	            }
	            config.headers = { Authorization: this.getAuthorization() };
	            return this.get(method, config);
	        },
	        /**
	         * @ngdoc method
	         * @name get
	         * @description $http.get call
	         * @methodOf osm.api.osmAPI
	         * @param {string} method path of the API, /foo/bar
	         * @param {Object} config $http config
	         * @returns {Promise} response
	         */
	        get: function (method, config) {
	            var deferred = $q.defer();
	            var self = this;
	            var url = osmSettingsService.getOSMAPI() + method;
	            $http.get(url, config).then(function (data) {
	                var contentType = data.headers()['content-type'];
	                var results;
	                if (contentType.indexOf('application/xml;') === 0) {
	                    results = osmUtils.parseXML(data.data);
	                }
	                else if (contentType.indexOf('text/xml;') === 0) {
	                    results = osmUtils.parseXML(data.data);
	                }
	                else {
	                    results = data.data;
	                }
	                deferred.resolve(results);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name put
	         * @description $http.put call
	         * @methodOf osm.api.osmAPI
	         * @param {string} method path of the API, /foo/bar
	         * @param {Object} content $http.put content
	         * @param {Object} config $http config
	         * @returns {Promise} response
	         */
	        put: function (method, content, config) {
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
	                    results = osmUtils.parseXML(data.data);
	                }
	                else if (contentType.indexOf('text/xml;') === 0) {
	                    results = osmUtils.parseXML(data.data);
	                }
	                else {
	                    results = data.data;
	                }
	                deferred.resolve(results);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name delete
	         * @description $http.delete
	         * @methodOf osm.api.osmAPI
	         * @param {string} method path of the object to delete
	         * @param {Object} config $http config
	         * @returns {Promise} response
	         */
	        delete: function (method, config) {
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
	                    results = osmUtils.parseXML(data.data);
	                }
	                else if (contentType.indexOf('text/xml;') === 0) {
	                    results = osmUtils.parseXML(data.data);
	                }
	                else {
	                    results = data.data;
	                }
	                deferred.resolve(results);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name createChangeset
	         * @description create a changeset to manipulate osm data
	         * put('/0.6/changeset/create')
	         * @methodOf osm.api.osmAPI
	         * @param {string} comment the comment
	         * @returns {Promise} response
	         */
	        createChangeset: function (comment) {
	            var deferred = $q.defer();
	            var changeset = '<osm><changeset><tag k="created_by" v="OSM-Relation-Editor"/><tag k="comment" v="';
	            changeset += comment + '"/></changeset></osm>';
	            this.put('/0.6/changeset/create', changeset).then(function (data) {
	                osmSettingsService.setChangeset(data);
	                deferred.resolve(data);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name getLastOpenedChangesetId
	         * @description get the last opened changeset (while reload the app)
	         * get('/0.6/changesets')
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} response
	         */
	        getLastOpenedChangesetId: function () {
	            var deferred = $q.defer();
	            var config = {
	                params: { user: osmSettingsService.getUserID(), open: true }
	            };
	            this.get('/0.6/changesets', config).then(function (data) {
	                var changesets = data.getElementsByTagName('changeset');
	                if (changesets.length > 0) {
	                    osmSettingsService.setChangeset(changesets[0].id);
	                    deferred.resolve(changesets[0].id);
	                }
	                else {
	                    osmSettingsService.setChangeset();
	                    deferred.resolve();
	                }
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name closeChangeset
	         * @description put('/0.6/changesets/ID/close')
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} response
	         */
	        closeChangeset: function () {
	            var changeset = osmSettingsService.getChangeset();
	            var results = this.put('/0.6/changeset/' + changeset + '/close');
	            osmSettingsService.setChangeset();
	            return results;
	        },
	        /**
	         * @ngdoc method
	         * @name closeChangeset
	         * @description get('/0.6/user/details')
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} response
	         */
	        getUserDetails: function () {
	            return this.getAuthenticated('/0.6/user/details');
	        },
	        /**
	         * @ngdoc method
	         * @name getMap
	         * @description get('/0.6/map?bbox=')
	         * @param {string} bbox
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} response
	         */
	        getMap: function (bbox) {
	            return this.get('/0.6/map?bbox=' + bbox);
	        },
	        /**
	         * @ngdoc method
	         * @name updateNode
	         * @param {Object} currentNode
	         * @param {Object} updatedNode
	         * @methodOf osm.api.osmAPI
	         * @returns {Promise} put response
	         */
	        updateNode: function (currentNode, updatedNode) {
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
	            }
	            else if (updatedNode.geometry.type === 'Point') {
	                nodeType = 'node';
	            }
	            else if (updatedNode.geometry.type === 'LineString') {
	                nodeType = 'way';
	            }
	            else {
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
	        /**
	         * @ngdoc method
	         * @name createNode
	         * @methodOf osm.api.osmAPI
	         * @param {Object} node
	         * @returns {Promise} put response
	         */
	        createNode: function (node) {
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
	                    }
	                    else {
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
	        getMapGeoJSON: function (bbox) {
	            var self = this;
	            var deferred = $q.defer();
	            self.getMap(bbox).then(function (xmlNodes) {
	                var geojsonNodes = osmUtils.getNodesInJSON(xmlNodes);
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
	        serialiseXmlToString: function (xml) {
	            return serializer.serializeToString(xml);
	        },
	        getTagsFromChildren: function (element) {
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
	        getNameFromTags: function (element) {
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
	        relationXmlToGeoJSON: function (relationID, relationXML) {
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
	                                coordinates.push([
	                                    parseFloat(node.getAttribute('lon')),
	                                    parseFloat(node.getAttribute('lat'))
	                                ]);
	                            }
	                        }
	                        features.push(feature);
	                    }
	                    else if (memberElement.tagName === 'node') {
	                        feature = {
	                            type: 'Feature',
	                            properties: properties,
	                            id: m.getAttribute('ref'),
	                            geometry: {
	                                type: 'Point',
	                                coordinates: [
	                                    parseFloat(memberElement.getAttribute('lon')),
	                                    parseFloat(memberElement.getAttribute('lat'))
	                                ]
	                            }
	                        };
	                        features.push(feature);
	                    }
	                    else if (memberElement.tagName === 'relation') {
	                        member.tags = properties;
	                    }
	                }
	            }
	            result.tags = self.getTagsFromChildren(relation);
	            return result;
	        },
	        encodeXML: function (str) {
	            return str.replace(/&/g, '&amp;')
	                .replace(/</g, '&lt;')
	                .replace(/>/g, '&gt;')
	                .replace(/"/g, '&quot;')
	                .replace(/'/g, '&apos;');
	        },
	        sortRelationMembers: function (relationGeoJSON) {
	            //sort members
	            var members = relationGeoJSON.members;
	            var features = relationGeoJSON.features;
	            var sorted = [];
	            var f, i, m, j, k;
	            var first, last;
	            var insertBefore = function (item) {
	                sorted.splice(0, 0, item);
	            };
	            var insertAfter = function (item) {
	                sorted.push(item);
	            };
	            var getCoordinates = function (i) {
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
	                var getFeatureById = function (id) {
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
	            }
	            else {
	                console.error('can t sort this relation');
	            }
	        }
	    };
	    return service;
	}
	exports.__esModule = true;
	exports["default"] = osmAPI;


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var taginfo_service_1 = __webpack_require__(20);
	var osmTagInfoModule = angular.module('osm.taginfo', [])
	    .factory('osmTagInfoAPI', taginfo_service_1["default"]);
	exports.__esModule = true;
	exports["default"] = osmTagInfoModule;


/***/ },
/* 20 */
/***/ function(module, exports) {

	"use strict";
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
	        get: function (method, config) {
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
	        getKeyCombinations: function (params) {
	            return this.get('/key/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyDistributionNodes: function (params) {
	            return this.get('/key/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyDistributionWays: function (params) {
	            return this.get('/key/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyStats: function (params) {
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
	        getKeyValues: function (params) {
	            return this.get('/key/values', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyWikiPages: function (params) {
	            return this.get('/key/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysAll: function (params) {
	            return this.get('/keys/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysWikiPages: function (params) {
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
	        getKeysWithoutWikiPage: function (params) {
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
	        getRelationRoles: function (params) {
	            return this.get('/relation/roles', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationStats: function (params) {
	            return this.get('/relation/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationWikiPages: function (params) {
	            return this.get('/relation/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationsAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the relation type matches this query (substring match, optional).
	         */
	        getRelationsAll: function (params) {
	            return this.get('/relations/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyAndValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyAndValue: function (params) {
	            return this.get('/search/by_key_and_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyword
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyword: function (params) {
	            return this.get('/search/by_keyword', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByRole
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Role to search for (substring search, required).
	         */
	        getSearchByRole: function (params) {
	            return this.get('/search/by_role', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByValue: function (params) {
	            return this.get('/search/by_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteInfo
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteInfo: function (params) {
	            return this.get('/site/info', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteSources
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteSources: function (params) {
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
	        getTagCombinations: function (params) {
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
	        getTagDistributionNodes: function (params) {
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
	        getTagDistributionWays: function (params) {
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
	        getTagStats: function (params) {
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
	        getTagWikiPages: function (params) {
	            return this.get('/tag/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagsPopular
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show tags matching this query (substring match in key and value, optional).
	         */
	        getTagsPopular: function (params) {
	            return this.get('/tags/popular', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getWikiLanguages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getWikiLanguages: function (params) {
	            return this.get('/wiki/languages', { params: params });
	        }
	    };
	    return service;
	}
	exports.__esModule = true;
	exports["default"] = osmTagInfoAPI;


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var settings_service_1 = __webpack_require__(22);
	var ngstorage_1 = __webpack_require__(14);
	var osmSettingsModule = angular.module('osm.settings', [
	    ngstorage_1["default"].name
	])
	    .factory('osmSettingsService', settings_service_1["default"]);
	exports.__esModule = true;
	exports["default"] = osmSettingsModule;


/***/ },
/* 22 */
/***/ function(module, exports) {

	"use strict";
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
	        getUserName: function () {
	            return this.localStorage.userName;
	        },
	        setUserName: function (username) {
	            this.localStorage.userName = username;
	        },
	        getUserID: function () {
	            return this.localStorage.userID;
	        },
	        setUserID: function (userid) {
	            this.localStorage.userID = userid;
	        },
	        getCredentials: function () {
	            return this.localStorage.credentials;
	        },
	        setCredentials: function (credentials) {
	            this.localStorage.credentials = credentials;
	        },
	        getOSMAPI: function () {
	            if (this.localStorage.osmAPI) {
	                return this.localStorage.osmAPI;
	            }
	            else {
	                return 'http://api.openstreetmap.org/api';
	            }
	        },
	        setOSMAPI: function (osmAPI) {
	            this.localStorage.osmAPI = osmAPI;
	        },
	        getOverpassAPI: function () {
	            if (this.localStorage.overpassAPI) {
	                return this.localStorage.overpassAPI;
	            }
	            else {
	                //return 'http://api.openstreetmap.org/api';
	                return 'http://overpass-api.de/api/interpreter';
	            }
	        },
	        setOverpassAPI: function (overpassAPI) {
	            this.localStorage.overpassAPI = overpassAPI;
	        },
	        getNodes: function () {
	            return this.localStorage.nodes;
	        },
	        setNodes: function (nodes) {
	            this.localStorage.nodes = nodes;
	        },
	        getChangeset: function () {
	            return this.localStorage.changeset;
	        },
	        setChangeset: function (changeset) {
	            this.localStorage.changeset = changeset;
	        },
	        getOsmAuth: function () {
	            return this.localStorage.osmAuth;
	        },
	        setOsmAuth: function (options) {
	            return this.localStorage.osmAuth = options;
	        }
	    };
	}
	exports.__esModule = true;
	exports["default"] = osmSettingsService;


/***/ }
]);