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
                Config.versionManifest !== false &&
                    hash({
                        name: Config.versionManifest,
                    }),
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

    // replace name for output options with dynamic filename because we can't use [name] as placeholder...
    if (outputOptions.format === 'iife') {
        const { output } = await bundle.generate(outputOptions);
        // console.log(output[0]);
        outputOptions['name'] = output[0].fileName.replace('.js', '');
    }

    return await bundle.write(outputOptions);
};
rollupJS.description = `compile scripts using rollup with babel and code splitting`;

export default rollupJS;
