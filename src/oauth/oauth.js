import osmAuthService from './oauth.service';

var osmOAuthModule = angular.module('osm.oauth', [])
.factory('osmAuthService', osmAuthService);

export default osmOAuthModule;
