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

	module.exports = __webpack_require__(15);


/***/ },

/***/ 15:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _taginfo = __webpack_require__(16);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmTagInfoModule = angular.module('osm.taginfo', []).factory('osmTagInfoAPI', _taginfo2.default);

	exports.default = osmTagInfoModule;

/***/ },

/***/ 16:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	osmTagInfoAPI.$inject = ['$http', '$q'];
	/**
	 * @ngdoc service
	 * @name osmTagInfoAPI
	 * @description integration of taginfo
	 * http://taginfo.openstreetmap.org/taginfo/apidoc
	 * @param  {any} $http
	 * @param  {any} $q
	 */
	function osmTagInfoAPI($http, $q) {
	    var service = {
	        get: function get(method, config) {
	            var deferred = $q.defer();
	            $http.get('https://taginfo.openstreetmap.org/api/4' + method, config).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key matches this query (substring match, optional).
	         */
	        getKeyCombinations: function getKeyCombinations(params) {
	            return this.get('/key/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyDistributionNodes: function getKeyDistributionNodes(params) {
	            return this.get('/key/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyDistributionWays: function getKeyDistributionWays(params) {
	            return this.get('/key/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyStats: function getKeyStats(params) {
	            return this.get('/key/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyValues
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            lang — Language for description (optional, default: 'en').
	            query — Only show results where the value matches this query (substring match, optional).
	         */
	        getKeyValues: function getKeyValues(params) {
	            return this.get('/key/values', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyWikiPages: function getKeyWikiPages(params) {
	            return this.get('/key/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysAll: function getKeysAll(params) {
	            return this.get('/keys/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysWikiPages: function getKeysWikiPages(params) {
	            return this.get('/keys/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWithoutWikiPage
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            english — Check for key wiki pages in any language (0, default) or in the English language (1).
	            min_count — How many tags with this key must there be at least to show up here? (default 10000).
	            query — Only show results where the key matches this query (substring match, optional).
	         */
	        getKeysWithoutWikiPage: function getKeysWithoutWikiPage(params) {
	            return this.get('/keys/without_wiki_page', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationRoles
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the role matches this query (substring match, optional).
	            rtype — Relation type (required).
	         */
	        getRelationRoles: function getRelationRoles(params) {
	            return this.get('/relation/roles', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationStats: function getRelationStats(params) {
	            return this.get('/relation/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationWikiPages: function getRelationWikiPages(params) {
	            return this.get('/relation/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationsAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the relation type matches this query (substring match, optional).
	         */
	        getRelationsAll: function getRelationsAll(params) {
	            return this.get('/relations/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyAndValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyAndValue: function getSearchByKeyAndValue(params) {
	            return this.get('/search/by_key_and_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyword
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyword: function getSearchByKeyword(params) {
	            return this.get('/search/by_keyword', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByRole
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Role to search for (substring search, required).
	         */
	        getSearchByRole: function getSearchByRole(params) {
	            return this.get('/search/by_role', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByValue: function getSearchByValue(params) {
	            return this.get('/search/by_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteInfo
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteInfo: function getSiteInfo(params) {
	            return this.get('/site/info', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteSources
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteSources: function getSiteSources(params) {
	            return this.get('/site/sources', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key or other_value matches this query (substring match, optional).
	            value — Tag value (required).
	         */
	        getTagCombinations: function getTagCombinations(params) {
	            return this.get('/tag/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagDistributionNodes: function getTagDistributionNodes(params) {
	            return this.get('/tag/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagDistributionWays: function getTagDistributionWays(params) {
	            return this.get('/tag/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagStats: function getTagStats(params) {
	            return this.get('/tag/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagWikiPages: function getTagWikiPages(params) {
	            return this.get('/tag/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagsPopular
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show tags matching this query (substring match in key and value, optional).
	         */
	        getTagsPopular: function getTagsPopular(params) {
	            return this.get('/tags/popular', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getWikiLanguages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getWikiLanguages: function getWikiLanguages(params) {
	            return this.get('/wiki/languages', { params: params });
	        }
	    };
	    return service;
	}
	exports.default = osmTagInfoAPI;

/***/ }

/******/ })
});
;