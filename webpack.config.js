var path = require('path');
var webpack = require('webpack');
var src = path.join(__dirname, 'src');

module.exports = {
    entry: {
        osm: './src/osm.ts',
        dependencies: ['angular', 'osm-auth', 'ngstorage']
    },
    output: {
        path: __dirname,
        filename: 'dist/osm.js'
    },
    resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension. 
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts'}
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
    }
};