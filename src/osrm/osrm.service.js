

/**
 * @ngdoc service
 * @name osrmAPI
 * @param  {any} $http
 * @param  {any} $q
 * @description
 * https://github.com/Project-OSRM/osrm-backend/blob/master/docs/http.md
 */
class osrmAPI{
    constructor($http, $q, options) {
        this.url = options.url;
        this.$http = $http;
        this.$q = $q;
    }
    get(service, version, profile, coordinates, options) {
        var _coordinates = coordinates;
        if (Array.isArray(coordinates)) {
            _coordinates = coordinates.join(';');
        }
        var url = `${this.url}/${service}/${version}/${profile}/${_coordinates}`;
        return this.$http.get(url, {params: options});
    }
    //coordinates is String of format {longitude},{latitude};{longitude},{latitude}[;{longitude},{latitude} ...]
    nearest(profile, coordinates, number) {
        var options;
        if (number) {
            options = {number: number};
        }
        return this.get('nearest', 'v1', profile, coordinates, options);
    }
    route(profile, coordinates, options) {
        return this.get('route', 'v1', profile, coordinates, options);
    }
    table(profile, coordinates, options) {
        return this.get('table', 'v1', profile, coordinates, options);
    }
    match(profile, coordinates, options) {
        return this.get('match', 'v1', profile, coordinates, options);
    }
    trip(profile, coordinates, options) {
        return this.get('trip', 'v1', profile, coordinates, options);
    }
}

export default osrmAPI;