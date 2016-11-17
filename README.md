Angular OSM
===========

[![NPM][npm-icon] ][npm-url]

[![Travis CI][travis-ci-image] ][travis-ci-url]
[![Codacy Badge][codacy-image] ][codacy-url]
[![semantic-release][semantic-image] ][semantic-url]
[![Commitizen friendly][commitizen-image] ][commitizen-url]

[![Quality][quality-badge] ][quality-url]
[![Coverage Status][coverage-image] ][coverage-url]
[![Circle CI] [circle-icon] ][circle-url]

[![dependencies][dependencies-image] ][dependencies-url]
[![devdependencies][devdependencies-image] ][devdependencies-url]

[npm-icon]: https://nodei.co/npm/angular-osm.png?downloads=true
[npm-url]: https://npmjs.org/package/angular-osm
[travis-ci-image]: https://travis-ci.org/toutpt/angular-osm.png?branch=master
[travis-ci-url]: https://travis-ci.org/toutpt/angular-osm

[coverage-image]: https://coveralls.io/repos/github/toutpt/angular-osm/badge.svg?branch=master
[coverage-url]: https://toutpt.github.io/angular-osm/coverage/index.html
[dependencies-image]: https://david-dm.org/toutpt/angular-osm.png
[dependencies-url]: https://david-dm.org/toutpt/angular-osm
[devdependencies-image]: https://david-dm.org/toutpt/angular-osm/dev-status.png
[devdependencies-url]: https://david-dm.org/toutpt/angular-osm#info=devDependencies

[codacy-image]: https://api.codacy.com/project/badge/Grade/aa28c31e62114c2591e7a7e3161d48ca
[codacy-url]: https://www.codacy.com/public/toutpt/angular-osm.git
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/


[quality-badge]: http://npm.packagequality.com/shield/angular-osm.svg
[quality-url]: http://packagequality.com/#?package=angular-osm

[circle-icon]: https://circleci.com/gh/toutpt/angular-osm.svg?style=svg
[circle-url]: https://circleci.com/gh/toutpt/angular-osm


Angular OSM is a set of angular services to use OSM APIs.

Please show me examples
-----------------------

[Example : OSM API](http://toutpt.github.io/angular-osm/examples/api)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/api)

[Example : base64 adapter](http://toutpt.github.io/angular-osm/examples/base64)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/base64)

[Example : nominatim](http://toutpt.github.io/angular-osm/examples/nominatim)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/nominatim)

[Example : oauth adapter](http://toutpt.github.io/angular-osm/examples/oauth)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/oauth)

[Example : osrm](http://toutpt.github.io/angular-osm/examples/osrm)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/osrm)

[Example : overpass](http://toutpt.github.io/angular-osm/examples/overpass)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/overpass)

[Example : taginfo](http://toutpt.github.io/angular-osm/examples/taginfo)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/taginfo)

[Example : togeojson](http://toutpt.github.io/angular-osm/examples/togeojson)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/togeojson)

[Example : full](http://toutpt.github.io/angular-osm/examples/full)
[Source](https://github.com/toutpt/angular-osm/tree/gh-pages/examples/full)



How to add angular openstreetmap to my project
==============================================

First add it to your dependencies:

    npm install --save angular-osm

Next it depends what you want to do. The release provide many distributed files:

    node_modules/angular-osm
    ├── README.md
    ├── dist
    │   ├── osm-api.js
    │   ├── osm-api.min.js
    │   ├── osm-base64.js
    │   ├── osm-base64.min.js
    │   ├── osm-full.js
    │   ├── osm-full.min.js
    │   ├── osm-nominatim.js
    │   ├── osm-nominatim.min.js
    │   ├── osm-oauth.js
    │   ├── osm-oauth.min.js
    │   ├── osm-osrm.js
    │   ├── osm-osrm.min.js
    │   ├── osm-overpass.js
    │   ├── osm-overpass.min.js
    │   ├── osm-taginfo.js
    │   ├── osm-taginfo.min.js
    │   ├── osm-togeojson.js
    │   ├── osm-togeojson.min.js

Each build provides one osm api integration so you can just pick the one you want.

If you want all API just include osm-full.min.js.

So you may need more dependencies dependening on what you want to do.
Here is the dependencies table of angular-osm builds:

| dist          | dependencies to install                          |
|---------------|--------------------------------------------------|
| osm-api       | npm install --save x2js                          |
| osm-base64    | npm install --save angular-base64 x2js           |
| osm-oauth     | npm install --save osm-auth x2js                 |
| osm-nominatim |                                                  |
| osm-osrm      |                                                  |
| osm-overpass  |                                                  |
| osm-taginfo   |                                                  |
| osm-togeojson |                                                  |

Now you have choose this you can plug the component into your angular app:


    angular.module('example', ['osm.api'])



If you want, most of provided service can be configured using corresponding providers

    angular.module('example', ['osm.api'])
    .config(function (osmAPIProvider) {
        osmAPIProvider.options = {
            url: 'http://api06.dev.openstreetmap.org/api'
        };
    });


The complete list of injectable services:

| module        | service                    |
|---------------|----------------------------|
| osm.api       | osmAPI                     |
| osm.base64    | osmBase64                  |
| osm.oauth     | osmAuthService             |
| osm.nominatim | osmNominatim               |
| osm.osrm      | osrmAPI                    |
| osm.overpass  | osmOverpassAPI             |
| osm.taginfo   | osmTagInfoAPI              |
| osm.togeojson | osmtogeojson               |
