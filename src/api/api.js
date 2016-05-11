import base64 from 'angular-base64';
import osmAPI from './api.service';
import osmSettingsModule from '../settings/settings';
import osmUtilsModule from '../utils/utils';

//The base64 module is only available as IIFE

var osmAPIModule = angular.module('osm.api', [
    osmSettingsModule.name,
    osmUtilsModule.name,
    'base64'
])
.service('osmAPI', osmAPI);

export default osmAPIModule;
