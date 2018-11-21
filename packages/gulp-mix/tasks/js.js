const path = require('path');

import gulp from 'gulp';
import environments from 'gulp-environments';

import plumber from 'gulp-plumber';
import eslint from 'gulp-eslint';

import { rollup } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import notify from 'gulp-notify';

const isDev = environments.development;
const isProd = environments.production;

import Config from '../config';

const defaultOptions = {
    babel: {
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
        exclude: 'node_modules/**',
        plugins: [],
    },
};

const lintJS = src => {
    return gulp
        .src(src)
        .pipe(
            plumber({
                errorHandler: error => {
                    if (Config.showNotifications) {
                        notify.onError({
                            title: Config.projectTitle + ' - Lint JS Error',
                            message: error.toString(),
                        })(error);
                    }
                    this.emit('end');
                },
            }),
        )
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};
lintJS.description = `lint scripts using eslint`;

const rollupBundle = (input, babelConfig, codeSplitting = false) => {
    return rollup({
        input: input,
        experimentalCodeSplitting: codeSplitting,
        plugins: [
            resolve(),
            commonjs(),
            babel(babelConfig),
            isProd() &&
                cleanup({
                    comments: ['eslint', /^\*-/],
                }),
            isProd() && minify(),
        ],
    });
};

const es6 = (src, dest, options = {}) => {
    options = Object.assign(defaultOptions, options);
    return rollupBundle(src, options.babel, true).then(bundle => {
        return new Promise(resolve => {
            bundle.write({
                dir: path.join(dest, 'module'),
                entryFileNames: '[name].js',
                format: 'es',
                sourcemap: !!isDev(),
            });
            resolve();
        });
    });
};
es6.description = `compile scripts using rollup with babel and code splitting`;

const es5 = (src, dest, options = {}) => {
    options = Object.assign(
        Object.assign(defaultOptions, {
            babel: {
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
            },
        }),
        options,
    );
    const bundlePromises = [];
    src.forEach(script => {
        rollupBundle(script, options.babel).then(bundle => {
            bundlePromises.push(
                new Promise(resolve => {
                    bundle.write({
                        file: path.join(dest, 'nomodule/') + path.basename(script),
                        name: path.basename(script).replace('.js', ''),
                        entryFileNames: '[name].js',
                        format: 'iife',
                        sourcemap: !!isDev(),
                    });
                    resolve();
                }),
            );
        });
    });
    return Promise.all(bundlePromises);
};
es5.description = `compile scripts using rollup with babel and transpiling it to ES5`;

const js = (src, dest) => {
    const bundlePromises = [es6(src, dest), es5(src, dest)];
    return Promise.all(bundlePromises);
};
js.description = `compile scripts using rollup to generate es6 and es5 bundles`;

const watchJS = (src, tasks) => {
    if (Config.showNotifications) {
        notify({
            title: Config.projectTitle,
            message: 'Watching for JS changes...',
        }).write('');
    }
    gulp.watch(src, tasks)
        .on('change', function() {
            if (Config.showNotifications) {
                notify({ title: Config.projectTitle, message: 'JS changed' }).write('');
            }
        })
        .on('error', function(error) {
            if (Config.showNotifications) {
                notify.onError({
                    title: Config.projectTitle,
                    message: 'ESLintError: ' + error.message,
                });
            }
        });
};
watchJS.description = `watch for scripts changes and lint then compile on change`;

export { es6, es5, js, lintJS, watchJS };
