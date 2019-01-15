const path = require('path');
import es6 from './es6.js';
import es5 from './es5.js';

const js = (src, dest) => {
    const bundlePromises = [es6(src, path.join(dest, 'module')), es5(src, path.join(dest, 'nomodule'))];
    return Promise.all(bundlePromises);
};
js.description = `compile scripts using rollup to generate es6 and es5 bundles`;

export default js;
