const gulp = require('gulp');
const mix = require('gulp-mix');

function clean() {
    return mix.clean(['public/assets/*', 'public/css/*', 'public/js/*']);
}

function copy() {
    return mix.copy([
        {
            src: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
            dest: 'public/vendor/js/',
        },
    ]);
}

function svg() {
    return mix.svg([
        {
            src: 'src/assets/icons/*.svg',
            dest: 'public/assets/icons',
        },
    ]);
}

function css() {
    return mix.compileCSS('src/css/*.css', 'public/css/');
}

function es6() {
    return mix.compileES6(['src/js/BaseElement.js'], 'public/js/');
}

function es5() {
    return mix.compileES5(['src/js/BaseElement.js'], 'public/js/');
}

function lintCSS() {
    return mix.lintCSS('src/css/*.css');
}

function lintJS() {
    return mix.lintJS('src/js/*.js');
}

function watchCSS() {
    return mix.watchCSS(['src/css/*.css', 'tailwind.js']);
}

function watchJS() {
    return mix.watchJS(['src/js/*.js', 'gulpfile.js']);
}

gulp.task('default', gulp.series(clean, gulp.parallel(copy, svg, css, es6, es5)));

gulp.task('dev', gulp.series(gulp.parallel(lintCSS, lintJS), 'default', gulp.parallel(watchCSS, watchJS)));
gulp.task('prod', gulp.series('default'));
gulp.task('tinker', gulp.series('default', gulp.parallel(watchCSS, watchJS)));

// Full API
// mix.js(src, output);
// mix.css(src, output, { autoprefixerOptions: {}, postCssPlugins: []});
// mix.extract(vendorLibs);
// mix.sass(src, output);
// mix.postCss(src, output, [require('postcss-some-plugin')()]);
// mix.browserSync('my-site.test');
// mix.combine(files, destination);
// mix.svg(icons, destination);
// mix.copy(from, to);
// mix.copyDir(fromDir, toDir);
// mix.minify(file);
// mix.sourceMaps(); // Enable sourcemaps
// mix.version(); // Enable versioning.
// mix.disableNotifications();
// mix.options({
//   purgeCss: false, // Remove unused CSS selectors.
// });
// mix.then(function () {}) <-- Will be triggered each time Webpack finishes building.
