(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("ngstorage"));
	else if(typeof define === 'function' && define.amd)
		define(["ngstorage"], factory);
	else if(typeof exports === 'object')
		exports["name"] = factory(require("ngstorage"));
	else
		root["angular-osm"] = root["angular-osm"] || {}, root["angular-osm"]["name"] = factory(root["ngstorage"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__) {
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

	module.exports = __webpack_require__(14);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
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
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _overpass = __webpack_require__(15);

	var _overpass2 = _interopRequireDefault(_overpass);

	var _settings = __webpack_require__(4);

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOverpassModule = angular.module('osm.overpass', [_settings2.default.name]).factory('osmOverpassAPI', _overpass2.default).provider('osmOverpassAPI', function osmOverpassAPIProvider() {
	    this.options = {
	        url: 'http://overpass-api.de/api/interpreter'
	    };
	    this.$get = function osmOverpassAPIFactory($http, $q, osmSettingsService) {
	        return new _overpass2.default($http, $q, osmSettingsService, this.options);
	    };
	    this.$get.$inject = ['$http', '$q', 'osmSettingsService'];
	});

	exports.default = osmOverpassModule;

/***/ },
/* 15 */
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
	function osmOverpassAPI($http, $q, osmSettingsService, options) {
	    this.overpass = function (query) {
	        var url = this.url;
	        var deferred = $q.defer();
	        var self = this;
	        var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
	        $http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
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
	    };
	}

	exports.default = osmOverpassAPI;

/***/ }
/******/ ])
});
;