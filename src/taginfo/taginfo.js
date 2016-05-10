import osmTagInfoAPI from './taginfo.service';

var osmTagInfoModule = angular.module('osm.taginfo', [])
.factory('osmTagInfoAPI', osmTagInfoAPI);

export default osmTagInfoModule;
