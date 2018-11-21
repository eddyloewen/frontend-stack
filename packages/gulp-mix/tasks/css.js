import gulp from 'gulp';
import environments from 'gulp-environments';

import stylelint from 'stylelint';

import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import sourcemaps from 'gulp-sourcemaps';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import purgecss from 'gulp-purgecss';
import cssnano from 'cssnano';
import notify from 'gulp-notify';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';

// Custom PurgeCSS extractor for Tailwind that allows special characters in class names.
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
    }
}

const lintCSS = src => {
    return gulp
        .src(src)
        .pipe(
            plumber({
                errorHandler: error => {
                    if (Config.showNotifications) {
                        notify.onError({
                            title: Config.projectTitle + ' - Lint CSS Error',
                            message: error.toString(),
                        })(error);
                    }
                    this.emit('end');
                },
            }),
        )
        .pipe(postcss([stylelint]));
};
lintCSS.description = `lint styles using stylint`;

const css = (src, dest) => {
    return gulp
        .src(src)
        .pipe(
            plumber({
                errorHandler: error => {
                    if (Config.showNotifications) {
                        notify.onError({
                            title: Config.projectTitle + ' - CSS Error',
                            message: error.toString(),
                        })(error);
                    }
                    this.emit('end');
                },
            }),
        )
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                postcssImport(),
                tailwindcss('tailwind.js'),
                postcssNested(),
                autoprefixer({
                    browsers: ['last 2 versions', 'IE 11'],
                    grid: true,
                }),
            ]),
        )
        .pipe(
            isProd(
                purgecss({
                    content: ['templates/**/*.html'],
                    extractors: [
                        {
                            extractor: TailwindExtractor,
                            extensions: ['html', 'js', 'ftl', 'yaml', 'hbs'],
                        },
                    ],
                }),
            ),
        )
        .pipe(
            isProd(
                postcss([
                    cssnano({
                        preset: 'default',
                    }),
                ]),
            ),
        )
        .pipe(isDev(sourcemaps.write('.')))
        .pipe(gulp.dest(dest));
};
css.description = `concatenate and compile styles using stylus before autoprefixing and minifying`;

const tailwind = (src, dest, configPath) => {
    return gulp
        .src(src)
        .pipe(
            plumber({
                errorHandler: error => {
                    if (Config.showNotifications) {
                        notify.onError({
                            title: Config.projectTitle + ' - Tailwind CSS Error',
                            message: error.toString(),
                        })(error);
                    }
                    this.emit('end');
                },
            }),
        )
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                postcssImport(),
                tailwindcss(configPath),
                postcssNested(),
                autoprefixer({
                    browsers: ['last 2 versions', 'IE 11'],
                    grid: true,
                }),
            ]),
        )
        .pipe(
            isProd(
                purgecss({
                    content: ['templates/**/*.html'],
                    extractors: [
                        {
                            extractor: TailwindExtractor,
                            extensions: ['html', 'js', 'ftl', 'yaml', 'hbs'],
                        },
                    ],
                }),
            ),
        )
        .pipe(
            isProd(
                postcss([
                    cssnano({
                        preset: 'default',
                    }),
                ]),
            ),
        )
        .pipe(isDev(sourcemaps.write('.')))
        .pipe(gulp.dest(dest));
};
tailwind.description = `concatenate and compile styles using tailwind before autoprefixing and minifying`;

const postCSS = (src, dest, plugins) => {
    return gulp
        .src(src)
        .pipe(
            plumber({
                errorHandler: error => {
                    if (Config.showNotifications) {
                        notify.onError({
                            title: Config.projectTitle + ' - PostCSS Error',
                            message: error.toString(),
                        })(error);
                    }
                    this.emit('end');
                },
            }),
        )
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(isDev(sourcemaps.write('.')))
        .pipe(gulp.dest(dest));
};
postCSS.description = `concatenate and compile styles using tailwind before autoprefixing and minifying`;

const watchCSS = (src, tasks) => {
    if (Config.showNotifications) {
        notify({ title: Config.projectTitle, message: 'Watching for CSS changes...' }).write('');
    }
    gulp.watch(src, tasks).on('change', function() {
        if (Config.showNotifications) {
            notify({ title: Config.projectTitle, message: 'CSS changed' }).write('');
        }
    });
};
watchCSS.description = `watch for style changes and lint then compile on change`;

export { css, tailwind, postCSS, lintCSS, watchCSS };
