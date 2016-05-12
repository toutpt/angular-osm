import osmOverpassAPI from './overpass.service';
import osmSettingsModule from '../settings/settings';

var osmOverpassModule = angular.module('osm.overpass', [osmSettingsModule.name])
.factory('osmOverpassAPI', osmOverpassAPI)
.provider('osmOverpassAPI', function osmOverpassAPIProvider () {
    this.options = {
        url: 'http://overpass-api.de/api/interpreter'
    };
    this.$get = function osmOverpassAPIFactory($http, $q, osmSettingsService) {
        return new osmOverpassAPI($http, $q, osmSettingsService, this.options);
    };
    this.$get.$inject = ['$http', '$q', 'osmSettingsService'];
});

export default osmOverpassModule;
