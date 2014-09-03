Angular OSM
===========

Angular OSM is a set of services for Angular which provides interfaces with OSM APIs.

OpenStreetMap (OSM)
-------------------

OpenStreetMap is built by a community of mappers that contribute and maintain data about roads, trails, cafés, railway stations, and much more, all over the world. 

OpenStreetMap is open data: you are free to use it for any purpose as long as you credit OpenStreetMap and its contributors. If you alter or build upon the data in certain ways, you may distribute the result only under the same licence. See the Copyright and License page for details.

Please read more: http://www.openstreetmap.org

Angular
-------

AngularJS is what HTML would have been, had it been designed for building web-apps. Declarative templates with data-binding, MVW, MVVM, MVC, dependency injection and great testability story all implemented with pure client-side JavaScript!

Please read more: http://angularjs.org


osmSettingsService
------------------

This service store in localstorage and expose the following settings:

* username / userid
* credential (not the password but it's not that secure)
* osm API url
* overpass API url
* current changeset id

osmAPI
------

This service provide all what you need to query OSM API ! Because OSM API use XML we use the browser's DOM parser so you will get DOM instead of plain text XML. (Note that we have a bug with Firefox on this one)

* getAuthenticated: function(method, config)
* get: function(method, config){
* put: function(method, content, config)
* delete: function(method, config)

You will also have some about geojson:
* getMapGeoJSON: function(bbox)
* relationXmlToGeoJSON: function(relationID, relationXML)
* relationGeoJSONToXml: function(relationGeoJSON)

There are lot more stuff (yql, addNode, updateNode, ...)



overpassAPI
-----------

This service provide interface to send queries and get the results:

* overpass: function(query) -> XML/DOM or JSON
* overpassToGeoJSON(query, filter) -> geojson

