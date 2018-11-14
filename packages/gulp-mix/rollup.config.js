module.exports = [
    {
        input: 'index.js',
        output: {
            interop: false,
            file: 'dist/cjs/index.js',
            format: 'cjs',
        },
    },
    {
        input: 'index.js',
        output: {
            interop: false,
            file: 'dist/es/index.js',
            format: 'es',
        },
    },
    {
        input: 'index.js',
        output: {
            interop: false,
            file: 'dist/umd/index.js',
            format: 'umd',
            name: 'GulpMix',
        },
    },
];
