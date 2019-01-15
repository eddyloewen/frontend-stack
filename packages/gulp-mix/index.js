import clean from './tasks/clean';
import copy from './tasks/copy';
import svg from './tasks/svg';
import { css, tailwind, postCSS, lintCSS, watchCSS } from './tasks/css';

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

const mix = {
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

export default mix;

// API
// mix.js(src, destination);
// mix.css(src, destination);
// mix.tailwind(src, destination);
// mix.postCss(src, destination, [plugins]);
// mix.browserSync(options);
// mix.svg(icons, destination);
// mix.copy(src, destination);
// mix.options({
//     projectTitle: 'gulp-mix',
//     showNotifications: true,
//     generateVersionManifest: false,
// });
// mix.register(mix, 'name', () => new Promise(resolve => {}));
