

class Base64backend{
    constructor($base64, $http, osmx2js) {
        this.$base64 = $base64;
        this.storage = {};
        this.$http = $http;
        this.url = 'http://api.openstreetmap.org/api';
        this.osmx2js = osmx2js;
    }
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
     * @ngdoc method
     * @name setCredentials
     * @description if you don't use oauth, you can save
     * credentials here using base64 localstorage (completly unsecure)
     * @methodOf osm.api.osmAPI
     * @returns {string} crendentials
    */
    setCredentials(username, password) {
        this.storage.username = username;
        var credentials = this.$base64.encode(username + ':' + password);
        this.storage.credentials = credentials;
        return credentials;
    }
    /**
     * @ngdoc method
     * @name getCredentials
     * @description if you don't use oauth, you can manage
     * credentials here using base64 headers
     * @methodOf osm.api.osmAPI
     * @returns {string} crendentials from the last set
    */
    getCredentials() {
        return this.storage.credentials;
    }
    /**
     * @ngdoc method
     * @name getAuthorization
     * @description compute authorization header from credentials
     * @methodOf osm.api.osmAPI
     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
    */
    getAuthorization() {
        return 'Basic ' + this.storage.credentials;
    }
    /**
     * @ngdoc method
     * @name clearCredentials
     * @description remove credentials from the localstorage
     * @methodOf osm.api.osmAPI
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

Base64backend.$inject = ['$base64', '$http', 'osmx2js'];

export default Base64backend;