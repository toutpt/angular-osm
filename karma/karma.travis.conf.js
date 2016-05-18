var conf = require('./conf');

module.exports = function(config){
    conf.browsers = ['PhantomJS'];
    conf.reporters.push('coverage', 'coveralls');
    conf.preprocessors['../dist/osm-full.js'] = ['coverage'];
    config.singleRun = true;
    conf.coverageReporter.type = 'lcov';
    config.set(conf);
};
