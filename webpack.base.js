// create a webpack configuration with all common parts included here
var createWebpackConfig = function(options) {
  return {
    entry: options.entry,
    output: options.output,
    plugins: options.plugins,
    // node: {
    //   fs: 'empty' // Because of jsrsasign usage of fs
    // },
    module: {
      loaders: [
        {
          test: /.js$/,
          loaders: ['babel'],
          exclude: /node_modules/,
          include: __dirname
        }
      ]
    },
    // this is for the sourcemaps
    devtool: options.devtool,
    externals: [
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ]
  };
};

module.exports = createWebpackConfig;
