/*jshint strict:false */
/*global angular:false */
/*global osmtogeojson:false */

angular.module('osm.services').factory('osmAPI',
    ['$base64', '$http', '$q', 'settingsService',
    function ($base64, $http, $q, settingsService) {
        var parseXml;
        var parser;
        var serializer = new XMLSerializer();
        var API = 'http://api.openstreetmap.org/api';

        if (typeof window.DOMParser !== 'undefined') {
            parser = new window.DOMParser();
            parseXml = function(xmlStr) {
                return parser.parseFromString(xmlStr, 'application/xml');
            };
        } else if (typeof window.ActiveXObject !== 'undefined') {
            parseXml = function(xmlStr) {
                var xmlDoc = new window.ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = 'false';
                xmlDoc.loadXML(xmlStr);
                return xmlDoc;
            };
        } else {
            throw new Error('No XML parser found');
        }

        var service = {
            validateCredentials: function(){
                var deferred = $q.defer();
                this.getUserDetails().then(function(data){
                    var users = data.getElementsByTagName('user');
                    if (users.length > 0){
                        settingsService.settings.userid = users[0].id;
                    }
                    deferred.resolve(users.length > 0);
                }, function(error){
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            setCredentials: function(username, password){
                settingsService.settings.username = username;
                settingsService.settings.credentials = $base64.encode(username + ':' + password);
                return settingsService.settings.credentials;
            },
            getCredentials: function(){
                return settingsService.settings.credentials;
            },
            getAuthorization: function(){
                return 'Basic ' + settingsService.settings.credentials;
            },
            clearCredentials: function () {
                settingsService.settings.credentials = '';
            },
            parseXML: function(data){
                //bug: this return nothing with firefox ...
                return parseXml(data);
            },
            getAuthenticated: function(method, config){
                if (config === undefined){
                    config = {};
                }
                config.headers = {Authorization: this.getAuthorization()};
                return this.get(method, config);
            },
            get: function(method, config){
                var deferred = $q.defer();
                var self = this;

                $http.get(API + method, config).then(function(data){
                    var contentType = data.headers()['content-type'];
                    var results;
                    if (contentType.indexOf('application/xml;') === 0){
                        results = self.parseXML(data.data);
                    }else if (contentType.indexOf('text/xml;') === 0){
                        results = self.parseXML(data.data);
                    }else{
                        results = data.data;
                    }
                    deferred.resolve(results);
                },function(data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            put: function(method, content, config){
                var deferred = $q.defer();
                var self = this;

                if (config === undefined){
                    config = {};
                }
                config.headers = {Authorization: this.getAuthorization()};
                $http.put(API + method, content, config).then(function(data){
                    var contentType = data.headers()['content-type'];
                    var results;
                    if (contentType.indexOf('application/xml;') === 0){
                        results = self.parseXML(data.data);
                    }else if (contentType.indexOf('text/xml;') === 0){
                        results = self.parseXML(data.data);
                    }else{
                        results = data.data;
                    }
                    deferred.resolve(results);
                },function(data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            delete: function(method, config){
                var deferred = $q.defer();
                var self = this;

                if (config === undefined){
                    config = {};
                }
                config.headers = {Authorization: this.getAuthorization()};
                config.url = API + method;
                config.method = 'delete';
                $http(config).then(function(data){
                    var contentType = data.headers()['content-type'];
                    var results;
                    if (contentType.indexOf('application/xml;') === 0){
                        results = self.parseXML(data.data);
                    }else if (contentType.indexOf('text/xml;') === 0){
                        results = self.parseXML(data.data);
                    }else{
                        results = data.data;
                    }
                    deferred.resolve(results);
                },function(data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            overpass: function(query){
                var url = 'http://api.openstreetmap.fr/oapi/interpreter';
                var deferred = $q.defer();
                var self = this;
                var headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'};
                $http.post(
                    url,
                    'data='+encodeURIComponent(query),
                    {headers: headers}
                ).then(function(data){
                    if (typeof data.data === 'object'){
                        deferred.resolve(data.data);
                    }else{
                        deferred.resolve(self.parseXML(data.data));
                    }
                },function(data) {
                    deferred.reject(data);
                });
                return deferred.promise;
            },
            overpassToGeoJSON: function(query, filter){
                var deferred = $q.defer();
                var features = [];
                var relations = [];
                var result = {
                    type: 'FeatureCollection',
                    features: features,
                    relations: relations
                };
                this.overpass(query).then(function(data){
                    //TODO check if data is XML or JSON, here it's JSON
                    var node, feature, coordinates;
                    var cache = {loaded:false};
                    var getNodeById = function(id){
                        if (!cache.loaded){
                            var tmp;
                            for (var i = 0; i < data.elements.length; i++) {
                                tmp = data.elements[i];
                                cache[tmp.id] = tmp;
                            }
                        }
                        return cache[id];
                    };
                    for (var i = 0; i < data.elements.length; i++) {
                        node = data.elements[i];
                        if (node.type === 'node'){
                            feature = {
                                type: 'Feature',
                                properties:node.tags,
                                id: node.id,
                                geometry: {
                                    type:'Point',
                                    coordinates: [node.lon, node.lat]
                                }
                            };
                            if (!filter(feature)){
                                features.push(feature);
                            }
                        }else if (node.type === 'way'){
                            coordinates = [];
                            feature = {
                                type: 'Feature',
                                properties:node.tags,
                                id: node.id,
                                geometry: {
                                    type:'LineString',
                                    coordinates: coordinates
                                }
                            };
                            for (var j = 0; j < node.nodes.length; j++) {
                                coordinates.push([
                                    getNodeById(node.nodes[j]).lon,
                                    getNodeById(node.nodes[j]).lat
                                ]);
                            }
                            if (!filter(feature)){
                                features.push(feature);
                            }
                        }else if (node.type === 'relation'){
                            result.relations.push({
                                ref: node.id,
                                tags: node.tags,
                                type: 'relation',
                                members: node.members
                            });
                        }
                    }
                    deferred.resolve(result);
                }, function(error){
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            getNodesInJSON: function(xmlNodes){
                settingsService.settings.nodes = xmlNodes;
                return osmtogeojson(xmlNodes, {flatProperties: true});
            },
            createChangeset: function(comment){
                var deferred = $q.defer();
                var changeset = '<osm><changeset><tag k="created_by" v="OSM-Relation-Editor"/><tag k="comment" v="';
                changeset += comment + '"/></changeset></osm>';
                this.put('/0.6/changeset/create', changeset).then(function(data){
                    settingsService.settings.changeset = data;
                    deferred.resolve(data);
                });
                return deferred.promise;
            },
            getLastOpenedChangesetId: function(){
                var deferred = $q.defer();
                this.get('/0.6/changesets', {params:{user: settingsService.settings.userid, open: true}}).then(function(data){
                    var changesets = data.getElementsByTagName('changeset');
                    if (changesets.length > 0){
                        settingsService.settings.changeset = changesets[0].id;
                        deferred.resolve(changesets[0].id);
                    }else{
                        deferred.resolve();
                    }
                });
                return deferred.promise;
            },
            closeChangeset: function(){
                var results = this.put('/0.6/changeset/'+ settingsService.settings.changeset +'/close');
                settingsService.settings.changeset = undefined;
                return results;
            },
            getUserDetails: function(){
                return this.getAuthenticated('/0.6/user/details');
            },
            getMap: function(bbox){
                return this.get('/0.6/map?bbox='+bbox);
            },
            updateNode: function(currentNode, updatedNode){
                //we need to do the diff and build the xml
                //first try to find the node by id
                var node = settingsService.settings.nodes.getElementById(currentNode.properties.id);
                var deferred = $q.defer(); //only for errors
                if (node === null){
                    deferred.reject({
                        msg: 'can t find node',
                        currentNode: currentNode,
                        updatedNode: updatedNode,
                        osmNode: node
                    });
                    return deferred.promise;
                }
                var tag;
                node.setAttribute('changeset', settingsService.settings.changeset);
                node.setAttribute('user', settingsService.settings.username);
                while (node.getElementsByTagName('tag')[0]){
                    node.removeChild(node.getElementsByTagName('tag')[0]);
                }
                var osm = document.createElement('osm');
                var value;
                osm.appendChild(node);
                for (var property in updatedNode.properties.tags) {
                    if (updatedNode.properties.tags.hasOwnProperty(property)) {
                        value = updatedNode.properties.tags[property];
                        if (value === undefined){
                            continue;
                        }
                        tag = document.createElement('tag');
                        tag.setAttribute('k', property);
                        tag.setAttribute('v', value);
                        node.appendChild(tag);
                    }
                }
                var nodeType;
                if (updatedNode.geometry.type === 'Polygon'){
                    nodeType = 'way';
                }else if (updatedNode.geometry.type === 'Point'){
                    nodeType = 'node';
                }else if (updatedNode.geometry.type === 'LineString'){
                    nodeType = 'way';
                }else{
                    deferred.reject({
                        msg: 'geojson type not supported',
                        currentNode: currentNode,
                        updatedNode: updatedNode,
                        osmNode: node
                    });
                    return deferred.promise;
                }
                //put request !!
                return this.put('/0.6/' + nodeType + '/' + currentNode.properties.id, osm.outerHTML);
            },
            addNode: function(feature){
                var newNode = '<osm><node changeset="CHANGESET" lat="LAT" lon="LNG">TAGS</node></osm>';
                var tagTPL = '<tag k="KEY" v="VALUE"/>';
                var tags = '';
                var value;
                newNode = newNode.replace('CHANGESET', settingsService.settings.changeset);
                for (var property in feature.osm) {
                    if (feature.osm.hasOwnProperty(property)) {
                        value = feature.osm[property];
                        if (value === undefined || value === null){
                            continue;
                        }else{
                            tags = tags + tagTPL.replace('KEY', property).replace('VALUE', feature.osm[property]);
                        }
                    }
                }
                newNode = newNode.replace('TAGS', tags);
                if (feature.geometry.type === 'Point'){
                    newNode = newNode.replace('LNG', feature.geometry.coordinates[0]);
                    newNode = newNode.replace('LAT', feature.geometry.coordinates[1]);
                }else{
                    throw new Error('Can t save sth else than Point');
                }
                console.log('create new node with ' + newNode);
                return this.put('/0.6/node/create', newNode);
            },
            getMapGeoJSON: function(bbox){
                var self = this;
                var deferred = $q.defer();
                self.getMap(bbox).then(function(xmlNodes){
                    var geojsonNodes = self.getNodesInJSON(xmlNodes);
                    //TODO: load row node (xml)
/*                    var node;
                    for (var i = 0; i < geojsonNodes.length; i++) {
                        node = geojsonNodes[i];
                        node.rawXMLNode = xmlNodes.getElementById(node.id.split('/')[1]);
                    }*/
                    deferred.resolve(geojsonNodes);
                }, function(error){
                    deferred.reject(error);
                });
                return deferred.promise;
            },
            serialiseXmlToString: function(xml){
                return serializer.serializeToString(xml);
            },
            getTagsFromChildren: function(element){
                var children, tags;
                tags = {};
                for (var i = 0; i < element.children.length; i++) {
                    children = element.children[i];
                    if (children.tagName !== 'tag'){
                        continue;
                    }
                    tags[children.getAttribute('k')] = children.getAttribute('v');
                }
                return tags;
            },
            getNameFromTags: function(element){
                var children;
                for (var i = 0; i < element.children.length; i++) {
                    children = element.children[i];
                    if (children.tagName !== 'tag'){
                        continue;
                    }
                    if (children.getAttribute('k') === 'name'){
                        return children.getAttribute('v');
                    }
                }
            },
            relationXmlToGeoJSON: function(relationID, relationXML){
                var self = this;
                var features = [];
                var relations = [];
                var result = {
                    type: 'FeatureCollection',
                    properties: {
                        id: relationID
                    },
                    options: {},
                    members:[],
                    features: features,
                    relations: relations
                };
                var relation = relationXML.getElementById(relationID);
                //bug: relation is null because firefox return an error
                result.properties.visible = relation.getAttribute('visible');
                result.properties.version = relation.getAttribute('version');
                result.properties.changeset = relation.getAttribute('changeset');
                result.properties.timestamp = relation.getAttribute('timestamp');
                result.properties.user = relation.getAttribute('user');
                result.properties.uid = relation.getAttribute('uid');
                var m, i;
                var child, node, properties, coordinates, feature, member, memberElement;
                for (i = 0; i < relation.children.length; i++) {
                    m = relation.children[i];
                    if (m.tagName === 'member'){
                        //<member type="way" ref="148934766" role=""/>
                        member = {
                            type: m.getAttribute('type'),
                            ref: m.getAttribute('ref'),
                            role: m.getAttribute('role'),
                        };
                        result.members.push(member);
                        //get relationXML for this member
                        memberElement = relationXML.getElementById(m.getAttribute('ref'));
                        /*
                        <way id="148934766" visible="true" version="5" changeset="13626362" timestamp="2012-10-25T11:48:27Z" user="Metacity" uid="160224">
                          <nd ref="1619955810"/>
                          ...
                          <tag k="access" v="yes"/>
                          ...
                        </way>
                         */
                        //get tags -> geojson properties
                        properties = self.getTagsFromChildren(memberElement);
                        member.name = properties.name;
                        if (memberElement.tagName === 'way'){
                            coordinates = [];
                            feature = {
                                type: 'Feature',
                                properties: properties,
                                id: m.getAttribute('ref'),
                                geometry:{
                                    type:'LineString',
                                    coordinates:coordinates
                                }
                            };
                            for (var j = 0; j < memberElement.children.length; j++) {
                                child = memberElement.children[j];
                                if (child.tagName === 'nd'){
                                    node = relationXML.getElementById(child.getAttribute('ref'));
                                    coordinates.push([
                                        parseFloat(node.getAttribute('lon')),
                                        parseFloat(node.getAttribute('lat'))
                                    ]);
                                }
                            }
                            features.push(feature);
                        }else if (memberElement.tagName === 'node'){
                            feature = {
                                type: 'Feature',
                                properties: properties,
                                id: m.getAttribute('ref'),
                                geometry:{
                                    type:'Point',
                                    coordinates:[
                                        parseFloat(memberElement.getAttribute('lon')),
                                        parseFloat(memberElement.getAttribute('lat'))
                                    ]
                                }
                            };
                            features.push(feature);
                        }else if (memberElement.tagName === 'relation'){
                            member.tags = properties;
                        }
                    }
                }
                result.tags = self.getTagsFromChildren(relation);
                return result;
            },
            relationGeoJSONToXml: function(relationGeoJSON){
                var i;
                var pp = relationGeoJSON.properties;
                var members = relationGeoJSON.members;
                var settings = settingsService.settings;
                var output = '<?xml version="1.0" encoding="UTF-8"?>\n';
                output += '<osm version="0.6" generator="CGImap 0.3.3 (31468 thorn-01.openstreetmap.org)" copyright="OpenStreetMap and contributors" attribution="http://www.openstreetmap.org/copyright" license="http://opendatacommons.org/licenses/odbl/1-0/">\n';
                output += '  <relation id="'+ pp.id + '" visible="' + pp.visible + '" ';
                output += 'version="' + pp.version + '" ';
                output += 'changeset="'+settings.changeset +'" timestamp="' + new Date().toISOString() + '" ';
                output += 'user="' + settings.username + '" uid="' + pp.uid + '">\n';

                for (i = 0; i < members.length; i++) {
                    output += '    <member type="'+ members[i].type +'" ';
                    output += 'ref="'+members[i].ref;
                    //role depends on the type of member
                    if (members[i].type === 'relation'){
                        output += '" role="'+ members[i].role+'"/>\n';
                    }else{
                        output += '" role="'+ members[i].role+'"/>\n';
                    }
                }

                var tags = relationGeoJSON.tags;
                for (var k in tags) {
                    output += '    <tag k="'+ k +'" v="'+ tags[k] +'"/>\n';
                }
                output += '  </relation>\n';
                output += '</osm>';
                return output;
            },
            sortRelationMembers: function(relationGeoJSON){
                //sort members
                var members = relationGeoJSON.members;
                var features = relationGeoJSON.features;
                var sorted = [];
                var f,i,m,j,k;
                var first, last;
                var insertBefore = function(item){
                    sorted.splice(0, 0, item);
                };
                var insertAfter = function(item){
                    sorted.push(item);
                };
                var getCoordinates = function(i){
                    return features[i].geometry.coordinates;
                };
                var c, cfirst, clast, alreadySorted;
                var foundFirst, foundLast = false;
                for (i = 0; i < members.length; i++) {
                    m = members[i];
                    if (m.type !== 'way'){
                        sorted.push(m);
                        continue;
                    }
                    //check if the member is already in
                    alreadySorted = false;
                    for (k = 0; k < sorted.length; k++) {
                        if (sorted[k].ref === m.ref){
                            alreadySorted = true;
                        }
                    }
                    if (alreadySorted){
                        continue;
                    }
                    if (sorted.length === 0){
                        sorted.push(m);
                        c = getCoordinates(i);
                        cfirst = c[0];
                        clast = c[c.length-1];
                    }
//                    console.log('cfirst ' +cfirst);
//                    console.log('clast '+ clast);
                    foundFirst = foundLast = false;
                    for (j = 0; j < features.length; j++) {
                        f = features[j];
                        if (f.geometry.type !== 'LineString'){
                            continue;
                        }
                        alreadySorted = false;
                        for (k = 0; k < sorted.length; k++) {
                            if (sorted[k].ref === f.id){
                                alreadySorted = true;
                            }
                        }
                        if (alreadySorted){
                            continue;
                        }

                        c = getCoordinates(j);
                        first = c[0];
                        last = c[c.length-1];
                        if (cfirst[0] === last[0] && cfirst[1] === last[1]){
                            insertBefore(members[j]);
                            cfirst = first;
                            foundFirst = true;
                            continue;
                        }
                        if (clast[0] === first[0] && clast[1] === first[1]){
                            insertAfter(members[j]);
                            clast = last;
                            foundLast = true;
                            continue;
                        }
                        //weird; order of linestring coordinates is not stable
                        if (cfirst[0] === first[0] && cfirst[1] === first[1]){
                            insertBefore(members[j]);
                            cfirst = last;
                            foundFirst = true;
                            continue;
                        }
                        if (clast[0] === last[0] && clast[1] === last[1]){
                            insertAfter(members[j]);
                            clast = first;
                            foundLast = true;
                            continue;
                        }
                    }
                    if (!foundFirst && !foundLast){
                        //cas du rond point ... ?
                        console.log('not found connected ways for '+m.ref);
                        console.log(cfirst);
                        console.log(clast);
                    }
                }
                if (members.length === sorted.length){
                    relationGeoJSON.members = sorted;
                    //Fix orders of features
                    //var features = relationGeoJSON.features;
                    var cache = {loaded:false};
                    var getFeatureById = function(id){
                        if (!cache.loaded){
                            for (var i = 0; i < features.length; i++) {
                                cache[features[i].id] = features[i];
                            }
                        }
                        return cache[id];
                    };
                    relationGeoJSON.features = [];
                    for (var l = 0; l < sorted.length; l++) {
                        relationGeoJSON.features.push(getFeatureById(sorted[l].ref));
                    }
                    //feature order fixed
                }else{
                    console.error('can t sort this relation');
                }
            },
            yqlJSON: function(featuresURL){
                var deferred = $q.defer();
                var url, config;
                config = {
                    params: {
                        q: 'select * from json where url=\'' + featuresURL + '\';',
                        format: 'json'
                    }
                };
                url = 'http://query.yahooapis.com/v1/public/yql';
                $http.get(url, config).then(
                    function(data){
                        if (data.data.query.results === null){
                            deferred.resolve([]);
                        }else{
                            deferred.resolve(data.data.query.results.json);
                        }
                    }, function(error){
                        deferred.reject(error);
                    });
                return deferred.promise;
            },
            getElementTypeFromFeature: function(feature){
                var gtype = feature.geometry.type;
                if (gtype === 'LineString'){
                    return 'way';
                }else if (gtype === 'Point'){
                    return 'node';
                }else{
                    console.error('not supported type '+gtype);
                }
            }
        };
        return service;
    }
]);
