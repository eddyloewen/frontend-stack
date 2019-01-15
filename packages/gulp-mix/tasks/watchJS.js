import gulp from 'gulp';
import notify from 'gulp-notify';

import Config from '../config';

const watchJS = (src, tasks) => {
    if (Config.showNotifications) {
        notify({
            title: Config.projectTitle,
            message: 'Watching for JS changes...',
        }).write('');
    }
    gulp.watch(src, tasks)
        .on('change', function() {
            if (Config.showNotifications) {
                notify({ title: Config.projectTitle, message: 'JS changed' }).write('');
            }
        })
        .on('error', function(error) {
            if (Config.showNotifications) {
                notify.onError({
                    title: Config.projectTitle,
                    message: 'ESLintError: ' + error.message,
                });
            }
        });
};
watchJS.description = `watch for scripts changes and lint then compile on change`;

export default watchJS;
