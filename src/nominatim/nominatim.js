/**
 * @module osm.nominatim
 */
import osmNominatim from './nominatim.service';

var osmNominatimModule = angular.module('osm.nominatim', [])
.provider('osmNominatim', function osmNominatimProvider () {
    this.options = {
        url: 'https://nominatim.openstreetmap.org'
    };
    this.$get = function osmNominatimFactory($http) {
        return new osmNominatim($http, this.options);
    };
    this.$get.$inject = ['$http'];
});

export default osmNominatimModule;
