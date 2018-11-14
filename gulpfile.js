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
//     disableNotifications: false,
//     generateVersionManifest: false,
//     purgeCss: true,
// });

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
gulp.task('tinker', gulp.series('default', gulp.parallel(watchCSS, watchJS)));

// Full API
// mix.js(src, output);
// mix.css(src, output);
// mix.tailwind(src, output);
// mix.postCss(src, output, [plugins]);
// mix.browserSync('my-site.test');
// mix.svg(icons, destination);
// mix.copy(from, to);
// mix.options({
//     projectTitle: 'Frontend Stack',
//     disableNotifications: false,
//     generateVersionManifest: false,
//     purgeCss: true,
// });

// TODO: add mix.register() for adding custom tasks (eg. mix.sass() or mix.less())
