const path = require('path')

import gulp from 'gulp'
import environments from 'gulp-environments'

import eslint from 'gulp-eslint'

import { rollup } from 'rollup'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'
import cleanup from 'rollup-plugin-cleanup'
import commonjs from 'rollup-plugin-commonjs'
import notify from 'gulp-notify'

const paths = {
    js: {
        src: 'src/js/*.js',
        dest: 'public/css/',
    },
    scripts: ['src/js/BaseElement.js'],
}

const isDev = environments.development
const isProd = environments.production

const lintJS = () => {
    return gulp
        .src(paths.js.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
}
lintJS.description = `lint script source(${paths.js.src}) using eslint`

const compileES6 = done => {
    rollup({
        input: paths.scripts,
        experimentalCodeSplitting: true,
        plugins: [
            resolve(),
            commonjs(),
            babel({
                babelrc: false,
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            modules: false,
                            targets: {
                                browsers: [
                                    'Chrome >= 60',
                                    'Safari >= 10.1',
                                    'iOS >= 10.3',
                                    'Firefox >= 54',
                                    'Edge >= 15',
                                ],
                            },
                        },
                    ],
                ],
                plugins: [],
            }),
            isProd() &&
                cleanup({
                    comments: ['eslint', /^\*-/],
                }),
            isProd() && minify(),
        ],
    }).then(bundle => {
        bundle.write({
            dir: 'public/js/module',
            entryFileNames: '[name].js',
            format: 'es',
            sourcemap: !!isDev(),
        })
        done()
    })
}
compileES6.description = `compile script sources (${paths.scripts}) using rollup with babel and code splitting`

const compileES5 = done => {
    const bundlePromises = []
    paths.scripts.forEach(script => {
        bundlePromises.push(
            rollup({
                input: script,
                plugins: [
                    resolve(),
                    commonjs(),
                    babel({
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
                        exclude: 'node_modules/**',
                        plugins: [],
                    }),
                    isProd() &&
                        cleanup({
                            comments: ['eslint', /^\*-/],
                        }),
                    isProd() && minify(),
                ],
            }),
        )
        Promise.all(bundlePromises).then(bundles => {
            bundles.forEach(bundle => {
                bundle.write({
                    file: 'public/js/nomodule/' + path.basename(script),
                    name: path.basename(script).replace('.js', ''),
                    entryFileNames: '[name].js',
                    format: 'iife',
                    sourcemap: !!isDev(),
                })
            })
            done()
        })
    })
}
compileES5.description = `compile script sourcees (${paths.scripts}) using rollup with babel and transpiling it to ES5`

const watchJS = () => {
    notify({
        title: 'Der kleine Biker',
        message: 'Watching for JS changes...',
    }).write('')
    gulp.watch([paths.js.src, 'gulpfile.babel.js'], gulp.series(lintJS, compileES6, compileES5))
        .on('change', function() {
            notify({ title: 'Der kleine Biker', message: 'JS changed' }).write('')
        })
        .on('error', function(error) {
            notify.onError({
                title: 'Der kleine Biker',
                message: 'ESLintError: ' + error.message,
            })
        })
}
watchJS.description = `watch for script source(${paths.scripts}) changes and lint then compile on change`

export { compileES6, compileES5, lintJS, watchJS }
