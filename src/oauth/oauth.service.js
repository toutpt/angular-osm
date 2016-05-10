import osmAuth from 'osm-auth';

/**
* @ngdoc service
* @name osm.oauth.osmAuthService
* @requires angular-osm.osmSettingsService
* @description handle osm oauth
*/
function osmAuthService($q, options) {
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
    this.authenticate = function () {
        var deferred = $q.defer();
        this.auth.authenticate(function () {
            deferred.resolve(true);
        });
        return deferred.promise;
    };
    this.xhr = function (options) {
        var deferred = $q.defer();
        this.auth.xhr(options, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
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
