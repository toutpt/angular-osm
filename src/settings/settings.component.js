


/**
 * @ngdoc service
 * @name osmSettingsService
 * @description provide service to access to settings
 * @param  {any} $localStorage
 */
osmSettingsService.$inject = ['$localStorage'];
function osmSettingsService ($localStorage) {
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
        getUserName: function(){
            return this.localStorage.userName;
        },
        setUserName: function(username){
            this.localStorage.userName = username;
        },
        getUserID: function(){
            return this.localStorage.userID;
        },
        setUserID: function(userid){
            this.localStorage.userID = userid;
        },
        getCredentials: function(){
            return this.localStorage.credentials;
        },
        setCredentials: function(credentials){
            this.localStorage.credentials = credentials;
        },
        getOSMAPI: function(){
            if (this.localStorage.osmAPI){
                return this.localStorage.osmAPI;
            }else{
                return 'http://api.openstreetmap.org/api';
            }
        },
        setOSMAPI: function(osmAPI){
            this.localStorage.osmAPI = osmAPI;
        },
        getOverpassAPI: function(){
            if (this.localStorage.overpassAPI){
                return this.localStorage.overpassAPI;
            }else{
                //return 'http://api.openstreetmap.org/api';
                return 'http://overpass-api.de/api/interpreter';
            }
        },
        setOverpassAPI: function(overpassAPI){
            this.localStorage.overpassAPI = overpassAPI;
        },
        getNodes: function(){
            return this.localStorage.nodes;
        },
        setNodes: function(nodes){
            this.localStorage.nodes = nodes;
        },
        getChangeset: function(){
            return this.localStorage.changeset;
        },
        setChangeset: function(changeset){
            this.localStorage.changeset = changeset;
        },
        getOsmAuth: function () {
            return this.localStorage.osmAuth;
        },
        setOsmAuth: function (options) {
            return this.localStorage.osmAuth = options;
        }
    };
}

export default osmSettingsService;
