const intro = `/**
  * Built: ${new Date()}
  */
`

const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')

let cache

const entries = [
  'src/main.js'
]

entries.forEach(entry =>
  rollup.rollup({
    entry,
    cache,
    plugins: [
      resolve({ jsnext: true }),
      commonjs(),
      babel()
    ]
  }).then(bundle => {
    cache = bundle
    bundle.write({
      intro,
      format: 'iife',
      dest: `dist/${entry}`,
      sourceMap: process.env !== 'production'
    })
  })
  .catch(console.error)
)
