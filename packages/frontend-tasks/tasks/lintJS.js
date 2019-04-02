import gulp from 'gulp';
import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';
import notify from 'gulp-notify';

import Config from '../config';

const lintJS = src => {
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
lintJS.description = `lint scripts using eslint`;

export default lintJS;
