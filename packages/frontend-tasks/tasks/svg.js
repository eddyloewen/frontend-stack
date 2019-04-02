import gulp from 'gulp';
import svgSprite from 'gulp-svg-sprite';
import merge from 'merge-stream';

const svgTask = (src, dest) => {
    return gulp
        .src(src)
        .pipe(svgSprite({ mode: { symbol: true } }))
        .pipe(gulp.dest(dest));
};

const svg = paths => {
    const streams = paths.map(path => {
        return svgTask(path.src, path.dest);
    });

    return merge(streams);
};
svg.description = `generates an svg sprite from all *.svg files in src and saves it in dest`;

export default svg;
