const del = require('del');

const clean = directories => {
    return del(directories);
};
clean.description = `cleans the given directories`;

export default clean;
