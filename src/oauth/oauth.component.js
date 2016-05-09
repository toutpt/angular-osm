

/**
* @ngdoc service
* @name osm.oauth.osmAuthService
* @requires angular-osm.osmSettingsService
* @description handle osm oauth
*/
osmAuthService.$inject = ['osmSettingsService'];
function osmAuthService(osmSettingsService) {
    var options = osmSettingsService.getOsmAuth();
    if (options.oauth_secret && options.oauth_consumer_key) {
        osmAuth(options);
    }
    this.logout = osmAuth.logout;
    this.authenticated = osmAuth.authenticated;
    this.authenticate = osmAuth.authenticate;
    this.xhr = osmAuth.xhr;
    this.options = osmAuth.options;
}

export default osmAuthService;
