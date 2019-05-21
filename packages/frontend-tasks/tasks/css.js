import gulp from 'gulp';
import environments from 'gulp-environments';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import purgecss from 'gulp-purgecss';
import cssnano from 'cssnano';
import notify from 'gulp-notify';
import gulpIf from 'gulp-if';
import hash from '../.node/GulpHashPlugin';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';
import watchCSS from './watchCSS';

const defaultOptions = {
    autoprefixer: {
        browsers: ['last 2 versions', 'IE 11'],
        grid: true,
    },
    purgecss: {
        content: ['**/*.html'],
    },
    cssnano: {
        preset: 'default',
    },
};

const cssTask = (src, dest, options = {}) => {
    options = Object.assign(defaultOptions, options);
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
        .pipe(postcss([postcssImport(), postcssNested(), options.autoprefixer && autoprefixer(options.autoprefixer)]))
        .pipe(gulpIf(isProd() && options.purgeCss, purgecss(options.purgeCss)))
        .pipe(isProd(postcss([options.cssnano && cssnano(options.cssnano)])))
        .pipe(isDev(sourcemaps.write('.')))
        .pipe(gulp.dest(dest))
        .pipe(gulpIf(Config.versionManifest !== false, hash(Config.versionManifest)));
};

const css = (src, dest, options = {}) => {
    const css = () => cssTask(src, dest, options);
    return isDev() ? watchCSS(src, css) : cssTask(src, dest, options);
};
css.description = `concatenate and compile styles using stylus before autoprefixing and minifying`;

export default css;
