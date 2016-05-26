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

	module.exports = __webpack_require__(18);


/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _osrm = __webpack_require__(19);

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
	});

	exports.default = osrmModule;

/***/ },

/***/ 19:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @ngdoc service
	 * @name osrmAPI
	 * @param  {any} $http
	 * @param  {any} $q
	 * @description
	 * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md
	 */

	var osrmAPI = function () {
	    function osrmAPI($http, $q, options) {
	        _classCallCheck(this, osrmAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	    }

	    _createClass(osrmAPI, [{
	        key: 'get',
	        value: function get(service, version, profile, coordinates, options) {
	            var _coordinates = coordinates;
	            if (Array.isArray(coordinates)) {
	                _coordinates = coordinates.join(';');
	            }
	            var url = this.url + '/' + service + '/' + version + '/' + profile + '/' + _coordinates;
	            return this.$http.get(url, { params: options });
	        }
	        //coordinates is String of format {longitude},{latitude};{longitude},{latitude}[;{longitude},{latitude} ...]

	    }, {
	        key: 'nearest',
	        value: function nearest(profile, coordinates, number) {
	            var options;
	            if (number) {
	                options = { number: number };
	            }
	            return this.get('nearest', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'route',
	        value: function route(profile, coordinates, options) {
	            return this.get('route', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'table',
	        value: function table(profile, coordinates, options) {
	            return this.get('table', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'match',
	        value: function match(profile, coordinates, options) {
	            return this.get('match', 'v1', profile, coordinates, options);
	        }
	    }, {
	        key: 'trip',
	        value: function trip(profile, coordinates, options) {
	            return this.get('trip', 'v1', profile, coordinates, options);
	        }
	    }]);

	    return osrmAPI;
	}();

	exports.default = osrmAPI;

/***/ }

/******/ })
});
;