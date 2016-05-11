var conf = require('./conf');

module.exports = function(config){
    conf.browsers = ['PhantomJS'];
    config.singleRun = true;
    config.set(conf);
};
