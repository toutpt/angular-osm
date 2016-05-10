import osmAPI from './api.service';
import osmSettingsModule from '../settings/settings';

var osmAPIModule = angular.module('osm.api', [osmSettingsModule.name])
.factory('osmAPI', osmAPI);

export default osmAPIModule;
