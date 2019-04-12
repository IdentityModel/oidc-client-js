var gulp = require('gulp');
var concat = require('gulp-concat');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var createWebpackConfig = require('./webpack.base');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// entry points for both configs
var npmEntry ='./index.js';
var classicEntry = ['babel-polyfill', npmEntry];

// npm compliant build with source-maps
function build_lib_sourcemap(){
  // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'development',
    entry: npmEntry,
    output: {
        filename:'oidc-client.js',
        libraryTarget:'umd',
        // Workaround for https://github.com/webpack/webpack/issues/6642
        globalObject: 'this'
    },
    plugins: [],
    devtool:'inline-source-map'
  }), webpack))
  .pipe(gulp.dest('lib/'));
}

// npm compliant build without source-maps & minified
function build_lib_min(){
    // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'production',
    entry: npmEntry,
    output: {
        filename:'oidc-client.min.js',
        libraryTarget:'umd',
        // Workaround for https://github.com/webpack/webpack/issues/6642
        globalObject: 'this'
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
}

// classic build with sourcemaps
function build_dist_sourcemap(){
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
}

// classic build without sourcemaps & minified
function build_dist_min(){
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
}

// this is used to manually build jsrsasign with the fewest modules to reduce its size
var files = [
     'jsrsasign/header.js'

    ,'jsrsasign/ext/yahoo-min.js'

    ,'jsrsasign/ext/cj/cryptojs-312-core-fix-min.js'
    ,'jsrsasign/ext/cj/x64-core_min.js'
//    ,'jsrsasign/ext/cj/cipher-core_min.js'
//    ,'jsrsasign/ext/cj/aes_min.js'
//    ,'jsrsasign/ext/cj/tripledes_min.js'
    ,'jsrsasign/ext/cj/enc-base64_min.js'
//    ,'jsrsasign/ext/cj/md5_min.js'
//    ,'jsrsasign/ext/cj/sha1_min.js'
    ,'jsrsasign/ext/cj/sha256_min.js'
//    ,'jsrsasign/ext/cj/sha224_min.js'
    ,'jsrsasign/ext/cj/sha512_min.js'
    ,'jsrsasign/ext/cj/sha384_min.js'
//    ,'jsrsasign/ext/cj/ripemd160_min.js'
//    ,'jsrsasign/ext/cj/hmac_min.js'
//    ,'jsrsasign/ext/cj/pbkdf2_min.js'

    ,'jsrsasign/ext/base64-min.js'
    ,'jsrsasign/ext/jsbn-min.js'
    ,'jsrsasign/ext/jsbn2-min.js'
    ,'jsrsasign/ext/prng4-min.js'
    ,'jsrsasign/ext/rng-min.js'
    ,'jsrsasign/ext/rsa-min.js'
//    ,'jsrsasign/ext/rsa2-min.js'
    ,'jsrsasign/ext/ec-min.js'
    ,'jsrsasign/ext/ec-patch-min.js'
    ,'jsrsasign/ext/json-sans-eval-min.js'

	  ,'jsrsasign/min/asn1-1.0.min.js'
  	,'jsrsasign/min/asn1hex-1.1.min.js'
//  	,'jsrsasign/min/asn1x509-1.0.min.js'
//  	,'jsrsasign/min/asn1cms-1.0.min.js'
//  	,'jsrsasign/min/asn1tsp-1.0.min.js'
//  	,'jsrsasign/min/asn1cades-1.0.min.js'
//  	,'jsrsasign/min/asn1csr-1.0.min.js'
//  	,'jsrsasign/min/asn1ocsp-1.0.min.js'
  	,'jsrsasign/min/base64x-1.1.min.js'
  	,'jsrsasign/min/crypto-1.1.min.js'
  	,'jsrsasign/min/ecdsa-modified-1.0.min.js'
  	,'jsrsasign/min/ecparam-1.0.min.js'
//  	,'jsrsasign/min/dsa-2.0.min.js'
  	,'jsrsasign/min/keyutil-1.0.min.js'
  	,'jsrsasign/min/rsapem-1.1.min.js'
  	,'jsrsasign/min/rsasign-1.2.min.js'
  	,'jsrsasign/min/x509-1.1.min.js'
  	,'jsrsasign/min/jws-3.3.min.js'
//  	,'jsrsasign/min/jwsjs-2.0.min.js'

    ,'jsrsasign/footer.js'
];

function build_jsrsasign(){
    return gulp.src(files)
        .pipe(concat('jsrsasign.js'))
        .pipe(gulp.dest('jsrsasign/dist/'));
}

// putting it all together
//gulp.task('build', ['build-lib-sourcemap','build-lib-min','build-dist-sourcemap','build-dist-min']);
exports.default = gulp.series(
  build_jsrsasign,
  gulp.parallel(build_lib_sourcemap, build_lib_min, build_dist_sourcemap, build_dist_min));
