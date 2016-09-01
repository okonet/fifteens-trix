process.env.BABEL_ENV = 'test'

const wallabyWebpack = require('wallaby-webpack')
const webpackConfig = require('./webpack.config')

const wallabyPostprocessor = wallabyWebpack(webpackConfig)

module.exports = wallaby => ({
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
})
