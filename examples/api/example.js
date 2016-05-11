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
        function onData(data) {
            $ctrl.loading = false;
            delete $ctrl.data;
            delete $ctrl.data_str;
            if (typeof data === 'object') {
                $ctrl.data = data;
            } else {
                $ctrl.data_str = data;
            }
        }
        function onError(error) {
            $ctrl.loading = false;
            $ctrl.error = error;
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
        this.getUserDetails = function () {
            this.loading = true;
            osmAPI.getUserDetails().then(onData, onError);
        };
        $ctrl.bbox = '11.5430,48.144,11.5435,48.145';
        this.getMap = function () {
            this.loading = true;
            osmAPI.getMap($ctrl.bbox).then(onData, onError);
        };
        this.getNotes = function () {
            this.loading = true;
            osmAPI.getNotes($ctrl.bbox, $ctrl.format).then(onData, onError);
        }
    }

})();