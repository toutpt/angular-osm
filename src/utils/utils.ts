import osmUtils from './utils.service';

var osmUtilsModule = angular.module('osm.utils', [])
.service('osmUtils', osmUtils);

export default osmUtilsModule;
