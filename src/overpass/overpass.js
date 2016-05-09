import overpassAPI from './overpass.component';

export default angular.module('osm.overpass', ['osm.settings'])
.factory('overpassAPI', overpassAPI);
