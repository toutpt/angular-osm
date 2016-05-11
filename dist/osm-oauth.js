(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("osm-auth"));
	else if(typeof define === 'function' && define.amd)
		define(["osm-auth"], factory);
	else if(typeof exports === 'object')
		exports["name"] = factory(require("osm-auth"));
	else
		root["angular-osm"] = root["angular-osm"] || {}, root["angular-osm"]["name"] = factory(root["osm-auth"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_12__) {
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

	module.exports = __webpack_require__(10);


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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _oauth = __webpack_require__(11);

	var _oauth2 = _interopRequireDefault(_oauth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOAuthModule = angular.module('osm.oauth', []).factory('osmAuthService', _oauth2.default).provider('osmAuthService', function osmAuthServiceProvider() {
	    this.options = {};

	    this.$get = function osmAuthServiceFactory($q) {
	        return new _oauth2.default($q, this.options);
	    };
	    this.$get.$inject = ['$q'];
	});

	exports.default = osmOAuthModule;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _osmAuth = __webpack_require__(12);

	var _osmAuth2 = _interopRequireDefault(_osmAuth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* @ngdoc service
	* @name osm.oauth.osmAuthService
	* @requires angular-osm.osmSettingsService
	* @description handle osm oauth
	*/
	function osmAuthService($q, options) {
	    if (options) {
	        if (options.oauth_secret && options.oauth_consumer_key) {
	            this.auth = osmAuth(options);
	        }
	    }
	    this.logout = function () {
	        return this.auth.logout();
	    };
	    this.authenticated = function () {
	        return this.auth.authenticated();
	    };
	    this.authenticate = function () {
	        var deferred = $q.defer();
	        this.auth.authenticate(function () {
	            deferred.resolve(true);
	        });
	        return deferred.promise;
	    };
	    this.xhr = function (options) {
	        var deferred = $q.defer();
	        this.auth.xhr(options, function (err, data) {
	            if (err) {
	                deferred.reject(err);
	            } else {
	                deferred.resolve(data);
	            }
	        });
	        return deferred.promise;
	    };
	    this.options = function (options) {
	        if (this.auth) {
	            this.auth.options(options);
	        } else {
	            this.auth = osmAuth(options);
	        }
	    };
	}

	exports.default = osmAuthService;

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_12__;

/***/ }
/******/ ])
});
;