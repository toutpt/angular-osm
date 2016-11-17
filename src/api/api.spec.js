'use strict';
/*global ngDescribe:false */
/*global it:false */
/*global expect:false */


ngDescribe({
    modules: ['osm.api'],
    inject: ['osmAPI', 'osmx2js', '$q', '$http', '$httpBackend', '$rootScope'],
    tests: function (deps) {
        function setHTTPAdapter(deps) {
            var adapter = {
                xhr: function (options) {
                    options.url = deps.osmAPI.url + options.path;
                    return deps.$http(options).then(function (data) {
                        var d = data.data;
                        if (!d) {
                            return;
                        }
                        if (d.substr) {
                            if (d.substr(0, 5) === '<?xml') {
                                return deps.osmx2js.xml2js(d);
                            }
                        }
                        return d;
                    });
                },
                getUserID: function () {
                    return 1;
                }
            };
            deps.osmAPI.setAuthAdapter(adapter);
        };

        it('should have URL configured', function() {
            var url = 'http://api.openstreetmap.org/api';
            expect(deps.osmAPI.url).toBe(url);
        });

        it('should access to oauth dependency if set', function() {
            var oauthDep = {};
            expect(deps.osmAPI._oauth).toBe(null);
            deps.osmAPI.setAuthAdapter(oauthDep);
            expect(deps.osmAPI._oauth).toBe(oauthDep);
            expect(deps.osmAPI.getAuthAdapter()).toBe(oauthDep);
        });

        it('should internal xhr works as expected', function() {
            var backend = {
                xhr: function(options) {
                    return deps.$q.when({data: 'data'});
                }
            };
            deps.osmAPI.setAuthAdapter(backend);
            deps.osmAPI.xhr().then(function (data) {
                expect(typeof data).toBe('object');
                expect(data.data).toBe('data');
            });
            deps.$rootScope.$digest();

        });

        it('should getAuthenticated', function() {
            setHTTPAdapter(deps);
            var method = '/0.6/user/details';
            var url = deps.osmAPI.url + method;
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

        it('should get works', function() {
            var method = '/api/0.6/map';
            var url = deps.osmAPI.url + method;
            var xml = '<osm version="0.6" generator="OpenStreetMap server">';
            xml += ' </osm>';
            deps.$httpBackend.expectGET(url).respond(200, xml);
            deps.osmAPI.get(method)
            .then(function (data) {
                expect(typeof data).toBe('object');
                expect(data.osm._version).toBe('0.6');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should put works (case of create node) to return id', function() {
            setHTTPAdapter(deps);
            var method = '/0.6/node/create';
            var url = deps.osmAPI.url + method;
            var response = '132134'; //id of the created node;
            var data = {osm: {node:{
                _changeset: 12,
                _lat: '...',
                _lon: '...',
                tag: {
                    _k: 'note', _v: 'Just a node'
                }
            }}};
            var xml = '<osm>';
            xml += '<node changeset="12" lat="..." lon="...">';
            xml += '<tag k="note" v="Just a node" />';
            xml += '</node>';
            xml += '</osm>';
            deps.$httpBackend.expectPUT(url, xml).respond(200, response);
            deps.osmAPI.put(method, data)
            .then(function (data) {
                expect(typeof data).toBe('string');
                expect(data).toBe('132134');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should delete works', function() {
            setHTTPAdapter(deps);
            var method = '/0.6/node/132134';
            var url = deps.osmAPI.url + method;
            var response = '3147'; //the new version number
            deps.$httpBackend.expectDELETE(url).respond(200, response);
            deps.osmAPI.delete(method)
            .then(function (data) {
                expect(typeof data).toBe('string');
                expect(data).toBe(response);
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should createChangeset works', function() {
            setHTTPAdapter(deps);
            var method = '/0.6/changeset/create';
            var comment = 'my changeset';
            var url = deps.osmAPI.url + method;
            var response = '3147'; //The ID of the newly created changeset
            var xml = '<osm>';
            xml += '<changeset><tag k="created_by" v="Angular-OSM" />';
            xml += '<tag k="comment" v="my changeset" />';
            xml += '</changeset></osm>';
            deps.$httpBackend.expectPUT(url, xml).respond(200, response);
            deps.osmAPI.createChangeset(comment)
            .then(function (data) {
                expect(typeof data).toBe('string');
                expect(data).toBe(response);
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should createChangeset via specific author name works', function() {
            setHTTPAdapter(deps);
            var method = '/0.6/changeset/create';
            var comment = 'my changeset';
            var author = "foobar";
            var url = deps.osmAPI.url + method;
            var response = '3147'; //The ID of the newly created changeset
            var xml = '<osm>';
            xml += '<changeset><tag k="created_by" v="foobar" />';
            xml += '<tag k="comment" v="my changeset" />';
            xml += '</changeset></osm>';
            deps.$httpBackend.expectPUT(url, xml).respond(200, response);
            deps.osmAPI.createChangeset(comment, author)
            .then(function (data) {
                expect(typeof data).toBe('string');
                expect(data).toBe(response);
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should getLastOpenedChangesetId works', function() {
            setHTTPAdapter(deps);
            var method = '/0.6/changesets?open=true&user=1';
            var url = deps.osmAPI.url + method;
            var xml = '<?xml version="1.0" encoding="UTF-8"?>';
            xml += '<osm><changeset id="1234"><tag k="created_by" v="Angular-OSM" />';
            xml += '<tag k="comment" v="my changeset" />';
            xml += '</changeset></osm>';
            deps.$httpBackend.expectGET(url).respond(200, xml);
            deps.osmAPI.getLastOpenedChangesetId()
            .then(function (data) {
                expect(typeof data).toBe('string');
                expect(data).toBe('1234');
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

        it('should closeChangeset works', function() {
            setHTTPAdapter(deps);
            var id = '1234';
            var method = '/0.6/changeset/' + id + '/close';
            var url = deps.osmAPI.url + method;
            deps.$httpBackend.expectPUT(url).respond(200);
            deps.osmAPI.closeChangeset(id)
            .then(function (data) {
                expect(data).toBeUndefined();
            });
            deps.$rootScope.$digest();
            deps.$httpBackend.flush();
        });

    }

});
