module.exports = {
    entry: './src/_index.js',
    output: {
        path: 'dist',
        filename: 'IdentityModel.js',
        libraryTarget: 'umd',
        library: 'IdentityModel'
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
