
/*
This is a CLI for bundling js scripts into a single file for use in a wordpress project. 
Wordpress will use bundle.js via the wp_enqueue_script() method.
Enter "npm run build" in the terminal to bundle the src directory.

  Prerequisites:
    1. Node.js installed locally.
    2. Run npm install on the project root dir.
*/
const path = require('path');
const fs = require('fs');
const { exit } = require('process');

const srcDirectory = fs.readdirSync('src');

  const readClassThenAppendBundle = (filename, callback) => {
    fs.readFile(path.resolve(__dirname, filename), 'utf8' , (err, data) => {
      if (err) {
        console.error(err)
        return;
      }
      let importExportPattern = new RegExp("export default [A-Za-z]+;|export {[A-Za-z ,]+};|import [a-zA-Z]+ from [a-zA-Z\"'\/.]+;","g");
      data = data.replace(importExportPattern, "");
      fs.appendFile(path.resolve(__dirname, 'dist/bundle.js'), data.toString(), err => {
          if (err) {
            console.error(err)
            return;
          }
          callback();
          return;
        })  
    });
  }

  const writeBundle = (callback) => {
    fs.writeFile('./dist/bundle.js', "", err => {
      if (err) {
        console.error(err);
        exit(1);
      }
      
      for (let i = 0; i <srcDirectory.length; i++) {
        readClassThenAppendBundle(`src/${srcDirectory[i]}`, ()=> {
        console.log(`Successfully bundled ${srcDirectory[i]}.`);
        });
      }
      callback();
    });
  }

  // Bundle ./src then append the iocContainer as the last item in the bundle
  writeBundle(()=> {
    readClassThenAppendBundle("iocContainer.js", ()=> {
      console.log('Successfully bundled iocContainer.');
      console.log('Bundle complete.');
      exit(0);
    });
  });
