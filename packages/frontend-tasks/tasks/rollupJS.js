import environments from 'gulp-environments';
import eslint from 'gulp-eslint';
import { rollup, watch } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import hash from '../.node/RollupHashPlugin';
const notify = require('gulp-notify');

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

    if (isDev() && outputOptions['format'] === 'es') {
        return new Promise(resolve => {
            const watcher = watch({
                ...inputOptions,
                output: [outputOptions],
                watch: {
                    clearScreen: true,
                },
            });
            watcher.on('event', event => {
                if (!Config.showNotifications) return;
                if (event.code === 'START') {
                    notify({ title: Config.projectTitle, message: 'Starting "es6"...' }).write('');
                }
                if (event.code === 'BUNDLE_END') {
                    notify({
                        title: Config.projectTitle,
                        message: 'Finished "es6" after ' + (event.duration / 1000).toFixed(2) + ' s',
                    }).write('');
                }
                if (event.code === 'END') {
                    resolve();
                }
                if (event.code === 'ERROR' || event.code === 'FATAL') {
                    console.log('rollup watch ERROR', event);
                    notify.onError({
                        title: Config.projectTitle,
                        message: 'JS ERROR|FATAL',
                    });
                }
            });
        });
    } else {
        const bundle = await rollup(inputOptions);
        return await bundle.write(outputOptions);
    }
};
rollupJS.description = `compile scripts using rollup with babel and code splitting`;

export default rollupJS;
