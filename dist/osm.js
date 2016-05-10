webpackJsonp([1],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _angular = __webpack_require__(1);

	var _angular2 = _interopRequireDefault(_angular);

	var _oauth = __webpack_require__(15);

	var _oauth2 = _interopRequireDefault(_oauth);

	var _api = __webpack_require__(17);

	var _api2 = _interopRequireDefault(_api);

	var _overpass = __webpack_require__(24);

	var _overpass2 = _interopRequireDefault(_overpass);

	var _taginfo = __webpack_require__(26);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	var _settings = __webpack_require__(20);

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_angular2.default.module('osm', [_settings2.default.name, _api2.default.name, _overpass2.default.name, _taginfo2.default.name, _oauth2.default.name]);

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _oauth = __webpack_require__(16);

	var _oauth2 = _interopRequireDefault(_oauth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOAuthModule = angular.module('osm.oauth', []).factory('osmAuthService', _oauth2.default).provider('osmAuthService', function osmAuthServiceProvider() {
	    this.options = {};

	    this.$get = function osmAuthServiceFactory($q) {
	        return new _oauth2.default($q, this.options);
	    };
	    this.$get.$inject = ['$q'];
	});

	exports.default = osmOAuthModule;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _osmAuth = __webpack_require__(3);

	var _osmAuth2 = _interopRequireDefault(_osmAuth);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	* @ngdoc service
	* @name osm.oauth.osmAuthService
	* @requires angular-osm.osmSettingsService
	* @description handle osm oauth
	*/
	function osmAuthService($q, options) {
	    if (options) {
	        if (options.oauth_secret && options.oauth_consumer_key) {
	            this.auth = (0, _osmAuth2.default)(options);
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
	            this.auth = (0, _osmAuth2.default)(options);
	        }
	    };
	}

	exports.default = osmAuthService;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _angularBase = __webpack_require__(18);

	var _angularBase2 = _interopRequireDefault(_angularBase);

	var _api = __webpack_require__(19);

	var _api2 = _interopRequireDefault(_api);

	var _settings = __webpack_require__(20);

	var _settings2 = _interopRequireDefault(_settings);

	var _utils = __webpack_require__(22);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//The base64 module is only available as IIFE

	var osmAPIModule = angular.module('osm.api', [_settings2.default.name, _utils2.default.name, 'base64']).service('osmAPI', _api2.default);

	exports.default = osmAPIModule;

/***/ },
/* 18 */
/***/ function(module, exports) {

	(function() {
	    'use strict';

	    /*
	     * Encapsulation of Nick Galbreath's base64.js library for AngularJS
	     * Original notice included below
	     */

	    /*
	     * Copyright (c) 2010 Nick Galbreath
	     * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
	     *
	     * Permission is hereby granted, free of charge, to any person
	     * obtaining a copy of this software and associated documentation
	     * files (the "Software"), to deal in the Software without
	     * restriction, including without limitation the rights to use,
	     * copy, modify, merge, publish, distribute, sublicense, and/or sell
	     * copies of the Software, and to permit persons to whom the
	     * Software is furnished to do so, subject to the following
	     * conditions:
	     *
	     * The above copyright notice and this permission notice shall be
	     * included in all copies or substantial portions of the Software.
	     *
	     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
	     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
	     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
	     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
	     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	     * OTHER DEALINGS IN THE SOFTWARE.
	     */

	    /* base64 encode/decode compatible with window.btoa/atob
	     *
	     * window.atob/btoa is a Firefox extension to convert binary data (the "b")
	     * to base64 (ascii, the "a").
	     *
	     * It is also found in Safari and Chrome.  It is not available in IE.
	     *
	     * if (!window.btoa) window.btoa = base64.encode
	     * if (!window.atob) window.atob = base64.decode
	     *
	     * The original spec's for atob/btoa are a bit lacking
	     * https://developer.mozilla.org/en/DOM/window.atob
	     * https://developer.mozilla.org/en/DOM/window.btoa
	     *
	     * window.btoa and base64.encode takes a string where charCodeAt is [0,255]
	     * If any character is not [0,255], then an exception is thrown.
	     *
	     * window.atob and base64.decode take a base64-encoded string
	     * If the input length is not a multiple of 4, or contains invalid characters
	     *   then an exception is thrown.
	     */

	    angular.module('base64', []).constant('$base64', (function() {

	        var PADCHAR = '=';

	        var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	        function getbyte64(s,i) {
	            var idx = ALPHA.indexOf(s.charAt(i));
	            if (idx == -1) {
	                throw "Cannot decode base64";
	            }
	            return idx;
	        }

	        function decode(s) {
	            // convert to string
	            s = "" + s;
	            var pads, i, b10;
	            var imax = s.length;
	            if (imax == 0) {
	                return s;
	            }

	            if (imax % 4 != 0) {
	                throw "Cannot decode base64";
	            }

	            pads = 0;
	            if (s.charAt(imax -1) == PADCHAR) {
	                pads = 1;
	                if (s.charAt(imax -2) == PADCHAR) {
	                    pads = 2;
	                }
	                // either way, we want to ignore this last block
	                imax -= 4;
	            }

	            var x = [];
	            for (i = 0; i < imax; i += 4) {
	                b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
	                    (getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
	                x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
	            }

	            switch (pads) {
	                case 1:
	                    b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6);
	                    x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
	                    break;
	                case 2:
	                    b10 = (getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
	                    x.push(String.fromCharCode(b10 >> 16));
	                    break;
	            }
	            return x.join('');
	        }

	        function getbyte(s,i) {
	            var x = s.charCodeAt(i);
	            if (x > 255) {
	                throw "INVALID_CHARACTER_ERR: DOM Exception 5";
	            }
	            return x;
	        }

	        function encode(s) {
	            if (arguments.length != 1) {
	                throw "SyntaxError: Not enough arguments";
	            }

	            var i, b10;
	            var x = [];

	            // convert to string
	            s = "" + s;

	            var imax = s.length - s.length % 3;

	            if (s.length == 0) {
	                return s;
	            }
	            for (i = 0; i < imax; i += 3) {
	                b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
	                x.push(ALPHA.charAt(b10 >> 18));
	                x.push(ALPHA.charAt((b10 >> 12) & 0x3F));
	                x.push(ALPHA.charAt((b10 >> 6) & 0x3f));
	                x.push(ALPHA.charAt(b10 & 0x3f));
	            }
	            switch (s.length - imax) {
	                case 1:
	                    b10 = getbyte(s,i) << 16;
	                    x.push(ALPHA.charAt(b10 >> 18) + ALPHA.charAt((b10 >> 12) & 0x3F) +
	                        PADCHAR + PADCHAR);
	                    break;
	                case 2:
	                    b10 = (getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
	                    x.push(ALPHA.charAt(b10 >> 18) + ALPHA.charAt((b10 >> 12) & 0x3F) +
	                        ALPHA.charAt((b10 >> 6) & 0x3f) + PADCHAR);
	                    break;
	            }
	            return x.join('');
	        }

	        return {
	            encode: encode,
	            decode: decode
	        };
	    })());

	})();


/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
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
	    this.validateCredentials = function () {
	        var deferred = $q.defer();
	        this.getUserDetails().then(function (data) {
	            var users = data.getElementsByTagName('user');
	            if (users.length > 0) {
	                osmSettingsService.setUserID(users[0].id);
	            }
	            deferred.resolve(users.length > 0);
	        }, function (error) {
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
	    this.setCredentials = function (username, password) {
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
	    this.getCredentials = function () {
	        return osmSettingsService.getCredentials();
	    };
	    /**
	     * @ngdoc method
	     * @name getAuthorization
	     * @description compute authorization header from credentials
	     * @methodOf osm.api.osmAPI
	     * @returns {string} HTTP Header 'Basic CREDENTIAL AS BASE64'
	    */
	    this.getAuthorization = function () {
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
	    this.getAuthenticated = function (method, config) {
	        if (config === undefined) {
	            config = {};
	        }
	        config.headers = { Authorization: this.getAuthorization() };
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
	    this.get = function (method, config) {
	        var deferred = $q.defer();
	        var self = this;
	        var url = osmSettingsService.getOSMAPI() + method;
	        $http.get(url, config).then(function (data) {
	            var contentType = data.headers()['content-type'];
	            var results;
	            if (contentType.indexOf('application/xml;') === 0) {
	                results = osmUtilsService.parseXml(data.data);
	            } else if (contentType.indexOf('text/xml;') === 0) {
	                results = osmUtilsService.parseXml(data.data);
	            } else {
	                results = data.data;
	            }
	            deferred.resolve(results);
	        }, function (data) {
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
	    this.put = function (method, content, config) {
	        var deferred = $q.defer();
	        var self = this;

	        if (config === undefined) {
	            config = {};
	        }
	        config.headers = { Authorization: this.getAuthorization() };
	        var url = osmSettingsService.getOSMAPI() + method;
	        $http.put(url, content, config).then(function (data) {
	            var contentType = data.headers()['content-type'];
	            var results;
	            if (contentType.indexOf('application/xml;') === 0) {
	                results = osmUtilsService.parseXml(data.data);
	            } else if (contentType.indexOf('text/xml;') === 0) {
	                results = osmUtilsService.parseXml(data.data);
	            } else {
	                results = data.data;
	            }
	            deferred.resolve(results);
	        }, function (data) {
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
	    this.delete = function (method, config) {
	        var deferred = $q.defer();
	        var self = this;

	        if (config === undefined) {
	            config = {};
	        }
	        config.headers = { Authorization: this.getAuthorization() };
	        config.url = osmSettingsService.getOSMAPI() + method;
	        config.method = 'delete';
	        $http(config).then(function (data) {
	            var contentType = data.headers()['content-type'];
	            var results;
	            if (contentType.indexOf('application/xml;') === 0) {
	                results = osmUtilsService.parseXml(data.data);
	            } else if (contentType.indexOf('text/xml;') === 0) {
	                results = osmUtilsService.parseXml(data.data);
	            } else {
	                results = data.data;
	            }
	            deferred.resolve(results);
	        }, function (data) {
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
	    this.createChangeset = function (comment) {
	        var deferred = $q.defer();
	        var changeset = '<osm><changeset><tag k="created_by" v="Angular-OSM"/><tag k="comment" v="';
	        changeset += comment + '"/></changeset></osm>';
	        this.put('/0.6/changeset/create', changeset).then(function (data) {
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
	    this.getLastOpenedChangesetId = function () {
	        var deferred = $q.defer();
	        var config = {
	            params: { user: osmSettingsService.getUserID(), open: true }
	        };
	        this.get('/0.6/changesets', config).then(function (data) {
	            var changesets = data.getElementsByTagName('changeset');
	            if (changesets.length > 0) {
	                osmSettingsService.setChangeset(changesets[0].id);
	                deferred.resolve(changesets[0].id);
	            } else {
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
	    this.closeChangeset = function () {
	        var changeset = osmSettingsService.getChangeset();
	        var results = this.put('/0.6/changeset/' + changeset + '/close');
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
	    this.getUserDetails = function () {
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
	    this.getMap = function (bbox) {
	        return this.get('/0.6/map?bbox=' + bbox);
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
	    this.updateNode = function (currentNode, updatedNode) {
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
	        while (node.getElementsByTagName('tag')[0]) {
	            node.removeChild(node.getElementsByTagName('tag')[0]);
	        }
	        var osm = document.createElement('osm');
	        var value;
	        osm.appendChild(node);
	        for (var property in updatedNode.properties.tags) {
	            if (updatedNode.properties.tags.hasOwnProperty(property)) {
	                value = updatedNode.properties.tags[property];
	                if (value === undefined) {
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
	    this.createNode = function (node) {
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
	    this.getMapGeoJSON = function (bbox) {
	        var self = this;
	        var deferred = $q.defer();
	        self.getMap(bbox).then(function (xmlNodes) {
	            var geojsonNodes = self.getNodesInJSON(xmlNodes);
	            //TODO: load row node (xml)
	            /*                    var node;
	                        for (var i = 0; i < geojsonNodes.length; i++) {
	                            node = geojsonNodes[i];
	                            node.rawXMLNode = xmlNodes.getElementById(node.id.split('/')[1]);
	                        }*/
	            deferred.resolve(geojsonNodes);
	        }, function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };
	}

	exports.default = osmAPI;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _settings = __webpack_require__(21);

	var _settings2 = _interopRequireDefault(_settings);

	var _ngstorage = __webpack_require__(14);

	var _ngstorage2 = _interopRequireDefault(_ngstorage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmSettingsModule = angular.module('osm.settings', [_ngstorage2.default.name]).factory('osmSettingsService', _settings2.default);

	exports.default = osmSettingsModule;

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});


	/**
	 * @ngdoc service
	 * @name osmSettingsService
	 * @description provide service to access to settings
	 * @param  {any} $localStorage
	 */
	osmSettingsService.$inject = ['$localStorage'];
	function osmSettingsService($localStorage) {
	    return {
	        localStorage: $localStorage.$default({
	            userName: '',
	            userID: '',
	            credentials: '',
	            nodes: [],
	            changeset: '',
	            osmAPI: '',
	            overpassAPI: ''
	        }),
	        getUserName: function getUserName() {
	            return this.localStorage.userName;
	        },
	        setUserName: function setUserName(username) {
	            this.localStorage.userName = username;
	        },
	        getUserID: function getUserID() {
	            return this.localStorage.userID;
	        },
	        setUserID: function setUserID(userid) {
	            this.localStorage.userID = userid;
	        },
	        getCredentials: function getCredentials() {
	            return this.localStorage.credentials;
	        },
	        setCredentials: function setCredentials(credentials) {
	            this.localStorage.credentials = credentials;
	        },
	        getOSMAPI: function getOSMAPI() {
	            if (this.localStorage.osmAPI) {
	                return this.localStorage.osmAPI;
	            } else {
	                return 'http://api.openstreetmap.org/api';
	            }
	        },
	        setOSMAPI: function setOSMAPI(osmAPI) {
	            this.localStorage.osmAPI = osmAPI;
	        },
	        getOverpassAPI: function getOverpassAPI() {
	            if (this.localStorage.overpassAPI) {
	                return this.localStorage.overpassAPI;
	            } else {
	                //return 'http://api.openstreetmap.org/api';
	                return 'http://overpass-api.de/api/interpreter';
	            }
	        },
	        setOverpassAPI: function setOverpassAPI(overpassAPI) {
	            this.localStorage.overpassAPI = overpassAPI;
	        },
	        getNodes: function getNodes() {
	            return this.localStorage.nodes;
	        },
	        setNodes: function setNodes(nodes) {
	            this.localStorage.nodes = nodes;
	        },
	        getChangeset: function getChangeset() {
	            return this.localStorage.changeset;
	        },
	        setChangeset: function setChangeset(changeset) {
	            this.localStorage.changeset = changeset;
	        },
	        getOsmAuth: function getOsmAuth() {
	            return this.localStorage.osmAuth;
	        },
	        setOsmAuth: function setOsmAuth(options) {
	            return this.localStorage.osmAuth = options;
	        }
	    };
	}

	exports.default = osmSettingsService;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(23);

	var _utils2 = _interopRequireDefault(_utils);

	var _settings = __webpack_require__(20);

	var _settings2 = _interopRequireDefault(_settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmUtilsModule = angular.module('osm.utils', [_settings2.default.name]).service('osmUtilsService', _utils2.default);

	exports.default = osmUtilsModule;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * @ngdoc service
	 * @name osm.utils.osmUtilsService
	 */
	function osmUtilsService(osmSettingsService) {
	    var _this = this;

	    this.serializer = new XMLSerializer();

	    if (typeof window.DOMParser !== 'undefined') {
	        (function () {
	            var parser = new window.DOMParser();
	            _this.parseXml = function parseXml(xmlStr) {
	                return parser.parseFromString(xmlStr, 'application/xml');
	            };
	        })();
	    } else if (typeof window.ActiveXObject !== 'undefined') {
	        this.parseXml = function parseXml(xmlStr) {
	            var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
	            xmlDoc.async = 'false';
	            xmlDoc.loadXML(xmlStr);
	            return xmlDoc;
	        };
	    } else {
	        throw new Error('No XML parser found');
	    }
	    this.createNode = function (node) {
	        var newNode = '<osm><node changeset="CHANGESET" lat="LAT" lon="LNG">TAGS</node></osm>';
	        var tagTPL = '<tag k="KEY" v="VALUE"/>';
	        var tags = '';
	        var value;
	        newNode = newNode.replace('CHANGESET', osmSettingsService.getChangeset());
	        for (var property in node.tags) {
	            if (node.tags.hasOwnProperty(property)) {
	                value = node.tags[property];
	                if (value === undefined || value === null) {
	                    continue;
	                } else {
	                    tags = tags + tagTPL.replace('KEY', property).replace('VALUE', node.tags[property]);
	                }
	            }
	        }
	        newNode = newNode.replace('TAGS', tags);
	        newNode = newNode.replace('LNG', node.lng);
	        newNode = newNode.replace('LAT', node.lat);
	        return newNode;
	    };
	    this.serialiseXmlToString = function (xml) {
	        return this.serializer.serializeToString(xml);
	    };
	    this.getTagsFromChildren = function (element) {
	        var children, tags;
	        tags = {};
	        for (var i = 0; i < element.children.length; i++) {
	            children = element.children[i];
	            if (children.tagName !== 'tag') {
	                continue;
	            }
	            tags[children.getAttribute('k')] = children.getAttribute('v');
	        }
	        return tags;
	    };
	    this.getNameFromTags = function (element) {
	        var children;
	        for (var i = 0; i < element.children.length; i++) {
	            children = element.children[i];
	            if (children.tagName !== 'tag') {
	                continue;
	            }
	            if (children.getAttribute('k') === 'name') {
	                return children.getAttribute('v');
	            }
	        }
	    };
	    this.relationXmlToGeoJSON = function (relationID, relationXML) {
	        var self = this;
	        var features = [];
	        var relations = [];
	        var result = {
	            type: 'FeatureCollection',
	            properties: {
	                id: relationID
	            },
	            options: {},
	            members: [],
	            features: features,
	            relations: relations
	        };
	        var relation = relationXML.getElementById(relationID);
	        //bug: relation is null because firefox return an error
	        result.properties.visible = relation.getAttribute('visible');
	        result.properties.version = relation.getAttribute('version');
	        result.properties.changeset = relation.getAttribute('changeset');
	        result.properties.timestamp = relation.getAttribute('timestamp');
	        result.properties.user = relation.getAttribute('user');
	        result.properties.uid = relation.getAttribute('uid');
	        var m, i;
	        var child, node, properties, coordinates, feature, member, memberElement;
	        for (i = 0; i < relation.children.length; i++) {
	            m = relation.children[i];
	            if (m.tagName === 'member') {
	                //<member type="way" ref="148934766" role=""/>
	                member = {
	                    type: m.getAttribute('type'),
	                    ref: m.getAttribute('ref'),
	                    role: m.getAttribute('role')
	                };
	                result.members.push(member);
	                //get relationXML for this member
	                memberElement = relationXML.getElementById(m.getAttribute('ref'));
	                /*
	                <way id="148934766" visible="true" version="5" changeset="13626362" timestamp="2012-10-25T11:48:27Z" user="Metacity" uid="160224">
	                    <nd ref="1619955810"/>
	                    ...
	                    <tag k="access" v="yes"/>
	                    ...
	                </way>
	                    */
	                //get tags -> geojson properties
	                properties = self.getTagsFromChildren(memberElement);
	                member.name = properties.name;
	                if (memberElement.tagName === 'way') {
	                    coordinates = [];
	                    feature = {
	                        type: 'Feature',
	                        properties: properties,
	                        id: m.getAttribute('ref'),
	                        geometry: {
	                            type: 'LineString',
	                            coordinates: coordinates
	                        }
	                    };
	                    for (var j = 0; j < memberElement.children.length; j++) {
	                        child = memberElement.children[j];
	                        if (child.tagName === 'nd') {
	                            node = relationXML.getElementById(child.getAttribute('ref'));
	                            coordinates.push([parseFloat(node.getAttribute('lon')), parseFloat(node.getAttribute('lat'))]);
	                        }
	                    }
	                    features.push(feature);
	                } else if (memberElement.tagName === 'node') {
	                    feature = {
	                        type: 'Feature',
	                        properties: properties,
	                        id: m.getAttribute('ref'),
	                        geometry: {
	                            type: 'Point',
	                            coordinates: [parseFloat(memberElement.getAttribute('lon')), parseFloat(memberElement.getAttribute('lat'))]
	                        }
	                    };
	                    features.push(feature);
	                } else if (memberElement.tagName === 'relation') {
	                    member.tags = properties;
	                }
	            }
	        }
	        result.tags = self.getTagsFromChildren(relation);
	        return result;
	    };

	    this.encodeXML = function (str) {
	        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
	    };
	    this.relationGeoJSONToXml = function (relationGeoJSON) {
	        var i;
	        var pp = relationGeoJSON.properties;
	        var members = relationGeoJSON.members;
	        var settings = osmSettingsService;
	        var output = '<?xml version="1.0" encoding="UTF-8"?>\n';
	        output += '<osm version="0.6" generator="angular-osm 0.2" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">\n';
	        output += '  <relation id="' + pp.id + '" visible="' + pp.visible + '" ';
	        output += 'version="' + pp.version + '" ';
	        output += 'changeset="' + settings.getChangeset() + '" timestamp="' + new Date().toISOString() + '" ';
	        output += 'user="' + settings.getUserName() + '" uid="' + pp.uid + '">\n';

	        for (i = 0; i < members.length; i++) {
	            output += '    <member type="' + members[i].type + '" ';
	            output += 'ref="' + members[i].ref;
	            //role depends on the type of member
	            if (members[i].type === 'relation') {
	                output += '" role="' + members[i].role + '"/>\n';
	            } else {
	                output += '" role="' + members[i].role + '"/>\n';
	            }
	        }

	        var tags = relationGeoJSON.tags;
	        for (var k in tags) {
	            output += '    <tag k="' + k + '" v="' + this.encodeXML(tags[k]) + '"/>\n';
	        }
	        output += '  </relation>\n';
	        output += '</osm>';
	        return output;
	    };
	    this.sortRelationMembers = function (relationGeoJSON) {
	        //sort members
	        var members = relationGeoJSON.members;
	        var features = relationGeoJSON.features;
	        var sorted = [];
	        var f, i, m, j, k;
	        var first, last;
	        var insertBefore = function insertBefore(item) {
	            sorted.splice(0, 0, item);
	        };
	        var insertAfter = function insertAfter(item) {
	            sorted.push(item);
	        };
	        var getCoordinates = function getCoordinates(i) {
	            return features[i].geometry.coordinates;
	        };
	        var c, cfirst, clast, alreadySorted;
	        var foundFirst,
	            foundLast = false;
	        for (i = 0; i < members.length; i++) {
	            m = members[i];
	            if (m.type !== 'way') {
	                sorted.push(m);
	                continue;
	            }
	            //check if the member is already in
	            alreadySorted = false;
	            for (k = 0; k < sorted.length; k++) {
	                if (sorted[k].ref === m.ref) {
	                    alreadySorted = true;
	                }
	            }
	            if (alreadySorted) {
	                continue;
	            }
	            if (sorted.length === 0) {
	                sorted.push(m);
	                c = getCoordinates(i);
	                cfirst = c[0];
	                clast = c[c.length - 1];
	            }
	            //                    console.log('cfirst ' +cfirst);
	            //                    console.log('clast '+ clast);
	            foundFirst = foundLast = false;
	            for (j = 0; j < features.length; j++) {
	                f = features[j];
	                if (f.geometry.type !== 'LineString') {
	                    continue;
	                }
	                alreadySorted = false;
	                for (k = 0; k < sorted.length; k++) {
	                    if (sorted[k].ref === f.id) {
	                        alreadySorted = true;
	                    }
	                }
	                if (alreadySorted) {
	                    continue;
	                }

	                c = getCoordinates(j);
	                first = c[0];
	                last = c[c.length - 1];
	                if (cfirst[0] === last[0] && cfirst[1] === last[1]) {
	                    insertBefore(members[j]);
	                    cfirst = first;
	                    foundFirst = true;
	                    continue;
	                }
	                if (clast[0] === first[0] && clast[1] === first[1]) {
	                    insertAfter(members[j]);
	                    clast = last;
	                    foundLast = true;
	                    continue;
	                }
	                //weird; order of linestring coordinates is not stable
	                if (cfirst[0] === first[0] && cfirst[1] === first[1]) {
	                    insertBefore(members[j]);
	                    cfirst = last;
	                    foundFirst = true;
	                    continue;
	                }
	                if (clast[0] === last[0] && clast[1] === last[1]) {
	                    insertAfter(members[j]);
	                    clast = first;
	                    foundLast = true;
	                    continue;
	                }
	            }
	            if (!foundFirst && !foundLast) {
	                //cas du rond point ... ?
	                console.log('not found connected ways for ' + m.ref);
	                console.log(cfirst);
	                console.log(clast);
	            }
	        }
	        if (members.length === sorted.length) {
	            relationGeoJSON.members = sorted;
	            //Fix orders of features
	            //var features = relationGeoJSON.features;
	            var cache = { loaded: false };
	            var getFeatureById = function getFeatureById(id) {
	                if (!cache.loaded) {
	                    for (var i = 0; i < features.length; i++) {
	                        cache[features[i].id] = features[i];
	                    }
	                }
	                return cache[id];
	            };
	            relationGeoJSON.features = [];
	            for (var l = 0; l < sorted.length; l++) {
	                relationGeoJSON.features.push(getFeatureById(sorted[l].ref));
	            }
	            //feature order fixed
	        } else {
	                console.error('can t sort this relation');
	            }
	    };
	    this.getNodesInJSON = function (xmlNodes, flatProperties) {
	        osmSettingsService.setNodes(xmlNodes);
	        var options = {};
	        if (flatProperties !== undefined) {
	            options.flatProperties = flatProperties;
	        }
	        return osmtogeojson(xmlNodes, options);
	    };
	    this.yqlJSON = function (featuresURL) {
	        var deferred = $q.defer();
	        var url, config;
	        config = {
	            params: {
	                q: 'select * from json where url=\'' + featuresURL + '\';',
	                format: 'json'
	            }
	        };
	        url = 'http://query.yahooapis.com/v1/public/yql';
	        $http.get(url, config).then(function (data) {
	            if (data.data.query.results === null) {
	                deferred.resolve([]);
	            } else {
	                deferred.resolve(data.data.query.results.json);
	            }
	        }, function (error) {
	            deferred.reject(error);
	        });
	        return deferred.promise;
	    };
	    this.getElementTypeFromFeature = function (feature) {
	        var gtype = feature.geometry.type;
	        if (gtype === 'LineString') {
	            return 'way';
	        } else if (gtype === 'Point') {
	            return 'node';
	        } else {
	            console.error('not supported type ' + gtype);
	        }
	    };
	}
	exports.default = osmUtilsService;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _overpass = __webpack_require__(25);

	var _overpass2 = _interopRequireDefault(_overpass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmOverpassModule = angular.module('osm.overpass', ['osm.settings']).factory('osmOverpassAPI', _overpass2.default);

	exports.default = osmOverpassModule;

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});


	/**
	 * @ngdoc service
	 * @name overpassAPI
	 * @param  {any} $http
	 * @param  {any} $q
	 * @param  {any} osmSettingsService
	 */
	osmOverpassAPI.$inject = ['$http', '$q', 'osmSettingsService'];
	function osmOverpassAPI($http, $q, osmSettingsService) {
	    var service = {
	        overpass: function overpass(query) {
	            var url = osmSettingsService.getOverpassAPI();
	            var deferred = $q.defer();
	            var self = this;
	            var headers = { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' };
	            $http.post(url, 'data=' + encodeURIComponent(query), { headers: headers }).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (data) {
	                deferred.reject(data);
	            });
	            return deferred.promise;
	        },
	        overpassToGeoJSON: function overpassToGeoJSON(query, filter) {
	            var deferred = $q.defer();
	            var features = [];
	            var relations = [];
	            var result = {
	                type: 'FeatureCollection',
	                features: features,
	                relations: relations
	            };
	            if (filter === undefined) {
	                filter = function filter() {};
	            }
	            this.overpass(query).then(function (data) {
	                //TODO check if data is XML or JSON, here it's JSON
	                var node, feature, coordinates;
	                var cache = { loaded: false };
	                function getNodeById(id) {
	                    if (!cache.loaded) {
	                        var tmp;
	                        for (var i = 0; i < data.elements.length; i++) {
	                            tmp = data.elements[i];
	                            cache[tmp.id] = tmp;
	                        }
	                    }
	                    return cache[id];
	                };
	                for (var i = 0; i < data.elements.length; i++) {
	                    node = data.elements[i];
	                    if (node.type === 'node') {
	                        feature = {
	                            type: 'Feature',
	                            properties: node.tags,
	                            id: node.id,
	                            geometry: {
	                                type: 'Point',
	                                coordinates: [node.lon, node.lat]
	                            }
	                        };
	                        if (!filter(feature)) {
	                            features.push(feature);
	                        }
	                    } else if (node.type === 'way') {
	                        coordinates = [];
	                        feature = {
	                            type: 'Feature',
	                            properties: node.tags,
	                            id: node.id,
	                            geometry: {
	                                type: 'LineString',
	                                coordinates: coordinates
	                            }
	                        };
	                        for (var j = 0; j < node.nodes.length; j++) {
	                            coordinates.push([getNodeById(node.nodes[j]).lon, getNodeById(node.nodes[j]).lat]);
	                        }
	                        if (!filter(feature)) {
	                            features.push(feature);
	                        }
	                    } else if (node.type === 'relation') {
	                        result.relations.push({
	                            ref: node.id,
	                            tags: node.tags,
	                            type: 'relation',
	                            members: node.members
	                        });
	                    }
	                }
	                deferred.resolve(result);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        }
	    };
	    return service;
	}

	exports.default = osmOverpassAPI;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _taginfo = __webpack_require__(27);

	var _taginfo2 = _interopRequireDefault(_taginfo);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var osmTagInfoModule = angular.module('osm.taginfo', []).factory('osmTagInfoAPI', _taginfo2.default);

	exports.default = osmTagInfoModule;

/***/ },
/* 27 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	osmTagInfoAPI.$inject = ['$http', '$q'];
	/**
	 * @ngdoc service
	 * @name osmTagInfoAPI
	 * @description integration of taginfo
	 * http://taginfo.openstreetmap.org/taginfo/apidoc
	 * @param  {any} $http
	 * @param  {any} $q
	 */
	function osmTagInfoAPI($http, $q) {
	    var service = {
	        get: function get(method, config) {
	            var deferred = $q.defer();
	            $http.get('https://taginfo.openstreetmap.org/api/4' + method, config).then(function (data) {
	                deferred.resolve(data.data);
	            }, function (error) {
	                deferred.reject(error);
	            });
	            return deferred.promise;
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key matches this query (substring match, optional).
	         */
	        getKeyCombinations: function getKeyCombinations(params) {
	            return this.get('/key/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyDistributionNodes: function getKeyDistributionNodes(params) {
	            return this.get('/key/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyDistributionWays: function getKeyDistributionWays(params) {
	            return this.get('/key/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	         * key — Tag key (required).
	         */
	        getKeyStats: function getKeyStats(params) {
	            return this.get('/key/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyValues
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            lang — Language for description (optional, default: 'en').
	            query — Only show results where the value matches this query (substring match, optional).
	         */
	        getKeyValues: function getKeyValues(params) {
	            return this.get('/key/values', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeyWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	         */
	        getKeyWikiPages: function getKeyWikiPages(params) {
	            return this.get('/key/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysAll: function getKeysAll(params) {
	            return this.get('/keys/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show keys matching this query (substring match, optional).
	         */
	        getKeysWikiPages: function getKeysWikiPages(params) {
	            return this.get('/keys/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getKeysWithoutWikiPage
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            english — Check for key wiki pages in any language (0, default) or in the English language (1).
	            min_count — How many tags with this key must there be at least to show up here? (default 10000).
	            query — Only show results where the key matches this query (substring match, optional).
	         */
	        getKeysWithoutWikiPage: function getKeysWithoutWikiPage(params) {
	            return this.get('/keys/without_wiki_page', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationRoles
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the role matches this query (substring match, optional).
	            rtype — Relation type (required).
	         */
	        getRelationRoles: function getRelationRoles(params) {
	            return this.get('/relation/roles', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationStats: function getRelationStats(params) {
	            return this.get('/relation/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            rtype — Relation type (required).
	         */
	        getRelationWikiPages: function getRelationWikiPages(params) {
	            return this.get('/relation/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getRelationsAll
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show results where the relation type matches this query (substring match, optional).
	         */
	        getRelationsAll: function getRelationsAll(params) {
	            return this.get('/relations/all', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyAndValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyAndValue: function getSearchByKeyAndValue(params) {
	            return this.get('/search/by_key_and_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByKeyword
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByKeyword: function getSearchByKeyword(params) {
	            return this.get('/search/by_keyword', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByRole
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Role to search for (substring search, required).
	         */
	        getSearchByRole: function getSearchByRole(params) {
	            return this.get('/search/by_role', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSearchByValue
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Value to search for (substring search, required).
	         */
	        getSearchByValue: function getSearchByValue(params) {
	            return this.get('/search/by_value', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteInfo
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteInfo: function getSiteInfo(params) {
	            return this.get('/site/info', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getSiteSources
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getSiteSources: function getSiteSources(params) {
	            return this.get('/site/sources', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagCombinations
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            query — Only show results where the other_key or other_value matches this query (substring match, optional).
	            value — Tag value (required).
	         */
	        getTagCombinations: function getTagCombinations(params) {
	            return this.get('/tag/combinations', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagDistributionNodes
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagDistributionNodes: function getTagDistributionNodes(params) {
	            return this.get('/tag/distribution/nodes', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagDistributionWays
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagDistributionWays: function getTagDistributionWays(params) {
	            return this.get('/tag/distribution/ways', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagStats
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagStats: function getTagStats(params) {
	            return this.get('/tag/stats', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagWikiPages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            key — Tag key (required).
	            value — Tag value (required).
	         */
	        getTagWikiPages: function getTagWikiPages(params) {
	            return this.get('/tag/wiki_pages', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getTagsPopular
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	            query — Only show tags matching this query (substring match in key and value, optional).
	         */
	        getTagsPopular: function getTagsPopular(params) {
	            return this.get('/tags/popular', { params: params });
	        },
	        /**
	         * @ngdoc method
	         * @name getWikiLanguages
	         * @methodOf osm.taginfo.osmTagInfoAPI
	         * @param {any} params
	           param: No params
	         */
	        getWikiLanguages: function getWikiLanguages(params) {
	            return this.get('/wiki/languages', { params: params });
	        }
	    };
	    return service;
	}
	exports.default = osmTagInfoAPI;

/***/ }
]);