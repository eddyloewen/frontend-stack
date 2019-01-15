import rollupJS from './rollupJS.js';

import environments from 'gulp-environments';

const isDev = environments.development;
const isProd = environments.production;

const es5 = (src, dest, options = {}) => {
    return rollupJS(
        {
            input: src,
        },
        {
            dir: dest,
            name: 'name',
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
    );
};
es5.description = `compile scripts using rollup with babel and transpiling it to ES5`;

export default es5;
