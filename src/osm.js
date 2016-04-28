(function () {
    'use strict';

    angular.module('osm', [
        'base64',
        'ngStorage',
        'osm.settings',
        'osm.api',
        'osm.overpass',
        'osm.taginfo'
    ]);

})();