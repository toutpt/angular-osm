/**
 * @module osm
 */

import oauth from './oauth/oauth';
import base64 from './base64/base64';
import api from './api/api';
import overpass from './overpass/overpass';
import taginfo from './taginfo/taginfo';
import nominatim from './nominatim/nominatim';
import togeojson from './togeojson/togeojson';
import osrm from './osrm/osrm';

angular.module('osm', [
    api.name,
    base64.name,
    oauth.name,
    overpass.name,
    taginfo.name,
    nominatim.name,
    togeojson.name,
    osrm.name
]);
export default angular.module('osm');
