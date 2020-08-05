var package = require('./package.json');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var webpackStream = require('webpack-stream');
var webpack = require('webpack');
var createWebpackConfig = require('./webpack.base');
var TerserPlugin = require('terser-webpack-plugin');

// entry points for both configs
var npmEntry ='./index.js';
var classicEntry = ['babel-polyfill', npmEntry];

const optimization = {
  minimizer: [new TerserPlugin({
    extractComments: false,
    terserOptions: {
      compress: {
          keep_fnames: true
      }
    }
  })]
};

const swapCryptoWithRSAImpl = new webpack.NormalModuleReplacementPlugin(
  /(.*)JoseUtil(\.js)?$/,
  (resource) => {
    resource.request = resource.request.replace(/JoseUtil/, 'JoseUtilRsa');
  }
)

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

// npm compliant build with source-maps
function build_lib_rsa_sourcemap(){
  // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'development',
    entry: npmEntry,
    output: {
        filename:'oidc-client.rsa256.js',
        libraryTarget:'umd',
        // Workaround for https://github.com/webpack/webpack/issues/6642
        globalObject: 'this'
    },
    plugins: [swapCryptoWithRSAImpl],
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
    optimization
  }), webpack))
  .pipe(gulp.dest('lib/'));
}

// npm compliant build without source-maps & minified
function build_lib_rsa_min(){
    // run webpack
  return gulp.src('index.js').pipe(webpackStream(createWebpackConfig({
    mode: 'production',
    entry: npmEntry,
    output: {
        filename:'oidc-client.rsa256.min.js',
        libraryTarget:'umd',
        // Workaround for https://github.com/webpack/webpack/issues/6642
        globalObject: 'this'
    },
    plugins: [swapCryptoWithRSAImpl],
    devtool: false,
    optimization
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
    optimization
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


function add_version(){
    var stream = source('./version.js');
    stream.end('const Version = "' + package.version + '"; export {Version};');
    return stream.pipe(gulp.dest('./'));
}

function build_jsrsasign(){
  return gulp.src(files)
      .pipe(concat('jsrsasign.js'))
      .pipe(gulp.dest('jsrsasign/dist/'));
}

function copy_ts(){
  return gulp.src('./index.d.ts')
      .pipe(rename('oidc-client.d.ts'))
      .pipe(gulp.dest('./dist/'));
}

// Replace the babel-polyfill with specific core-js polyfills.
function slimBuildTarget() {
    return {
        mode: 'production',
        entry: ['./polyfills.js', './index.js'],
        output: {
            filename: 'oidc-client.slim.min.js',
            libraryTarget: 'var',
            library: 'Oidc'
        },
        plugins: [],
        optimization
    };
}
function slimBuildTargetSourceMap() {
  return {
      mode: 'development',
      entry: ['./polyfills.js', './index.js'],
      output: {
          filename: 'oidc-client.slim.js',
          libraryTarget: 'var',
          library: 'Oidc'
      },
      plugins: [],
      devtool:'inline-source-map'
  };
}

// Adds a configuration for slimming down the production build. This build
// does not contain the full babel-polyfill. Instead it imports specific
// core-js polyfills
function build_dist_slim() {
    return gulp.src('index.js')
        .pipe(webpackStream(createWebpackConfig(slimBuildTarget()), webpack))
        .pipe(gulp.dest('dist/'));
};
function build_dist_slim_sourcemap() {
  return gulp.src('index.js')
      .pipe(webpackStream(createWebpackConfig(slimBuildTargetSourceMap()), webpack))
      .pipe(gulp.dest('dist/'));
};

// Creates a build with only RSA256 exponent+modulus support (no X509)
function build_dist_slim_rsa() {
    var conf = slimBuildTarget();
    conf.output.filename = 'oidc-client.rsa256.slim.min.js';

    // This plugin should always be first in the chain
    conf.plugins.unshift(swapCryptoWithRSAImpl);

    return gulp.src('index.js')
        .pipe(webpackStream(createWebpackConfig(conf), webpack))
        .pipe(gulp.dest('dist/'));
};
function build_dist_slim_rsa_sourcemap() {
  var conf = slimBuildTargetSourceMap();
  conf.output.filename = 'oidc-client.rsa256.slim.js';

  // This plugin should always be first in the chain
  conf.plugins.unshift(swapCryptoWithRSAImpl);

  return gulp.src('index.js')
      .pipe(webpackStream(createWebpackConfig(conf), webpack))
      .pipe(gulp.dest('dist/'));
};

// putting it all together
exports.default = gulp.series(
  add_version,
  build_jsrsasign,
  gulp.parallel(
    build_lib_sourcemap,
    build_lib_min,

    build_lib_rsa_sourcemap,
    build_lib_rsa_min,

    build_dist_sourcemap,
    build_dist_min,

    build_dist_slim_sourcemap,
    build_dist_slim,

    build_dist_slim_rsa_sourcemap,
    build_dist_slim_rsa
  ),
  copy_ts
);
