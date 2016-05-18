import base64 from 'angular-base64';
import osmAPI from './api.service';
import osmSettingsModule from '../settings/settings';
import osmx2jsModule from '../x2js/x2js';

//The base64 module is only available as IIFE

var osmAPIModule = angular.module('osm.api', [
    osmSettingsModule.name,
    osmx2jsModule.name,
    'base64'
])
.service('osmAPI', osmAPI)
.provider('osmAPI', function osmAPIProvider () {
    this.options = {
        url: 'http://api.openstreetmap.org/api'
    };
    this.$get = function osmAPIFactory($base64, $http, $q, osmSettingsService, osmx2js) {
        return new osmAPI($base64, $http, $q, osmSettingsService, osmx2js, this.options);
    };
    this.$get.$inject = ['$base64', '$http', '$q', 'osmSettingsService', 'osmx2js'];
});

export default osmAPIModule;
