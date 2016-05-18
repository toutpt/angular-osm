var path = require('path');
var webpack = require('webpack');

var config = {
    entry: {
        full: './src/osm.js',
        api: ['./src/api/api.js'],
        oauth: ['./src/oauth/oauth.js'],
        osmr: ['./src/osmr/osmr.js'],
        overpass: ['./src/overpass/overpass.js'],
        taginfo: ['./src/taginfo/taginfo.js'],
        togeojson: ['./src/togeojson/togeojson.js'],
        nominatim: ['./src/nominatim/nominatim.js'],
        utils: ['./src/utils/utils.js']
    },
    externals: {
        angular: 'angular',
        'osm-auth': 'osm-auth',
        'osmAuth': 'osmAuth',
        'angular-base64': 'angular-base64',
        ngstorage: 'ngstorage',
        osmtogeojson: 'osmtogeojson'
    },
    output: {
        path: __dirname,
        filename: 'dist/osm-[name].js',
        libraryTarget: 'umd',
        library: ['angular-osm', 'name']
    },
    module: {
        loaders: [
            {
               test: path.join(__dirname, 'src'),
               loader: 'babel-loader',
               query: {
                   presets: ['es2015']
               }
            }
        ]
    },
    devServer: {
        contentBase: __dirname,
        //hot: true,
        inline: true,
        progress: true,
        color: true
    },
};
module.exports = config;
