(function() {
    angular.module('example', ['osm.taginfo'])
    .controller('ExampleCtrl', ExampleCtrl);
    
    function ExampleCtrl (osmTagInfoAPI) {
        var $ctrl = this;
        this.loading = false;
        this.key = 'amenity';
        function attach(api, params) {
            $ctrl[api] = function () {
                $ctrl.loading = true;
                $ctrl.data = undefined;
                osmTagInfoAPI[api](params)
                .then(function (data) {
                    $ctrl.data = data;
                    $ctrl.loading = false;
                }, function (error) {
                    $ctrl.error = error;
                    $ctrl.loading = false;
                });
            };
        }
        [
            'getKeyValues',
            'getKeyStats',
            'getKeyCombinations',
            'getKeyDistributionWays'
        ].forEach(function (api) {
            attach(api, {key: $ctrl.key});
        });
        [
            'getTagsPopular',
            'getSearchByValue',
            'getSearchByRole',
            'getSearchByKeyword',
            'getSearchByKeyAndValue',
            'getRelationsAll',
            'getKeysAll'
        ].forEach(function (api) {
            attach(api, {query: $ctrl.query});
        });
    }

})();