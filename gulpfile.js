var gulp = require('gulp');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var createWebpackConfig = require('./webpack.base');

// entry points for both configs
var npmEntry = './index.js';
var classicEntry = ['babel-polyfill', npmEntry];

var electronPlugin = new webpack.IgnorePlugin(/^(electron)$/);

// uglify plugin for minification
var uglifyPlugin = new webpack.optimize.UglifyJsPlugin({
      compress: {
          warnings: false,
          screw_ie8: true,
      },
  });

var externals = { "electron" : "electron" };

// npm compliant build with source-maps
gulp.task('build-lib-sourcemap', function() {
  // run webpack
  gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    entry: npmEntry,
    output: {
        filename: 'oidc-client.js',
        libraryTarget: 'umd'
    },
    plugins: [electronPlugin],
    devtool: 'inline-source-map',
    externals: externals
  })))
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
    plugins: [uglifyPlugin, electronPlugin],
    devtool: null,
    externals: externals
  })))
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
    plugins: [electronPlugin],
    devtool: 'inline-source-map',
    externals: externals
  })))
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
    plugins: [uglifyPlugin, electronPlugin],
    devtool: null,
    externals: externals
  })))
  .pipe(gulp.dest('dist/'));
});

// putting it all together
gulp.task('build', ['build-lib-sourcemap', 'build-lib-min', 'build-dist-sourcemap', 'build-dist-min']);
