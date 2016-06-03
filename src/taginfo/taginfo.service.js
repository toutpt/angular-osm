
/**
 * @class
 * Create osmTafInforAPI service instance.
 * http://taginfo.openstreetmap.org/taginfo/apidoc
 */
class TagInfoAPI{
    /**
     * @param {Object} $http angular $http service
     * @param {Object} $q angular $q service
     */
    constructor($http, $q, options) {
        this.$http = $http;
        this.$q = $q;
        this.url = options.url;
        this.cache = true;
        if (options.cache === false) {
            this.cache = false;
        }
    }
    /**
     * internal get request to the remote API
     * @param {string} method
     * @param {Object} config $http config object
     * @return {Promise}
     */
    get(method, config) {
        var deferred = this.$q.defer();
        if (!config) {
            config = {};
        }
        if (config.cache === undefined) {
            config.cache = this.cache;
        }
        this.$http.get(this.url + method, config).then(
            function (data) {
                deferred.resolve(data.data);
            }, function (error) {
                deferred.reject(error);
            }
        );
        return deferred.promise;
    }
    /**
     * @param {any} params
        key — Tag key (required).
        query — Only show results where the other_key matches this query (substring match, optional).
     */
    getKeyCombinations(params) {
        return this.get('/key/combinations', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
     */
    getKeyDistributionNodes(params) {
        return this.get('/key/distribution/nodes', {params: params});
    }
    /**
     * @param {any} params
     * key — Tag key (required).
     */
    getKeyDistributionWays(params) {
        return this.get('/key/distribution/ways', {params: params});
    }
    /**
     * @param {any} params
     * key — Tag key (required).
     */
    getKeyStats(params) {
        return this.get('/key/stats', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
        lang — Language for description (optional, default: 'en').
        query — Only show results where the value matches this query (substring match, optional).
     */
    getKeyValues(params) {
        return this.get('/key/values', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
     */
    getKeyWikiPages(params) {
        return this.get('/key/wiki_pages', {params: params});
    }
    /**
     * @param {any} params
        query — Only show keys matching this query (substring match, optional).
     */
    getKeysAll(params) {
        return this.get('/keys/all', {params: params});
    }
    /**
     * @param {any} params
        query — Only show keys matching this query (substring match, optional).
     */
    getKeysWikiPages(params) {
        return this.get('/keys/wiki_pages', {params: params});
    }
    /**
     * @param {any} params
        english — Check for key wiki pages in any language (0, default) or in the English language (1).
        min_count — How many tags with this key must there be at least to show up here? (default 10000).
        query — Only show results where the key matches this query (substring match, optional).
     */
    getKeysWithoutWikiPage(params) {
        return this.get('/keys/without_wiki_page', {params: params});
    }
    /**
     * @param {any} params
        query — Only show results where the role matches this query (substring match, optional).
        rtype — Relation type (required).
     */
    getRelationRoles(params) {
        return this.get('/relation/roles', {params: params});
    }
    /**
     * @param {any} params
        rtype — Relation type (required).
     */
    getRelationStats(params) {
        return this.get('/relation/stats', {params: params});
    }
    /**
     * @param {any} params
        rtype — Relation type (required).
     */
    getRelationWikiPages(params) {
        return this.get('/relation/wiki_pages', {params: params});
    }
    /**
     * @param {any} params
        query — Only show results where the relation type matches this query (substring match, optional).
     */
    getRelationsAll(params) {
        return this.get('/relations/all', {params: params});
    }
    /**
     * @param {any} params
        query — Value to search for (substring search, required).
     */
    getSearchByKeyAndValue(params) {
        return this.get('/search/by_key_and_value', {params: params});
    }
    /**
     * @param {any} params
        query — Value to search for (substring search, required).
     */
    getSearchByKeyword(params) {
        return this.get('/search/by_keyword', {params: params});
    }
    /**
     * @param {any} params
        query — Role to search for (substring search, required).
     */
    getSearchByRole(params) {
        return this.get('/search/by_role', {params: params});
    }
    /**
     * @param {any} params
        query — Value to search for (substring search, required).
     */
    getSearchByValue(params) {
        return this.get('/search/by_value', {params: params});
    }
    /**
     * @param {any} params
         param: No params
     */
    getSiteInfo(params) {
        return this.get('/site/info', {params: params});
    }
    /**
     * @param {any} params
         param: No params
     */
    getSiteSources(params) {
        return this.get('/site/sources', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
        query — Only show results where the other_key or other_value matches this query (substring match, optional).
        value — Tag value (required).
     */
    getTagCombinations(params) {
        return this.get('/tag/combinations', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    getTagDistributionNodes(params) {
        return this.get('/tag/distribution/nodes', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    getTagDistributionWays(params) {
        return this.get('/tag/distribution/ways', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    getTagStats(params) {
        return this.get('/tag/stats', {params: params});
    }
    /**
     * @param {any} params
        key — Tag key (required).
        value — Tag value (required).
     */
    getTagWikiPages(params) {
        return this.get('/tag/wiki_pages', {params: params});
    }
    /**
     * @param {any} params
        query — Only show tags matching this query (substring match in key and value, optional).
     */
    getTagsPopular(params) {
        return this.get('/tags/popular', {params: params});
    }
    /**
     * @param {any} params
         param: No params
     */
    getWikiLanguages(params) {
        return this.get('/wiki/languages', {params: params});
    }
}

TagInfoAPI.$inject = ['$http', '$q'];

export default TagInfoAPI;
