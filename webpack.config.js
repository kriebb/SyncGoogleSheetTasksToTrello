const path = require('path');
const GasPlugin = require("gas-webpack-plugin");
const es3ifyPlugin = require('es3ify-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
  code: './src/index.ts'
  },
  devtool: 'inline-source-map',
  context: __dirname,

  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'Code.js',
    path: path.resolve(__dirname, 'built')
  },
  plugins: [
    new GasPlugin(),
    new es3ifyPlugin(),
    new CopyWebpackPlugin([
      { from: './node_modules/underscore/underscore.js', to: path.resolve(__dirname, 'built'), force:true},
      { from: './src/dependencies/appsscript.json', to: path.resolve(__dirname, 'built'), force:true},
    ], {}),
  ]

};
