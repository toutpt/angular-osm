import osmAPI from './api.component';

var osmAPIModule = angular.module('osm.api', ['osm.settings'])
.factory('osmAPI', osmAPI);

export default osmAPIModule;
