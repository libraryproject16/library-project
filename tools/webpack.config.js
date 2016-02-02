var path = require('path');

module.exports = {
    context: path.resolve('src'),
    entry: './app.js',
    output: {
        path: path.resolve('dist'),
        filename: 'bundle.js'
    }
};