import gulp from 'gulp';
import stylelint from 'stylelint';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import notify from 'gulp-notify';

import Config from '../config';

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
lintCSS.description = `lint styles using stylelint`;

export default lintCSS;
