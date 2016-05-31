/**
 * @module osm.base64
 */
import osmBase64 from './base64.service';
import osmAPIModule from '../api/api';
import osmx2jsModule from '../x2js/x2js';

var osmBase64Module = angular.module('osm.base64', [
    osmx2jsModule.name,
    osmAPIModule.name,
    'base64'
])
.provider('osmBase64', function osmBase64Provider () {
    this.options = {
        url: 'http://api.openstreetmap.org/api'
    };
    this.$get = function osmBase64Factory($base64, $http, $q, osmx2js) {
        return new osmBase64($base64, $http, $q, osmx2js, this.options);
    };
    this.$get.$inject = ['$base64', '$http', 'osmx2js'];
});

export default osmBase64Module;
