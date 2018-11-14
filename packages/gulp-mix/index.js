import clean from './tasks/clean';
import copy from './tasks/copy';
import svg from './tasks/svg';
import { css, tailwind, postCSS, lintCSS, watchCSS } from './tasks/css';
import { es6, es5, js, lintJS, watchJS } from './tasks/js';

const mix = {
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
