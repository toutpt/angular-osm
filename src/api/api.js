/**
 * @module osm.api
 */
import osmAPI from './api.service';
import osmx2jsModule from '../x2js/x2js';

var osmAPIModule = angular.module('osm.api', [
    osmx2jsModule.name
])
.provider('osmAPI', function osmAPIProvider () {
    this.options = {
        url: 'http://api.openstreetmap.org/api'
    };
    this.$get = ($http, osmx2js) => {
        return new osmAPI($http, osmx2js, this.options);
    };
    this.$get.$inject = ['$http', 'osmx2js'];
});

export default osmAPIModule;
