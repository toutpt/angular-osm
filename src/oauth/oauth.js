import osmAuthService from './oauth.service';

var osmOAuthModule = angular.module('osm.oauth', [])
.factory('osmAuthService', osmAuthService)
.provider('osmAuthService', function osmAuthServiceProvider () {
    this.options = {};
    this.$get = function osmAuthServiceFactory() {
        return new osmAuthService(this.options);
    };
});

export default osmOAuthModule;
