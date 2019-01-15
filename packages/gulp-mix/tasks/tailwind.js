import gulp from 'gulp';
import environments from 'gulp-environments';

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
import gulpIf from 'gulp-if';

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

const defaultOptions = {
    autoprefixer: {
        browsers: ['last 2 versions', 'IE 11'],
        grid: true,
    },
    purgecss: {
        content: ['**/*.html'],
        extractors: [
            {
                extractor: TailwindExtractor,
                extensions: ['html', 'js', 'ftl', 'yaml', 'hbs'],
            },
        ],
    },
    cssnano: {
        preset: 'default',
    },
};

const tailwind = (src, dest, configPath, options = {}) => {
    options = Object.assign(defaultOptions, options);
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
                options.autoprefixer && autoprefixer(options.autoprefixer),
            ]),
        )
        .pipe(gulpIf(isProd() && options.purgeCss, purgecss(options.purgeCss)))
        .pipe(isProd(postcss([options.cssnano && cssnano(options.cssnano)])))
        .pipe(isDev(sourcemaps.write('.')))
        .pipe(gulp.dest(dest));
};
tailwind.description = `concatenate and compile styles using tailwind before autoprefixing and minifying`;

export default tailwind;
