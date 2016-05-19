'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */


ngDescribe({
    modules: 'osm.togeojson',
    inject: ['osmtogeojson'],
    tests: function (deps) {
        it('should getAsArray work', function() {
            var data = {};
            var result = deps.osmtogeojson.getAsArray(data);
            expect(result.length).toBe(1);
            expect(Array.isArray(result)).toBe(true);

            data = [{}, {}];
            result = deps.osmtogeojson.getAsArray(data);
            expect(result.length).toBe(2);
            expect(Array.isArray(result)).toBe(true);
        });
        it('should getTags work', function() {
            var data = {
                tag: {
                    _k: 'highway',
                    _v: 'mini_roundabout'
                }
            };
            var result = deps.osmtogeojson.getTags(data);
            expect(result.highway).toBe('mini_roundabout');
            expect(result.xx).toBe(undefined);

            data = {};
            result = deps.osmtogeojson.getTags(data);
            expect(result.xx).toBe(undefined);

            data = {
                tag: [{
                    _k: 'highway',
                    _v: 'mini_roundabout'
                }, {
                    _k: 'name',
                    _v: 'osm'
                }]
            };
            result = deps.osmtogeojson.getTags(data);
            expect(result.highway).toBe('mini_roundabout');
            expect(result.name).toBe('osm');
        });

        it('should getNodes work', function() {
            var data = {osm: {node: {
                _id: 3,
                _lat: 123,
                _lon: 321,
                tag: {
                    _k: 'highway',
                    _v: 'mini_roundabout'
                }
            }}};
            var nodes = deps.osmtogeojson.getNodes(data);
            expect(nodes['3'].id).toBe(3);
            expect(nodes['3'].type).toBe('node');
            expect(nodes['3'].latLng.length).toBe(2);
            expect(nodes['3'].latLng[0]).toBe(123);
            expect(nodes['3'].latLng[1]).toBe(321);
            expect(nodes['3'].tags.highway).toBe('mini_roundabout');

            //must work the same if node is array & tag is array of tags
            data = {osm: {node: [{
                _id: 3,
                _lat: 123,
                _lon: 321
            }]}};
            nodes = deps.osmtogeojson.getNodes(data);
            expect(nodes['3'].id).toBe(3);
            expect(nodes['3'].type).toBe('node');
            expect(nodes['3'].latLng.length).toBe(2);
            expect(nodes['3'].latLng[0]).toBe(123);
            expect(nodes['3'].latLng[1]).toBe(321);
            expect(nodes['3'].tags.highway).toBe(undefined);

        });

        it('should getWays work', function() {
            var data = {osm: {node: [{
                _id: 1,
                _lat: 123,
                _lon: 321
            },{
                _id: 2,
                _lat: 234,
                _lon: 432
            }], way: {
                _id: 1,
                tag: {
                    _k: 'highway',
                    _v: 'mini_roundabout'
                },
                nd: [{
                    _ref: '1'
                },
                {
                    _ref: '2'
                }]
            }}};
            var nodes = deps.osmtogeojson.getNodes(data);
            var ways = deps.osmtogeojson.getWays(data, nodes);
            expect(ways.length).toBe(1);
            expect(ways[0].id).toBe(1);
            expect(ways[0].type).toBe('way');
            expect(ways[0].nodes.length).toBe(2);
            expect(ways[0].nodes[0].id).toBe(1);
            expect(ways[0].nodes[1].id).toBe(2);
        });

        it('should getRelations work', function() {
            var data = {osm: {node: [{
                _id: 1,
                _lat: 123,
                _lon: 321
            },{
                _id: 2,
                _lat: 234,
                _lon: 432
            }], way: {
                _id: 1,
                tag: {
                    _k: 'highway',
                    _v: 'mini_roundabout'
                },
                nd: [{
                    _ref: '1'
                },
                {
                    _ref: '2'
                }]
            }, relation: {
                _id: 1,
                member: [
                    {
                        _type: 'way',
                        _ref: '1',
                        _role: 'outer'
                    },
                    {
                        _type: 'node',
                        _ref: '1',
                        _role: 'outer'
                    }
                ], tag: [
                    {
                        _k: 'access',
                        _v: 'yes'
                    },
                    {
                        _k: 'area',
                        _v: 'yes'
                    }
                ]
            }}};
            var nodes = deps.osmtogeojson.getNodes(data);
            var ways = deps.osmtogeojson.getNodes(data, nodes);
            var relations = deps.osmtogeojson.getRelations(data, nodes, ways);
            expect(relations.length).toBe(1);
            expect(relations[0].id).toBe(1);
            expect(relations[0].type).toBe('relation');
            expect(relations[0].members.length).toBe(2);
            expect(relations[0].members[0]).toBe(null);
            expect(relations[0].members[1].id).toBe(1);
        });

        it('should buildFeatures work', function() {
            var data = {osm: {node: [{
                _id: 1,
                _lat: 123,
                _lon: 321
            },{
                _id: 2,
                _lat: 234,
                _lon: 432
            }], way: {
                _id: 1,
                tag: {
                    _k: 'highway',
                    _v: 'mini_roundabout'
                },
                nd: [{
                    _ref: '1'
                },
                {
                    _ref: '2'
                }]
            }, relation: {
                _id: 1,
                member: [
                    {
                        _type: 'way',
                        _ref: '1',
                        _role: 'outer'
                    },
                    {
                        _type: 'node',
                        _ref: '1',
                        _role: 'outer'
                    }
                ], tag: [
                    {
                        _k: 'access',
                        _v: 'yes'
                    },
                    {
                        _k: 'area',
                        _v: 'yes'
                    }
                ]
            }}};
            var result = deps.osmtogeojson.buildFeatures(data);
            expect(result.length).toBe(2);
            expect(result[0].type).toBe('node');
            expect(result[1].type).toBe('way');
        });

        it('should isWayArea work', function() {
            var n1 = {}, n2 = {}, n3 = {};
            var way = {nodes: [n1, n2, n3]};
            var result = deps.osmtogeojson.isWayArea(way);
            expect(result).toBe(false);
            
            way.nodes = [n1, n2, n3, n1];
            result = deps.osmtogeojson.isWayArea(way);
            expect(result).toBe(false);

            way.tags = {building: 'yes'};
            result = deps.osmtogeojson.isWayArea(way);
            expect(result).toBe(true);
        });

        it('should interestingNode work', function() {
            var node = {};
            var ways = [];
            var relations = [];
            var result = deps.osmtogeojson.interestingNode(node, ways, relations);
            expect(result).toBe(true);

            ways[0] = {nodes: [node]};
            result = deps.osmtogeojson.interestingNode(node, ways, relations);
            expect(result).toBe(false);

            relations[0] = {members: [node]};
            result = deps.osmtogeojson.interestingNode(node, ways, relations);
            expect(result).toBe(true);

        });

        it('should getFeatures to work with changeset', function() {
            var node = {
                _min_lat: -123,
                _min_lon: -234,
                _max_lat: 123,
                _max_lon: 234
            };
            var data = [{
                type: 'changeset',
                latLngBounds: node
            }];
            var features = deps.osmtogeojson.getFeatures(data);
            expect(features.length).toBe(1);
            expect(features[0].geometry.type).toBe('Polygon');
            expect(features[0].geometry.coordinates[0][0][0]).toBe(-234);
            expect(features[0].geometry.coordinates[0][0][1]).toBe(-123);
            expect(features[0].geometry.coordinates[0][1][0]).toBe(-234);
            expect(features[0].geometry.coordinates[0][1][1]).toBe(123);
            expect(features[0].geometry.coordinates[0][2][0]).toBe(234);
            expect(features[0].geometry.coordinates[0][2][1]).toBe(123);
            expect(features[0].geometry.coordinates[0][3][0]).toBe(234);
            expect(features[0].geometry.coordinates[0][3][1]).toBe(-123);
            //last must be same as first
            expect(features[0].geometry.coordinates[0][4][0]).toBe(-234);
            expect(features[0].geometry.coordinates[0][4][1]).toBe(-123);
        });
        it('should getFeatures to work with node', function() {
            var data = [{
                id: 1,
                type: 'node',
                latLng: [123, 234],
                tags: {name: 'my node'}
            }];
            var features = deps.osmtogeojson.getFeatures(data);
            expect(features.length).toBe(1);
            expect(features[0].geometry.type).toBe('Point');
            expect(features[0].geometry.coordinates[0]).toBe(234);
            expect(features[0].geometry.coordinates[1]).toBe(123);
            expect(features[0].geometry.coordinates[2]).toBe();
        });
        it('should getFeatures to work with way', function() {
            var n1 = {
                id: 1,
                type: 'node',
                latLng: [123, 234],
                tags: {name: 'my node 1'}
            };
            var n2 = {
                id: 2,
                type: 'node',
                latLng: [1234, 2345],
                tags: {name: 'my node 2'}
            };
            var data = [{
                id: 1,
                type: 'way',
                nodes: [n1, n2],
                tags: {name: 'my way'}
            }];
            var features = deps.osmtogeojson.getFeatures(data);
            expect(features.length).toBe(1);
            expect(features[0].geometry.type).toBe('LineString');
            expect(features[0].properties.tags.name).toBe('my way');
            expect(features[0].geometry.coordinates[0][0]).toBe(234);
            expect(features[0].geometry.coordinates[0][1]).toBe(123);
            expect(features[0].geometry.coordinates[1][0]).toBe(2345);
            expect(features[0].geometry.coordinates[1][1]).toBe(1234);
            expect(features[0].geometry.coordinates[2]).toBe();
        });

        it('should getFeatures to work with way (area)', function() {
            var n1 = {
                id: 1,
                type: 'node',
                latLng: [1, 2],
                tags: {name: 'my node 1'}
            };
            var n2 = {
                id: 2,
                type: 'node',
                latLng: [12, 23],
                tags: {name: 'my node 2'}
            };
            var n3 = {
                id: 3,
                type: 'node',
                latLng: [123, 234],
                tags: {name: 'my node 2'}
            };
            var data = [{
                id: 1,
                type: 'way',
                nodes: [n1, n2, n3, n1],
                tags: {name: 'my area'}
            }];
            var features = deps.osmtogeojson.getFeatures(data);
            expect(features.length).toBe(1);
            expect(features[0].geometry.type).toBe('Polygon');
            expect(features[0].geometry.coordinates[0][0][0]).toBe(2);
            expect(features[0].geometry.coordinates[0][0][1]).toBe(1);
            expect(features[0].geometry.coordinates[0][1][0]).toBe(23);
            expect(features[0].geometry.coordinates[0][1][1]).toBe(12);
            expect(features[0].geometry.coordinates[0][2][0]).toBe(234);
            expect(features[0].geometry.coordinates[0][2][1]).toBe(123);
            //last must be same as first
            expect(features[0].geometry.coordinates[0][3][0]).toBe(2);
            expect(features[0].geometry.coordinates[0][3][1]).toBe(1);
        });


        it('should togeojson work', function() {
            var geojson = deps.osmtogeojson.togeojson();
            expect(geojson.type).toBe('FeatureCollection');
            expect(geojson.features.length).toBe(0);
            expect(Array.isArray(geojson.features)).toBe(true);

            var data = {osm: {node: [{
                _id: 1,
                _lat: 123,
                _lon: 321
            },{
                _id: 2,
                _lat: 234,
                _lon: 432
            }], way: {
                _id: 1,
                tag: {
                    _k: 'highway',
                    _v: 'mini_roundabout'
                },
                nd: [{
                    _ref: '1'
                },
                {
                    _ref: '2'
                }]
            }, relation: {
                _id: 1,
                member: [
                    {
                        _type: 'way',
                        _ref: '1',
                        _role: 'outer'
                    },
                    {
                        _type: 'node',
                        _ref: '1',
                        _role: 'outer'
                    }
                ], tag: [
                    {
                        _k: 'access',
                        _v: 'yes'
                    },
                    {
                        _k: 'area',
                        _v: 'yes'
                    }
                ]
            }}};
            geojson = deps.osmtogeojson.togeojson(data);
            expect(geojson.type).toBe('FeatureCollection');
            expect(geojson.features.length).toBe(2);
            expect(Array.isArray(geojson.features)).toBe(true);
            expect(geojson.features[1].properties.tags.highway).toBe('mini_roundabout');
            expect(geojson.features[1].geometry.type).toBe('LineString');
            expect(geojson.features[0].geometry.type).toBe('Point');
        });

    }
});