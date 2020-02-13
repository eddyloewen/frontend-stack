import glob from 'glob-all';
import { tasks, options } from 'frontend-tasks';
import { task, parallel, series } from 'gulp';

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

options({
    projectTitle: 'Frontend Stack',
    versionManifest: { name: 'public/hash-manifest.json' },
});

task('clean', tasks.clean(files.clean));
task('copy', tasks.copy(files.copy));
task('svg', tasks.svg(files.svg));

task('css', tasks.tailwind('src/css/*.css', 'public/css/'));
task('js', tasks.js(['src/js/*.js'], 'public/js/'));

task('lintCSS', tasks.lintCSS('src/css/*.css'));
task('lintJS', tasks.lintJS({ src: 'src/js/*.js' }));

task('default', series('clean', parallel('copy', 'svg', 'css', 'js')));
task('dev', series(parallel('lintCSS', 'lintJS'), 'default'));
task('prod', series('default'));

const log = filesGlob => {
    return () => {
        return new Promise(resolve => {
            glob(filesGlob, function(error, files) {
                console.log('custom log task', files);
            });
            resolve();
        });
    };
};

task('log', log('src/css/*.css'));
task('tinker', series('log', 'default'));
