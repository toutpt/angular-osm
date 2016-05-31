
/**
 * @class
 * Create osmBase64 angular service instance.
 * This can be used as osmAPI adapter.
 */
class Base64Adapter{
    /**
     * the constructor
     * @param {Object} $base64 service provided by angular-base64 module
     * @param {Object} $http angular $http service
     * @param {Object} osmx2js angular-osm service
     * to transform response from xml to object
     */
    constructor($base64, $http, osmx2js) {
        this.$base64 = $base64;
        this.storage = {};
        this.$http = $http;
        this.url = 'http://api.openstreetmap.org/api';
        this.osmx2js = osmx2js;
    }
    /**
     * the main method used to do the call to the API
     * @param {Object} options
     * @returns {Promise} $http response
     */
    xhr(options) {
        var self = this;
        options.url = this.url + options.path;
        options.headers = {
            Authorization: this.getAuthorization()
        };
        return this.$http(options).then(function (data) {
            var d = data.data;
            if (!d) {
                return;
            }
            if (d.substr) {
                if (d.substr(0, 5) === '<?xml') {
                    return self.osmx2js.xml2js(d);
                }
            }
            return d;
        });
    }
    /**
     * if you don't use oauth, you can save
     * credentials here using base64 localstorage (completly unsecure)
     * @param {string} username your username
     * @param {string} password the user password.
     * WARNING base64 is unsafe and the credentials are stored in the localstorage
     * @returns {string} crendentials
    */
    setCredentials(username, password) {
        this.storage.username = username;
        var credentials = this.$base64.encode(username + ':' + password);
        this.storage.credentials = credentials;
        return credentials;
    }
    /**
     * if you don't use oauth, you can manage
     * credentials here using base64 headers
     * @returns {string} crendentials from the last set
    */
    getCredentials() {
        return this.storage.credentials;
    }
    /**
     * compute authorization header from credentials
     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
    */
    getAuthorization() {
        return 'Basic ' + this.storage.credentials;
    }
    /**
     * remove credentials from the localstorage
     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
    */
    clearCredentials() {
        if (this.storage.removeItem) {
            this.storage.removeItem('credentials')
        } else {
            delete this.storage.credentials;
        }
    }
}

Base64Adapter.$inject = ['$base64', '$http', 'osmx2js'];

export default Base64Adapter;