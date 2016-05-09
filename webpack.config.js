var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        osm: './src/osm.js',
        dependencies: ['angular', 'osm-auth', 'ngstorage', 'osmtogeojson']
    },
    output: {
        path: __dirname,
        filename: 'dist/osm.js'
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
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"dependencies", /* filename= */"dist/dependencies.js"),
    ],
    devServer: {
        contentBase: __dirname,
        //hot: true,
        inline: true,
        progress: true,
        color: true
    },
};