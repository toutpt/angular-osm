'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */


ngDescribe({
    modules: 'osm.base64',
    inject: ['osmBase64', 'osmAPI', '$q', '$httpBackend', '$rootScope'],
    tests: function (deps) {
        beforeEach(function() {
            deps.osmAPI.setAuthAdapter(deps.osmBase64);
        });
        it('should credentials works', function() {
            var res = 'Zm9vOnBhc3M=';
            var cred = deps.osmBase64.setCredentials('foo', 'pass');
            expect(cred).toBe(res); //base64
            //and stored to osmSettings
            expect(deps.osmBase64.getCredentials())
            .toBe(res);
            //access throw 
            expect(deps.osmBase64.getCredentials()).toBe(res);
            expect(deps.osmBase64.getAuthorization()).toBe('Basic ' + res);

            deps.osmBase64.clearCredentials();
            expect(deps.osmBase64.getCredentials()).toBeUndefined();
        });

        it('should internal xhr works as expected', function() {
            var method = '/capabilities';
            var options = {
                method: 'GET',
                path: method,
            };
            var url = deps.osmAPI.url + method;
            var xml = '<?xml version="1.0" encoding="UTF-8"?>';
            xml += '<osm version="0.6" generator="OpenStreetMap server">';
            xml += '   <api>';
            xml += '     <version minimum="0.6" maximum="0.6"/>';
            xml += '     <area maximum="0.25"/>';
            xml += '     <tracepoints per_page="5000"/>';
            xml += '     <waynodes maximum="2000"/>';
            xml += '     <changesets maximum_elements="50000"/>';
            xml += '     <timeout seconds="300"/>';
            xml += '     <status database="online" api="online" gpx="online"/>';
            xml += '   </api>';
            xml += ' </osm>';
            deps.$httpBackend.expectGET(url).respond(200, xml);
            deps.osmAPI.xhr(options).then(function (data) {
                expect(typeof data).toBe('object');
                expect(data.osm._version).toBe('0.6');
                expect(data.osm._generator).toBe('OpenStreetMap server');
                expect(data.osm.api.version._minimum).toBe('0.6');
                expect(data.osm.api.version._maximum).toBe('0.6');
                expect(data.osm.api.area._maximum).toBe('0.25');
                expect(data.osm.api.tracepoints._per_page).toBe('5000');
                expect(data.osm.api.waynodes._maximum).toBe('2000');
                expect(data.osm.api.changesets._maximum_elements).toBe('50000');
                expect(data.osm.api.timeout._seconds).toBe('300');
                expect(data.osm.api.status._database).toBe('online');
                expect(data.osm.api.status._api).toBe('online');
                expect(data.osm.api.status._gpx).toBe('online');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();

        });

        it('should getAuthenticated', function() {
            var method = '/0.6/user/details';
            var url = deps.osmBase64.url + method;
            var xml = '<?xml version="1.0" encoding="UTF-8"?>';
            xml += '<osm version="0.6" generator="OpenStreetMap server">';
            xml += ' <user display_name="Max Muster" account_created="2006-07-21T19:28:26Z" id="1234">';
            xml += '    <contributor-terms agreed="true" pd="true"/>';
            xml += '    <img href="http://www.openstreetmap.org/attachments/users/images/000/000/1234/original/someLongURLOrOther.JPG"/>';
            xml += '    <roles></roles>';
            xml += '    <changesets count="4182"/>';
            xml += '    <traces count="513"/>';
            xml += '    <blocks>';
            xml += '        <received count="0" active="0"/>';
            xml += '    </blocks>';
            xml += '    <home lat="49.4733718952806" lon="8.89285988577866" zoom="3"/>';
            xml += '    <description>The description of your profile</description>';
            xml += '    <languages>';
            xml += '      <lang>de-DE</lang>';
            xml += '      <lang>de</lang>';
            xml += '      <lang>en-US</lang>';
            xml += '      <lang>en</lang>';
            xml += '    </languages>';
            xml += '    <messages>';
            xml += '      <received count="1" unread="0"/>';
            xml += '      <sent count="0"/>';
            xml += '    </messages>';
            xml += '  </user>';
            xml += ' </osm>';

            deps.$httpBackend.expectGET(url).respond(200, xml);
            deps.osmAPI.getAuthenticated(method)
            .then(function (data) {
                expect(typeof data).toBe('object');
                expect(data.osm.user._display_name).toBe('Max Muster');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });
    }

});