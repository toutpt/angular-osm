import osmAuthService from './oauth.component';

var osmOAuthModule = angular.module('osm.oauth', [])
.factory('osmAuthService', osmAuthService);

export default osmOAuthModule;
