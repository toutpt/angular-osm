/*jshint strict:false */
/*global angular:false */

angular.module('osm.services').factory('osmTagInfoAPI',
    ['$base64', '$http', '$q',
    function ($base64, $http, $q) {
        //http://taginfo.openstreetmap.org/taginfo/apidoc
        var service = {
            get: function(method, config){
                var deferred = $q.defer();
                $http.get('https://taginfo.openstreetmap.org/api/4' + method, config).then(
                    function(data){
                        deferred.resolve(data.data);
                    }, function(error){
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            },
            getKeyCombinations: function(params){
                /* param:
                key — Tag key (required).
                query — Only show results where the other_key matches this query (substring match, optional).
                */
                return this.get('/key/combinations', {params: params});
            },
            getKeyDistributionNodes: function(params){
                /* param:
                key — Tag key (required).
                 */
                return this.get('/key/distribution/nodes', {params: params});
            },
            getKeyDistributionWays: function(params){
                /* param:
                key — Tag key (required)
                 */
                return this.get('/key/distribution/ways', {params: params});
            },
            getKeyStats: function(params){
                /* param:
                key — Tag key (required).
                 */
                return this.get('/key/stats', {params: params});
            },
            getKeyValues: function(params){
                /* param:
                key — Tag key (required).
                lang — Language for description (optional, default: 'en').
                query — Only show results where the value matches this query (substring match, optional).
                 */
                return this.get('/key/values', {params: params});
            },
            getKeyWikiPages: function(params){
                /* param:
                key — Tag key (required).
                 */
                return this.get('/key/wiki_pages', {params: params});
            },
            getKeysAll: function(params){
                /* param:
                query — Only show keys matching this query (substring match, optional).
                 */
                return this.get('/keys/all', {params: params});
            },
            getKeysWikiPages: function(params){
                /* param:
                query — Only show keys matching this query (substring match, optional).
                 */
                return this.get('/keys/wiki_pages', {params: params});
            },
            getKeysWithoutWikiPage: function(params){
                /* param:
                english — Check for key wiki pages in any language (0, default) or in the English language (1).
                min_count — How many tags with this key must there be at least to show up here? (default 10000).
                query — Only show results where the key matches this query (substring match, optional).
                 */
                return this.get('/keys/without_wiki_page', {params: params});
            },
            getRelationRoles: function(params){
                /* param:
                query — Only show results where the role matches this query (substring match, optional).
                rtype — Relation type (required).
                 */
                return this.get('/relation/roles', {params: params});
            },
            getRelationStats: function(params){
                /* param:
                rtype — Relation type (required).
                 */
                return this.get('/relation/stats', {params: params});
            },
            getRelationWikiPages: function(params){
                /* param:
                rtype — Relation type (required).
                 */
                return this.get('/relation/wiki_pages', {params: params});
            },
            getRelationsAll: function(params){
                /* param:
                query — Only show results where the relation type matches this query (substring match, optional).
                 */
                return this.get('/relations/all', {params: params});
            },
            getSearchByKeyAndValue: function(params){
                /* param:
                query — Value to search for (substring search, required).
                 */
                return this.get('/search/by_key_and_value', {params: params});
            },
            getSearchByKeyword: function(params){
                /* param:
                query — Value to search for (substring search, required).
                 */
                return this.get('/search/by_keyword', {params: params});
            },
            getSearchByRole: function(params){
                /* param:
                query — Role to search for (substring search, required).
                 */
                return this.get('/search/by_role', {params: params});
            },
            getSearchByValue: function(params){
                /* param:
                query — Value to search for (substring search, required).
                 */
                return this.get('/search/by_value', {params: params});
            },
            getSiteInfo: function(params){
                /* param: No params */
                return this.get('/site/info', {params: params});
            },
            getSiteSources: function(params){
                /* param: No params */
                return this.get('/site/sources', {params: params});
            },
            getTagCombinations: function(params){
                /* param:
                key — Tag key (required).
                query — Only show results where the other_key or other_value matches this query (substring match, optional).
                value — Tag value (required).
                 */
                return this.get('/tag/combinations', {params: params});
            },
            getTagDistributionNodes: function(params){
                /* param:
                key — Tag key (required).
                value — Tag value (required).
                 */
                return this.get('/tag/distribution/nodes', {params: params});
            },
            getTagDistributionWays: function(params){
                /* param:
                key — Tag key (required).
                value — Tag value (required).
                 */
                return this.get('/tag/distribution/ways', {params: params});
            },
            getTagStats: function(params){
                /* param:
                key — Tag key (required).
                value — Tag value (required).
                 */
                return this.get('/tag/stats', {params: params});
            },
            getTagWikiPages: function(params){
                /* param:
                key — Tag key (required)
                value — Tag value (required).
                 */
                return this.get('/tag/wiki_pages', {params: params});
            },
            getTagsPopular: function(params){
                /* param:
                query — Only show tags matching this query (substring match in key and value, optional).
                 */
                return this.get('/tags/popular', {params: params});
            },
            getWikiLanguages: function(params){
                /* param: No params */
                return this.get('/wiki/languages', {params: params});
            }
        };
        return service;
    }
]);
