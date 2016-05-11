
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
    this.get = function (method, config) {
        var deferred = $q.defer();
        $http.get('https://taginfo.openstreetmap.org/api/4' + method, config).then(
            function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name getKeyCombinations
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        query — Only show results where the other_key matches this query (substring match, optional).
     */
    this.getKeyCombinations = function (params) {
        return this.get('/key/combinations', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeyDistributionNodes
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
     */
    this.getKeyDistributionNodes = function (params) {
        return this.get('/key/distribution/nodes', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeyDistributionWays
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
     * key — Tag key (required).
     */
    this.getKeyDistributionWays = function (params) {
        return this.get('/key/distribution/ways', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeyStats
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
     * key — Tag key (required).
     */
    this.getKeyStats = function (params) {
        return this.get('/key/stats', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeyValues
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        lang — Language for description (optional, default: 'en').
        query — Only show results where the value matches this query (substring match, optional).
     */
    this.getKeyValues = function (params) {
        return this.get('/key/values', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeyWikiPages
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
     */
    this.getKeyWikiPages = function (params) {
        return this.get('/key/wiki_pages', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeysAll
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Only show keys matching this query (substring match, optional).
     */
    this.getKeysAll = function (params) {
        return this.get('/keys/all', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeysWikiPages
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Only show keys matching this query (substring match, optional).
     */
    this.getKeysWikiPages = function (params) {
        return this.get('/keys/wiki_pages', {params: params});
    };
    /**
     * @ngdoc method
     * @name getKeysWithoutWikiPage
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        english — Check for key wiki pages in any language (0, default) or in the English language (1).
        min_count — How many tags with this key must there be at least to show up here? (default 10000).
        query — Only show results where the key matches this query (substring match, optional).
     */
    this.getKeysWithoutWikiPage = function (params) {
        return this.get('/keys/without_wiki_page', {params: params});
    };
    /**
     * @ngdoc method
     * @name getRelationRoles
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Only show results where the role matches this query (substring match, optional).
        rtype — Relation type (required).
     */
    this.getRelationRoles = function (params) {
        return this.get('/relation/roles', {params: params});
    };
    /**
     * @ngdoc method
     * @name getRelationStats
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        rtype — Relation type (required).
     */
    this.getRelationStats = function (params) {
        return this.get('/relation/stats', {params: params});
    };
    /**
     * @ngdoc method
     * @name getRelationWikiPages
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        rtype — Relation type (required).
     */
    this.getRelationWikiPages = function (params) {
        return this.get('/relation/wiki_pages', {params: params});
    };
    /**
     * @ngdoc method
     * @name getRelationsAll
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Only show results where the relation type matches this query (substring match, optional).
     */
    this.getRelationsAll = function (params) {
        return this.get('/relations/all', {params: params});
    };
    /**
     * @ngdoc method
     * @name getSearchByKeyAndValue
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Value to search for (substring search, required).
     */
    this.getSearchByKeyAndValue = function (params) {
        return this.get('/search/by_key_and_value', {params: params});
    };
    /**
     * @ngdoc method
     * @name getSearchByKeyword
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Value to search for (substring search, required).
     */
    this.getSearchByKeyword = function (params) {
        return this.get('/search/by_keyword', {params: params});
    };
    /**
     * @ngdoc method
     * @name getSearchByRole
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Role to search for (substring search, required).
     */
    this.getSearchByRole = function (params) {
        return this.get('/search/by_role', {params: params});
    };
    /**
     * @ngdoc method
     * @name getSearchByValue
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Value to search for (substring search, required).
     */
    this.getSearchByValue = function (params) {
        return this.get('/search/by_value', {params: params});
    };
    /**
     * @ngdoc method
     * @name getSiteInfo
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
         param: No params
     */
    this.getSiteInfo = function (params) {
        return this.get('/site/info', {params: params});
    };
    /**
     * @ngdoc method
     * @name getSiteSources
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
         param: No params
     */
    this.getSiteSources = function (params) {
        return this.get('/site/sources', {params: params});
    };
    /**
     * @ngdoc method
     * @name getTagCombinations
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        query — Only show results where the other_key or other_value matches this query (substring match, optional).
        value — Tag value (required).
     */
    this.getTagCombinations = function (params) {
        return this.get('/tag/combinations', {params: params});
    };
    /**
     * @ngdoc method
     * @name getTagDistributionNodes
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    this.getTagDistributionNodes = function (params) {
        return this.get('/tag/distribution/nodes', {params: params});
    };
    /**
     * @ngdoc method
     * @name getTagDistributionWays
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    this.getTagDistributionWays = function (params) {
        return this.get('/tag/distribution/ways', {params: params});
    };
    /**
     * @ngdoc method
     * @name getTagStats
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    this.getTagStats = function (params) {
        return this.get('/tag/stats', {params: params});
    };
    /**
     * @ngdoc method
     * @name getTagWikiPages
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    this.getTagWikiPages = function (params) {
        return this.get('/tag/wiki_pages', {params: params});
    };
    /**
     * @ngdoc method
     * @name getTagsPopular
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
        query — Only show tags matching this query (substring match in key and value, optional).
     */
    this.getTagsPopular = function (params) {
        return this.get('/tags/popular', {params: params});
    };
    /**
     * @ngdoc method
     * @name getWikiLanguages
     * @methodOf osm.taginfo.osmTagInfoAPI
     * @param {any} params
         param: No params
     */
    this.getWikiLanguages = function (params) {
        return this.get('/wiki/languages', {params: params});
    };
}
export default osmTagInfoAPI;
