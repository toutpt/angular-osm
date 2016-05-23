
/**
* @ngdoc service
* @name osm.oauth.osmAuthService
* @description handle osm oauth
*/
class osmAuthService{
    constructor($q, osmx2js, options) {
        if (options) {
            if (options.oauth_secret && options.oauth_consumer_key) {
                this.auth = osmAuth(options);
            }
        }
        this.osmx2js = osmx2js;
        this.$q = $q;
        this._options = options;
    }
    /**
     * @ngdoc method
     * @name logout
     * @methodOf osm.auth.osmAuthService
     */
    logout() {
        this.auth.logout();
    }
    /**
     * @ngdoc method
     * @name authenticated
     * @methodOf osm.auth.osmAuthService
     * @return {boolean} authenticated
     */
    authenticated() {
        return this.auth.authenticated();
    }
    /**
     * @ngdoc method
     * @name authenticate
     * @methodOf osm.auth.osmAuthService
     * @return {Promise} true/false
     */
    authenticate() {
        var deferred = this.$q.defer();
        this.auth.authenticate(function () {
            deferred.resolve(true);
        });
        return deferred.promise;
    }
    /**
     * @ngdoc method
     * @name xhr
     * @methodOf osm.auth.osmAuthService
     * @return {Promise} http response
     */
    xhr(options) {
        var self = this;
        var deferred = this.$q.defer();
        options.path = '/api' + options.path;
        if (options.data) {
            options.body = options.data;
            options.data = undefined;
        }
        this.auth.xhr(options, function (err, data) {
            if (err) {
                deferred.reject(err);
            } else {
                if (data instanceof XMLDocument) {
                    deferred.resolve(self.osmx2js.dom2js(data));
                } else {
                    deferred.resolve(data);
                }
            }
        });
        return deferred.promise;
    }
    /**
     * @ngdoc method
     * @name options
     * @methodOf osm.auth.osmAuthService
     */
    options(options) {
        if (this.auth) {
            this.auth.options(options);
        } else {
            this.auth = osmAuth(options);
        }
    }
}

export default osmAuthService;
