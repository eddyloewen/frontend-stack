import clean from './tasks/clean';
import copy from './tasks/copy';
import svg from './tasks/svg';

import css from './tasks/css';
import tailwind from './tasks/tailwind';
import postCSS from './tasks/postCSS';
import lintCSS from './tasks/lintCSS';
import watchCSS from './tasks/watchCSS';

import es6 from './tasks/es6';
import es5 from './tasks/es5';
import js from './tasks/js';
import lintJS from './tasks/lintJS';
import watchJS from './tasks/watchJS';

import Config from './config';

const options = (options = {}) => {
    Object.assign(Config, options);
};

// TODO: check for async task (https://github.com/gulpjs/gulp/blob/master/docs/getting-started/4-async-completion.md)
const register = (mix, name, task) => {
    mix[name] = task.bind();
};

const tasks = {
    register,
    options,
    clean,
    copy,
    svg,
    css,
    tailwind,
    postCSS,
    lintCSS,
    watchCSS,
    es6,
    es5,
    js,
    lintJS,
    watchJS,
};

export default tasks;

// API
// tasks.js(src, destination);
// tasks.css(src, destination);
// tasks.tailwind(src, destination);
// tasks.postCss(src, destination, [plugins]);
// tasks.browserSync(options);
// tasks.svg(icons, destination);
// tasks.copy(src, destination);
// tasks.options({
//     projectTitle: 'frontend-tasks',
//     showNotifications: true,
//     generateVersionManifest: false,
// });
// tasks.register(mix, 'name', () => new Promise(resolve => {}));
