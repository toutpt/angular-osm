import osmAPI from './api.service';

var osmAPIModule = angular.module('osm.api', ['osm.settings'])
.factory('osmAPI', osmAPI);

export default osmAPIModule;
