
/**
 * @class
 * Create osrmAPI service instance
 */
class OSRMAPI{
    /**
     * @param  {any} $http
     * @param  {any} $q
     * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md
     */
    constructor($http, $q, options) {
        this.url = options.url;
        this.$http = $http;
        this.$q = $q;
        this.cache = true;
        if (options.cache === false) {
            this.cache = false;
        }
    }
    /**
     * internal get request to the remote API
     * @param {string} service
     * @param {string} version
     * @param {string} profile
     * @param {string|Object} coordinates
     * the string format is
     * {longitude},{latitude};{longitude},{latitude}[;{longitude},{latitude} ...]
     * @param {Object} options
     */
    get(service, version, profile, coordinates, options) {
        var _coordinates = coordinates;
        if (Array.isArray(coordinates)) {
            _coordinates = coordinates.join(';');
        }
        var url = `${this.url}/${service}/${version}/${profile}/${_coordinates}`;
        return this.$http.get(url, {params: options, cache: this.cache});
    }
    /**
     * neareset service
     * @param {string} profile
     * @param {string|Object} coordinates
     * @param {number} number integer >= 1 (default 1)	Number of nearest segments that should be returned.
     */
    nearest(profile, coordinates, number) {
        var options;
        if (number) {
            options = {number: number};
        }
        return this.get('nearest', 'v1', profile, coordinates, options);
    }
    /**
     * route service
     * @param {string} profile
     * @param {string|Object} coordinates
     * @param {Object} options
     * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-route
     */
    route(profile, coordinates, options) {
        return this.get('route', 'v1', profile, coordinates, options);
    }
    /**
     * table service
     * @param {string} profile
     * @param {string|Object} coordinates
     * @param {Object} options
     * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-table
     */
    table(profile, coordinates, options) {
        return this.get('table', 'v1', profile, coordinates, options);
    }
    /**
     * match service
     * @param {string} profile
     * @param {string|Object} coordinates
     * @param {Object} options
     * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-match
     */
    match(profile, coordinates, options) {
        return this.get('match', 'v1', profile, coordinates, options);
    }
    /**
     * trip service
     * @param {string} profile
     * @param {string|Object} coordinates
     * @param {Object} options
     * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md#service-trip
     */
    trip(profile, coordinates, options) {
        return this.get('trip', 'v1', profile, coordinates, options);
    }
}

OSRMAPI.$inject = ['$http', '$q'];

export default OSRMAPI;