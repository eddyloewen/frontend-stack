import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const defaultOptions = {
    name: 'hash-manifest.json',
    replace: false,
    versionPattern: '[name]?version=[hash]',
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

function generateVersionString(versionPattern, name, hash) {
    return versionPattern.replace('[name]', name).replace('[hash]', hash);
}

export default function hash(options = {}) {
    options = Object.assign({}, defaultOptions, options);

    return {
        name: 'hash-version-manifest',
        generateBundle: function(outputOptions, bundle) {
            // console.log('hash outputOptions', outputOptions);
            // console.log('hash bundle', bundle);

            const bundleName = bundle[Object.keys(bundle)[0]].fileName;
            const bundleCode = bundle[Object.keys(bundle)[0]].code;

            const fileName = `${outputOptions.dir}/${bundleName}`;

            // console.log('hash bundleName', bundleName);
            // console.log('hash fileName', fileName);

            const manifest = tryRequire(options.name) || {};
            manifest[`${fileName}`] = generateVersionString(options.versionPattern, fileName, md5(bundleCode));
            mkdirpath(options.name);
            fs.writeFileSync(options.name, JSON.stringify(manifest), 'utf8');
        },
    };
}
