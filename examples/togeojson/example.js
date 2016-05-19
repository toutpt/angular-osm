(function() {
    angular.module('example', ['osm.togeojson', 'angular-leaflet', 'osm.api'])
    .controller('ExampleCtrl', ExampleCtrl);

    function ExampleCtrl ($scope, $http, osmtogeojson, osmAPI, leafletService) {
        leafletService.settings.imagePath = 'http://cdn.leafletjs.com/leaflet/v0.7.7/images';
        var $ctrl = this;
        $ctrl.osmtogeojson = osmtogeojson;
        $ctrl.togeojson = function () {
            $ctrl.data = osmtogeojson.togeojson(JSON.parse($ctrl.osmdata));
        };
        $ctrl.onData = function onData(data) {
            $ctrl.loading = false;
            delete $ctrl.data;
            $ctrl.data = osmtogeojson.togeojson(data);
        };
        $ctrl.onError = function onError(error) {
            $ctrl.loading = false;
            $ctrl.error = error;
        };
        
        $ctrl.onMapInitialized = function(map) {
            $ctrl.leaflet = map;
            $ctrl.leaflet.setZoom(18);
            setBBox();
            leafletService.on('move', setBBox, map, $scope);
            leafletService.on('zoomend', setBBox, map, $scope);
        };
        $ctrl.getMapGeoJson = getMapGeoJson;
        function setBBox() {
            var bounds = $ctrl.leaflet.getBounds();
            $ctrl.bbox = bounds.toBBoxString();
        }
        function getMapGeoJson() {
            osmAPI.getMap($ctrl.bbox).then($ctrl.onData, $ctrl.onError)
            .then(function () {
                createOrUpdateGeojsonLayer();
            });
        }
        $http.get('getMap.json').then(function (data) {
            $ctrl.osmdata = JSON.stringify(data.data, null, 2);
        });
        function createOrUpdateGeojsonLayer() {
            if ($ctrl.geojsonlayer && $ctrl.leaflet) {
                if ($ctrl.leaflet.hasLayer($ctrl.geojsonlayer)) {
                    $ctrl.leaflet.removeLayer($ctrl.geojsonlayer);
                }
                delete $ctrl.geojsonlayer;
            }
            if ($ctrl.data && $ctrl.leaflet) {
                $ctrl.geojsonlayer = L.geoJson($ctrl.data).addTo($ctrl.leaflet);
            }
        }

    }

})();