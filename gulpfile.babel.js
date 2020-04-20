import glob from 'glob-all';
import { tasks, options } from 'frontend-tasks';
import { task, parallel, series } from 'gulp';
import dotenv from 'dotenv';

dotenv.config();

const files = {
    clean: ['public/assets/*', 'public/css/*', 'public/js/*'],
    copy: [
        {
            src: 'src/assets/images/*.*',
            dest: 'public/assets/images',
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

task('clean', tasks.clean({ directories: files.clean }));
task('copy', tasks.copy({ paths: files.copy }));
task('svg', tasks.svg({ paths: files.svg }));

task('css', tasks.css({ src: 'src/css/*.css', dest: 'public/css/' }));
task('js', tasks.js({ src: ['src/js/**/*.js'], dest: 'public/js/' }));

task('lintCSS', tasks.lintCSS({ src: 'src/css/*.css' }));
task('lintJS', tasks.lintJS({ src: 'src/js/*.js' }));

task('ls', tasks.run({ cmd: 'ls', args: ['-la'] }));

task(
    'watch',
    tasks.watch({
        paths: [
            {
                src: ['src/css/**/*.css', 'tailwind.config.js'],
                tasks: series('lintCSS', 'css'),
                changeMessage: 'CSS changed',
            },
            {
                src: ['src/assets/**/*.svg'],
                tasks: series('svg'),
                changeMessage: 'SVG Sprite changed',
            },
        ],
    }),
);

task(
    'browserSync',
    tasks.browserSync({
        files: ['public/**/*.js', 'public/**/*.css'],
    }),
);

task('default', series('clean', parallel('copy', 'svg', 'css', 'js')));
task('dev', series(parallel('lintCSS', 'lintJS'), 'default'));
task('dev:watch', series('dev', 'watch'));
task('dev:sync', parallel('dev:watch', 'browserSync'));
task('prod', series('default'));

const log = filesGlob => {
    return () => {
        return new Promise(resolve => {
            glob(filesGlob, function (error, files) {
                console.log('custom log task', files);
            });
            resolve();
        });
    };
};

task('log', log('src/css/*.css'));
task('tinker', series('log', 'default'));
