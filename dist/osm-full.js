(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["name"] = factory();
	else
		root["angular-osm"] = root["angular-osm"] || {}, root["angular-osm"]["name"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _oauth = __webpack_require__(6);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _base = __webpack_require__(4);

	var _base2 = _interopRequireDefault(_base);

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	var _overpass = __webpack_require__(8);

	var _overpass2 = _interopRequireDefault(_overpass);

	var _taginfo = __webpack_require__(10);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	var _nominatim = __webpack_require__(12);

	var _nominatim2 = _interopRequireDefault(_nominatim);

	var _togeojson = __webpack_require__(14);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	var _osrm = __webpack_require__(17);

	var _osrm2 = _interopRequireDefault(_osrm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @module osm
	 */

	angular.module('osm', [_api2.default.name, _base2.default.name, _oauth2.default.name, _overpass2.default.name, _taginfo2.default.name, _nominatim2.default.name, _togeojson2.default.name, _osrm2.default.name]);
	exports.default = angular.module('osm');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _api = __webpack_require__(2);

	var _api2 = _interopRequireDefault(_api);

	var _x2js = __webpack_require__(3);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * @module osm.api
	 */


	var osmAPIModule = angular.module('osm.api', [_x2js2.default.name]).provider('osmAPI', function osmAPIProvider() {
	    this.options = {
	        url: 'http://api.openstreetmap.org/api'
	    };
	    this.$get = function osmAPIFactory($http, $q, osmx2js) {
	        return new _api2.default($http, $q, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$http', '$q', 'osmx2js'];
	});

	exports.default = osmAPIModule;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create the angular service instance.
	 * The main idea is to provide only object and hide the XML related stuf.
	 * This is achieve using XML2JS.
	 */

	var OSMAPI = function () {
	    /**
	     * @param  {Object} $http angular http
	     * @param  {Object} $q angular promise
	     * @param  {Object} osmx2js service
	     * @param  {Object} options to get set url of the API
	     */

	    function OSMAPI($http, $q, osmx2js, options) {
	        _classCallCheck(this, OSMAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	        this.osmx2js = osmx2js;
	        this._oauth = null;
	    }

	    /**
	     * Set the adapter to make authenticated request.
	     * @param {Object} adapter must provide xhr method.
	     * angular-osm provide two adapter: osmBase64 and osmAuthService
	    */


	    _createClass(OSMAPI, [{
	        key: 'setAuthAdapter',
	        value: function setAuthAdapter(adapter) {
	            this._oauth = adapter;
	        }

	        /**
	         * Get the adapter used to do authenticated xhr
	         * @return {Object}
	        */

	    }, {
	        key: 'getAuthAdapter',
	        value: function getAuthAdapter() {
	            return this._oauth;
	        }

	        // ------------------ INTERNAL CALL SERVER (API) -----------------

	        /**
	         * Call the API
	         * @param {Object} options
	         * ```
	            var options = {
	                method: 'GET', // POST, DELETE, PUT
	                path: '/0.6/changesets', //without the /api
	                data: content //if you need a payload
	            };
	            osmAPI.xhr(options);
	            ```
	         * @return {Promise} the adapter response
	        */

	    }, {
	        key: 'xhr',
	        value: function xhr(options) {
	            var deferred = this.$q.defer();
	            return this._oauth.xhr(options);
	        }

	        /**
	         * send a get request to OSM with
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'getAuthenticated',
	        value: function getAuthenticated(method, config) {
	            var _config = angular.copy(config);
	            if (!_config) {
	                _config = {};
	            }
	            _config.method = 'GET';
	            _config.path = method;
	            return this.xhr(_config);
	        }
	        /**
	         * send a get request
	         * @param {string} method the api method
	         * @param {Object} config the $http.get config
	         * @returns {Promise} $http response with XML as string
	        */

	    }, {
	        key: 'get',
	        value: function get(method, config) {
	            var deferred = this.$q.defer();
	            var self = this;
	            var url = this.url + method;
	            this.$http.get(url, config).then(function (data) {
	                deferred.resolve(self.osmx2js.xml2js(data.data));
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        }
	        /**
	         * send a put request
	         * @param {string} method the api method
	         * @param {Object} content payload
	         * @param {Object} config the $http.put config
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'put',
	        value: function put(method, content, config) {
	            if (!config) {
	                config = {};
	            }
	            var _config = angular.copy(config);
	            _config.method = 'PUT';
	            _config.path = method;
	            _config.data = this.osmx2js.js2xml(content);
	            return this.xhr(_config);
	        }
	        /**
	         * send a delete request
	         * @param {string} method the api method
	         * @param {Object} config the $http.delete config
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'delete',
	        value: function _delete(method, config) {
	            if (!config) {
	                config = {};
	            }
	            var _config = angular.copy(config);
	            _config.method = 'DELETE';
	            _config.path = method;
	            return this.xhr(_config);
	        }

	        // ------------------ CHANGESET -----------------

	        /**
	         * @param {string} comment the comment assiociated to the changeset
	         * @returns {Promise} $http response
	        */

	    }, {
	        key: 'createChangeset',
	        value: function createChangeset(comment) {
	            var self = this;
	            var deferred = this.$q.defer();
	            var changeset = { osm: {
	                    changeset: {
	                        tag: [{ _k: 'created_by', _v: 'Angular-OSM' }, { _k: 'comment', _v: comment }]
	                    }
	                } };
	            this.put('/0.6/changeset/create', changeset).then(function (data) {
	                deferred.resolve(data);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @returns {Promise} $http response with the last changeset id
	         * or undefined if no changeset was opened
	        */

	    }, {
	        key: 'getLastOpenedChangesetId',
	        value: function getLastOpenedChangesetId() {
	            var self = this;
	            var deferred = this.$q.defer();
	            var config = {
	                params: { user: this._oauth.getUserID(), open: true }
	            };
	            this.get('/0.6/changesets', config).then(function (data) {
	                var changesets = data.osm.changeset;
	                if (changesets.length > 0) {
	                    deferred.resolve(changesets[0].id);
	                } else if (changesets._id) {
	                    deferred.resolve(changesets._id);
	                } else {
	                    deferred.resolve();
	                }
	            });
	            return deferred.promise;
	        }
	        /**
	         * @returns {Promise} $http.put response of
	         * /0.6/changeset/CHANGESET_ID/close
	        */

	    }, {
	        key: 'closeChangeset',
	        value: function closeChangeset(id) {
	            var self = this;
	            return this.put('/0.6/changeset/' + id + '/close').then(function (data) {
	                return data;
	            });
	        }

	        // ------------------ USER API -----------------

	        /**
	         * @param {string} id id of the user
	         * @returns {Promise} $http.get response
	         * /0.6/user/#id
	        */

	    }, {
	        key: 'getUserById',
	        value: function getUserById(id) {
	            return this.getAuthenticated('/0.6/user/' + id);
	        }

	        /**
	         * @returns {Promise} $http.get response
	         * /0.6/user/details
	        */

	    }, {
	        key: 'getUserDetails',
	        value: function getUserDetails() {
	            return this.getAuthenticated('/0.6/user/details');
	        }
	        /**
	         * @returns {Promise} $http.get response
	         * /0.6/user/preferences
	        */

	    }, {
	        key: 'getUserPreferences',
	        value: function getUserPreferences() {
	            return this.getAuthenticated('/0.6/user/preferences');
	        }

	        /**
	         * @param {string} key the preference key
	         * @param {string} value the preference value
	         * @returns {Promise} $http.get response
	         * /0.6/user/preferences
	        */

	    }, {
	        key: 'putUserPreferences',
	        value: function putUserPreferences(key, value) {
	            return this.put('/0.6/user/preferences/' + key, value);
	        }

	        //------------------ MAP DATA -------------------------

	        /**
	         * @param {string} bbox left,bottom,right,top
	         * where:
	            left is the longitude of the left (westernmost) side of the bounding box.
	            bottom is the latitude of the bottom (southernmost) side of the bounding box.
	            right is the longitude of the right (easternmost) side of the bounding box.
	            top is the latitude of the top (northernmost) side of the bounding box.
	         * @returns {Promise} $http.get response
	         * /0.6/map?bbox=bbox
	        */

	    }, {
	        key: 'getMap',
	        value: function getMap(bbox) {
	            return this.get('/0.6/map?bbox=' + bbox);
	        }

	        /**
	         * @param {string} bbox left,bottom,right,top
	         * where:
	            left is the longitude of the left (westernmost) side of the bounding box.
	            bottom is the latitude of the bottom (southernmost) side of the bounding box.
	            right is the longitude of the right (easternmost) side of the bounding box.
	            top is the latitude of the top (northernmost) side of the bounding box.
	         * @returns {Promise} $http.get response
	        */

	    }, {
	        key: 'getNotes',
	        value: function getNotes(bbox) {
	            var url = '/0.6/notes?bbox=' + bbox;
	            return this.get(url);
	        }

	        //------------------ ELEMENTS: Node ----------------

	        /**
	         * @param {Object/string} node
	             var node = {osm: {node: {
	                _changeset: '12', _lat: '...', _lon: '...',
	                tags: [
	                    {_k: '...', _v: '...'}
	                ]
	            }}};
	         * @returns {Promise} $http.put response
	         * PUT /0.6/node/create
	        */

	    }, {
	        key: 'createNode',
	        value: function createNode(node) {
	            return this.put('/0.6/node/create', node);
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id
	        */

	    }, {
	        key: 'getNode',
	        value: function getNode(id) {
	            return this.get('/0.6/node/' + id);
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id/relations
	        */

	    }, {
	        key: 'getNodeRelations',
	        value: function getNodeRelations(id) {
	            return this.get('/0.6/node/' + id + '/relations');
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id/ways
	        */

	    }, {
	        key: 'getNodeWays',
	        value: function getNodeWays(id) {
	            return this.get('/0.6/node/' + id + '/ways');
	        }

	        /**
	         * @param {array} ids ids
	         * @returns {Promise} $http.get response
	         * GET /0.6/node/#id
	        */

	    }, {
	        key: 'getNodes',
	        value: function getNodes(ids) {
	            return this.get('/0.6/nodes?nodes=' + ids.join(','));
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.delete response
	         * DELETE /0.6/node/#id
	        */

	    }, {
	        key: 'deleteNode',
	        value: function deleteNode(id) {
	            return this.delete('/0.6/node/' + id);
	        }

	        //------------------ ELEMENTS: WAY ----------------

	        /**
	         * @param {Object/string} way
	            var way = {osm: {way: {
	                _changeset: '12', _lat: '...', _lon: '...',
	                tags: [
	                    {_k: '...', _v: '...'}
	                ],
	                nd: [
	                    {_ref: '123'},
	                    {_ref: '456'},
	                ]
	            }}};
	         * @returns {Promise} $http.put response
	         * PUT /0.6/way/create
	        */

	    }, {
	        key: 'createWay',
	        value: function createWay(way) {
	            return this.put('/0.6/way/create', way);
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/way/#id
	        */

	    }, {
	        key: 'getWay',
	        value: function getWay(id) {
	            return this.get('/0.6/way/' + id);
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/way/#id/relations
	        */

	    }, {
	        key: 'getWayRelations',
	        value: function getWayRelations(id) {
	            return this.get('/0.6/way/' + id + '/relations');
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/way/#id/full
	        */

	    }, {
	        key: 'getWayFull',
	        value: function getWayFull(id) {
	            return this.get('/0.6/way/' + id + '/full');
	        }

	        /**
	         * @param {array} ids ids
	         * @returns {Promise} $http.get response
	         * GET /0.6/ways?ways=ids
	        */

	    }, {
	        key: 'getWays',
	        value: function getWays(ids) {
	            return this.get('/0.6/ways?ways=' + ids.join(','));
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.delete response
	         * DELETE /0.6/way/#id
	        */

	    }, {
	        key: 'deleteWay',
	        value: function deleteWay(id) {
	            return this.delete('/0.6/way/' + id);
	        }

	        //------------------ ELEMENTS: RELATION ----------------

	        /**
	         * @param {Object/string} relation
	            var relation = {osm: {relation: {
	                _changeset: '12', _lat: '...', _lon: '...',
	                tags: [
	                    {_k: '...', _v: '...'}
	                ],
	                member: [
	                    {_type: 'node', _role: 'stop', 'ref': '123'},
	                    {_type: 'way', 'ref': '234'}
	                ]
	            }}};
	         * @returns {Promise} $http.put response
	         * PUT /0.6/relation/create
	        */

	    }, {
	        key: 'createRelation',
	        value: function createRelation(relation) {
	            return this.put('/0.6/relation/create', relation);
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/relation/#id
	        */

	    }, {
	        key: 'getRelation',
	        value: function getRelation(id) {
	            return this.get('/0.6/relation/' + id);
	        }
	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/relation/#id/relations
	        */

	    }, {
	        key: 'getRelationRelations',
	        value: function getRelationRelations(id) {
	            return this.get('/0.6/relation/' + id + '/relations');
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.get response
	         * GET /0.6/relation/#id/full
	        */

	    }, {
	        key: 'getRelationFull',
	        value: function getRelationFull(id) {
	            return this.get('/0.6/relation/' + id + '/full');
	        }

	        /**
	         * @param {array} ids ids
	         * @returns {Promise} $http.get response
	         * GET /0.6/relations?relations=ids
	        */

	    }, {
	        key: 'getRelations',
	        value: function getRelations(ids) {
	            return this.get('/0.6/relations?relations=' + ids.join(','));
	        }

	        /**
	         * @param {string} id id
	         * @returns {Promise} $http.delete response
	         * DELETE /0.6/relation/#id
	        */

	    }, {
	        key: 'deleteRelation',
	        value: function deleteRelation(id) {
	            return this.delete('/0.6/relation/' + id);
	        }
	    }]);

	    return OSMAPI;
	}();

	OSMAPI.$inject = ['$http', '$q', 'osmx2js'];
	exports.default = OSMAPI;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @module osm.x2js
	 */
	var osmx2jsModule = angular.module('osm.x2js', []).provider('osmx2js', function osmx2jsProvider() {
	    this.options = {};
	    this.$get = function osmx2jsFactory() {
	        return new X2JS(this.options); //X2JS must be global
	    };
	});

	exports.default = osmx2jsModule;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _base = __webpack_require__(5);

	var _base2 = _interopRequireDefault(_base);

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	var _x2js = __webpack_require__(3);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmBase64Module = angular.module('osm.base64', [_x2js2.default.name, _api2.default.name, 'base64']).provider('osmBase64', function osmBase64Provider() {
	    this.options = {
	        url: 'http://api.openstreetmap.org/api'
	    };
	    this.$get = function osmBase64Factory($base64, $http, $q, osmx2js) {
	        return new _base2.default($base64, $http, $q, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$base64', '$http', 'osmx2js'];
	}); /**
	     * @module osm.base64
	     */


	exports.default = osmBase64Module;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osmBase64 angular service instance.
	 * This can be used as osmAPI adapter.
	 */

	var Base64Adapter = function () {
	    /**
	     * the constructor
	     * @param {Object} $base64 service provided by angular-base64 module
	     * @param {Object} $http angular $http service
	     * @param {Object} osmx2js angular-osm service
	     * to transform response from xml to object
	     */

	    function Base64Adapter($base64, $http, osmx2js) {
	        _classCallCheck(this, Base64Adapter);

	        this.$base64 = $base64;
	        this.storage = {};
	        this.$http = $http;
	        this.url = 'http://api.openstreetmap.org/api';
	        this.osmx2js = osmx2js;
	    }
	    /**
	     * the main method used to do the call to the API
	     * @param {Object} options
	     * @returns {Promise} $http response
	     */


	    _createClass(Base64Adapter, [{
	        key: 'xhr',
	        value: function xhr(options) {
	            var self = this;
	            options.url = this.url + options.path;
	            options.headers = {
	                Authorization: this.getAuthorization()
	            };
	            return this.$http(options).then(function (data) {
	                var d = data.data;
	                if (!d) {
	                    return;
	                }
	                if (d.substr) {
	                    if (d.substr(0, 5) === '<?xml') {
	                        return self.osmx2js.xml2js(d);
	                    }
	                }
	                return d;
	            });
	        }
	        /**
	         * if you don't use oauth, you can save
	         * credentials here using base64 localstorage (completly unsecure)
	         * @param {string} username your username
	         * @param {string} password the user password.
	         * WARNING base64 is unsafe and the credentials are stored in the localstorage
	         * @returns {string} crendentials
	        */

	    }, {
	        key: 'setCredentials',
	        value: function setCredentials(username, password) {
	            this.storage.username = username;
	            var credentials = this.$base64.encode(username + ':' + password);
	            this.storage.credentials = credentials;
	            return credentials;
	        }
	        /**
	         * if you don't use oauth, you can manage
	         * credentials here using base64 headers
	         * @returns {string} crendentials from the last set
	        */

	    }, {
	        key: 'getCredentials',
	        value: function getCredentials() {
	            return this.storage.credentials;
	        }
	        /**
	         * compute authorization header from credentials
	         * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	        */

	    }, {
	        key: 'getAuthorization',
	        value: function getAuthorization() {
	            return 'Basic ' + this.storage.credentials;
	        }
	        /**
	         * remove credentials from the localstorage
	         * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	        */

	    }, {
	        key: 'clearCredentials',
	        value: function clearCredentials() {
	            if (this.storage.removeItem) {
	                this.storage.removeItem('credentials');
	            } else {
	                delete this.storage.credentials;
	            }
	        }
	    }]);

	    return Base64Adapter;
	}();

	Base64Adapter.$inject = ['$base64', '$http', 'osmx2js'];

	exports.default = Base64Adapter;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _oauth = __webpack_require__(7);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _api = __webpack_require__(1);

	var _api2 = _interopRequireDefault(_api);

	var _x2js = __webpack_require__(3);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOAuthModule = angular.module('osm.oauth', [_api2.default.name, _x2js2.default.name]).provider('osmAuthService', function osmAuthServiceProvider() {
	    this.options = {};

	    this.$get = function osmAuthServiceFactory($q, osmx2js) {
	        return new _oauth2.default($q, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$q', 'osmx2js'];
	}); /**
	     * @module osm.oauth
	     */


	exports.default = osmOAuthModule;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osmAuthService service instance
	 */

	var OAuthAdapter = function () {
	    /**
	     * @param {Object} $q angular $q service
	     * @param {Object} osmx2js angular osm service
	     * @param {Object} options set options for the lib https://github.com/osmlab/osm-auth
	     */

	    function OAuthAdapter($q, osmx2js, options) {
	        _classCallCheck(this, OAuthAdapter);

	        if (options) {
	            if (options.oauth_secret && options.oauth_consumer_key) {
	                this.auth = osmAuth(options);
	            }
	        }
	        this.osmx2js = osmx2js;
	        this.$q = $q;
	        this._options = options;
	    }
	    /**
	     * Just logout. Warning this is synchronous code
	     * and doesn t return anything.
	     */


	    _createClass(OAuthAdapter, [{
	        key: 'logout',
	        value: function logout() {
	            this.auth.logout();
	        }
	        /**
	         * @return {boolean}
	         */

	    }, {
	        key: 'authenticated',
	        value: function authenticated() {
	            return this.auth.authenticated();
	        }
	        /**
	         * @return {Promise} true/false value
	         */

	    }, {
	        key: 'authenticate',
	        value: function authenticate() {
	            var deferred = this.$q.defer();
	            this.auth.authenticate(function () {
	                deferred.resolve(true);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @param {Object} options
	         * @return {Promise} http response
	         */

	    }, {
	        key: 'xhr',
	        value: function xhr(options) {
	            var self = this;
	            var deferred = this.$q.defer();
	            options.path = '/api' + options.path;
	            if (options.data) {
	                options.body = options.data;
	                options.data = undefined;
	            }
	            this.auth.xhr(options, function (err, data) {
	                if (err) {
	                    deferred.reject(err);
	                } else {
	                    if (data instanceof XMLDocument) {
	                        deferred.resolve(self.osmx2js.dom2js(data));
	                    } else {
	                        deferred.resolve(data);
	                    }
	                }
	            });
	            return deferred.promise;
	        }
	        /**
	         * Set the options of the oauth lib
	         * @param {Object} options set options for the lib https://github.com/osmlab/osm-auth
	         */

	    }, {
	        key: 'options',
	        value: function options(_options) {
	            if (this.auth) {
	                this.auth.options(_options);
	            } else {
	                this.auth = osmAuth(_options);
	            }
	        }
	    }]);

	    return OAuthAdapter;
	}();

	OAuthAdapter.$inject = ['$q', 'osmx2js'];

	exports.default = OAuthAdapter;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _overpass = __webpack_require__(9);

	var _overpass2 = _interopRequireDefault(_overpass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOverpassModule = angular.module('osm.overpass', []).provider('osmOverpassAPI', function osmOverpassAPIProvider() {
	    this.options = {
	        url: 'http://overpass-api.de/api/interpreter'
	    };
	    this.$get = function osmOverpassAPIFactory($http, $q) {
	        return new _overpass2.default($http, $q, this.options);
	    };
	    this.$get.$inject = ['$http', '$q'];
	}); /**
	     * @module osm.overpass
	     */


	exports.default = osmOverpassModule;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osmOverpassAPI service instance
	 */

	var OverpassAPI = function () {
	    /**
	     * @param {Object} $http angular $http service
	     * @param {Object} $q  angular $q service
	     * @param {Object} options
	     */

	    function OverpassAPI($http, $q, options) {
	        _classCallCheck(this, OverpassAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	    }
	    /**
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
	     * @return {Promise} $http.get
	    */


	    _createClass(OverpassAPI, [{
	        key: 'overpass',
	        value: function overpass(query) {
	            var url = this.url;
	            var deferred = this.$q.defer();
	            var headers = {
	                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	            };
	            this.$http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
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

	    }, {
	        key: 'getAreaId',
	        value: function getAreaId(type, osmId) {
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
	    }, {
	        key: 'overpassToGeoJSON',
	        value: function overpassToGeoJSON(query, filter) {
	            var deferred = this.$q.defer();
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
	                }
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
	    }]);

	    return OverpassAPI;
	}();

	exports.default = OverpassAPI;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _taginfo = __webpack_require__(11);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmTagInfoModule = angular.module('osm.taginfo', []).service('osmTagInfoAPI', _taginfo2.default); /**
	                                                                                                       * @module osm.taginfo
	                                                                                                       */


	exports.default = osmTagInfoModule;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osmTafInforAPI service instance.
	 * http://taginfo.openstreetmap.org/taginfo/apidoc
	 */

	var TagInfoAPI = function () {
	    /**
	     * @param {Object} $http angular $http service
	     * @param {Object} $q angular $q service
	     */

	    function TagInfoAPI($http, $q) {
	        _classCallCheck(this, TagInfoAPI);

	        this.$http = $http;
	        this.$q = $q;
	        this.url = 'https://taginfo.openstreetmap.org/api/4';
	    }
	    /**
	     * internal get request to the remote API
	     * @param {string} method
	     * @param {Object} config $http config object
	     * @return {Promise}
	     */


	    _createClass(TagInfoAPI, [{
	        key: 'get',
	        value: function get(method, config) {
	            var deferred = this.$q.defer();
	            this.$http.get(this.url + method, config).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeyCombinations',
	        value: function getKeyCombinations(params) {
	            return this.get('/key/combinations', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyDistributionNodes',
	        value: function getKeyDistributionNodes(params) {
	            return this.get('/key/distribution/nodes', { params: params });
	        }
	        /**
	         * @param {any} params
	         * key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyDistributionWays',
	        value: function getKeyDistributionWays(params) {
	            return this.get('/key/distribution/ways', { params: params });
	        }
	        /**
	         * @param {any} params
	         * key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyStats',
	        value: function getKeyStats(params) {
	            return this.get('/key/stats', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            lang — Language for description (optional, default: 'en').
	            query — Only show results where the value matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeyValues',
	        value: function getKeyValues(params) {
	            return this.get('/key/values', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	         */

	    }, {
	        key: 'getKeyWikiPages',
	        value: function getKeyWikiPages(params) {
	            return this.get('/key/wiki_pages', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeysAll',
	        value: function getKeysAll(params) {
	            return this.get('/keys/all', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeysWikiPages',
	        value: function getKeysWikiPages(params) {
	            return this.get('/keys/wiki_pages', { params: params });
	        }
	        /**
	         * @param {any} params
	            english — Check for key wiki pages in any language (0, default) or in the English language (1).
	            min_count — How many tags with this key must there be at least to show up here? (default 10000).
	            query — Only show results where the key matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getKeysWithoutWikiPage',
	        value: function getKeysWithoutWikiPage(params) {
	            return this.get('/keys/without_wiki_page', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Only show results where the role matches this query (substring match, optional).
	            rtype — Relation type (required).
	         */

	    }, {
	        key: 'getRelationRoles',
	        value: function getRelationRoles(params) {
	            return this.get('/relation/roles', { params: params });
	        }
	        /**
	         * @param {any} params
	            rtype — Relation type (required).
	         */

	    }, {
	        key: 'getRelationStats',
	        value: function getRelationStats(params) {
	            return this.get('/relation/stats', { params: params });
	        }
	        /**
	         * @param {any} params
	            rtype — Relation type (required).
	         */

	    }, {
	        key: 'getRelationWikiPages',
	        value: function getRelationWikiPages(params) {
	            return this.get('/relation/wiki_pages', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Only show results where the relation type matches this query (substring match, optional).
	         */

	    }, {
	        key: 'getRelationsAll',
	        value: function getRelationsAll(params) {
	            return this.get('/relations/all', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByKeyAndValue',
	        value: function getSearchByKeyAndValue(params) {
	            return this.get('/search/by_key_and_value', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByKeyword',
	        value: function getSearchByKeyword(params) {
	            return this.get('/search/by_keyword', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Role to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByRole',
	        value: function getSearchByRole(params) {
	            return this.get('/search/by_role', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */

	    }, {
	        key: 'getSearchByValue',
	        value: function getSearchByValue(params) {
	            return this.get('/search/by_value', { params: params });
	        }
	        /**
	         * @param {any} params
	             param: No params
	         */

	    }, {
	        key: 'getSiteInfo',
	        value: function getSiteInfo(params) {
	            return this.get('/site/info', { params: params });
	        }
	        /**
	         * @param {any} params
	             param: No params
	         */

	    }, {
	        key: 'getSiteSources',
	        value: function getSiteSources(params) {
	            return this.get('/site/sources', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key or other_value matches this query (substring match, optional).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagCombinations',
	        value: function getTagCombinations(params) {
	            return this.get('/tag/combinations', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagDistributionNodes',
	        value: function getTagDistributionNodes(params) {
	            return this.get('/tag/distribution/nodes', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagDistributionWays',
	        value: function getTagDistributionWays(params) {
	            return this.get('/tag/distribution/ways', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagStats',
	        value: function getTagStats(params) {
	            return this.get('/tag/stats', { params: params });
	        }
	        /**
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */

	    }, {
	        key: 'getTagWikiPages',
	        value: function getTagWikiPages(params) {
	            return this.get('/tag/wiki_pages', { params: params });
	        }
	        /**
	         * @param {any} params
	            query — Only show tags matching this query (substring match in key and value, optional).
	         */

	    }, {
	        key: 'getTagsPopular',
	        value: function getTagsPopular(params) {
	            return this.get('/tags/popular', { params: params });
	        }
	        /**
	         * @param {any} params
	             param: No params
	         */

	    }, {
	        key: 'getWikiLanguages',
	        value: function getWikiLanguages(params) {
	            return this.get('/wiki/languages', { params: params });
	        }
	    }]);

	    return TagInfoAPI;
	}();

	TagInfoAPI.$inject = ['$http', '$q'];

	exports.default = TagInfoAPI;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _nominatim = __webpack_require__(13);

	var _nominatim2 = _interopRequireDefault(_nominatim);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmNominatimModule = angular.module('osm.nominatim', []).factory('osmNominatim', _nominatim2.default).provider('osmNominatim', function osmNominatimProvider() {
	    this.options = {
	        url: 'https://nominatim.openstreetmap.org'
	    };
	    this.$get = function osmNominatimFactory($http) {
	        return new _nominatim2.default($http, this.options);
	    };
	    this.$get.$inject = ['$http'];
	}); /**
	     * @module osm.nominatim
	     */


	exports.default = osmNominatimModule;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osmNominatim service instance.
	 * This service create nominatim query.
	 */

	var NominatimAPI = function () {
	    /**
	     * @param {Object} $http angular $http service
	     * @param {Object} options set by the provider to set the url
	     */

	    function NominatimAPI($http, options) {
	        _classCallCheck(this, NominatimAPI);

	        this.url = options.url;
	        this.$http = $http;
	    }

	    /**
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/Nominatim
	     * @return {Promise} $http.get
	    */


	    _createClass(NominatimAPI, [{
	        key: 'search',
	        value: function search(query) {
	            //https://nominatim.openstreetmap.org/search
	            //?X-Requested-With=overpass-turbo&format=json&q=vern-sur-seiche
	            //params['accept-language'] = 'fr';
	            var params;
	            if (typeof query === 'string' || !query) {
	                params = {
	                    format: 'json',
	                    q: query
	                };
	            } else {
	                params = angular.copy(query);
	                params.format = 'json';
	            }
	            var config = {
	                params: params
	            };
	            var url = this.url + '/search';
	            return this.$http.get(url, config);
	        }

	        /**
	         * @param {Object/String} query
	         * http://wiki.openstreetmap.org/wiki/Nominatim
	         * @return {Promise} $http.get
	        */

	    }, {
	        key: 'reverse',
	        value: function reverse(query) {
	            //https://nominatim.openstreetmap.org/reverse
	            //?X-Requested-With=overpass-turbo&format=json&q=vern-sur-seiche
	            //params['accept-language'] = 'fr';
	            var params;
	            if (typeof query === 'string') {
	                params = {
	                    format: 'json',
	                    q: query
	                };
	            } else {
	                params = angular.copy(query);
	                params.format = 'json';
	            }
	            var config = {
	                params: params
	            };
	            var url = this.url + '/reverse';
	            return this.$http.get(url, config);
	        }

	        /**
	         *  http://nominatim.openstreetmap.org/lookup?osm_ids=R146656,W104393803,N240109189
	         * @param {Object/String} query
	         * http://wiki.openstreetmap.org/wiki/Nominatim
	         * @return {Promise} $http.get
	        */

	    }, {
	        key: 'lookup',
	        value: function lookup(query) {
	            var params;
	            if (typeof query === 'string') {
	                params = {
	                    format: 'json',
	                    q: query
	                };
	            } else {
	                params = angular.copy(query);
	                params.format = 'json';
	            }
	            var config = {
	                params: params
	            };
	            var url = this.url + '/lookup';
	            return this.$http.get(url, config);
	        }
	    }]);

	    return NominatimAPI;
	}();

	NominatimAPI.$inject = ['$http'];

	exports.default = NominatimAPI;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _togeojson = __webpack_require__(15);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmtogeojsonModule = angular.module('osm.togeojson', []).provider('osmtogeojson', _togeojson2.default); /**
	                                                                                                             * @module osm.togeojson
	                                                                                                             */

	exports.default = osmtogeojsonModule;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _togeojson = __webpack_require__(16);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function osmtogejsonProvider() {
	    this.options = {
	        areaTags: ['area', 'building', 'leisure', 'tourism', 'ruins', 'historic', 'landuse', 'military', 'natural', 'sport'],
	        uninterestingTags: ['source', 'source_ref', 'source:ref', 'history', 'attribution', 'created_by', 'tiger:county', 'tiger:tlid', 'tiger:upload_uuid'],
	        styles: {}
	    };
	    this.$get = function () {
	        return (0, _togeojson2.default)(this.options);
	    };
	}
	exports.default = osmtogejsonProvider;

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * @constructor ToGeoJSON
	 * @param {Object} options provided by the provider
	 * @description osm to geojson without dependencies :)
	   Import Note : geojson wait for lon/lat where every body else use lat/lon
	 */
	function factory(options) {
	    //copy/pasted/adapter from https://github.com/jfirebaugh/leaflet-osm/blob/master/leaflet-osm.js
	    var service = {
	        options: options,
	        getAsArray: getAsArray,
	        getFeatures: getFeatures,
	        getNodes: getNodes,
	        getWays: getWays,
	        getRelations: getRelations,
	        getTags: getTags,
	        buildFeatures: buildFeatures,
	        isWayArea: isWayArea,
	        interestingNode: interestingNode,
	        togeojson: togeojson
	    };
	    return service;

	    function getFeatures(data) {
	        var features = [];
	        if (!(data instanceof Array)) {
	            data = buildFeatures(data);
	        }

	        for (var i = 0; i < data.length; i++) {
	            var d = data[i];
	            var feature = {
	                type: 'Feature',
	                geometry: {},
	                properties: {
	                    id: d.id,
	                    tags: d.tags
	                }
	            };
	            if (d.type === "changeset") {
	                //build rectangle
	                // X = Long; Y = Lat, lets do it clockwise
	                feature.geometry.type = 'Polygon';
	                var bounds = d.latLngBounds;
	                feature.geometry.coordinates = [[[parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)], [parseFloat(bounds._min_lon), parseFloat(bounds._max_lat)], [parseFloat(bounds._max_lon), parseFloat(bounds._max_lat)], [parseFloat(bounds._max_lon), parseFloat(bounds._min_lat)], [parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)]]];
	            } else if (d.type === "node") {
	                //add a Point
	                feature.geometry.type = 'Point';
	                feature.geometry.coordinates = [d.latLng[1], d.latLng[0]];
	            } else {
	                var lngLats = new Array(d.nodes.length);

	                for (var j = 0; j < d.nodes.length; j++) {
	                    var latLng = d.nodes[j].latLng;
	                    lngLats[j] = [latLng[1], latLng[0]];
	                }

	                if (isWayArea(d)) {
	                    feature.geometry.type = 'Polygon';
	                    feature.geometry.coordinates = [lngLats];
	                } else {
	                    feature.geometry.type = 'LineString';
	                    feature.geometry.coordinates = lngLats;
	                }
	            }
	            features.push(feature);
	        }
	        return features;
	    }
	    function getAsArray(data) {
	        if (Array.isArray(data)) {
	            return data;
	        } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === "object") {
	            return [data];
	        } else {
	            return [];
	        }
	    }
	    function getTags(data) {
	        var rawtags = getAsArray(data.tag);
	        var tags = {};
	        rawtags.forEach(function (t) {
	            tags[t._k] = t._v;
	        });
	        return tags;
	    }
	    function getChangesets(data) {
	        var result = [];

	        var nodes = getAsArray(data.osm.changeset);
	        for (var i = 0; i < nodes.length; i++) {
	            var node = nodes[i];
	            result.push({
	                id: node._id,
	                type: "changeset",

	                latLngBounds: node,
	                tags: getTags(node)
	            });
	        }

	        return result;
	    }

	    function getNodes(data) {
	        var nodesAsArray = getAsArray(data.osm.node);
	        var nodesById = {};
	        nodesAsArray.forEach(function (node) {
	            nodesById[node._id] = {
	                id: node._id,
	                type: 'node',
	                latLng: [parseFloat(node._lat), parseFloat(node._lon)],
	                tags: getTags(node)
	            };
	        });
	        return nodesById;
	    }
	    function getWays(data, nodes) {
	        var result = [];
	        var ways = getAsArray(data.osm.way);
	        var features = [];
	        ways.forEach(function (way) {
	            var nds = way.nd;
	            var way_object = {
	                id: way._id,
	                type: "way",
	                nodes: new Array(nds.length),
	                tags: getTags(way)
	            };
	            for (var j = 0; j < nds.length; j++) {
	                way_object.nodes[j] = nodes[nds[j]._ref];
	            }
	            result.push(way_object);
	        });
	        return result;
	    }
	    function getRelations(data, nodes, way) {
	        var result = [];

	        var rels = getAsArray(data.osm.relation);
	        for (var i = 0; i < rels.length; i++) {
	            var rel = rels[i];
	            var members = getAsArray(rel.member);
	            var rel_object = {
	                id: rel._id,
	                type: "relation",
	                members: new Array(members.length),
	                tags: getTags(rel)
	            };
	            for (var j = 0; j < members.length; j++) {
	                if (members[j]._type === "node") {
	                    rel_object.members[j] = nodes[members[j]._ref];
	                } else {
	                    // relation-way and relation-relation membership not implemented
	                    rel_object.members[j] = null;
	                }
	            }
	            result.push(rel_object);
	        }
	        return result;
	    }

	    function buildFeatures(data) {
	        var features = [];
	        var nodes = getNodes(data); //-> {id: data, ...}
	        var ways = getWays(data, nodes); //->[]
	        var relations = getRelations(data, nodes, ways); //->[]

	        for (var node_id in nodes) {
	            var node = nodes[node_id];
	            if (interestingNode(node, ways, relations)) {
	                features.push(node);
	            }
	        }

	        for (var i = 0; i < ways.length; i++) {
	            var way = ways[i];
	            features.push(way);
	        }

	        return features;
	    }

	    function isWayArea(way) {
	        if (way.nodes[0] != way.nodes[way.nodes.length - 1]) {
	            return false;
	        }

	        for (var key in way.tags) {
	            if (options.areaTags.indexOf(key)) {
	                return true;
	            }
	        }

	        return false;
	    }

	    function interestingNode(node, ways, relations) {
	        var used = false;

	        for (var i = 0; i < ways.length; i++) {
	            if (ways[i].nodes.indexOf(node) >= 0) {
	                used = true;
	                break;
	            }
	        }

	        if (!used) {
	            return true;
	        }

	        for (var _i = 0; _i < relations.length; _i++) {
	            if (relations[_i].members.indexOf(node) >= 0) {
	                return true;
	            }
	        }

	        return false;
	    }
	    function togeojson(data, options) {
	        var res = {
	            type: 'FeatureCollection',
	            features: []
	        };
	        if (data) {
	            res.features = getFeatures(data);
	        }
	        return res;
	    }
	}

	exports.default = factory;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _osrm = __webpack_require__(18);

	var _osrm2 = _interopRequireDefault(_osrm);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osrmModule = angular.module('osm.osrm', []).provider('osrmAPI', function osrmAPIProvider() {
	    this.options = {
	        url: 'http://router.project-osrm.org'
	    };
	    this.$get = function osrmAPIFactory($http, $q) {
	        return new _osrm2.default($http, $q, this.options);
	    };
	    this.$get.$inject = ['$http', '$q'];
	}); /**
	     * @module osm.osrm
	     */


	exports.default = osrmModule;

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osrmAPI service instance
	 */

	var OSRMAPI = function () {
	    /**
	     * @param  {any} $http
	     * @param  {any} $q
	     * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md
	     */

	    function OSRMAPI($http, $q, options) {
	        _classCallCheck(this, OSRMAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	    }
	    /**
	     * internal get request to the remote API
	     * @param {string} service
	     * @param {string} version
	     * @param {string} profile
	     * @param {string|Object} coordinates
	     * the string format is {longitude},{latitude};{longitude},{latitude}[;{longitude},{latitude} ...]
	     * @param {Object} options
	     */


	    _createClass(OSRMAPI, [{
	        key: 'get',
	        value: function get(service, version, profile, coordinates, options) {
	            var _coordinates = coordinates;
	            if (Array.isArray(coordinates)) {
	                _coordinates = coordinates.join(';');
	            }
	            var url = this.url + '/' + service + '/' + version + '/' + profile + '/' + _coordinates;
	            return this.$http.get(url, { params: options });
	        }
	        /**
	         * neareset service
	         * @param {string} profile
	         * @param {string|Object} coordinates
	         * @param {number} number integer >= 1 (default 1)	Number of nearest segments that should be returned.
	         */

	    }, {
	        key: 'nearest',
	        value: function nearest(profile, coordinates, number) {
	            var options;
	            if (number) {
	                options = { number: number };
	            }
	            return this.get('nearest', 'v1', profile, coordinates, options);
	        }
	        /**
	         * route service
	         * @param {string} profile
	         * @param {string|Object} coordinates
	         * @param {Object} options
	         * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-route
	         */

	    }, {
	        key: 'route',
	        value: function route(profile, coordinates, options) {
	            return this.get('route', 'v1', profile, coordinates, options);
	        }
	        /**
	         * table service
	         * @param {string} profile
	         * @param {string|Object} coordinates
	         * @param {Object} options
	         * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-table
	         */

	    }, {
	        key: 'table',
	        value: function table(profile, coordinates, options) {
	            return this.get('table', 'v1', profile, coordinates, options);
	        }
	        /**
	         * match service
	         * @param {string} profile
	         * @param {string|Object} coordinates
	         * @param {Object} options
	         * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-match
	         */

	    }, {
	        key: 'match',
	        value: function match(profile, coordinates, options) {
	            return this.get('match', 'v1', profile, coordinates, options);
	        }
	        /**
	         * trip service
	         * @param {string} profile
	         * @param {string|Object} coordinates
	         * @param {Object} options
	         * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-trip
	         */

	    }, {
	        key: 'trip',
	        value: function trip(profile, coordinates, options) {
	            return this.get('trip', 'v1', profile, coordinates, options);
	        }
	    }]);

	    return OSRMAPI;
	}();

	OSRMAPI.$inject = ['$http', '$q'];

	exports.default = OSRMAPI;

/***/ }
/******/ ])
});
;