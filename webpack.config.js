module.exports = {
    entry: './src/_index.js',
    output: {
        path: 'build',
        filename: 'oidc-client.js',
        libraryTarget: 'umd',
        library: 'OidcClient'
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                loader: 'babel-loader'
            }
        ]
    }
};
