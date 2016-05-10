import osmOverpassAPI from './overpass.service';

var osmOverpassModule = angular.module('osm.overpass', ['osm.settings'])
.factory('osmOverpassAPI', osmOverpassAPI);

export default osmOverpassModule;
