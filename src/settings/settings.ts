import osmSettingsService from './settings.service';
import ngstorage from 'ngstorage';

var osmSettingsModule = angular.module('osm.settings', [
    ngstorage.name
])
.factory('osmSettingsService', osmSettingsService);

export default osmSettingsModule;
