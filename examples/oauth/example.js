(function() {
    angular.module('example', ['osm.oauth'])
    .config(config)
    .controller('ExampleCtrl', ExampleCtrl);
    function config(osmAuthServiceProvider) {
        osmAuthServiceProvider.options = {
            oauth_consumer_key: 'Y4mIaH1rx9qqjYFo9mjDEc7rArpP7rFkj1hLl3Mj',
            oauth_secret: 'EkXrocMrHbtSQ3r9VH0D7KH6oAEhfJ6elImVRBzB'
        };
    }
    function ExampleCtrl (osmAuthService) {
        var $ctrl = this;
        this.options = {};
        this.login = function () {
            //osmAuthService.options(this.options);
            osmAuthService.authenticate().then(update);
        };
        function onUserDetails(res) {
            $ctrl.data = res;
        }
        function onError(err) {
            $ctrl.err = err;
        }
        function update() {
            if (osmAuthService.authenticated()) {
                $ctrl.authenticated = true;
                osmAuthService.xhr({
                    method: 'GET',
                    path: '/api/0.6/user/details'
                }).then(onUserDetails, onError);
            } else {
                $ctrl.authenticated = false;
            }
        }
    }

})();