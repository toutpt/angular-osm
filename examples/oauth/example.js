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
    function ExampleCtrl (osmAuthService, osmAPI) {
        var $ctrl = this;
        osmAPI.setAuthAdapter(osmAuthService);
        this.options = {};
        this.login = function () {
            //osmAuthService.options(this.options);
            osmAuthService.authenticate().then(update);
        };
        this.logout = function() {
            osmAuthService.logout();
            update();
        };
        function onUserDetails(res) {
            $ctrl.data = res;
            $ctrl.userDetails = res;
        }
        function onError(err) {
            $ctrl.err = err;
        }
        function update() {
            if (osmAuthService.authenticated()) {
                $ctrl.authenticated = true;
                osmAPI.getUserDetails().then(onUserDetails, onError);
            } else {
                $ctrl.authenticated = false;
                onUserDetails();
            }
        }
        update();
    }

})();