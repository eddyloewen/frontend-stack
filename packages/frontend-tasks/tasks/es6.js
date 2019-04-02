const glob = require('glob-all');
import rollupJS from './rollupJS.js';

import environments from 'gulp-environments';

const isDev = environments.development;
const isProd = environments.production;

const es6 = (src, dest, options = {}) => {
    return rollupJS(
        {
            input: glob.sync(src),
        },
        {
            dir: dest,
            entryFileNames: '[name].js',
            format: 'es',
            sourcemap: !!isDev(),
        },
        {
            babelrc: false,
            presets: [
                [
                    '@babel/preset-env',
                    {
                        targets: {
                            browsers: ['Chrome >= 61', 'Safari >= 11', 'iOS >= 11', 'Firefox >= 60', 'Edge >= 16'],
                        },
                    },
                ],
            ],
            plugins: [],
        },
    );
};
es6.description = `compile scripts using rollup with babel and code splitting`;

export default es6;
