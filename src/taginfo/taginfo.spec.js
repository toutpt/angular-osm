'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */


ngDescribe({
    modules: 'osm.taginfo',
    inject: ['osmTagInfoAPI'],
    mocks: {
        ng: {
            $http: {
                get: function ($q, url, config) {
                    if (url === 'https://taginfo.openstreetmap.org/api/4/key/combinations') {
                        return $q.when({
                            data: {
                                life: 42
                            }
                        });
                    }
                }
            }
        }
    },
    tests: function (deps) {
        it('should have all API methods of taginfo', function() {
            var taginfo = deps.osmTagInfoAPI;
            var methods = [
                'getKeyCombinations',
                'getKeyDistributionNodes',
                'getKeyDistributionWays',
                'getKeyStats',
                'getKeyValues',
                'getKeyWikiPages',
                'getKeysAll',
                'getKeysWikiPages',
                'getKeysWithoutWikiPage',
                'getRelationRoles',
                'getRelationStats',
                'getRelationWikiPages',
                'getRelationsAll',
                'getSearchByKeyAndValue',
                'getSearchByKeyword',
                'getSearchByRole',
                'getSearchByValue',
                'getSiteInfo',
                'getSiteSources',
                'getTagCombinations',
                'getTagDistributionNodes',
                'getTagDistributionWays',
                'getTagStats',
                'getTagWikiPages',
                'getTagsPopular',
                'getWikiLanguages'
            ];
            methods.forEach(function (method) {
                expect(taginfo[method]).not.toBeUndefined();
            });
        });

    }

});