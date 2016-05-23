var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './index.js'
    ],
    output: {
        path: path.join(__dirname, 'lib'),
        filename: 'oidc-client.js',
        libraryTarget: 'umd',
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
            },
        })
    ],
    node: {
        fs: 'empty', // Because of jsrsasign usage of fs
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname,
            }
        ]
    }
};
