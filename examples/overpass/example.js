(function() {
    angular.module('example', ['osm.overpass'])
    .controller('ExampleCtrl', ExampleCtrl);
    
    function ExampleCtrl (osmOverpassAPI) {
        var $ctrl = this;
        this.query = '[out:json];node[amenity=drinking_water]\n'
        this.query += '(41.88403598409956,12.479889392852781,41.896191943449324,12.499651908874512);out;';
        this.doQuery = function () {
            this.loading = true;
            this.data = undefined;
            osmOverpassAPI.overpass(this.query)
            .then(function (data) {
                $ctrl.loading = false;
                $ctrl.data = data;
            }, function (error) {
                $ctrl.error = error;
                $ctrl.loading = false;
            });
        };
        this.doQueryToGeoJSON = function () {
            this.loading = true;
            this.data = undefined;
            osmOverpassAPI.overpassToGeoJSON(this.query)
            .then(function (data) {
                $ctrl.loading = false;
                $ctrl.data = data;
            }, function (error) {
                $ctrl.error = error;
                $ctrl.loading = false;
            });
        };
    }

})();