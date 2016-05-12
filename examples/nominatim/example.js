(function() {
    angular.module('example', ['osm.nominatim'])
    .controller('ExampleCtrl', ExampleCtrl);
    
    function ExampleCtrl (osmNominatim) {
        var $ctrl = this;
        $ctrl.osmNominatim = osmNominatim;
        $ctrl.onData = function onData(data) {
            $ctrl.loading = false;
            delete $ctrl.data;
            $ctrl.data = data.data;
        };
        $ctrl.onError = function onError(error) {
            $ctrl.loading = false;
            $ctrl.error = error;
        };
        //example
        $ctrl.query_search = 'Nantes';
        $ctrl.query_reverse = {
            lat: 52.5487429714954,
            lon: -1.81602098644987,
            zoom:18,
            addressdetails: 1
        };
        $ctrl.query_lookup = {
            osm_ids: 'R146656,W104393803,N240109189'
        };

    }

})();