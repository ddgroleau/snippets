/*
This is a CLI for bundling .js scripts into a single file to improve JavaScript loading performance. 
Wordpress will use bundle.js via the wp_enqueue_script() method.
Enter "npm run build" in the terminal to bundle the /src directory to the /dist directory.
  Prerequisites:
    1. Node.js installed locally.
    2. Run npm install on the project root dir.
*/
const path = require('path');
const fs = require('fs');
const { exit } = require('process');

class Bundler {
  constructor() {
  }

  execute() {
    const srcDirectory = fs.readdirSync(path.resolve(__dirname, 'src'));
    fs.writeFileSync('./dist/bundle.js', "");

    srcDirectory.map(filename => {
      this._readFileThenAppendBundle(`src/${filename}`); 
    });

    // Append the iocContainer as the last item in the bundle
    this._readFileThenAppendBundle('iocContainer.js'); 

    console.log('Bundle complete.');
    exit(0);
  }

  _readFileThenAppendBundle(filename) {
    try {
      let fileContents = fs.readFileSync(path.resolve(__dirname, filename), { encoding: 'utf8'});
      
      // Matches any import/export statement and removes them
      let importExportPattern = new RegExp("export default [A-Za-z]+;|export {[A-Za-z ,]+};|import [a-zA-Z]+ from [a-zA-Z0-9\"\'\.\/\-]+;","g");
      fileContents = fileContents.replace(importExportPattern, "");
      
      fs.appendFileSync(path.resolve(__dirname, 'dist/bundle.js'),fileContents);
      console.log(`Successfully bundled ${filename.split('/').pop()}.`);
    } catch {
      console.log(`Failed to bundle ${filename.split('/').pop()}.`);
      exit(1);
    } finally {
      return;
    }
  };
}

const bundler = new Bundler();
bundler.execute();