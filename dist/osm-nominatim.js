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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(16);


/***/ },

/***/ 16:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _nominatim = __webpack_require__(17);

	var _nominatim2 = _interopRequireDefault(_nominatim);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmNominatimModule = angular.module('osm.nominatim', []).factory('osmNominatim', _nominatim2.default).provider('osmNominatim', function osmNominatimProvider() {
	    this.options = {
	        url: 'https://nominatim.openstreetmap.org'
	    };
	    this.$get = function osmNominatimFactory($q) {
	        return new _nominatim2.default($q, this.options);
	    };
	    this.$get.$inject = ['$http'];
	});

	exports.default = osmNominatimModule;

/***/ },

/***/ 17:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	/**
	* @ngdoc service
	* @name osm.nominatim.osmNominatim
	* @description handle nominatim query
	*/
	function osmNominatim($http, options) {
	    this.url = options.url;

	    /**
	     * @ngdoc method
	     * @name search
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/Nominatim
	     * @methodOf osm.nominatim.osmNominatim
	     * @return {Promise} $http.get
	    */
	    this.search = function search(query) {
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
	        return $http.get(url, config);
	    };

	    /**
	     * @ngdoc method
	     * @name reverse
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/Nominatim
	     * @methodOf osm.nominatim.osmNominatim
	     * @return {Promise} $http.get
	    */
	    this.reverse = function reverse(query) {
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
	        return $http.get(url, config);
	    };

	    /**
	     * @ngdoc method
	     * @name lookup
	     * @description
	     *  http://nominatim.openstreetmap.org/lookup?osm_ids=R146656,W104393803,N240109189
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/Nominatim
	     * @methodOf osm.nominatim.osmNominatim
	     * @return {Promise} $http.get
	    */
	    this.lookup = function lookup(query) {
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
	        return $http.get(url, config);
	    };
	}

	exports.default = osmNominatim;

/***/ }

/******/ })
});
;