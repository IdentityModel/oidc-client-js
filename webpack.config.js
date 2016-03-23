module.exports = {
    entry:  './src/index.js',
    output: {
        path:     'build',
        filename: 'OidcClient.js',
        libraryTarget: 'umd',
        library: 'OidcClient'
    },
    module: {
        loaders: [
            {
                test:   /\.js/,
                loader: 'babel'
            }
        ]
    }
};
