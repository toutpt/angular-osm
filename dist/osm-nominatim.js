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

	module.exports = __webpack_require__(12);


/***/ },

/***/ 12:
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

/***/ 13:
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

/***/ }

/******/ })
});
;