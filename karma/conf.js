module.exports = {
    basePath : '',
    files : [
        {pattern: '../node_modules/angular/angular.js', watched: true, included: true, nocache: true},
        {pattern: '../node_modules/angular-base64/angular-base64.min.js', watched: true, included: true, nocache: true},
        {pattern: '../node_modules/x2js/x2js.js', watched: true, included: true, nocache: true},
        {pattern: '../node_modules/angular-mocks/angular-mocks.js', watched: false, included: true, served: true},
        {pattern: '../node_modules/ng-describe/dist/ng-describe.js', watched: false, included: true, served: true},
        '../dist/osm-full.js',
        {pattern: '../src/**/*.spec.js', watched: true, included: true, nocache: true}
    ],
    exclude : [],
    autoWatch : true,
    frameworks: ['jasmine'],
    reporters: ['dots'],
    coverageReporter: {
        dir: '../coverage/'
    },
    preprocessors: {},
    logLevel: 'LOG_DEBUG'
};