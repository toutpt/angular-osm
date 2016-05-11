import osmTagInfoAPI from './taginfo.service';

var osmTagInfoModule = angular.module('osm.taginfo', [])
.service('osmTagInfoAPI', osmTagInfoAPI);

export default osmTagInfoModule;
