import osmAuthLib from 'osm-auth';

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
    /**
     * @ngdoc method
     * @name logout
     * @methodOf osm.auth.osmAuthService
     */
    this.logout = function () {
        this.auth.logout();
    };
    /**
     * @ngdoc method
     * @name authenticated
     * @methodOf osm.auth.osmAuthService
     * @return {boolean} authenticated
     */
    this.authenticated = function () {
        return this.auth.authenticated();
    };
    /**
     * @ngdoc method
     * @name authenticate
     * @methodOf osm.auth.osmAuthService
     * @return {Promise} true/false
     */
    this.authenticate = function () {
        var deferred = $q.defer();
        this.auth.authenticate(function () {
            deferred.resolve(true);
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name xhr
     * @methodOf osm.auth.osmAuthService
     * @return {Promise} http response
     */
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
    /**
     * @ngdoc method
     * @name options
     * @methodOf osm.auth.osmAuthService
     */
    this.options = function (options) {
        if (this.auth) {
            this.auth.options(options);
        } else {
            this.auth = osmAuth(options);
        }
    };
}

export default osmAuthService;
