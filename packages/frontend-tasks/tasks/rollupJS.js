import environments from 'gulp-environments';
import eslint from 'gulp-eslint';
import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import hash from 'rollup-plugin-hash-version-manifest';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';

const rollupJS = async (inputOptions = {}, outputOptions = {}, babelOptions = {}) => {
    inputOptions = Object.assign(
        {
            input: 'src/main.js',
            plugins: [
                resolve(),
                commonjs(),
                babel(babelOptions),
                Config.versionManifest !== false && hash(Config.versionManifest),
                isProd() &&
                    cleanup({
                        comments: ['eslint', /^\*-/],
                    }),
                isProd() && minify(),
            ],
        },
        inputOptions,
    );
    outputOptions = Object.assign(
        {
            dir: 'public',
            entryFileNames: '[name].js',
            format: 'es',
            sourcemap: !!isDev(),
        },
        outputOptions,
    );

    const bundle = await rollup(inputOptions);

    return await bundle.write(outputOptions);
};
rollupJS.description = `compile scripts using rollup with babel and code splitting`;

export default rollupJS;
