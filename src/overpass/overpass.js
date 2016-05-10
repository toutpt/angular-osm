import osmOverpassAPI from './overpass.service';
import osmSettingsModule from '../settings/settings';

var osmOverpassModule = angular.module('osm.overpass', [osmSettingsModule.name])
.factory('osmOverpassAPI', osmOverpassAPI);

export default osmOverpassModule;
