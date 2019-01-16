import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const defaultOptions = {
    name: 'hash-manifest.json',
    replace: false,
};

function md5(string) {
    return crypto
        .createHash('md5')
        .update(string)
        .digest('hex');
}

function tryRequire(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
    }
}

function mkdirpath(dest) {
    const dir = path.dirname(dest);
    try {
        fs.readdirSync(dir);
    } catch (err) {
        mkdirpath(dir);
        fs.mkdirSync(dir);
    }
}

export default function hash(opts = {}) {
    opts = Object.assign({}, defaultOptions, opts);

    return {
        name: 'hash-version-manifest',
        generateBundle: function(options, bundle) {
            // console.log('hash options', options);
            // console.log('hash bundle', bundle);

            const bundleName = bundle[Object.keys(bundle)[0]].fileName;
            const bundleCode = bundle[Object.keys(bundle)[0]].code;

            const fileName = `${options.dir}/${bundleName}`;

            // console.log('hash bundleName', bundleName);
            // console.log('hash fileName', fileName);

            if (opts.name) {
                const manifest = tryRequire(opts.name) || {};
                manifest[`${fileName}`] = `${md5(bundleCode)}`;
                mkdirpath(opts.name);
                fs.writeFileSync(opts.name, JSON.stringify(manifest), 'utf8');
            }
        },
    };
}
