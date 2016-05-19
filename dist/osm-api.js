(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular-base64"), require("ngstorage"));
	else if(typeof define === 'function' && define.amd)
		define(["angular-base64", "ngstorage"], factory);
	else if(typeof exports === 'object')
		exports["name"] = factory(require("angular-base64"), require("ngstorage"));
	else
		root["angular-osm"] = root["angular-osm"] || {}, root["angular-osm"]["name"] = factory(root["angular-base64"], root["ngstorage"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_6__) {
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _angularBase = __webpack_require__(2);

	var _angularBase2 = _interopRequireDefault(_angularBase);

	var _api = __webpack_require__(3);

	var _api2 = _interopRequireDefault(_api);

	var _settings = __webpack_require__(4);

	var _settings2 = _interopRequireDefault(_settings);

	var _x2js = __webpack_require__(7);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//The base64 module is only available as IIFE

	var osmAPIModule = angular.module('osm.api', [_settings2.default.name, _x2js2.default.name, 'base64']).service('osmAPI', _api2.default).provider('osmAPI', function osmAPIProvider() {
	    this.options = {
	        url: 'http://api.openstreetmap.org/api'
	    };
	    this.$get = function osmAPIFactory($base64, $http, $q, osmSettingsService, osmx2js) {
	        return new _api2.default($base64, $http, $q, osmSettingsService, osmx2js, this.options);
	    };
	    this.$get.$inject = ['$base64', '$http', '$q', 'osmSettingsService', 'osmx2js'];
	});

	exports.default = osmAPIModule;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * @ngdoc service
	 * @name osm.oauth.osmAuthService
	 * @description The main idea is use geojson object where it is possible
	 * for the rest of the API (changeset, ...) it's XML2JS that is used so always expect objects.
	 * @param  {Object} $base64 angular-base64
	 * @param  {Object} $http angular http
	 * @param  {Object} $q angular promise
	 * @param  {Object} osmSettingsService settings service
	 */
	function osmAPI($base64, $http, $q, osmSettingsService, osmx2js, options) {

	    this.url = options.url;
	    // ------------------ CREDENTIALS -----------------

	    /**
	     * @ngdoc method
	     * @name validateCredentials
	     * @description if you don't use oauth, you can manage
	     * credentials here using base64 headers
	     * @methodOf osm.api.osmAPI
	     * @returns {Promise} true/false
	    */
	    this.validateCredentials = function () {
	        var deferred = $q.defer();
	        this.getUserDetails().then(function (data) {
	            if (data.osm.user) {
	                osmSettingsService.setUserID(data.osm.user._id);
	            }
	            deferred.resolve(data.osm.user !== undefined);
	        }, function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };
	    /**
	     * @ngdoc method
	     * @name setCredentials
	     * @description if you don't use oauth, you can save
	     * credentials here using base64 localstorage (completly unsecure)
	     * @methodOf osm.api.osmAPI
	     * @returns {string} crendentials
	    */
	    this.setCredentials = function (username, password) {
	        osmSettingsService.setUserName(username);
	        var credentials = $base64.encode(username + ':' + password);
	        osmSettingsService.setCredentials(credentials);
	        return credentials;
	    };
	    /**
	     * @ngdoc method
	     * @name getCredentials
	     * @description if you don't use oauth, you can manage
	     * credentials here using base64 headers
	     * @methodOf osm.api.osmAPI
	     * @returns {string} crendentials from the last set
	    */
	    this.getCredentials = function () {
	        return osmSettingsService.getCredentials();
	    };
	    /**
	     * @ngdoc method
	     * @name getAuthorization
	     * @description compute authorization header from credentials
	     * @methodOf osm.api.osmAPI
	     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	    */
	    this.getAuthorization = function () {
	        return 'Basic ' + osmSettingsService.getCredentials();
	    };
	    /**
	     * @ngdoc method
	     * @name clearCredentials
	     * @description remove credentials from the localstorage
	     * @methodOf osm.api.osmAPI
	     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	    */
	    this.clearCredentials = function () {
	        osmSettingsService.setCredentials('');
	    };

	    /**
	     * @ngdoc method
	     * @name setOauth
	     * @description use oauth object to call API
	     * @methodOf osm.api.osmAPI
	    */
	    this.setOauth = function setOauth(oauth) {
	        this._oauth = oauth;
	    };

	    /**
	     * @ngdoc method
	     * @name setOauth
	     * @description use oauth object to call API
	     * @methodOf osm.api.osmAPI
	     * @return {Object} oauth
	    */
	    this.getOauth = function getOauth() {
	        return this._oauth;
	    };

	    // ------------------ INTERNAL CALL SERVER (API) -----------------

	    function isElement(obj) {
	        try {
	            //Using W3 DOM2 (works for FF, Opera and Chrom)
	            return obj instanceof HTMLElement;
	        } catch (e) {
	            //Browsers not supporting W3 DOM2 don't have HTMLElement and
	            //an exception is thrown and we end up here. Testing some
	            //properties that all elements have. (works on IE7)
	            return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" && obj.nodeType === 1 && _typeof(obj.style) === "object" && _typeof(obj.ownerDocument) === "object";
	        }
	    }

	    /**
	     * @ngdoc method
	     * @name xhr
	     * @description call the API
	     * @param {Object} options
	     * ```
	        var options = {
	            method: 'GET', // POST, DELETE, PUT
	            path: '/0.6/changesets', //without the /api
	            data: content //if you need a payload
	        };
	        osmAPI.xhr(options);
	        ```
	     * @methodOf osm.api.osmAPI
	     * @return {Object} oauth
	    */
	    this.xhr = function (options) {
	        var deferred = $q.defer();
	        var promise = void 0;
	        var hasOauth = this._oauth;
	        if (hasOauth) {
	            options.path = '/api' + options.path;
	            if (options.data) {
	                options.body = options.data;
	                options.data = undefined;
	            }
	            promise = this._oauth.xhr(options);
	        } else {
	            options.url = this.url + options.path;
	            options.headers = {
	                Authorization: this.getAuthorization()
	            };
	            promise = $http(options);
	        }
	        promise.then(function (data) {
	            var d;
	            var t = function t(d) {
	                if (!d) {
	                    return d;
	                }
	                if (d.substr) {
	                    if (d.substr(0, 5) === '<?xml') {
	                        return osmx2js.xml2js(d);
	                    }
	                } else if (isElement(d)) {
	                    return osmx2js.dom2js(d);
	                }
	                return d;
	            };
	            if (hasOauth) {
	                d = data;
	            } else {
	                d = data.data;
	            }
	            deferred.resolve(t(d));
	        }, function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };

	    /**
	     * @ngdoc method
	     * @name getAuthenticated
	     * @description send a get request to OSM with
	     * base64 crendentials in header
	     * @methodOf osm.api.osmAPI
	     * @returns {Promise} $http response
	    */
	    this.getAuthenticated = function (method, config) {
	        var _config = angular.copy(config);
	        if (!_config) {
	            _config = {};
	        }
	        _config.method = 'GET';
	        _config.path = method;
	        return this.xhr(_config);
	    };
	    /**
	     * @ngdoc method
	     * @name get
	     * @description send a get request
	     * @methodOf osm.api.osmAPI
	     * @param {string} method the api method
	     * @param {Object} config the $http.get config
	     * @returns {Promise} $http response with XML as string
	    */
	    this.get = function (method, config) {
	        var deferred = $q.defer();
	        var self = this;
	        var url = this.url + method;
	        $http.get(url, config).then(function (data) {
	            deferred.resolve(osmx2js.xml2js(data.data));
	        }, function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };
	    /**
	     * @ngdoc method
	     * @name put
	     * @description send a put request
	     * @methodOf osm.api.osmAPI
	     * @param {string} method the api method
	     * @param {Object} content payload
	     * @param {Object} config the $http.put config
	     * @returns {Promise} $http response
	    */
	    this.put = function (method, content, config) {
	        if (!config) {
	            config = {};
	        }
	        var _config = angular.copy(config);
	        _config.method = 'PUT';
	        _config.path = method;
	        _config.data = osmx2js.js2xml(content);
	        return this.xhr(_config);
	    };
	    /**
	     * @ngdoc method
	     * @name delete
	     * @description send a delete request
	     * @methodOf osm.api.osmAPI
	     * @param {string} method the api method
	     * @param {Object} config the $http.delete config
	     * @returns {Promise} $http response
	    */
	    this.delete = function (method, config) {
	        if (!config) {
	            config = {};
	        }
	        var _config = angular.copy(config);
	        _config.method = 'DELETE';
	        _config.path = method;
	        return this.xhr(_config);
	    };

	    // ------------------ CHANGESET -----------------

	    /**
	     * @ngdoc method
	     * @name createChangeset
	     * @methodOf osm.api.osmAPI
	     * @param {string} comment the comment assiociated to the changeset
	     * @returns {Promise} $http response
	    */
	    this.createChangeset = function (comment) {
	        var deferred = $q.defer();
	        var changeset = { osm: {
	                changeset: {
	                    tag: [{ _k: 'created_by', _v: 'Angular-OSM' }, { _k: 'comment', _v: comment }]
	                }
	            } };
	        this.put('/0.6/changeset/create', changeset).then(function (data) {
	            osmSettingsService.setChangeset(data);
	            deferred.resolve(data);
	        });
	        return deferred.promise;
	    };
	    /**
	     * @ngdoc method
	     * @name getLastOpenedChangesetId
	     * @methodOf osm.api.osmAPI
	     * @returns {Promise} $http response with the last changeset id
	     * or undefined if no changeset was opened
	    */
	    this.getLastOpenedChangesetId = function () {
	        var deferred = $q.defer();
	        var config = {
	            params: { user: osmSettingsService.getUserID(), open: true }
	        };
	        this.get('/0.6/changesets', config).then(function (data) {
	            var changesets = data.osm.changeset;
	            if (changesets.length > 0) {
	                osmSettingsService.setChangeset(changesets[0].id);
	                deferred.resolve(changesets[0].id);
	            } else if (changesets._id) {
	                osmSettingsService.setChangeset(changesets._id);
	                deferred.resolve(changesets._id);
	            } else {
	                osmSettingsService.setChangeset();
	                deferred.resolve();
	            }
	        });
	        return deferred.promise;
	    };
	    /**
	     * @ngdoc method
	     * @name closeChangeset
	     * @methodOf osm.api.osmAPI
	     * @returns {Promise} $http.put response of
	     * /0.6/changeset/CHANGESET_ID/close
	    */
	    this.closeChangeset = function () {
	        var changeset = osmSettingsService.getChangeset();
	        return this.put('/0.6/changeset/' + changeset + '/close').then(function (data) {
	            osmSettingsService.setChangeset();
	            return data;
	        });
	    };

	    // ------------------ USER API -----------------

	    /**
	     * @ngdoc method
	     * @name getUserById
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id of the user
	     * @returns {Promise} $http.get response
	     * /0.6/user/#id
	    */
	    this.getUserById = function (id) {
	        return this.getAuthenticated('/0.6/user/' + id);
	    };

	    /**
	     * @ngdoc method
	     * @name getUserDetails
	     * @methodOf osm.api.osmAPI
	     * @returns {Promise} $http.get response
	     * /0.6/user/details
	    */
	    this.getUserDetails = function () {
	        return this.getAuthenticated('/0.6/user/details');
	    };
	    /**
	     * @ngdoc method
	     * @name getUserPreferences
	     * @methodOf osm.api.osmAPI
	     * @returns {Promise} $http.get response
	     * /0.6/user/preferences
	    */
	    this.getUserPreferences = function () {
	        return this.getAuthenticated('/0.6/user/preferences');
	    };

	    /**
	     * @ngdoc method
	     * @name putUserPreferences
	     * @methodOf osm.api.osmAPI
	     * @param {string} key the preference key
	     * @param {string} value the preference value
	     * @returns {Promise} $http.get response
	     * /0.6/user/preferences
	    */
	    this.putUserPreferences = function (key, value) {
	        return this.put('/0.6/user/preferences/' + key, value);
	    };

	    //------------------ MAP DATA -------------------------

	    /**
	     * @ngdoc method
	     * @name getMap
	     * @methodOf osm.api.osmAPI
	     * @param {string} bbox left,bottom,right,top
	     * where:
	        left is the longitude of the left (westernmost) side of the bounding box.
	        bottom is the latitude of the bottom (southernmost) side of the bounding box.
	        right is the longitude of the right (easternmost) side of the bounding box.
	        top is the latitude of the top (northernmost) side of the bounding box.
	     * @returns {Promise} $http.get response
	     * /0.6/map?bbox=bbox
	    */
	    this.getMap = function (bbox) {
	        return this.get('/0.6/map?bbox=' + bbox);
	    };

	    /**
	     * @ngdoc method
	     * @name getNotes
	     * @methodOf osm.api.osmAPI
	     * @param {string} bbox left,bottom,right,top
	     * where:
	        left is the longitude of the left (westernmost) side of the bounding box.
	        bottom is the latitude of the bottom (southernmost) side of the bounding box.
	        right is the longitude of the right (easternmost) side of the bounding box.
	        top is the latitude of the top (northernmost) side of the bounding box.
	     * @returns {Promise} $http.get response
	    */
	    this.getNotes = function (bbox) {
	        var url = '/0.6/notes?bbox=' + bbox;
	        return this.get(url);
	    };

	    //------------------ ELEMENTS: Node ----------------

	    /**
	     * @ngdoc method
	     * @name createNode
	     * @methodOf osm.api.osmAPI
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
	    this.createNode = function (node) {
	        return this.put('/0.6/node/create', node);
	    };

	    /**
	     * @ngdoc method
	     * @name getNode
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/node/#id
	    */
	    this.getNode = function (id) {
	        return this.get('/0.6/node/' + id);
	    };

	    /**
	     * @ngdoc method
	     * @name getNodeRelations
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/node/#id/relations
	    */
	    this.getNodeRelations = function (id) {
	        return this.get('/0.6/node/' + id + '/relations');
	    };

	    /**
	     * @ngdoc method
	     * @name getNodeWays
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/node/#id/ways
	    */
	    this.getNodeWays = function (id) {
	        return this.get('/0.6/node/' + id + '/ways');
	    };

	    /**
	     * @ngdoc method
	     * @name getNodes
	     * @methodOf osm.api.osmAPI
	     * @param {array} ids ids
	     * @returns {Promise} $http.get response
	     * GET /0.6/node/#id
	    */
	    this.getNodes = function (ids) {
	        return this.get('/0.6/nodes?nodes=' + ids.join(','));
	    };

	    /**
	     * @ngdoc method
	     * @name deleteNode
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.delete response
	     * DELETE /0.6/node/#id
	    */
	    this.deleteNode = function (id) {
	        return this.delete('/0.6/node/' + id);
	    };

	    //------------------ ELEMENTS: WAY ----------------

	    /**
	     * @ngdoc method
	     * @name createWay
	     * @methodOf osm.api.osmAPI
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
	    this.createWay = function (way) {
	        return this.put('/0.6/way/create', way);
	    };

	    /**
	     * @ngdoc method
	     * @name getWay
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/way/#id
	    */
	    this.getWay = function (id) {
	        return this.get('/0.6/way/' + id);
	    };

	    /**
	     * @ngdoc method
	     * @name getWayRelations
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/way/#id/relations
	    */
	    this.getWayRelations = function (id) {
	        return this.get('/0.6/way/' + id + '/relations');
	    };

	    /**
	     * @ngdoc method
	     * @name getWayFull
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/way/#id/full
	    */
	    this.getWayFull = function (id) {
	        return this.get('/0.6/way/' + id + '/full');
	    };

	    /**
	     * @ngdoc method
	     * @name getWays
	     * @methodOf osm.api.osmAPI
	     * @param {array} ids ids
	     * @returns {Promise} $http.get response
	     * GET /0.6/ways?ways=ids
	    */
	    this.getWays = function (ids) {
	        return this.get('/0.6/ways?ways=' + ids.join(','));
	    };

	    /**
	     * @ngdoc method
	     * @name deleteWay
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.delete response
	     * DELETE /0.6/way/#id
	    */
	    this.deleteWay = function (id) {
	        return this.delete('/0.6/way/' + id);
	    };

	    //------------------ ELEMENTS: RELATION ----------------

	    /**
	     * @ngdoc method
	     * @name createRelation
	     * @methodOf osm.api.osmAPI
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
	    this.createRelation = function (relation) {
	        return this.put('/0.6/relation/create', relation);
	    };

	    /**
	     * @ngdoc method
	     * @name getRelation
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/relation/#id
	    */
	    this.getRelation = function (id) {
	        return this.get('/0.6/relation/' + id);
	    };
	    /**
	     * @ngdoc method
	     * @name getRelationRelations
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/relation/#id/relations
	    */
	    this.getRelationRelations = function (id) {
	        return this.get('/0.6/relation/' + id + '/relations');
	    };

	    /**
	     * @ngdoc method
	     * @name getRelationFull
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.get response
	     * GET /0.6/relation/#id/full
	    */
	    this.getRelationFull = function (id) {
	        return this.get('/0.6/relation/' + id + '/full');
	    };

	    /**
	     * @ngdoc method
	     * @name getRelations
	     * @methodOf osm.api.osmAPI
	     * @param {array} ids ids
	     * @returns {Promise} $http.get response
	     * GET /0.6/relations?relations=ids
	    */
	    this.getRelations = function (ids) {
	        return this.get('/0.6/relations?relations=' + ids.join(','));
	    };

	    /**
	     * @ngdoc method
	     * @name deleteRelation
	     * @methodOf osm.api.osmAPI
	     * @param {string} id id
	     * @returns {Promise} $http.delete response
	     * DELETE /0.6/relation/#id
	    */
	    this.deleteRelation = function (id) {
	        return this.delete('/0.6/relation/' + id);
	    };
	}

	exports.default = osmAPI;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _settings = __webpack_require__(5);

	var _settings2 = _interopRequireDefault(_settings);

	var _ngstorage = __webpack_require__(6);

	var _ngstorage2 = _interopRequireDefault(_ngstorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var ngStorageModuleName = _ngstorage2.default ? _ngstorage2.default.name : 'ngStorage';

	var osmSettingsModule = angular.module('osm.settings', [ngStorageModuleName]).service('osmSettingsService', _settings2.default);

	exports.default = osmSettingsModule;

/***/ },
/* 5 */
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

	    this.localStorage = $localStorage.$default({
	        userName: '',
	        userID: '',
	        credentials: '',
	        changeset: ''
	    });
	    this.getUserName = function () {
	        return this.localStorage.userName;
	    };
	    this.setUserName = function (username) {
	        this.localStorage.userName = username;
	    };
	    this.getUserID = function () {
	        return this.localStorage.userID;
	    };
	    this.setUserID = function (userid) {
	        this.localStorage.userID = userid;
	    };
	    this.getCredentials = function () {
	        return this.localStorage.credentials;
	    };
	    this.setCredentials = function (credentials) {
	        this.localStorage.credentials = credentials;
	    };
	    this.getChangeset = function () {
	        return this.localStorage.changeset;
	    };
	    this.setChangeset = function (changeset) {
	        this.localStorage.changeset = changeset;
	    };
	    this.getOsmAuth = function () {
	        return this.localStorage.osmAuth;
	    };
	    this.setOsmAuth = function (options) {
	        this.localStorage.osmAuth = options;
	    };
	}

	exports.default = osmSettingsService;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	//https://github.com/abdmob/x2js as angular service
	var osmx2jsModule = angular.module('osm.x2js', []).provider('osmx2js', function osmx2jsProvider() {
	    this.options = {};
	    this.$get = function osmx2jsFactory() {
	        return new X2JS(this.options); //X2JS must be global
	    };
	});

	exports.default = osmx2jsModule;

/***/ }
/******/ ])
});
;