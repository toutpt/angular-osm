(function() {
    angular.module('example', ['osm.api', 'osm.base64', 'angular-leaflet'])
    .config(config)
    .controller('ExampleCtrl', ExampleCtrl);
    function config(osmAPIProvider) {
        osmAPIProvider.options = {
//            url: 'http://api06.dev.openstreetmap.org/api'
            url: 'http://www.openstreetmap.org/api'
//            url: 'http://master.apis.dev.openstreetmap.org/api'
        };
    }

    function ExampleCtrl ($scope, osmAPI, osmBase64, osmSettingsService, leafletService) {
        var $ctrl = this;
        $ctrl.osmAPI = osmAPI;
        osmAPI.setAuthAdapter(osmBase64);
        $ctrl.bbox = '';

        $ctrl.onMapInitialized = function(map) {
            $ctrl.leaflet = map;
            $ctrl.leaflet.setZoom(18);
            setBBox();
            leafletService.on('move', setBBox, map, $scope);
            leafletService.on('zoomend', setBBox, map, $scope);
        };

        function setBBox() {
            var bounds = $ctrl.leaflet.getBounds();
            $ctrl.bbox = bounds.toBBoxString();
        }
        var credentials = osmBase64.getCredentials();
        function validateCredentials() {
            osmAPI.getUserDetails().then(function (data) {
                if (data) {
                    $ctrl.username = data.osm.user._display_name;
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
        this.doLogin = function () {
            osmBase64.setCredentials($ctrl.login, $ctrl.password);
            validateCredentials();
        };
        this.doLogout = function () {
            osmBase64.clearCredentials();
            validateCredentials();
        };
        if (credentials) {
            validateCredentials();
        }
    }

})();