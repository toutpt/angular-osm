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

	module.exports = __webpack_require__(10);


/***/ },

/***/ 10:
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

/***/ 11:
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

/***/ }

/******/ })
});
;