import osmAPI from './api.component';

export default angular.module('osm.api', ['osm.settings'])
.factory('osmAPI', osmAPI);