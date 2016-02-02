var serverAddress = require('./server-address');

exports.config = {
    baseUrl: serverAddress,
    rootElement: 'app',
    specs: ['e2e/**/*.spec.js']
};