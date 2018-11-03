import gulp from 'gulp'
import environments from 'gulp-environments'

import stylelint from 'stylelint'

import postcss from 'gulp-postcss'
import postcssImport from 'postcss-import'
import postcssNested from 'postcss-nested'
import sourcemaps from 'gulp-sourcemaps'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import purgecss from 'gulp-purgecss'
import cssnano from 'cssnano'
import notify from 'gulp-notify'

const paths = {
    styles: {
        src: 'src/css/*.css',
        dest: 'public/css/',
    },
}

const isDev = environments.development
const isProd = environments.production

// Custom PurgeCSS extractor for Tailwind that allows special characters in class names.
// https://github.com/FullHuman/purgecss#extractor
class TailwindExtractor {
    static extract(content) {
        return content.match(/[A-Za-z0-9-_:\/]+/g) || []
    }
}

const lintCSS = () => {
    return gulp.src(paths.styles.src).pipe(postcss([stylelint]))
}
lintCSS.description = `lint style source(${paths.styles.src}) using stylint`

const compileCSS = () => {
    return gulp
        .src('src/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(
            postcss([
                postcssImport(),
                tailwindcss('tailwind.js'),
                postcssNested(),
                autoprefixer({
                    browsers: ['last 2 versions', 'IE 11'],
                    grid: true,
                }),
            ]),
        )
        .pipe(
            isProd(
                purgecss({
                    content: ['templates/**/*.html'],
                    extractors: [
                        {
                            extractor: TailwindExtractor,
                            extensions: ['html', 'js', 'ftl', 'yaml', 'hbs'],
                        },
                    ],
                }),
            ),
        )
        .pipe(
            isProd(
                postcss([
                    cssnano({
                        preset: 'default',
                    }),
                ]),
            ),
        )
        .pipe(isDev(sourcemaps.write('.')))
        .pipe(gulp.dest(paths.styles.dest))
}
compileCSS.description = `concatenate and compile style source(${
    paths.styles.src
}) using stylus before autoprefixing and minifying`

const watchCSS = () => {
    notify({ title: 'Der kleine Biker', message: 'Watching for CSS changes...' }).write('')
    gulp.watch([paths.styles.src, 'tailwind.js'], gulp.series(lintCSS, compileCSS)).on('change', function() {
        notify({ title: 'Der kleine Biker', message: 'CSS changed' }).write('')
    })
}
watchCSS.description = `watch for style source(${paths.styles.src}) changes and lint then compile on change`

export { compileCSS, lintCSS, watchCSS }
