/**
 * @module osm.taginfo
 */
import osmTagInfoAPI from './taginfo.service';

var osmTagInfoModule = angular.module('osm.taginfo', [])
.provider('osmTagInfoAPI', function osmTagInfoAPIProvider () {
    this.options = {
        url: 'https://taginfo.openstreetmap.org/api/4'
    };
    this.$get = function osmTagInfoAPIFactory($http, $q) {
        return new osmTagInfoAPI($http, $q, this.options);
    };
    this.$get.$inject = ['$http', '$q'];
});

export default osmTagInfoModule;
