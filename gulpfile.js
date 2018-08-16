var gulp = require('gulp');
var concat = require('gulp-concat');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var createWebpackConfig = require('./webpack.base');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// entry points for both configs
var npmEntry ='./index.js';
var classicEntry = ['babel-polyfill', 'webcrypto-shim', npmEntry];

// npm compliant build with source-maps
gulp.task('build-lib-sourcemap', function() {
  // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'development',
    entry: npmEntry,
    output: {
        filename:'oidc-client.js',
        libraryTarget:'umd'
    },
    plugins: [],
    devtool:'inline-source-map'
  }), webpack))
  .pipe(gulp.dest('lib/'));
});

// npm compliant build without source-maps & minified
gulp.task('build-lib-min', function() {
  // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'production',
    entry: npmEntry,
    output: {
        filename:'oidc-client.min.js',
        libraryTarget:'umd',
    },
    plugins: [],
    devtool: false,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            keep_fnames: true
          }
        })
      ]
    }
  }), webpack))
  .pipe(gulp.dest('lib/'));
});

// classic build with sourcemaps
gulp.task('build-dist-sourcemap', function() {
  // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'development',
    entry: classicEntry,
    output: {
        filename:'oidc-client.js',
        libraryTarget:'var',
        library:'Oidc'
    },
    plugins: [],
    devtool:'inline-source-map'
  }), webpack))
  .pipe(gulp.dest('dist/'));
});

// classic build without sourcemaps & minified
gulp.task('build-dist-min', function() {
  // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'production',
    entry: classicEntry,
    output: {
        filename:'oidc-client.min.js',
        libraryTarget:'var',
        library:'Oidc'
    },
    plugins: [],
    devtool: false,
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            keep_fnames: true
          }
        })
      ]
    }
  }), webpack))
  .pipe(gulp.dest('dist/'));
});

// putting it all together
gulp.task('build', ['build-lib-sourcemap','build-lib-min','build-dist-sourcemap','build-dist-min']);
