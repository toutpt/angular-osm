import osmAuth from 'osm-auth';

//TODO: write a provider to configure the service and provide options

/**
* @ngdoc service
* @name osm.oauth.osmAuthService
* @requires angular-osm.osmSettingsService
* @description handle osm oauth
*/
function osmAuthService(options) {
    if (options) {
        if (options.oauth_secret && options.oauth_consumer_key) {
            this.auth = osmAuth(options);
        }
    }
    this.logout = function () {
        return this.auth.logout();
    };
    this.authenticated = function () {
        return this.auth.authenticated();
    };
    this.authenticate = function (callback) {
        return this.auth.authenticate(callback);
    };
    this.xhr = function (options) {
        return this.auth.xhr(options);
    };
    this.options = function (options) {
        if (this.auth) {
            this.auth.options(options);
        } else {
            this.auth = osmAuth(options);
        }
    };
}

export default osmAuthService;
