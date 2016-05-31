/**
 * @module osm.osrm
 */
import osrmAPI from './osrm.service';

var osrmModule = angular.module('osm.osrm', [])
.provider('osrmAPI', function osrmAPIProvider () {
    this.options = {
        url: 'http://router.project-osrm.org'
    };
    this.$get = function osrmAPIFactory($http, $q) {
        return new osrmAPI($http, $q, this.options);
    };
    this.$get.$inject = ['$http', '$q'];
});

export default osrmModule;
