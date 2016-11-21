/**
 * @class
 * Create the angular service instance.
 * The main idea is to provide only object and hide the XML related stuf.
 * This is achieve using XML2JS.
 */
class OSMAPI {
    /**
     * @param  {Object} $http angular http
     * @param  {Object} $q angular promise
     * @param  {Object} osmx2js service
     * @param  {Object} options to get set url of the API
     */
    constructor($http, $q, osmx2js, options) {
        this.url = options.url;
        this.$http = $http;
        this.$q = $q;
        this.osmx2js = osmx2js;
        this._oauth = null;
    }

    /**
     * Set the adapter to make authenticated request.
     * @param {Object} adapter must provide xhr method.
     * angular-osm provide two adapter: osmBase64 and osmAuthService
    */
    setAuthAdapter(adapter) {
        this._oauth = adapter;
    }

    /**
     * Get the adapter used to do authenticated xhr
     * @return {Object}
    */
    getAuthAdapter() {
        return this._oauth;
    }


    // ------------------ INTERNAL CALL SERVER (API) -----------------

    /**
     * Call the API
     * @param {Object} options
     * ```
        var options = {
            method: 'GET', // POST, DELETE, PUT
            path: '/0.6/changesets', //without the /api
            data: content //if you need a payload
        };
        osmAPI.xhr(options);
        ```
     * @return {Promise} the adapter response
    */
    xhr(options) {
        let deferred = this.$q.defer();
        return this._oauth.xhr(options);
    }

    /**
     * send a get request to OSM with
     * @returns {Promise} $http response
    */
    getAuthenticated(method, config) {
        var _config = angular.copy(config);
        if (!_config) {
            _config = {};
        }
        _config.method = 'GET';
        _config.path = method;
        return this.xhr(_config);
    }
    /**
     * send a get request
     * @param {string} method the api method
     * @param {Object} config the $http.get config
     * @returns {Promise} $http response with XML as string
    */
    get(method, config) {
        var deferred = this.$q.defer();
        var self = this;
        var url = this.url + method;
        this.$http.get(url, config).then(function (data) {
            deferred.resolve(self.osmx2js.xml2js(data.data));
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    }
    /**
     * send a put request
     * @param {string} method the api method
     * @param {Object} content payload
     * @param {Object} config the $http.put config
     * @returns {Promise} $http response
    */
    put(method, content, config) {
        if (!config) {
            config = {};
        }
        var _config = angular.copy(config);
        _config.method = 'PUT';
        _config.path = method;
        _config.data = this.osmx2js.js2xml(content);
        _config.options = {};
        _config.options.header = {"Content-Type": "text/xml"};
        return this.xhr(_config);
    }
    /**
     * send a delete request
     * @param {string} method the api method
     * @param {Object} config the $http.delete config
     * @returns {Promise} $http response
    */
    delete(method, config) {
        if (!config) {
            config = {};
        }
        var _config = angular.copy(config);
        _config.method = 'DELETE';
        _config.path = method;
        return this.xhr(_config);
    }


    // ------------------ CHANGESET -----------------


    /**
     * @param {string} comment the comment assiociated to the changeset
     * @returns {Promise} $http response
    */
    createChangeset(comment, author) {
        var self = this;
        var deferred = this.$q.defer();
        var changeset = {osm: {
            changeset: {
                tag: [
                    {_k:'created_by', _v: author || 'Angular-OSM'},
                    {_k:'comment', _v: comment},
                ]
            }
        }};
        this.put('/0.6/changeset/create', changeset).then(function (data) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }
    /**
     * @returns {Promise} $http response with the last changeset id
     * or undefined if no changeset was opened
    */
    getLastOpenedChangesetId() {
        var self = this;
        var deferred = this.$q.defer();
        var config = {
            params:{user: this._oauth.getUserID(), open: true}
        };
        this.get('/0.6/changesets', config).then(function (data) {
            var changesets = data.osm.changeset;
            if (changesets.length > 0) {
                deferred.resolve(changesets[0].id);
            } else if (changesets._id) {
                deferred.resolve(changesets._id);
            } else {
                deferred.resolve();
            }
        });
        return deferred.promise;
    }
    /**
     * @returns {Promise} $http.put response of
     * /0.6/changeset/CHANGESET_ID/close
    */
    closeChangeset(id) {
        var self = this;
        return this.put(`/0.6/changeset/${id}/close`)
        .then(function (data) {
            return data;
        });
    }


    // ------------------ USER API -----------------

    /**
     * @param {string} id id of the user
     * @returns {Promise} $http.get response
     * /0.6/user/#id
    */
    getUserById(id) {
        return this.getAuthenticated('/0.6/user/' + id);
    }


    /**
     * @returns {Promise} $http.get response
     * /0.6/user/details
    */
    getUserDetails() {
        return this.getAuthenticated('/0.6/user/details');
    }
    /**
     * @returns {Promise} $http.get response
     * /0.6/user/preferences
    */
    getUserPreferences() {
        return this.getAuthenticated('/0.6/user/preferences');
    }

    /**
     * @param {string} key the preference key
     * @param {string} value the preference value
     * @returns {Promise} $http.get response
     * /0.6/user/preferences
    */
    putUserPreferences(key, value) {
        return this.put('/0.6/user/preferences/' + key , value);
    }


    //------------------ MAP DATA -------------------------

    /**
     * @param {string} bbox left,bottom,right,top
     * where:
        left is the longitude of the left (westernmost) side of the bounding box.
        bottom is the latitude of the bottom (southernmost) side of the bounding box.
        right is the longitude of the right (easternmost) side of the bounding box.
        top is the latitude of the top (northernmost) side of the bounding box.
     * @returns {Promise} $http.get response
     * /0.6/map?bbox=bbox
    */
    getMap(bbox) {
        return this.get('/0.6/map?bbox=' + bbox);
    }


    /**
     * @param {string} bbox left,bottom,right,top
     * where:
        left is the longitude of the left (westernmost) side of the bounding box.
        bottom is the latitude of the bottom (southernmost) side of the bounding box.
        right is the longitude of the right (easternmost) side of the bounding box.
        top is the latitude of the top (northernmost) side of the bounding box.
     * @returns {Promise} $http.get response
    */
    getNotes(bbox) {
        var url = '/0.6/notes?bbox=' + bbox;
        return this.get(url);
    }



    //------------------ ELEMENTS: Node ----------------

    /**
     * @param {Object/string} node
         var node = {osm: {node: {
            _changeset: '12', _lat: '...', _lon: '...',
            tags: [
                {_k: '...', _v: '...'}
            ]
        }}};
     * @returns {Promise} $http.put response
     * PUT /0.6/node/create
    */
    createNode(node) {
        return this.put('/0.6/node/create', node);
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/node/#id
    */
    getNode(id) {
        return this.get('/0.6/node/' + id);
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/node/#id/relations
    */
    getNodeRelations(id) {
        return this.get(`/0.6/node/${id}/relations`);
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/node/#id/ways
    */
    getNodeWays(id) {
        return this.get(`/0.6/node/${id}/ways`);
    }

    /**
     * @param {array} ids ids
     * @returns {Promise} $http.get response
     * GET /0.6/node/#id
    */
    getNodes(ids) {
        return this.get('/0.6/nodes?nodes=' + ids.join(','));
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.delete response
     * DELETE /0.6/node/#id
    */
    deleteNode(id) {
        return this.delete('/0.6/node/' + id);
    }



    //------------------ ELEMENTS: WAY ----------------


    /**
     * @param {Object/string} way
        var way = {osm: {way: {
            _changeset: '12', _lat: '...', _lon: '...',
            tags: [
                {_k: '...', _v: '...'}
            ],
            nd: [
                {_ref: '123'},
                {_ref: '456'},
            ]
        }}};
     * @returns {Promise} $http.put response
     * PUT /0.6/way/create
    */
    createWay(way) {
        return this.put('/0.6/way/create', way);
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/way/#id
    */
    getWay(id) {
        return this.get('/0.6/way/' + id);
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/way/#id/relations
    */
    getWayRelations(id) {
        return this.get(`/0.6/way/${id}/relations`);
    }


    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/way/#id/full
    */
    getWayFull(id) {
        return this.get(`/0.6/way/${id}/full`);
    }

    /**
     * @param {array} ids ids
     * @returns {Promise} $http.get response
     * GET /0.6/ways?ways=ids
    */
    getWays(ids) {
        return this.get('/0.6/ways?ways=' + ids.join(','));
    }


    /**
     * @param {string} id id
     * @returns {Promise} $http.delete response
     * DELETE /0.6/way/#id
    */
    deleteWay(id) {
        return this.delete('/0.6/way/' + id);
    }

    //------------------ ELEMENTS: RELATION ----------------


    /**
     * @param {Object/string} relation
        var relation = {osm: {relation: {
            _changeset: '12', _lat: '...', _lon: '...',
            tags: [
                {_k: '...', _v: '...'}
            ],
            member: [
                {_type: 'node', _role: 'stop', 'ref': '123'},
                {_type: 'way', 'ref': '234'}
            ]
        }}};
     * @returns {Promise} $http.put response
     * PUT /0.6/relation/create
    */
    createRelation(relation) {
        return this.put('/0.6/relation/create', relation);
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/relation/#id
    */
    getRelation(id) {
        return this.get('/0.6/relation/' + id);
    }
    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/relation/#id/relations
    */
    getRelationRelations(id) {
        return this.get(`/0.6/relation/${id}/relations`);
    }


    /**
     * @param {string} id id
     * @returns {Promise} $http.get response
     * GET /0.6/relation/#id/full
    */
    getRelationFull(id) {
        return this.get(`/0.6/relation/${id}/full`);
    }

    /**
     * @param {array} ids ids
     * @returns {Promise} $http.get response
     * GET /0.6/relations?relations=ids
    */
    getRelations(ids) {
        return this.get('/0.6/relations?relations=' + ids.join(','));
    }

    /**
     * @param {string} id id
     * @returns {Promise} $http.delete response
     * DELETE /0.6/relation/#id
    */
    deleteRelation(id) {
        return this.delete('/0.6/relation/' + id);
    }

}

OSMAPI.$inject = ['$http', '$q', 'osmx2js'];
export default OSMAPI;
