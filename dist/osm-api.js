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

	var _utils = __webpack_require__(7);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//The base64 module is only available as IIFE

	var osmAPIModule = angular.module('osm.api', [_settings2.default.name, _utils2.default.name, 'base64']).service('osmAPI', _api2.default).provider('osmAPI', function osmAPIProvider() {
	    this.options = {
	        url: 'http://api.openstreetmap.org/api'
	    };
	    this.$get = function osmAPIFactory($base64, $http, $q, osmSettingsService, osmUtilsService) {
	        return new _api2.default($base64, $http, $q, osmSettingsService, osmUtilsService, this.options);
	    };
	    this.$get.$inject = ['$base64', '$http', '$q', 'osmSettingsService', 'osmUtilsService'];
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
	/**
	 * @ngdoc service
	 * @name osm.oauth.osmAuthService
	 * @description The main idea is use geojson object where it is possible
	 * for the rest of the API (changeset, ...) it's XML2JS that is used so always expect objects.
	 * @param  {any} $base64
	 * @param  {any} $http
	 * @param  {any} $q
	 * @param  {any} osmSettingsService
	 */
	function osmAPI($base64, $http, $q, osmSettingsService, osmUtilsService, options) {

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

	    /**
	     * @ngdoc method
	     * @name xhr
	     * @description call the API
	     * @param {Object} options
	     * @comment
	     * ```
	        var options = {
	            method: 'GET' // POST, DELETE, PUT
	            path: '/0.6/changesets' //without the /api,
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
	            var fct = options.method.toLowerCase();
	            if (options.config === undefined) {
	                options.config = {};
	            }
	            options.config.headers = { Authorization: this.getAuthorization() };
	            promise = $http[fct](options.path, options.config);
	        }
	        promise.then(function (data) {
	            if (hasOauth) {
	                deferred.resolve(osmUtilsService.x2js.dom2js(data));
	            } else {
	                deferred.resolve(osmUtilsService.xml2js(data.data));
	            }
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
	            deferred.resolve(osmUtilsService.xml2js(data.data));
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
	        var _config = angular.copy(config);
	        config.method = 'PUT';
	        config.path = method;
	        config.data = content;
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
	        var _config = angular.copy(config);
	        config.method = 'DELETE';
	        config.path = method;
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
	     * @param {string} id of the user
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
	     * @name getMapGeoJSON
	     * @methodOf osm.api.osmAPI
	     * @param {string} bbox the bounding box
	     * @returns {Promise} $http.get response
	    */
	    this.getMapGeoJSON = function (bbox) {
	        var self = this;
	        var deferred = $q.defer();
	        self.getMap(bbox).then(function (nodes) {
	            var geojsonNodes = osmUtilsService.js2geojson(nodes);
	            deferred.resolve(geojsonNodes);
	        }, function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
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
	     * @param {string} id
	     * @returns {Promise} $http.get response
	     * GET /0.6/node/#id
	    */
	    this.getNode = function (id) {
	        return this.get('/0.6/node/' + id);
	    };

	    /**
	     * @ngdoc method
	     * @name deleteNode
	     * @methodOf osm.api.osmAPI
	     * @param {string} id
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
	     * @param {string} id
	     * @returns {Promise} $http.get response
	     * GET /0.6/way/#id
	    */
	    this.getWay = function (id) {
	        return this.get('/0.6/way/' + id);
	    };

	    /**
	     * @ngdoc method
	     * @name deleteWay
	     * @methodOf osm.api.osmAPI
	     * @param {string} id
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
	     * @param {string} id
	     * @returns {Promise} $http.get response
	     * GET /0.6/relation/#id
	    */
	    this.getRelation = function (id) {
	        return this.get('/0.6/relation/' + id);
	    };

	    /**
	     * @ngdoc method
	     * @name deleteRelation
	     * @methodOf osm.api.osmAPI
	     * @param {string} id
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

	var osmSettingsModule = angular.module('osm.settings', [ngStorageModuleName]).factory('osmSettingsService', _settings2.default);

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
	    return {
	        localStorage: $localStorage.$default({
	            userName: '',
	            userID: '',
	            credentials: '',
	            nodes: [],
	            changeset: ''
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
	            this.localStorage.osmAuth = options;
	        }
	    };
	}

	exports.default = osmSettingsService;

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(8);

	var _utils2 = _interopRequireDefault(_utils);

	var _settings = __webpack_require__(4);

	var _settings2 = _interopRequireDefault(_settings);

	var _x2js = __webpack_require__(9);

	var _x2js2 = _interopRequireDefault(_x2js);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmUtilsModule = angular.module('osm.utils', [_settings2.default.name, _x2js2.default.name]).service('osmUtilsService', _utils2.default);

	exports.default = osmUtilsModule;

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	    this.relationToGeoJSON = function (relationID, relation) {
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
	    };

	    /**
	     * @ngdoc method
	     * @name encodeXML
	     * @methodOf osm.utils.osmUtilsService
	     * @param {string} str the string to encode
	     * @return {string} the encoded string
	     */
	    this.encodeXML = function (str) {
	        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
	    };
	    /**
	     * @ngdoc method
	     * @name relationGeoJSONToXml
	     * @methodOf osm.utils.osmUtilsService
	     * @param {Object} relationGeoJSON geojson
	     * @return {string} relation as xml
	     */
	    this.relationGeoJSONToXml = function (relationGeoJSON) {
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
	    };
	    /**
	     * @ngdoc method
	     * @name sortRelationMembers
	     * @methodOf osm.utils.osmUtilsService
	     * @param {Object} relationGeoJSON geojson
	     * @return {Object} relation as geojson sorted
	     */
	    this.sortRelationMembers = function (relationGeoJSON) {
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
	        return relationGeoJSON;
	    };
	    this.x2js = osmx2js;
	    this.xml2js = function (xml_str) {
	        return osmx2js.xml2js(xml_str);
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
	    this.yqlJSON = function (featuresURL) {
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
	    };
	    /**
	     * @ngdoc method
	     * @name getElementTypeFromFeature
	     * @methodOf osm.utils.osmUtilsService
	     * @param {string} feature geojson feature
	     * @return {string} type 'node' or 'way'
	     */
	    this.getElementTypeFromFeature = function (feature) {
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
	exports.default = osmUtilsService;

/***/ },
/* 9 */
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