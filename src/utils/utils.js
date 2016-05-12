import osmUtilsService from './utils.service';
import osmSettingsModule from '../settings/settings';
import x2jsModule from '../x2js/x2js';

var osmUtilsModule = angular.module('osm.utils', [osmSettingsModule.name, x2jsModule.name])
.service('osmUtilsService', osmUtilsService);

export default osmUtilsModule;
