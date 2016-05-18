import angular from 'angular';

import oauth from './oauth/oauth';
import api from './api/api';
import overpass from './overpass/overpass';
import taginfo from './taginfo/taginfo';
import settings from './settings/settings';
import nominatim from './nominatim/nominatim';
import togeojson from './togeojson/togeojson';

angular.module('osm', [
    settings.name,
    api.name,
    overpass.name,
    taginfo.name,
    oauth.name,
    nominatim.name,
    togeojson.name
]);
