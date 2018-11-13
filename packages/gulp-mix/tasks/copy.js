import gulp from 'gulp';
import flatten from 'gulp-flatten';
import merge from 'merge-stream';

const copyTask = (src, dest) => {
    return gulp
        .src(src)
        .pipe(flatten())
        .pipe(gulp.dest(dest));
};

const copy = paths => {
    const streams = [];

    paths.forEach(path => {
        streams.push(copyTask(path.src, path.dest));
    });

    return merge(streams);
};
copy.description = `copies files from src to dest`;

export default copy;
