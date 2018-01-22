const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const uglify = require('rollup-plugin-uglify')

const intro =
`/**
 * Built: ${new Date()}
 */
`

let cache

module.exports = entry => {
  const plugins = [
    resolve({ jsnext: true }),
    commonjs(),
    babel()
  ]

  if (process.env.NODE_ENV === 'production') {
    plugins.push(uglify())
  }

  return rollup.rollup({
    entry,
    cache,
    plugins
  }).then(bundle => {
    cache = bundle

    const { code } = bundle.generate({
      intro,
      format: 'iife'
    })

    return { code }
  })
  .catch(console.error)
}
