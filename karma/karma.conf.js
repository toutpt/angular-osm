module.exports = function(config){
    config.set({
        basePath : '',
        files : [
            {pattern: '../dist/dependencies.js', watched: true, included: true, nocache: true},
            {pattern: '../node_modules/osmtogeojson/osmtogeojson.js', watched: true, included: true, nocache: true},
            {pattern: '../node_modules/angular-mocks/angular-mocks.js', watched: false, included: true, served: true},
            {pattern: '../node_modules/ng-describe/dist/ng-describe.js', watched: false, included: true, served: true},
            {pattern: '../dist/osm.js', watched: true, included: true, nocache: true},
            {pattern: '../src/**/*.spec.js', watched: true, included: true, nocache: true}
        ],
        exclude : [],
        autoWatch : true,
        frameworks: ['jasmine'],
        plugins : [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        reporters: ['dots'],
        logLevel: 'LOG_DEBUG'
    });
};