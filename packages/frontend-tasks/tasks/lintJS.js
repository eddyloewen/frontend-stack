import gulp from 'gulp';
import environments from 'gulp-environments';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';
import notify from 'gulp-notify';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';
import watchJS from './watchJS';

const lintJSTask = src => {
    return gulp
        .src(src)
        .pipe(
            plumber({
                errorHandler: error => {
                    if (Config.showNotifications) {
                        notify.onError({
                            title: Config.projectTitle + ' - Lint JS Error',
                            message: error.toString(),
                        })(error);
                    }
                    this.emit('end');
                },
            }),
        )
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};

const lintJS = async src => {
    const lintJS = () => lintJSTask(src);
    return isDev() ? watchJS(src, lintJSTask(src)) : lintJSTask(src);
};
lintJS.description = `lint scripts using eslint`;

export default lintJS;
