
/**
 * @ngdoc service
 * @name osmSettingsService
 * @description provide service to access to settings
 * @param  {any} $localStorage
 */
osmSettingsService.$inject = ['$localStorage'];
function osmSettingsService ($localStorage) {

    this.localStorage = $localStorage.$default({
        userName: '',
        userID: '',
        credentials: '',
        changeset: ''
    });
    this.getUserName = function () {
        return this.localStorage.userName;
    };
    this.setUserName = function (username) {
        this.localStorage.userName = username;
    };
    this.getUserID = function () {
        return this.localStorage.userID;
    };
    this.setUserID = function (userid) {
        this.localStorage.userID = userid;
    };
    this.getCredentials = function () {
        return this.localStorage.credentials;
    };
    this.setCredentials = function (credentials) {
        this.localStorage.credentials = credentials;
    };
    this.getChangeset = function () {
        return this.localStorage.changeset;
    };
    this.setChangeset = function (changeset) {
        this.localStorage.changeset = changeset;
    };
    this.getOsmAuth = function () {
        return this.localStorage.osmAuth;
    };
    this.setOsmAuth = function (options) {
        this.localStorage.osmAuth = options;
    };
}

export default osmSettingsService;
