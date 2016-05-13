var conf = require('./conf');

module.exports = function(config){
    conf.browsers = ['Chrome'];
    conf.coverageReporter.type = 'html';
    config.set(conf);
};