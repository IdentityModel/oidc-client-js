var gulp = require('gulp');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var createWebpackConfig = require('./webpack.base');

// entry points for both configs
var npmEntry = './index.js';
var classicEntry = ['babel-polyfill', npmEntry];

// uglify plugin for minification
var uglifyPlugins =  [
  new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false,
          screw_ie8: true,
      },
  })
];

// npm compliant build with source-maps
gulp.task('build-lib-sourcemap', function() {
  // run webpack
  gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    entry: npmEntry,
    output: {
        filename: 'oidc-client.js',
        libraryTarget: 'umd'
    },
    plugins: [],
    devtool: 'inline-source-map'
  }), require('webpack')))
  .pipe(gulp.dest('lib/'));
});

// npm compliant build without source-maps & minified
gulp.task('build-lib-min', function() {
  // run webpack
  gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    entry: npmEntry,
    output: {
        filename: 'oidc-client.min.js',
        libraryTarget: 'umd',
    },
    plugins: uglifyPlugins,
    devtool: null
  }), require('webpack')))
  .pipe(gulp.dest('lib/'));
});

// classic build with sourcemaps
gulp.task('build-dist-sourcemap', function() {
  // run webpack
  gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    entry: classicEntry,
    output: {
        filename: 'oidc-client.js',
        libraryTarget: 'var',
        library: 'Oidc'
    },
    plugins: [],
    devtool: 'inline-source-map'
  }), require('webpack')))
  .pipe(gulp.dest('dist/'));
});

// classic build without sourcemaps & minified
gulp.task('build-dist-min', function() {
  // run webpack
  gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    entry: classicEntry,
    output: {
        filename: 'oidc-client.min.js',
        libraryTarget: 'var',
        library: 'Oidc'
    },
    plugins: uglifyPlugins,
    devtool: false,
  }), require('webpack')))
  .pipe(gulp.dest('dist/'));
});

// Replace the babel-polyfill with specific core-js polyfills.
function slimBuildTarget() {
  return {
    entry: ['./polyfills.js', './index.js'],
    output: {
      filename: 'oidc-client.slim.min.js',
      libraryTarget: 'var',
      library: 'Oidc'
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
        },
      })
    ],
  };
}

// Adds a configuration for slimming down the production build. This build
// does not contain the full babel-polyfill. Instead it imports specific
// core-js polyfills
gulp.task('build-slim', function() {
  gulp.src('index.js').pipe(webpackStream(createWebpackConfig(slimBuildTarget()), require('webpack')))
  .pipe(gulp.dest('dist/'))
});

// Creates a build with only RSA256 exponent+modulus support (no X509)
gulp.task('build-slim-rsa', function() {
  var conf = slimBuildTarget();
  conf.output.filename = 'oidc-client.rsa256.slim.min.js';

  conf.plugins.unshift(
    new webpack.NormalModuleReplacementPlugin(/(.*)crypto-jsrsasign(\.*)/, (resource) => {
      resource.request = resource.request.replace(/crypto-jsrsasign/, `crypto-rsa`);
    })
  );

  gulp.src('index.js').pipe(webpackStream(createWebpackConfig(conf), require('webpack')))
  .pipe(gulp.dest('dist/'))
});


// putting it all together
gulp.task('build', ['build-lib-sourcemap', 'build-lib-min', 'build-dist-sourcemap', 'build-dist-min', 'build-slim', 'build-slim-rsa']);
