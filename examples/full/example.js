(function() {
    angular.module('example', ['osm', 'angular-leaflet'])
    .config(config)
    .controller('ExampleCtrl', ExampleCtrl);
    function config(osmAuthServiceProvider, osmAPIProvider) {
        /**
         * oauth dependes on URL:
         */
        var OSM_AUTH = {
            'master.apis.dev': {
                url: 'http://master.apis.dev.openstreetmap.org',
                oauth_consumer_key: 'q6ufd5sRaJrKTUs5wKrxezq9fkwIP83ulmnUsZHH',
                oauth_secret: 'C3CDCY0FRERp8QVxl8MjZv1sYuv7yAUSP4pDFwLt'
            },
            'api06.dev': {
                url: 'http://api06.dev.openstreetmap.org',
            },
            'www': {
                url: 'http://www.openstreetmap.org',
                oauth_consumer_key: 'Y4mIaH1rx9qqjYFo9mjDEc7rArpP7rFkj1hLl3Mj',
                oauth_secret: 'EkXrocMrHbtSQ3r9VH0D7KH6oAEhfJ6elImVRBzB'
            }
        };
        osmAPIProvider.options = {
//            url: 'http://api06.dev.openstreetmap.org/api'
//            url: 'http://www.openstreetmap.org/api'
            url: 'http://master.apis.dev.openstreetmap.org/api'
        };
        osmAuthServiceProvider.options = OSM_AUTH['master.apis.dev'];
    }
    function ExampleCtrl ($scope, osmAPI, osmAuthService, leafletService) {
        var $ctrl = this;
        $ctrl.bbox = '-1.5590554475784302,47.21250296746172,-1.5530633926391602,47.21564395777462';
        $ctrl.osmAPI = osmAPI;
        $ctrl.osmAuth = osmAuthService;
        this.loading = false;
        $ctrl.doLogin = function () {
            osmAuthService.authenticate().then(onUserChange);
        };

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

        function onUserChange(data) {
            if (osmAuthService.authenticated()) {
                $ctrl.authenticated = true;
                osmAPI.setAuthAdapter(osmAuthService);
                osmAPI.getUserDetails().then(function (user) {
                    $ctrl.data = user;
                    $ctrl.user = user.osm.user;
                });
            } else {
                $ctrl.authenticated = false;
                delete $ctrl.data;
                delete $ctrl.user;
            }
        }
        onUserChange();
        $ctrl.logout = function () {
            osmAuthService.logout();
            onUserChange();
        };
        $ctrl.onData = function onData(data) {
            $ctrl.loading = false;
            delete $ctrl.data;
            $ctrl.data = data;
        };
        $ctrl.onError = function onError(error) {
            $ctrl.loading = false;
            $ctrl.error = error;
        };
        $ctrl.closeError = function () {
            delete $ctrl.error;
        };

    }

})();