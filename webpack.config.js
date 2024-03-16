const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node', 
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js' // Output file name
  },
  stats: {
    errorDetails: true
  }
};
