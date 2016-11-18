/**
 * @module osm.overpass
 */
import osmOverpassAPI from './overpass.service';

var osmOverpassModule = angular.module('osm.overpass', [])
.provider('osmOverpassAPI', function osmOverpassAPIProvider () {
    this.options = {
        url: '//overpass-api.de/api/interpreter'
    };
    this.$get = function osmOverpassAPIFactory($http, $q) {
        return new osmOverpassAPI($http, $q, this.options);
    };
    this.$get.$inject = ['$http', '$q'];
});

export default osmOverpassModule;
