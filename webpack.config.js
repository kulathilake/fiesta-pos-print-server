const path = require('path');
const exec = require('child_process').exec;
const AdmZip = require('adm-zip');
const ZipPlugin = require('zip-webpack-plugin');
/**
 * @type {import("webpack").Configuration}
 */
module.exports = {
  target: "node",
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js', // Output bundle file
  },
  externals: {
    'escpos-usb': 'commonjs escpos-usb',// exclude 'escpos-usb' from bundling,
  },
  stats: {
    errorDetails:true
  },
  plugins: [
    {
      /**
       * @param {import("webpack").Compiler} compiler 
       */
      apply: compiler => {
        compiler.hooks.afterEmit.tapAsync("Install escpos-usb",(compilation,callback)=>{
          console.log("packaging escpos-usb")
          exec("npm init -y && npm i escpos-usb",{cwd: path.resolve(__dirname,'build')},(err)=>{
            if(err){
              console.log(err);
              return;
            }
            console.log("zipping",)
            const zip = new AdmZip();
            zip.addLocalFolder(path.resolve(__dirname,"build"));
            zip.writeZip(path.resolve(__dirname,"dist","bundle.zip"));
            callback();
          })
        })
      }
    }
  ],
};
