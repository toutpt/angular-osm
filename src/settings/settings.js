import osmSettingsService from './settings.component';

var osmSettingsModule = angular.module('osm.settings', [])
.factory('osmSettingsService', osmSettingsService);

export default osmSettingsModule;
