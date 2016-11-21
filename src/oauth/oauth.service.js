
/**
 * @class
 * Create osmAuthService service instance
 */
class OAuthAdapter{
    /**
     * @param {Object} $q angular $q service
     * @param {Object} osmx2js angular osm service
     * @param {Object} options set options for the lib https://github.com/osmlab/osm-auth
     */
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
     * Just logout. Warning this is synchronous code
     * and doesn t return anything.
     */
    logout() {
        this.auth.logout();
    }
    /**
     * @return {boolean}
     */
    authenticated() {
        return this.auth.authenticated();
    }
    /**
     * @return {Promise} true/false value
     */
    authenticate() {
        var deferred = this.$q.defer();
        this.auth.authenticate(function () {
            deferred.resolve(true);
        });
        return deferred.promise;
    }
    /**
     * @param {Object} options
     * @return {Promise} http response
     */
    xhr(options) {
        var self = this;
        var deferred = this.$q.defer();
        options.path = '/api' + options.path;
        if (options.data) {
            options.content = options.data;
            delete options.data;
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
     * Set the options of the oauth lib
     * @param {Object} options set options for the lib https://github.com/osmlab/osm-auth
     */
    options(options) {
        if (this.auth) {
            this.auth.options(options);
        } else {
            this.auth = osmAuth(options);
        }
    }
}

OAuthAdapter.$inject = ['$q', 'osmx2js'];

export default OAuthAdapter;
