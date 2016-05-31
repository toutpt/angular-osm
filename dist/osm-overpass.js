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

	module.exports = __webpack_require__(8);


/***/ },

/***/ 8:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _overpass = __webpack_require__(9);

	var _overpass2 = _interopRequireDefault(_overpass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOverpassModule = angular.module('osm.overpass', []).provider('osmOverpassAPI', function osmOverpassAPIProvider() {
	    this.options = {
	        url: 'http://overpass-api.de/api/interpreter'
	    };
	    this.$get = function osmOverpassAPIFactory($http, $q) {
	        return new _overpass2.default($http, $q, this.options);
	    };
	    this.$get.$inject = ['$http', '$q'];
	}); /**
	     * @module osm.overpass
	     */


	exports.default = osmOverpassModule;

/***/ },

/***/ 9:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * @class
	 * Create osmOverpassAPI service instance
	 */

	var OverpassAPI = function () {
	    /**
	     * @param {Object} $http angular $http service
	     * @param {Object} $q  angular $q service
	     * @param {Object} options
	     */

	    function OverpassAPI($http, $q, options) {
	        _classCallCheck(this, OverpassAPI);

	        this.url = options.url;
	        this.$http = $http;
	        this.$q = $q;
	    }
	    /**
	     * @param {Object/String} query
	     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
	     * @return {Promise} $http.get
	    */


	    _createClass(OverpassAPI, [{
	        key: 'overpass',
	        value: function overpass(query) {
	            var url = this.url;
	            var deferred = this.$q.defer();
	            var headers = {
	                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
	            };
	            this.$http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        }
	        /**
	         * http://wiki.openstreetmap.org/wiki/FR:Overpass_API/Overpass_QL#By_area_.28area.29
	            By convention the area id can be calculated from an existing OSM way by adding 2400000000 to its OSM id, or in case of a relation by adding 3600000000 respectively. Note that area creation is subject to some extraction rules, i.e. not all ways/relations have an area counterpart (notably those that are tagged with area=no, and most multipolygons and that don't have a defined name=* will not be part of areas).
	         * @param {String} type 'r'/'relation' or 'w'/'way'
	         * @param {String/Number} osmId the id of the element
	         * @return {Number} the area id
	        */

	    }, {
	        key: 'getAreaId',
	        value: function getAreaId(type, osmId) {
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
	        }
	    }, {
	        key: 'overpassToGeoJSON',
	        value: function overpassToGeoJSON(query, filter) {
	            var deferred = this.$q.defer();
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
	        }
	    }]);

	    return OverpassAPI;
	}();

	exports.default = OverpassAPI;

/***/ }

/******/ })
});
;