module.exports = function(config) {

    var webpackCfg = require('../webpack.base.js')({
        mode: 'development',
        devtool: 'inline-cheap-source-map'
    });
    delete webpackCfg.entry;

    var files = [
        'unit/JoseUtil.spec.js',
        'unit/ResponseValidator.spec.js',
    ];
    var preprocessors = {};
    files.map(x => preprocessors[x] = ['webpack']);

    config.set({

        browsers: ['Firefox'],
        frameworks: ['mocha'],
        reporters: ['spec'],

        files: files,
        preprocessors: preprocessors,
        webpack: webpackCfg
    });
};