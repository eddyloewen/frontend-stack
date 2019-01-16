import gulp from 'gulp';
import environments from 'gulp-environments';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import notify from 'gulp-notify';
import gulpIf from 'gulp-if';
import hash from 'gulp-hash-version-manifest';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';

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
        .pipe(gulp.dest(dest))
        .pipe(gulpIf(Config.versionManifest !== false, hash(Config.versionManifest)));
};
postCSS.description = `process styles with postcss`;

export default postCSS;
