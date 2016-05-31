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

	module.exports = __webpack_require__(14);


/***/ },

/***/ 14:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _togeojson = __webpack_require__(15);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmtogeojsonModule = angular.module('osm.togeojson', []).provider('osmtogeojson', _togeojson2.default); /**
	                                                                                                             * @module osm.togeojson
	                                                                                                             */

	exports.default = osmtogeojsonModule;

/***/ },

/***/ 15:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _togeojson = __webpack_require__(16);

	var _togeojson2 = _interopRequireDefault(_togeojson);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function osmtogejsonProvider() {
	    this.options = {
	        areaTags: ['area', 'building', 'leisure', 'tourism', 'ruins', 'historic', 'landuse', 'military', 'natural', 'sport'],
	        uninterestingTags: ['source', 'source_ref', 'source:ref', 'history', 'attribution', 'created_by', 'tiger:county', 'tiger:tlid', 'tiger:upload_uuid'],
	        styles: {}
	    };
	    this.$get = function () {
	        return (0, _togeojson2.default)(this.options);
	    };
	}
	exports.default = osmtogejsonProvider;

/***/ },

/***/ 16:
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	/**
	 * @constructor ToGeoJSON
	 * @param {Object} options provided by the provider
	 * @description osm to geojson without dependencies :)
	   Import Note : geojson wait for lon/lat where every body else use lat/lon
	 */
	function factory(options) {
	    //copy/pasted/adapter from https://github.com/jfirebaugh/leaflet-osm/blob/master/leaflet-osm.js
	    var service = {
	        options: options,
	        getAsArray: getAsArray,
	        getFeatures: getFeatures,
	        getNodes: getNodes,
	        getWays: getWays,
	        getRelations: getRelations,
	        getTags: getTags,
	        buildFeatures: buildFeatures,
	        isWayArea: isWayArea,
	        interestingNode: interestingNode,
	        togeojson: togeojson
	    };
	    return service;

	    function getFeatures(data) {
	        var features = [];
	        if (!(data instanceof Array)) {
	            data = buildFeatures(data);
	        }

	        for (var i = 0; i < data.length; i++) {
	            var d = data[i];
	            var feature = {
	                type: 'Feature',
	                geometry: {},
	                properties: {
	                    id: d.id,
	                    tags: d.tags
	                }
	            };
	            if (d.type === "changeset") {
	                //build rectangle
	                // X = Long; Y = Lat, lets do it clockwise
	                feature.geometry.type = 'Polygon';
	                var bounds = d.latLngBounds;
	                feature.geometry.coordinates = [[[parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)], [parseFloat(bounds._min_lon), parseFloat(bounds._max_lat)], [parseFloat(bounds._max_lon), parseFloat(bounds._max_lat)], [parseFloat(bounds._max_lon), parseFloat(bounds._min_lat)], [parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)]]];
	            } else if (d.type === "node") {
	                //add a Point
	                feature.geometry.type = 'Point';
	                feature.geometry.coordinates = [d.latLng[1], d.latLng[0]];
	            } else {
	                var lngLats = new Array(d.nodes.length);

	                for (var j = 0; j < d.nodes.length; j++) {
	                    var latLng = d.nodes[j].latLng;
	                    lngLats[j] = [latLng[1], latLng[0]];
	                }

	                if (isWayArea(d)) {
	                    feature.geometry.type = 'Polygon';
	                    feature.geometry.coordinates = [lngLats];
	                } else {
	                    feature.geometry.type = 'LineString';
	                    feature.geometry.coordinates = lngLats;
	                }
	            }
	            features.push(feature);
	        }
	        return features;
	    }
	    function getAsArray(data) {
	        if (Array.isArray(data)) {
	            return data;
	        } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === "object") {
	            return [data];
	        } else {
	            return [];
	        }
	    }
	    function getTags(data) {
	        var rawtags = getAsArray(data.tag);
	        var tags = {};
	        rawtags.forEach(function (t) {
	            tags[t._k] = t._v;
	        });
	        return tags;
	    }
	    function getChangesets(data) {
	        var result = [];

	        var nodes = getAsArray(data.osm.changeset);
	        for (var i = 0; i < nodes.length; i++) {
	            var node = nodes[i];
	            result.push({
	                id: node._id,
	                type: "changeset",

	                latLngBounds: node,
	                tags: getTags(node)
	            });
	        }

	        return result;
	    }

	    function getNodes(data) {
	        var nodesAsArray = getAsArray(data.osm.node);
	        var nodesById = {};
	        nodesAsArray.forEach(function (node) {
	            nodesById[node._id] = {
	                id: node._id,
	                type: 'node',
	                latLng: [parseFloat(node._lat), parseFloat(node._lon)],
	                tags: getTags(node)
	            };
	        });
	        return nodesById;
	    }
	    function getWays(data, nodes) {
	        var result = [];
	        var ways = getAsArray(data.osm.way);
	        var features = [];
	        ways.forEach(function (way) {
	            var nds = way.nd;
	            var way_object = {
	                id: way._id,
	                type: "way",
	                nodes: new Array(nds.length),
	                tags: getTags(way)
	            };
	            for (var j = 0; j < nds.length; j++) {
	                way_object.nodes[j] = nodes[nds[j]._ref];
	            }
	            result.push(way_object);
	        });
	        return result;
	    }
	    function getRelations(data, nodes, way) {
	        var result = [];

	        var rels = getAsArray(data.osm.relation);
	        for (var i = 0; i < rels.length; i++) {
	            var rel = rels[i];
	            var members = getAsArray(rel.member);
	            var rel_object = {
	                id: rel._id,
	                type: "relation",
	                members: new Array(members.length),
	                tags: getTags(rel)
	            };
	            for (var j = 0; j < members.length; j++) {
	                if (members[j]._type === "node") {
	                    rel_object.members[j] = nodes[members[j]._ref];
	                } else {
	                    // relation-way and relation-relation membership not implemented
	                    rel_object.members[j] = null;
	                }
	            }
	            result.push(rel_object);
	        }
	        return result;
	    }

	    function buildFeatures(data) {
	        var features = [];
	        var nodes = getNodes(data); //-> {id: data, ...}
	        var ways = getWays(data, nodes); //->[]
	        var relations = getRelations(data, nodes, ways); //->[]

	        for (var node_id in nodes) {
	            var node = nodes[node_id];
	            if (interestingNode(node, ways, relations)) {
	                features.push(node);
	            }
	        }

	        for (var i = 0; i < ways.length; i++) {
	            var way = ways[i];
	            features.push(way);
	        }

	        return features;
	    }

	    function isWayArea(way) {
	        if (way.nodes[0] != way.nodes[way.nodes.length - 1]) {
	            return false;
	        }

	        for (var key in way.tags) {
	            if (options.areaTags.indexOf(key)) {
	                return true;
	            }
	        }

	        return false;
	    }

	    function interestingNode(node, ways, relations) {
	        var used = false;

	        for (var i = 0; i < ways.length; i++) {
	            if (ways[i].nodes.indexOf(node) >= 0) {
	                used = true;
	                break;
	            }
	        }

	        if (!used) {
	            return true;
	        }

	        for (var _i = 0; _i < relations.length; _i++) {
	            if (relations[_i].members.indexOf(node) >= 0) {
	                return true;
	            }
	        }

	        return false;
	    }
	    function togeojson(data, options) {
	        var res = {
	            type: 'FeatureCollection',
	            features: []
	        };
	        if (data) {
	            res.features = getFeatures(data);
	        }
	        return res;
	    }
	}

	exports.default = factory;

/***/ }

/******/ })
});
;