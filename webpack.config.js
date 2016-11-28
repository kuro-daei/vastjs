
const env = process.env.NODE_ENV || 'development';
console.log('build env:' + env);

const path = require('path');
const webpack = require('webpack');
const uglify = new webpack.optimize.UglifyJsPlugin({ compress: {warnings: false}, output: {comments: false} });


let config;
if (env === 'production') {
  config = {
    entry: {'dist/index.js': './src/main.js'},
    output: { filename: '[name]' },
    plugins: [ uglify, defineProduction ],
    module: { loaders: [ babelLoader, urlLoader ] },
  };
} else {
  config = {
    entry: {index: [
      './test/src/01-base.js'
    ]},
    output: {
      path: path.join(__dirname, 'test/dist'),
      filename: '[name].js'
    },
    node: {fs: 'empty'},
    target: 'node',
    devtool: 'source-map',
    module: {},
    loaders: [
      {
        test: /src\/*.js$/,
        loaders: ['babel'],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /test\/*.js$/,
        loaders: ['mocha', 'babel'],
        exclude: /(node_modules|bower_components)/,
      },
      { test: /\.xml$/, loader: 'xml-loader' } // will load all .xml files with xml-loader by default
    ],
    devServer: {
      headers: {
        'Access-Control-Allow-Origin': 'http://tpc.googlesyndication.com',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Range'
      }
    }
  };
}

module.exports = config;
