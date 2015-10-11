/* eslint-disable no-var, func-names */

var wallabyWebpack = require('wallaby-webpack');
var webpackConfig = require('./webpack.config');

var wallabyPostprocessor = wallabyWebpack(webpackConfig);

module.exports = function(wallaby) {
    return {
        files: [
            { pattern: 'src/**/*.js', load: false },
            { pattern: 'src/**/__tests__/*.js', ignore: true }
        ],

        tests: [
            { pattern: 'src/**/__tests__/*.js', load: false }
        ],

        compilers: {
            'src/**/*.js': wallaby.compilers.babel({
                babel: require('babel'),
                stage: 0
            })
        },

        testFramework: 'mocha',

        postprocessor: wallabyPostprocessor,

        bootstrap: function() {
            // required to trigger tests loading
            window.__moduleBundler.loadTests();
        }

    };
};
