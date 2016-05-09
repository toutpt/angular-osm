import overpassAPI from './overpass.component';

var osmOverpassModule = angular.module('osm.overpass', ['osm.settings'])
.factory('overpassAPI', overpassAPI);

export default osmOverpassModule;
