import clean from './tasks/clean';
import copy from './tasks/copy';
import svg from './tasks/svg';
import { css, tailwind, postCSS, lintCSS, watchCSS } from './tasks/css';
import { es6, es5, js, lintJS, watchJS } from './tasks/js';

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
