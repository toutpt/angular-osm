
/**
 * @class
 * Create osmNominatim service instance.
 * This service create nominatim query.
 */
class NominatimAPI{
    /**
     * @param {Object} $http angular $http service
     * @param {Object} options set by the provider to set the url
     */
    constructor($http, options) {
        this.url = options.url;
        this.$http = $http;
        this.cache = true;
        if (options.cache === false) {
            this.cache = false;
        }
    }

    /**
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/Nominatim
     * @return {Promise} $http.get
    */
    search(query) {
        //https://nominatim.openstreetmap.org/search
        //?X-Requested-With=overpass-turbo&format=json&q=vern-sur-seiche
        //params['accept-language'] = 'fr';
        var params;
        if (typeof query === 'string' || !query) {
            params = {
                format: 'json',
                q: query
            };
        } else {
            params = angular.copy(query);
            params.format = 'json';
        }
        var config = {
            params: params,
            cache: this.cache
        };
        let url = this.url + '/search';
        return this.$http.get(url, config);
    }

    /**
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/Nominatim
     * @return {Promise} $http.get
    */
    reverse(query) {
        //https://nominatim.openstreetmap.org/reverse
        //?X-Requested-With=overpass-turbo&format=json&q=vern-sur-seiche
        //params['accept-language'] = 'fr';
        var params;
        if (typeof query === 'string') {
            params = {
                format: 'json',
                q: query
            };
        } else {
            params = angular.copy(query);
            params.format = 'json';
        }
        var config = {
            params: params,
            cache: this.cache
        };
        let url = this.url + '/reverse';
        return this.$http.get(url, config);
    }


    /**
     *  http://nominatim.openstreetmap.org/lookup?osm_ids=R146656,W104393803,N240109189
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/Nominatim
     * @return {Promise} $http.get
    */
    lookup(query) {
        var params;
        if (typeof query === 'string') {
            params = {
                format: 'json',
                q: query
            };
        } else {
            params = angular.copy(query);
            params.format = 'json';
        }
        var config = {
            params: params,
            cache: this.cache
        };
        let url = this.url + '/lookup';
        return this.$http.get(url, config);
    }

}

NominatimAPI.$inject =  ['$http'];

export default NominatimAPI;