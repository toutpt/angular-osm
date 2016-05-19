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

	module.exports = __webpack_require__(12);


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
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _overpass = __webpack_require__(13);

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
/* 13 */
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
	    this.url = options.url;
	    /**
	     * @ngdoc method
	     * @name overpass
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
	     * @methodOf osm.overpass.osmOverpassAPI
	     * @return {Promise} $http.get
	    */
	    this.overpass = function (query) {
	        var self = this;
	        var url = self.url;
	        var deferred = $q.defer();
	        var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
	        $http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
	            deferred.resolve(data.data);
	        }, function (data) {
	            deferred.reject(data);
	        });
	        return deferred.promise;
	    };
	    /**
	     * @ngdoc method
	     * @name overpass
	     * @description
	     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API/Overpass_QL#By_area_.28area.29
	        By convention the area id can be calculated from an existing OSM way by adding 2400000000 to its OSM id, or in case of a relation by adding 3600000000 respectively. Note that area creation is subject to some extraction rules, i.e. not all ways/relations have an area counterpart (notably those that are tagged with area=no, and most multipolygons and that don't have a defined name=* will not be part of areas).
	     * @param {String} type 'r'/'relation' or 'w'/'way'
	     * @param {String/Number} osmId the id of the element
	     * @methodOf osm.overpass.osmOverpassAPI
	     * @return {Number} the area id
	    */
	    this.getAreaId = function (type, osmId) {
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
	    };
	}

	exports.default = osmOverpassAPI;

/***/ }
/******/ ])
});
;