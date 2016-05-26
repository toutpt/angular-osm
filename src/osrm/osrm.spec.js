'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */

ngDescribe({
    modules: 'osm.osrm',
    inject: ['osrmAPI', '$httpBackend', '$rootScope'],
    tests: function (deps) {
        it('should have all API services of osrm', function() {
            var api = deps.osrmAPI;
            var methods = [
                'nearest', 'route', 'table', 'trip', 'match'
            ];
            methods.forEach(function (method) {
                expect(api[method]).not.toBeUndefined();
            });
        });
        it('should answer to get', function() {
            var url = 'http://router.project-osrm.org/service/version/profile/coordinates?option1=1';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.get('service', 'version', 'profile', 'coordinates', {option1: 1}).then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to get with coordinates an array', function() {
            var url = 'http://router.project-osrm.org/service/version/profile/coordinate1;coordinate2';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.get('service', 'version', 'profile', ['coordinate1', 'coordinate2']).then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to nearest', function() {
            var url = 'http://router.project-osrm.org/nearest/v1/profile/coordinates';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.nearest('profile', 'coordinates').then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to route', function() {
            var url = 'http://router.project-osrm.org/route/v1/profile/coordinates';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.route('profile', 'coordinates').then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to table', function() {
            var url = 'http://router.project-osrm.org/table/v1/profile/coordinates';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.table('profile', 'coordinates').then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to match', function() {
            var url = 'http://router.project-osrm.org/match/v1/profile/coordinates';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.match('profile', 'coordinates').then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to trip', function() {
            var url = 'http://router.project-osrm.org/trip/v1/profile/coordinates';
            deps.$httpBackend.expectGET(url).respond(200, {key: 'value'});
            deps.osrmAPI.trip('profile', 'coordinates').then(function (data) {
                expect(data.data.key).toBe('value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
    }
});
