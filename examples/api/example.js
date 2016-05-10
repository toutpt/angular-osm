(function() {
    angular.module('example', ['osm.api'])
    .controller('ExampleCtrl', ExampleCtrl);
    
    function ExampleCtrl (osmAPI, osmSettingsService) {
        var $ctrl = this;
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