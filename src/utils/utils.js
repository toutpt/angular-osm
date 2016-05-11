import osmUtilsService from './utils.service';
import osmSettingsModule from '../settings/settings';

var osmUtilsModule = angular.module('osm.utils', [osmSettingsModule.name])
.service('osmUtilsService', osmUtilsService);

export default osmUtilsModule;
