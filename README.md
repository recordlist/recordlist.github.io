## Usage

### Basic Usage

After downloading, simply edit the HTML and CSS files included with the template in your favorite text editor to make changes. These are the only files you need to worry about, you can ignore everything else! To preview the changes you make to the code, you can open the `index.html` file in your web browser.

### Advanced Usage

After installation, run `npm install`, 'npm install uglify-js -g'.

Install 'npm install --save-dev gulp-uglify', 'npm install gulp-concat --save-dev'

For old browser compatibility added Modernizr 3.8.0., it doesn't contain build version.
Run './node_modules/modernizr/bin/modernizr -c ./node_modules/modernizr/lib/config-all.json -d ./node_modules/modernizr/dist/modernizr-3.8.0.js'.
There is a mistake in build aprox. on line 6933 in cleanup part, add one more condition into if statement - from 'if (body.fake) {' to 'if (body.parentNode && body.fake) {'.
Then run uglify & minify to get minified version of Modernizr 3.8.0 
- 'uglifyjs ./node_modules/modernizr/dist/modernizr-3.8.0.js --output ./node_modules/modernizr/dist/modernizr-3.8.0.min.js'.

After all run 'gulp' to build all staff.

Then`gulp dev` which will open up a preview of the template in your default browser, watch for changes to core template files, and live reload the browser when changes are saved. You can view the `gulpfile.js` to see which tasks are included with the dev environment.

You must have npm and Gulp installed globally on your machine in order to use these features.

## Copyright and License

Copyright © recordlist.github.io 2020. Code released under the [MIT](https://github.com/recordlist/recordlist.github.io/blob/master/LICENSE) license.