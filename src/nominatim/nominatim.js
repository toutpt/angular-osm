import osmNominatim from './nominatim.service';

var osmNominatimModule = angular.module('osm.nominatim', [])
.factory('osmNominatim', osmNominatim)
.provider('osmNominatim', function osmNominatimProvider () {
    this.options = {
        url: 'https://nominatim.openstreetmap.org'
    };
    this.$get = function osmNominatimFactory($q) {
        return new osmNominatim($q, this.options);
    };
    this.$get.$inject = ['$http'];
});

export default osmNominatimModule;
