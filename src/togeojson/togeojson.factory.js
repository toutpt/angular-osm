
/**
 * @constructor ToGeoJSON
 * @param {Object} options provided by the provider
 * @description osm to geojson without dependencies :)
   Import Note : geojson wait for lon/lat where every body else use lat/lon
 */
function factory(options) {
    //copy/pasted/adapter from https://github.com/jfirebaugh/leaflet-osm/blob/master/leaflet-osm.js
    var service = {
        options,
        getAsArray,
        getFeatures,
        getNodes,
        getWays,
        getRelations,
        getTags,
        buildFeatures,
        isWayArea,
        interestingNode,
        togeojson
    };
    return service;

    function getFeatures(data) {
        var features = [];
        if (!(data instanceof Array)) {
            data = buildFeatures(data);
        }

        for (let i = 0; i < data.length; i++) {
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
                feature.geometry.coordinates = [[
                    [parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)],
                    [parseFloat(bounds._min_lon), parseFloat(bounds._max_lat)],
                    [parseFloat(bounds._max_lon), parseFloat(bounds._max_lat)],
                    [parseFloat(bounds._max_lon), parseFloat(bounds._min_lat)],
                    [parseFloat(bounds._min_lon), parseFloat(bounds._min_lat)]
                ]];
            } else if (d.type === "node") {
                //add a Point
                feature.geometry.type = 'Point';
                feature.geometry.coordinates = [d.latLng[1], d.latLng[0]];
            } else {
                var lngLats = new Array(d.nodes.length);

                for (let j = 0; j < d.nodes.length; j++) {
                    let latLng = d.nodes[j].latLng;
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
        } else if (typeof data === "object") {
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
            for (let j = 0; j < nds.length; j++) {
                way_object.nodes[j] = nodes[nds[j]._ref];
            }
            result.push(way_object);
        });
        return result;
    }
    function getRelations(data, nodes, way) {
        var result = [];

        var rels = getAsArray(data.osm.relation);
        for (let i = 0; i < rels.length; i++) {
            var rel = rels[i];
            var members = getAsArray(rel.member);
            var rel_object = {
                id: rel._id,
                type: "relation",
                members: new Array(members.length),
                tags: getTags(rel)
            };
            for (let j = 0; j < members.length; j++) {
                if (members[j]._type === "node") {
                    rel_object.members[j] = nodes[members[j]._ref];
                } else{
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

        for (let node_id in nodes) {
            var node = nodes[node_id];
            if (interestingNode(node, ways, relations)) {
                features.push(node);
            }
        }

        for (let i = 0; i < ways.length; i++) {
            var way = ways[i];
            features.push(way);
        }

        return features;
    }

    function isWayArea(way) {
        if (way.nodes[0] != way.nodes[way.nodes.length - 1]) {
            return false;
        }

        for (let key in way.tags) {
            if (options.areaTags.indexOf(key)) {
                return true;
            }
        }

        return false;
    }

    function interestingNode(node, ways, relations) {
        var used = false;

        for (let i = 0; i < ways.length; i++) {
            if (ways[i].nodes.indexOf(node) >= 0) {
                used = true;
                break;
            }
        }

        if (!used) {
            return true;
        }

        for (let i = 0; i < relations.length; i++) {
            if (relations[i].members.indexOf(node) >= 0) {
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

export default factory;