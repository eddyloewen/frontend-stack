const gulp = require('gulp');
const mix = require('gulp-mix');

const copyFiles = [
    {
        src: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
        dest: 'public/vendor/js/',
    },
];

const svgSprites = [
    {
        src: 'src/assets/icons/*.svg',
        dest: 'public/assets/icons',
    },
];

// TODO: add global config to gulp-mix (see: https://github.com/JeffreyWay/laravel-mix/blob/master/src/index.js)
// mix.options({
//     projectTitle: 'Frontend Stack',
// });

const clean = () => mix.clean(['public/assets/*', 'public/css/*', 'public/js/*']);
const copy = () => mix.copy(copyFiles);
const svg = () => mix.svg(svgSprites);

// TODO: rename mix tasks to just css and js (remove compile part in function name)
const css = () => mix.compileCSS('src/css/*.css', 'public/css/');
const js = () => mix.compileJS(['src/js/BaseElement.js'], 'public/js/');

// TODO: use lint configs from project rather than from gulp-mix
const lintCSS = () => mix.lintCSS('src/css/*.css');
const lintJS = () => mix.lintJS('src/js/*.js');

const watchCSS = () => mix.watchCSS(['src/css/*.css', 'tailwind.js'], gulp.series(lintCSS, css));
const watchJS = () => mix.watchJS(['src/js/*.js', 'gulpfile.js'], gulp.series(lintJS, js));

gulp.task('default', gulp.series(clean, gulp.parallel(copy, svg, css, js)));

gulp.task('dev', gulp.series(gulp.parallel(lintCSS, lintJS), 'default', gulp.parallel(watchCSS, watchJS)));
gulp.task('prod', gulp.series('default'));
gulp.task('tinker', gulp.series('default', gulp.parallel(watchCSS, watchJS)));

// Full API
// mix.js(src, output);
// mix.css(src, output, { autoprefixerOptions: {}, postCssPlugins: []});
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
