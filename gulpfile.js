const glob = require('glob');
const gulp = require('gulp');
const tasks = require('frontend-tasks');

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

tasks.options({
    projectTitle: 'Frontend Stack',
    versionManifest: { name: 'public/hash-manifest.json' },
});

const clean = () => tasks.clean(files.clean);
const copy = () => tasks.copy(files.copy);
const svg = () => tasks.svg(files.svg);

const css = () => tasks.css('src/css/*.css', 'public/css/');
const js = () => tasks.js(['src/js/*.js'], 'public/js/');

const lintCSS = () => tasks.lintCSS('src/css/*.css');
const lintJS = () => tasks.lintJS('src/js/*.js');

gulp.task('default', gulp.series(clean, gulp.parallel(copy, svg, css, js)));
gulp.task('dev', gulp.series(gulp.parallel(lintCSS, lintJS), 'default'));
gulp.task('prod', gulp.series('default'));

tasks.register(tasks, 'log', filesGlob => {
    return new Promise(resolve => {
        glob(filesGlob, function(error, files) {
            console.log('custom log task', files);
        });
        resolve();
    });
});
const customTask = () => tasks.log('src/css/*.css');
gulp.task('tinker', gulp.series(customTask, 'default'));
