import gulp from 'gulp'
import svgSprite from 'gulp-svg-sprite'

const paths = {
    svg: {
        src: 'src/assets/icons/*.svg',
        dest: 'public/assets/',
    },
}

const svg = done => {
    gulp.src(paths.svg.src)
        .pipe(svgSprite({ mode: { symbol: true } }))
        .pipe(gulp.dest(paths.svg.dest))
    done()
}
svg.description = `...`

export { svg }
