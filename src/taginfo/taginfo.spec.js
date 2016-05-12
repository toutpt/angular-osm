'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */


ngDescribe({
    modules: 'osm.taginfo',
    inject: ['osmTagInfoAPI', '$httpBackend', '$rootScope'],
    mocks: {
    },
    tests: function (deps) {
        it('should have all API methods of taginfo', function() {
            var taginfo = deps.osmTagInfoAPI;
            var methods = [
                'getKeyCombinations',
                'getKeyDistributionNodes',
                'getKeyDistributionWays',
                'getKeyStats',
                'getKeyValues',
                'getKeyWikiPages',
                'getKeysAll',
                'getKeysWikiPages',
                'getKeysWithoutWikiPage',
                'getRelationRoles',
                'getRelationStats',
                'getRelationWikiPages',
                'getRelationsAll',
                'getSearchByKeyAndValue',
                'getSearchByKeyword',
                'getSearchByRole',
                'getSearchByValue',
                'getSiteInfo',
                'getSiteSources',
                'getTagCombinations',
                'getTagDistributionNodes',
                'getTagDistributionWays',
                'getTagStats',
                'getTagWikiPages',
                'getTagsPopular',
                'getWikiLanguages'
            ];
            methods.forEach(function (method) {
                expect(taginfo[method]).not.toBeUndefined();
            });
        });
        it('should answer to getKeyCombinations', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/key/combinations';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'combination'}});
            deps.osmTagInfoAPI.getKeyCombinations().then(function (data) {
                expect(data.data.key).toBe('combination');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeyDistributionNodes', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/key/distribution/nodes';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'distribution'}});
            deps.osmTagInfoAPI.getKeyDistributionNodes().then(function (data) {
                expect(data.data.key).toBe('distribution');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeyDistributionWays', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/key/distribution/ways';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'distribution'}});
            deps.osmTagInfoAPI.getKeyDistributionWays().then(function (data) {
                expect(data.data.key).toBe('distribution');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeyStats', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/key/stats';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'stats'}});
            deps.osmTagInfoAPI.getKeyStats().then(function (data) {
                expect(data.data.key).toBe('stats');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeyValues', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/key/values';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'values'}});
            deps.osmTagInfoAPI.getKeyValues().then(function (data) {
                expect(data.data.key).toBe('values');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeyWikiPages', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/key/wiki_pages';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'wiki_pages'}});
            deps.osmTagInfoAPI.getKeyWikiPages().then(function (data) {
                expect(data.data.key).toBe('wiki_pages');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeysAll', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/keys/all';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'all'}});
            deps.osmTagInfoAPI.getKeysAll().then(function (data) {
                expect(data.data.key).toBe('all');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getKeysWikiPages', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/keys/wiki_pages';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'wiki_pages'}});
            deps.osmTagInfoAPI.getKeysWikiPages().then(function (data) {
                expect(data.data.key).toBe('wiki_pages');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getRelationRoles', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/relation/roles';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'roles'}});
            deps.osmTagInfoAPI.getRelationRoles().then(function (data) {
                expect(data.data.key).toBe('roles');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getRelationWikiPages', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/relation/wiki_pages';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'wiki_pages'}});
            deps.osmTagInfoAPI.getRelationWikiPages().then(function (data) {
                expect(data.data.key).toBe('wiki_pages');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getRelationsAll', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/relations/all';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'all'}});
            deps.osmTagInfoAPI.getRelationsAll().then(function (data) {
                expect(data.data.key).toBe('all');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getSearchByKeyAndValue', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/search/by_key_and_value';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'by_key_and_value'}});
            deps.osmTagInfoAPI.getSearchByKeyAndValue().then(function (data) {
                expect(data.data.key).toBe('by_key_and_value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getSearchByKeyword', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/search/by_keyword';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'by_keyword'}});
            deps.osmTagInfoAPI.getSearchByKeyword().then(function (data) {
                expect(data.data.key).toBe('by_keyword');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getSearchByRole', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/search/by_role';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'by_role'}});
            deps.osmTagInfoAPI.getSearchByRole().then(function (data) {
                expect(data.data.key).toBe('by_role');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getSearchByValue', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/search/by_value';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'by_value'}});
            deps.osmTagInfoAPI.getSearchByValue().then(function (data) {
                expect(data.data.key).toBe('by_value');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getSiteInfo', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/site/info';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'info'}});
            deps.osmTagInfoAPI.getSiteInfo().then(function (data) {
                expect(data.data.key).toBe('info');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getSiteSources', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/site/sources';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'sources'}});
            deps.osmTagInfoAPI.getSiteSources().then(function (data) {
                expect(data.data.key).toBe('sources');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getTagCombinations', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/tag/combinations';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'combination'}});
            deps.osmTagInfoAPI.getTagCombinations().then(function (data) {
                expect(data.data.key).toBe('combination');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getTagDistributionNodes', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/tag/distribution/nodes';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'nodes'}});
            deps.osmTagInfoAPI.getTagDistributionNodes().then(function (data) {
                expect(data.data.key).toBe('nodes');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getTagDistributionWays', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/tag/distribution/ways';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'ways'}});
            deps.osmTagInfoAPI.getTagDistributionWays().then(function (data) {
                expect(data.data.key).toBe('ways');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getTagStats', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/tag/stats';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'stats'}});
            deps.osmTagInfoAPI.getTagStats().then(function (data) {
                expect(data.data.key).toBe('stats');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getTagWikiPages', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/tag/wiki_pages';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'wiki_pages'}});
            deps.osmTagInfoAPI.getTagWikiPages().then(function (data) {
                expect(data.data.key).toBe('wiki_pages');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getTagsPopular', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/tags/popular';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'popular'}});
            deps.osmTagInfoAPI.getTagsPopular().then(function (data) {
                expect(data.data.key).toBe('popular');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should answer to getWikiLanguages', function() {
            var url = 'https://taginfo.openstreetmap.org/api/4/wiki/languages';
            deps.$httpBackend.expectGET(url).respond(200, {data: {key: 'languages'}});
            deps.osmTagInfoAPI.getWikiLanguages().then(function (data) {
                expect(data.data.key).toBe('languages');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

    }

});