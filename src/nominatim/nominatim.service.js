
/**
* @ngdoc service
* @name osm.nominatim.osmNominatim
* @description handle nominatim query
*/
class osmNominatim{
    constructor($http, options) {
        this.url = options.url;
        this.$http = $http;
    }

    /**
     * @ngdoc method
     * @name search
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/Nominatim
     * @methodOf osm.nominatim.osmNominatim
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
            params: params
        };
        let url = this.url + '/search';
        return this.$http.get(url, config);
    }

    /**
     * @ngdoc method
     * @name reverse
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/Nominatim
     * @methodOf osm.nominatim.osmNominatim
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
            params: params
        };
        let url = this.url + '/reverse';
        return this.$http.get(url, config);
    }


    /**
     * @ngdoc method
     * @name lookup
     * @description
     *  http://nominatim.openstreetmap.org/lookup?osm_ids=R146656,W104393803,N240109189
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/Nominatim
     * @methodOf osm.nominatim.osmNominatim
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
            params: params
        };
        let url = this.url + '/lookup';
        return this.$http.get(url, config);
    }

}

export default osmNominatim;