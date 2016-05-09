import osmOverpassAPI from './overpass.component';

var osmOverpassModule = angular.module('osm.overpass', ['osm.settings'])
.factory('osmOverpassAPI', osmOverpassAPI);

export default osmOverpassModule;
