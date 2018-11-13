import clean from './tasks/clean';
import copy from './tasks/copy';
import svg from './tasks/svg';
import { compileCSS, lintCSS, watchCSS } from './tasks/css';
import { compileES6, compileES5, lintJS, watchJS } from './tasks/js';

const mix = {
    clean,
    copy,
    svg,
    compileCSS,
    lintCSS,
    watchCSS,
    compileES6,
    compileES5,
    lintJS,
    watchJS,
};

export default mix;
