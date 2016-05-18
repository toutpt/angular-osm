import provider from './togeojson.provider';
import factory from './togeojson.factory';

var osmtogeojsonModule = angular.module('osm.togeojson', [])
.factory('osmtogeojson', factory)
.provider('osmtogeojson', provider);

export default osmtogeojsonModule;
