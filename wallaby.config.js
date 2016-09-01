/* eslint-disable no-var, func-names */

var wallabyWebpack = require('wallaby-webpack')
var webpackConfig = require('./webpack.config')

var wallabyPostprocessor = wallabyWebpack(webpackConfig)

module.exports = function (wallaby) {
  return {
    files: [
            { pattern: 'src/**/*.js', load: false },
            { pattern: 'src/**/*.spec.js', ignore: true }
    ],

    tests: [
            { pattern: 'src/**/*.spec.js', load: false }
    ],

    compilers: {
      'src/**/*.js': wallaby.compilers.babel()
    },

    testFramework: 'mocha',

    postprocessor: wallabyPostprocessor,

    bootstrap() {
            // required to trigger tests loading
      window.__moduleBundler.loadTests() // eslint-disable-line
    }

  }
}
