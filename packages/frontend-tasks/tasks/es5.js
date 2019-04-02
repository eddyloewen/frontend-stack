import path from 'path';
import glob from 'glob-all';
import rollupJS from './rollupJS.js';

import environments from 'gulp-environments';

const isDev = environments.development;
const isProd = environments.production;

const es5 = (src, dest, options = {}) => {
    const promises = [];

    glob.sync(src).forEach(script => {
        promises.push(
            rollupJS(
                {
                    input: script,
                },
                {
                    dir: dest,
                    name: path.basename(script).replace('.js', ''),
                    entryFileNames: '[name].js',
                    format: 'iife',
                    sourcemap: !!isDev(),
                },
                {
                    babelrc: false,
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    ie: '11',
                                },
                            },
                        ],
                    ],
                    plugins: [],
                },
            ),
        );
    });

    return Promise.all(promises);
};
es5.description = `compile scripts using rollup with babel and transpiling it to ES5`;

export default es5;
