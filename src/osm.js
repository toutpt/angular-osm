import angular from 'angular';
import base64 from 'angular-base64';
import ngstorage from 'ngstorage';
import oauth from './oauth/oauth';
import api from './api/api';
import overpass from './overpass/overpass';
import taginfo from './taginfo/taginfo';
import settings from './settings/settings';

angular.module('osm', [
    base64.name,
    ngstorage.name,
    settings.name,
    api.name,
    overpass.name,
    taginfo.name,
    oauth.name
]);
