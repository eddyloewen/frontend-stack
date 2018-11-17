const glob = require('glob');
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

mix.options({
    projectTitle: 'Frontend Stack',
});

const clean = () => mix.clean(['public/assets/*', 'public/css/*', 'public/js/*']);
const copy = () => mix.copy(copyFiles);
const svg = () => mix.svg(svgSprites);

const css = () => mix.css('src/css/*.css', 'public/css/');
const js = () => mix.js(['src/js/BaseElement.js'], 'public/js/');

const lintCSS = () => mix.lintCSS('src/css/*.css');
const lintJS = () => mix.lintJS('src/js/*.js');

const watchCSS = () => mix.watchCSS(['src/css/*.css', 'tailwind.js'], gulp.series(lintCSS, css));
const watchJS = () => mix.watchJS(['src/js/*.js', 'gulpfile.js'], gulp.series(lintJS, js));

gulp.task('default', gulp.series(clean, gulp.parallel(copy, svg, css, js)));
gulp.task('dev', gulp.series(gulp.parallel(lintCSS, lintJS), 'default', gulp.parallel(watchCSS, watchJS)));
gulp.task('prod', gulp.series('default'));

mix.register(mix, 'log', filesGlob => {
    return new Promise(resolve => {
        glob(filesGlob, function(error, files) {
            console.log('custom log task', files);
        });
        resolve();
    });
});
const customTask = () => mix.log('src/css/*.css');
gulp.task('tinker', gulp.series(customTask, 'default', gulp.parallel(watchCSS, watchJS)));

// Full API
// mix.js(src, destination);
// mix.css(src, destination);
// mix.tailwind(src, destination);
// mix.postCss(src, destination, [plugins]);
// mix.browserSync(options);
// mix.svg(icons, destination);
// mix.copy(src, destination);
// mix.options({
//     projectTitle: 'Frontend Stack',
//     disableNotifications: false,
//     generateVersionManifest: false,
//     purgeCss: true,
// });
