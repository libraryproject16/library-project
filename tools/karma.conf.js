module.exports = function(config) {
    config.set({
        basePath: '../src',
        browsers: ['Chrome'],
        files: ['**/*.spec.js'],
        frameworks: ['jasmine']
    });
};