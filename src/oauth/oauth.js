/**
 * @module osm.oauth
 */
import osmAuthService from './oauth.service';
import osmAPIModule from '../api/api';
import osmx2jsModule from '../x2js/x2js';

var osmOAuthModule = angular.module('osm.oauth', [
    osmAPIModule.name,
    osmx2jsModule.name
])
.provider('osmAuthService', function osmAuthServiceProvider () {
    this.options = {};

    this.$get = function osmAuthServiceFactory($q, osmx2js) {
        return new osmAuthService($q, osmx2js, this.options);
    };
    this.$get.$inject = ['$q', 'osmx2js'];
});

export default osmOAuthModule;
