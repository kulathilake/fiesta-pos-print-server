const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
module.exports = {
  target: "node",
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js', // Output bundle file
  },
  externals: {
    'escpos-usb': 'commonjs escpos-usb',// exclude 'escpos-usb' from bundling,
    'usb': 'commonjs usb'
  },
  stats: {
    errorDetails:true
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "node_modules/escpos-usb",
          to: "node_modules/escpos-usb"
        },
        {
          from: "node_modules/usb",
          to: "node_modules/usb",
          globOptions: {
            ignore: ['**/test/**'], // Exclude the test directory
          },
        },
        {
          from: "node_modules/node-gyp-build",
          to: "node_modules/node-gyp-build"
        }
      ]
    }),
    new ZipPlugin({
      filename: 'bundle.zip',
      path: path.resolve(__dirname, 'dist'),
    })
  ],
};
