const path = require('path');

import gulp from 'gulp';
import environments from 'gulp-environments';

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

const lintJS = src => {
    return gulp
        .src(src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
};
lintJS.description = `lint scripts using eslint`;

const rollupBundle = (input, codeSplitting = false, presets) => {
    return rollup({
        input: input,
        experimentalCodeSplitting: codeSplitting,
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelrc: false,
                presets: presets,
                exclude: 'node_modules/**',
                plugins: [],
            }),
            isProd() &&
                cleanup({
                    comments: ['eslint', /^\*-/],
                }),
            isProd() && minify(),
        ],
    });
};

const compileES6 = (src, dest) => {
    return rollupBundle(src, true, [
        [
            '@babel/preset-env',
            {
                modules: false,
                targets: {
                    browsers: ['Chrome >= 60', 'Safari >= 10.1', 'iOS >= 10.3', 'Firefox >= 54', 'Edge >= 15'],
                },
            },
        ],
    ]).then(bundle => {
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
compileES6.description = `compile scripts using rollup with babel and code splitting`;

const compileES5 = (src, dest) => {
    const bundlePromises = [];
    src.forEach(script => {
        rollupBundle(script, [
            [
                '@babel/preset-env',
                {
                    targets: {
                        ie: '11',
                    },
                },
            ],
        ]).then(bundle => {
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
compileES5.description = `compile scripts using rollup with babel and transpiling it to ES5`;

const compileJS = (src, dest) => {
    const bundlePromises = [compileES6(src, dest), compileES5(src, dest)];
    return Promise.all(bundlePromises);
};
compileJS.description = `compile scripts using rollup to generate es6 and es5 bundles`;

const projectTitle = 'Project title';
const watchJS = (src, tasks) => {
    notify({
        title: projectTitle,
        message: 'Watching for JS changes...',
    }).write('');
    gulp.watch(src, tasks)
        .on('change', function() {
            notify({ title: projectTitle, message: 'JS changed' }).write('');
        })
        .on('error', function(error) {
            notify.onError({
                title: projectTitle,
                message: 'ESLintError: ' + error.message,
            });
        });
};
watchJS.description = `watch for scripts changes and lint then compile on change`;

export { compileES6, compileES5, compileJS, lintJS, watchJS };
