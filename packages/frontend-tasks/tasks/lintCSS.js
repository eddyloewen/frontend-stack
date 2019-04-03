import gulp from 'gulp';
import environments from 'gulp-environments';
import stylelint from 'stylelint';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import notify from 'gulp-notify';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';
import watchCSS from './watchCSS';

const lintCSSTask = src => {
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

const lintCSS = async src => {
    const lintCSS = () => lintCSSTask(src);
    return isDev() ? watchCSS(src, lintCSSTask(src)) : lintCSSTask(src);
};
lintCSS.description = `lint styles using stylelint`;

export default lintCSS;
