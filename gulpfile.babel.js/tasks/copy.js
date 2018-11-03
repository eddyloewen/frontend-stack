import gulp from 'gulp'
import flatten from 'gulp-flatten'

const paths = {
    copy: [
        {
            src: 'node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js',
            dest: 'public/vendor/js/',
        },
    ],
}

const copy = done => {
    for (const path of paths.copy) {
        gulp.src(path.src)
            .pipe(flatten())
            .pipe(gulp.dest(path.dest))
    }
    done()
}
copy.description = `copies files from src to dest`

export { copy }
