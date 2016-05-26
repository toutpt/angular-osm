(function() {
    angular.module('example', ['osm.osrm', 'angular-leaflet'])
    .controller('ExampleCtrl', ExampleCtrl)
    .config(config);

    function config(leafletServiceProvider) {
        leafletServiceProvider.settings = {
            imagePath: 'http://cdn.leafletjs.com/leaflet/v0.7.7/images'
        };
    }
    function ExampleCtrl ($scope, osrmAPI, leafletService) {
        var $ctrl = this;
        this.loading = false;
        $ctrl.api = osrmAPI;
        $ctrl.profile = 'car';
        $ctrl.nearestNumber = 1;
        $ctrl.coordinates = [];
        $ctrl.onMapInitialized = function(map) {
            $ctrl.leaflet = map;
            $ctrl.leaflet.setZoom(18);
            $ctrl.addCoordinate();
        };
        var markers = [];
        $ctrl.addCoordinate = function () {
            var center = $ctrl.leaflet.getCenter();
            var coordinate = `${center.lng},${center.lat}`;
            $ctrl.coordinates.push(coordinate);
            markers.push(
                L.marker([center.lat, center.lng])
                .addTo($ctrl.leaflet)
            );
            
        };
        $ctrl.resetCoordinates = function () {
            $ctrl.coordinates = [];
            markers.forEach(function (marker) {
                $ctrl.leaflet.removeLayer(marker);
            });
            markers = [];
            if ($ctrl.routegeo) {
                $ctrl.leaflet.removeLayer($ctrl.routegeo);
            }
        };
        $ctrl.nearest = function () {
            osrmAPI.nearest($ctrl.profile, $ctrl.coordinates, $ctrl.nearestNumber)
            .then($ctrl.onData, $ctrl.onError);
        };
        $ctrl.routeOptions = {
            alternatives: false,
            steps: false,
            annotate: false,
            overview: 'simplified',
            continue_straight: 'default',
            geometries: 'geojson'
        };
        $ctrl.route = function () {
            osrmAPI.route($ctrl.profile, $ctrl.coordinates, $ctrl.routeOptions)
            .then($ctrl.onData, $ctrl.onError)
            .then(setGeoJSON);
        };
        $ctrl.table = function () {
            osrmAPI.table($ctrl.profile, $ctrl.coordinates)
            .then($ctrl.onData, $ctrl.onError);
        };
        $ctrl.trip = function () {
            var options = angular.copy($ctrl.routeOptions);
            delete options.alternatives;
            delete options.continue_straight;
            osrmAPI.trip($ctrl.profile, $ctrl.coordinates, options)
            .then($ctrl.onData, $ctrl.onError);
        };
        $ctrl.onData = function onData(data) {
            $ctrl.loading = false;
            delete $ctrl.data;
            $ctrl.data = data;
            return data;
        };
        $ctrl.onError = function onError(error) {
            $ctrl.loading = false;
            $ctrl.error = error;
        };
        function setGeoJSON(data) {
            if ($ctrl.routegeo) {
                $ctrl.leaflet.removeLayer($ctrl.routegeo);
            }
            if (Array.isArray(data.data.routes)) {
                data.data.routes.forEach(function (route) {
                    if (!route.geometry) {
                        return data;
                    }
                    $ctrl.routegeo = L.geoJson(route.geometry).addTo($ctrl.leaflet);
                    $ctrl.leaflet.fitBounds($ctrl.routegeo.getBounds());
                });
            }
            return data;
        }
    }

})();