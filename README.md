# CredCardCalc


´´´
json
{
  "name": "PrimacareAetna",
  "version": "0.0.1",
  "description": "Aetna",
  "repository": {
    "type": "git",
    "url": ""
  },
  "scripts": {
    "postinstall": "node utils/intro.js",
    "start": "gulp clean && gulp",
    "build:local": "gulp clean && gulp base && gulp bundle:img",
    "build:prod": "gulp clean && gulp base && gulp bundle",
    "help": "gulp reference"
  },
  "keywords": [
    "3096",
    "aetna",
    "primacare"
  ],
  "author": "Zemoga inc",
  "license": "ISC",
  "dependencies": {
    "purecss": "latest"
  },
  "devDependencies": {
    "browser-sync": "latest",
    "browserify": "latest",
    "del": "latest",
    "event-stream": "latest",
    "gulp": "latest",
    "gulp-autoprefixer": "latest",
    "gulp-compile-handlebars": "latest",
    "gulp-concat": "latest",
    "gulp-imagemin": "latest",
    "gulp-less": "latest",
    "gulp-minify-css": "latest",
    "gulp-notify": "latest",
    "gulp-rename": "latest",
    "gulp-replace": "latest",
    "gulp-sourcemaps": "latest",
    "gulp-task-listing": "latest",
    "gulp-uglify": "latest",
    "gulp-util": "latest",
    "handlebars": "latest",
    "imagemin-pngquant": "latest",
    "moment": "latest",
    "vinyl-source-stream": "latest",
    "watchify": "latest"
  }
}
´´´




## References
[abduzeedo ui design analytics](http://abduzeedo.com/ui-design-analytics)
