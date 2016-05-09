import oauth from './oauth/oauth';

angular.module('osm', [
    'base64',
    'ngStorage',
    'osm.settings',
    'osm.api',
    'osm.overpass',
    'osm.taginfo',
    oauth.name
]);
