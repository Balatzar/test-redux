var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './app.js'
  ],
  output: {
      publicPath: '/',
      filename: 'main.js'
  },
  module: {
    loaders: [
      { 
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
    ]
  },
};
