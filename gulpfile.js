const glob = require('glob');
const gulp = require('gulp');
const mix = require('gulp-mix');

const files = {
    clean: ['public/assets/*', 'public/css/*', 'public/js/*'],
    copy: [
        {
            src: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
            dest: 'public/vendor/js/',
        },
    ],
    svg: [
        {
            src: 'src/assets/icons/*.svg',
            dest: 'public/assets/icons',
        },
    ],
};

mix.options({
    projectTitle: 'Frontend Stack',
});

const clean = () => mix.clean(files.clean);
const copy = () => mix.copy(files.copy);
const svg = () => mix.svg(files.svg);

const css = () => mix.css('src/css/*.css', 'public/css/');
const js = () => mix.js(['src/js/BaseElement.js'], 'public/js/');
const es6 = () => mix.es6(['src/js/BaseElement.js'], 'public/js/');

const lintCSS = () => mix.lintCSS('src/css/*.css');
const lintJS = () => mix.lintJS('src/js/*.js');

const watchCSS = () => mix.watchCSS(['src/css/*.css', 'tailwind.js'], gulp.series(lintCSS, css));
const watchJS = () => mix.watchJS(['src/js/*.js', 'gulpfile.js'], gulp.series(lintJS, es6));

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
