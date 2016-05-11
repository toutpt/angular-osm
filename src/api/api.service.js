/**
 * @ngdoc service
 * @name osm.oauth.osmAuthService
 * @param  {any} $base64
 * @param  {any} $http
 * @param  {any} $q
 * @param  {any} osmSettingsService
 */
osmAPI.$inject = ['$base64', '$http', '$q', 'osmSettingsService', 'osmUtilsService'];
function osmAPI($base64, $http, $q, osmSettingsService, osmUtilsService) {
    /**
     * @ngdoc method
     * @name validateCredentials
     * @description if you don't use oauth, you can manage
     * credentials here using base64 headers
     * @methodOf osm.api.osmAPI
     * @returns {Promise} true/false
    */
    this.validateCredentials = function (){
        var deferred = $q.defer();
        this.getUserDetails().then(function(data){
            var users = data.getElementsByTagName('user');
            if (users.length > 0){
                osmSettingsService.setUserID(users[0].id);
            }
            deferred.resolve(users.length > 0);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name setCredentials
     * @description if you don't use oauth, you can save
     * credentials here using base64 localstorage (completly unsecure)
     * @methodOf osm.api.osmAPI
     * @returns {string} crendentials
    */
    this.setCredentials = function(username, password){
        osmSettingsService.setUserName(username);
        var credentials = $base64.encode(username + ':' + password);
        osmSettingsService.setCredentials(credentials);
        return credentials;
    };
    /**
     * @ngdoc method
     * @name getCredentials
     * @description if you don't use oauth, you can manage
     * credentials here using base64 headers
     * @methodOf osm.api.osmAPI
     * @returns {string} crendentials from the last set
    */
    this.getCredentials = function(){
        return osmSettingsService.getCredentials();
    };
    /**
     * @ngdoc method
     * @name getAuthorization
     * @description compute authorization header from credentials
     * @methodOf osm.api.osmAPI
     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
    */
    this.getAuthorization = function(){
        return 'Basic ' + osmSettingsService.getCredentials();
    };
    /**
     * @ngdoc method
     * @name clearCredentials
     * @description remove credentials from the localstorage
     * @methodOf osm.api.osmAPI
     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
    */
    this.clearCredentials = function () {
        osmSettingsService.setCredentials('');
    };
    /**
     * @ngdoc method
     * @name getAuthenticated
     * @description send a get request to OSM with
     * base64 crendentials in header
     * @methodOf osm.api.osmAPI
     * @returns {Promise} $http response
    */
    this.getAuthenticated = function(method, config){
        if (config === undefined){
            config = {};
        }
        config.headers = {Authorization: this.getAuthorization()};
        return this.get(method, config);
    };
    /**
     * @ngdoc method
     * @name get
     * @description send a get request
     * @methodOf osm.api.osmAPI
     * @param {string} method the api method
     * @param {Object} config the $http.get config
     * @returns {Promise} $http response
    */
    this.get = function(method, config){
        var deferred = $q.defer();
        var self = this;
        var url = osmSettingsService.getOSMAPI() + method;
        $http.get(url, config).then(function(data){
            var contentType = data.headers()['content-type'];
            var results;
            if (contentType.indexOf('application/xml;') === 0){
                results = osmUtilsService.parseXml(data.data);
            } else if (contentType.indexOf('text/xml;') === 0){
                results = osmUtilsService.parseXml(data.data);
            } else {
                results = data.data;
            }
            deferred.resolve(results);
        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name put
     * @description send a put request
     * @methodOf osm.api.osmAPI
     * @param {string} method the api method
     * @param {Object} content payload
     * @param {Object} config the $http.put config
     * @returns {Promise} $http response
    */
    this.put = function(method, content, config){
        var deferred = $q.defer();
        var self = this;

        if (config === undefined){
            config = {};
        }
        config.headers = {Authorization: this.getAuthorization()};
        var url = osmSettingsService.getOSMAPI() + method;
        $http.put(url, content, config).then(function(data){
            var contentType = data.headers()['content-type'];
            var results;
            if (contentType.indexOf('application/xml;') === 0){
                results = osmUtilsService.parseXml(data.data);
            }else if (contentType.indexOf('text/xml;') === 0){
                results = osmUtilsService.parseXml(data.data);
            }else{
                results = data.data;
            }
            deferred.resolve(results);
        },function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name delete
     * @description send a delete request
     * @methodOf osm.api.osmAPI
     * @param {string} method the api method
     * @param {Object} config the $http.delete config
     * @returns {Promise} $http response
    */
    this.delete = function(method, config){
        var deferred = $q.defer();
        var self = this;

        if (config === undefined){
            config = {};
        }
        config.headers = {Authorization: this.getAuthorization()};
        config.url = osmSettingsService.getOSMAPI() + method;
        config.method = 'delete';
        $http(config).then(function(data){
            var contentType = data.headers()['content-type'];
            var results;
            if (contentType.indexOf('application/xml;') === 0){
                results = osmUtilsService.parseXml(data.data);
            }else if (contentType.indexOf('text/xml;') === 0){
                results = osmUtilsService.parseXml(data.data);
            }else{
                results = data.data;
            }
            deferred.resolve(results);
        },function(data) {
            deferred.reject(data);
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name createChangeset
     * @methodOf osm.api.osmAPI
     * @param {string} comment the comment assiociated to the changeset
     * @returns {Promise} $http response
    */
    this.createChangeset = function(comment){
        var deferred = $q.defer();
        var changeset = '<osm><changeset><tag k="created_by" v="Angular-OSM"/><tag k="comment" v="';
        changeset += comment + '"/></changeset></osm>';
        this.put('/0.6/changeset/create', changeset).then(function(data){
            osmSettingsService.setChangeset(data);
            deferred.resolve(data);
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name getLastOpenedChangesetId
     * @methodOf osm.api.osmAPI
     * @returns {Promise} $http response with the last changeset id
     * or undefined if no changeset was opened
    */
    this.getLastOpenedChangesetId = function(){
        var deferred = $q.defer();
        var config = {
            params:{user: osmSettingsService.getUserID(), open: true}
        };
        this.get('/0.6/changesets', config).then(function(data){
            var changesets = data.getElementsByTagName('changeset');
            if (changesets.length > 0){
                osmSettingsService.setChangeset(changesets[0].id);
                deferred.resolve(changesets[0].id);
            }else{
                osmSettingsService.setChangeset();
                deferred.resolve();
            }
        });
        return deferred.promise;
    };
    /**
     * @ngdoc method
     * @name closeChangeset
     * @methodOf osm.api.osmAPI
     * @returns {Promise} $http.put response of
     * /0.6/changeset/CHANGESET_ID/close
    */
    this.closeChangeset = function(){
        var changeset = osmSettingsService.getChangeset();
        var results = this.put('/0.6/changeset/'+ changeset +'/close');
        osmSettingsService.setChangeset();
        return results;
    };
    /**
     * @ngdoc method
     * @name getUserDetails
     * @methodOf osm.api.osmAPI
     * @returns {Promise} $http.get response
     * /0.6/user/details
    */
    this.getUserDetails = function(){
        return this.getAuthenticated('/0.6/user/details');
    };
    /**
     * @ngdoc method
     * @name getMap
     * @methodOf osm.api.osmAPI
     * @param {string} bbox
     * @returns {Promise} $http.get response
     * /0.6/map?bbox=bbox
    */
    this.getMap = function(bbox){
        return this.get('/0.6/map?bbox='+bbox);
    };

    /**
     * @ngdoc method
     * @name updateNode
     * @methodOf osm.api.osmAPI
     * @param {Object} currentNode geojson
     * @param {Object} updatedNode geojson
     * @returns {Promise} $http.get response
     * /0.6/map?bbox=bbox
    */
    this.updateNode = function(currentNode, updatedNode){
        //we need to do the diff and build the xml
        //first try to find the node by id
        var nodes = osmSettingsService.getNodes();
        var node = nodes.getElementById(currentNode.properties.id);
        var deferred = $q.defer(); //only for errors
        if (node === null) {
            deferred.reject({
                msg: 'can t find node',
                currentNode: currentNode,
                updatedNode: updatedNode,
                osmNode: node
            });
            return deferred.promise;
        }
        var tag;
        node.setAttribute('changeset', osmSettingsService.getChangeset());
        node.setAttribute('user', osmSettingsService.getUserName());
        while (node.getElementsByTagName('tag')[0]){
            node.removeChild(node.getElementsByTagName('tag')[0]);
        }
        var osm = document.createElement('osm');
        var value;
        osm.appendChild(node);
        for (var property in updatedNode.properties.tags) {
            if (updatedNode.properties.tags.hasOwnProperty(property)) {
                value = updatedNode.properties.tags[property];
                if (value === undefined){
                    continue;
                }
                tag = document.createElement('tag');
                tag.setAttribute('k', property);
                tag.setAttribute('v', value);
                node.appendChild(tag);
            }
        }
        var nodeType;
        if (updatedNode.geometry.type === 'Polygon') {
            nodeType = 'way';
        } else if (updatedNode.geometry.type === 'Point') {
            nodeType = 'node';
        } else if (updatedNode.geometry.type === 'LineString') {
            nodeType = 'way';
         } else {
            deferred.reject({
                msg: 'geojson type not supported',
                currentNode: currentNode,
                updatedNode: updatedNode,
                osmNode: node
            });
            return deferred.promise;
        }
        //put request !!
        var url = '/0.6/' + nodeType + '/' + currentNode.properties.id;
        return this.put(url, osm.outerHTML);
    };
    /**
     * @ngdoc method
     * @name createNode
     * @methodOf osm.api.osmAPI
     * @param {Object} node geojson
     * @returns {Promise} $http.put response
     * /0.6/node/create
    */
    this.createNode = function(node){
        var newNode = osmUtilsService.createNode(node);
        return this.put('/0.6/node/create', newNode);
    };
    /**
     * @ngdoc method
     * @name getMapGeoJSON
     * @methodOf osm.api.osmAPI
     * @param {string} bbox the bounding box
     * @returns {Promise} $http.get response
    */
    this.getMapGeoJSON = function(bbox){
        var self = this;
        var deferred = $q.defer();
        self.getMap(bbox).then(function(xmlNodes){
            var geojsonNodes = self.getNodesInJSON(xmlNodes);
            //TODO: load row node (xml)
/*                    var node;
            for (var i = 0; i < geojsonNodes.length; i++) {
                node = geojsonNodes[i];
                node.rawXMLNode = xmlNodes.getElementById(node.id.split('/')[1]);
            }*/
            deferred.resolve(geojsonNodes);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };

}

export default osmAPI;
