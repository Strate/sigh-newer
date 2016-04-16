# sigh-newer

[![build status](https://circleci.com/gh/Strate/sigh-newer.png)](https://circleci.com/gh/Strate/sigh-newer)

Sigh plugin for filtering files, keeping only newer in stream

## Example

`npm install --save-dev sigh-newer` then add something like this to your `sigh.js`:
```javascript
var newer, glob, write, postcss, stylus
module.exports = function(pipelines) {
    pipelines['assets'] = [
      glob("src/**/*.jpg"),
      newer("target"),
      write("target") // writes only newer files that in target
    ];
    
    pipelines['styl'] = [
      glob("src/**/*.styl"),
      // it can test against changed extension,
      // in this example files filtered by searching corresponding css file in target directory
      newer("target", "css"),
      stylus(),
      postcss(),
      write("target")
    ];
}
```
