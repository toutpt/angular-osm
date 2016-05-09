import osmAuthService from './oauth.component';

export default angular.module('osm.oauth', ['osm.settings'])
.factory('osmAuthService', osmAuthService);
