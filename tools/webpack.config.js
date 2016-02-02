var path = require('path');

module.exports = {
    context: path.resolve('src'),
    entry: './boot.ts',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.ts', '.js']
    },
    module: {
        loaders: [
            { test: /\.ts$/, exclude: /node_modules/,  loader: 'ts-loader' },
            { test: /\.html$/, exclude: /node_modules/,  loader: 'raw-loader' }
        ]
    },
    ts: {
        compilerOptions: {
            emitDecoratorMetadata: true
        }
    }
};