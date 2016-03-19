var webpack = require('webpack');

module.exports = {
  debug: true,
  devtool: 'source-map',
  entry: {
      main: './main.tsx'
  },
  output: {
    filename: './dist/[name].js'
  },
  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.(tsx?)$/, loader: 'ts-loader?configFileName=./../../tsconfig.json' }
    ]
  }
};
