'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */


ngDescribe({
    modules: 'osm.nominatim',
    inject: ['osmNominatim', '$httpBackend', '$rootScope'],
    tests: function (deps) {
        it('should have URL configured', function() {
            var url = 'https://nominatim.openstreetmap.org';
            expect(deps.osmNominatim.url).toBe(url);
        });

        it('should search works', function() {
            var term = 'term';
            var method = '/search?format=json&q=' + term;
            var url = deps.osmNominatim.url + method;
            var response = '[{"place_id":"143602252","licence":"Data © OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright","osm_type":"relation","osm_id":"123388","boundingbox":["48.3784579","48.4175525","-1.1092162","-1.0529994"],"lat":"48.3948164","lon":"-1.0635017","display_name":"Le Loroux, Fougères-Vitré, Ille-et-Vilaine, Bretagne, France métropolitaine, 35133, France","class":"boundary","type":"administrative","importance":0.50317778737284,"icon":"https:\/\/nominatim.openstreetmap.org\/images\/mapicons\/poi_boundary_administrative.p.20.png"}]';
            deps.$httpBackend.expectGET(url).respond(200, response);
            deps.osmNominatim.search(term)
            .then(function (data) {
                expect(typeof data).toBe('object');
                expect(data.data.length).toBe(1);
                expect(Array.isArray(data.data)).toBe(true);
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should reverse works', function() {
            var method = '/reverse?addressdetails=1&format=json&lat=52.5487429714954&lon=-1.81602098644987&zoom=18';
            var url = deps.osmNominatim.url + method;
            var response = '{"place_id":"81118674","licence":"Data © OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright","osm_type":"way","osm_id":"90394420","lat":"52.54877605","lon":"-1.81627023283164","display_name":"137, Pilkington Avenue, Sutton Coldfield, Maney, Birmingham, West Midlands, Angleterre, B72 1LH, Royaume-Uni","address":{"house_number":"137","road":"Pilkington Avenue","suburb":"Sutton Coldfield","hamlet":"Maney","city":"Birmingham","state_district":"West Midlands","state":"Angleterre","postcode":"B72 1LH","country":"Royaume-Uni","country_code":"gb"},"boundingbox":["52.5487321","52.5488299","-1.8163513","-1.8161884"]}';

            var query = {
                lat: 52.5487429714954,
                lon:-1.81602098644987,
                zoom:18,
                addressdetails:1
            };

            deps.$httpBackend.expectGET(url).respond(200, response);
            deps.osmNominatim.reverse(query)
            .then(function (data) {
                expect(typeof data).toBe('object');
                expect(data.data.place_id).toBe('81118674');
                expect(data.data.osm_type).toBe('way');
                expect(data.data.osm_id).toBe('90394420');
                expect(data.data.lat).toBe('52.54877605');
                expect(data.data.lon).toBe('-1.81627023283164');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
        it('should lookup works', function() {
            var method = '/lookup?format=json&osm_ids=R146656,W104393803,N240109189';
            var url = deps.osmNominatim.url + method;
            var response = '[{"place_id":"2609199663","licence":"Data © OpenStreetMap contributors, ODbL 1.0. http:\/\/www.openstreetmap.org\/copyright","osm_type":"relation","osm_id":"146656","lat":"53.4791301","lon":"-2.2441008","display_name":"Manchester, Greater Manchester, Angleterre du Nord-Ouest, Angleterre, Royaume-Uni","class":"boundary","type":"administrative","importance":"0.704893333438333","address":{"city":"Manchester","county":"Greater Manchester","state_district":"Angleterre du Nord-Ouest","state":"Angleterre","country":"Royaume-Uni","country_code":"gb"}}]';

            var query = {
                osm_ids: 'R146656,W104393803,N240109189'
            };

            deps.$httpBackend.expectGET(url).respond(200, response);
            deps.osmNominatim.lookup(query)
            .then(function (data) {
                expect(typeof data).toBe('object');
                expect(Array.isArray(data.data)).toBe(true);
                expect(data.data[0].place_id).toBe('2609199663');
                expect(data.data[0].osm_type).toBe('relation');
                expect(data.data[0].osm_id).toBe('146656');
                expect(data.data[0].lat).toBe('53.4791301');
                expect(data.data[0].lon).toBe('-2.2441008');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

    }

});