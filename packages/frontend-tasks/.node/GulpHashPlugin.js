import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import through from 'through2';

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

export default function(options) {
    options = Object.assign({}, defaultOptions, options);

    return through.obj((chunk, enc, cb) => {
        // console.log('through chunk', chunk.contents, chunk.path, chunk.cwd, chunk.base);

        const fileName = chunk.path.replace(chunk.cwd + '/', '');

        if (fileName.indexOf('.map') === -1) {
            const manifest = tryRequire(options.name) || {};
            manifest[`${fileName}`] = generateVersionString(options.versionPattern, fileName, md5(chunk.contents));
            mkdirpath(options.name);
            fs.writeFileSync(options.name, JSON.stringify(manifest), 'utf8');
        }

        cb(null, chunk);
    });
}
