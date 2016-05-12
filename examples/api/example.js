(function() {
    angular.module('example', ['osm.api'])
    .config(config)
    .controller('ExampleCtrl', ExampleCtrl);
    function config(osmAPIProvider) {
        osmAPIProvider.options = {
//            url: 'http://api06.dev.openstreetmap.org/api'
//            url: 'http://www.openstreetmap.org/api'
            url: 'http://master.apis.dev.openstreetmap.org/api'
        };
    }

    function ExampleCtrl (osmAPI, osmSettingsService) {
        var $ctrl = this;
        $ctrl.osmAPI = osmAPI;
        $ctrl.bbox = '-1.5590554475784302,47.21250296746172,-1.5530633926391602,47.21564395777462';
        var credentials = osmAPI.getCredentials();
        function validateCredentials() {
            osmAPI.validateCredentials().then(function (isValid) {
                if (isValid) {
                    $ctrl.username = osmSettingsService.getUserName();
                } else {
                    delete $ctrl.username;
                }
            });
        }
        $ctrl.onData = function onData(data) {
            $ctrl.loading = false;
            delete $ctrl.data;
            $ctrl.data = data;
        };
        $ctrl.onError = function onError(error) {
            $ctrl.loading = false;
            $ctrl.error = error;
        };
        if (credentials) {
            validateCredentials();
        }
        this.doLogin = function () {
            osmAPI.setCredentials($ctrl.login, $ctrl.password);
            validateCredentials();
        };
        this.doLogout = function () {
            osmAPI.clearCredentials();
            validateCredentials();
        };
    }

})();