import osmAuthService from './oauth.service';

var osmOAuthModule = angular.module('osm.oauth', [])
.factory('osmAuthService', osmAuthService)
.provider('osmAuthService', function osmAuthServiceProvider () {
    this.options = {};
    
    this.$get = function osmAuthServiceFactory($q) {
        return new osmAuthService($q, this.options);
    };
    this.$get.$inject = ['$q'];
});

export default osmOAuthModule;
