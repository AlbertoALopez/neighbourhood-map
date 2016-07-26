module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            'http://maps.google.com/maps/api/js?sensor=false',
            { pattern: 'test-context.js', watched: false },
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'test-context.js': ['webpack']
        },
        webpack: {
            module: {
                loaders: [
                    { test: /\.js/, exclude: /node_modules/, loader: 'babel?presets[]=es2015' }
                ]
            },
            watch: true
        },
        webpackServer: {
            noInfo: true
        }
    });
};
