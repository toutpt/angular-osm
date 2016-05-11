module.exports = function(config){
    config.set({
        basePath : '',
        files : [
            {pattern: '../node_modules/angular/angular.min.js', watched: true, included: true, nocache: true},
            {pattern: '../node_modules/ngstorage/ngStorage.min.js', watched: true, included: true, nocache: true},
            {pattern: '../node_modules/angular-base64/angular-base64.min.js', watched: true, included: true, nocache: true},
            {pattern: '../node_modules/osmtogeojson/osmtogeojson.js', watched: true, included: true, nocache: true},
            {pattern: '../node_modules/angular-mocks/angular-mocks.js', watched: false, included: true, served: true},
            {pattern: '../node_modules/ng-describe/dist/ng-describe.js', watched: false, included: true, served: true},
            {pattern: '../dist/osm-full.js', watched: true, included: true, nocache: true},
            {pattern: '../src/**/*.spec.js', watched: true, included: true, nocache: true}
        ],
        exclude : [],
        autoWatch : true,
        frameworks: ['jasmine'],
        reporters: ['dots'],
        logLevel: 'LOG_DEBUG'
    });
};