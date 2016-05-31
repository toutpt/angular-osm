/**
 * @module osm.togeojson
 */

import provider from './togeojson.provider';

var osmtogeojsonModule = angular.module('osm.togeojson', [])
.provider('osmtogeojson', provider);

export default osmtogeojsonModule;
