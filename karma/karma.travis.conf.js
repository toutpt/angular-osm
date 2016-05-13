var conf = require('./conf');

module.exports = function(config){
    conf.browsers = ['PhantomJS'];
    config.singleRun = true;
    conf.coverageReporter.type = 'lcov';
    config.set(conf);
};
