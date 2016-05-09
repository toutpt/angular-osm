import osmTagInfoAPI from './taginfo.component';

var osmTagInfoModule = angular.module('osm.taginfo', [])
.factory('osmTagInfoAPI', osmTagInfoAPI);

export default osmTagInfoModule;
