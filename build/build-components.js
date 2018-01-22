const fs = require('fs')
const mkdirp = require('mkdirp')

const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const sass = require('node-sass')

const DIST_PATH = 'dist/src/components'
const BASE_PATH = 'src/components/'

const entries = [
  'tc-header',
  'tc-boards',
  'tc-board-details',
  'tc-create-new-board',
]

const buildJs = entry => {
  const intro =
`/**
 * Built: ${new Date()}
 */
`

  let cache

  return rollup.rollup({
    entry: BASE_PATH + entry + '/index.js',
    cache,
    plugins: [
      resolve({ jsnext: true }),
      commonjs(),
      babel()
    ]
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

const buildStyles = (entry) => {
  return new Promise((resolve, reject) => {
    sass.render({
      file: BASE_PATH + entry + `/styles.scss`
    }, (err, result) => {
      if (err) return reject(err)

      resolve(result.css)
    })
  })
}

const readTemplate = entry => {
  return new Promise((resolve, reject) => {
    const path = BASE_PATH + entry + '/' + entry + '.html'
    fs.readFile(path, 'utf8', (error, data) => {
      if (error) {
        return reject(error)
      }

      resolve(data)
    })
  })
}

const buildComponent = (entry) => {
  return Promise.all([
    readTemplate(entry),
    buildJs(entry),
    buildStyles(entry)
  ])
    .then(([template, script, styles]) => {
      return template
        .replace(/<style inject><\/style>/, `<style>${styles}</style>`)
        .concat(`<script>${script.code}</script>`)
    })
}

mkdirp(DIST_PATH, err => {
  if (err) return console.error(err)

  entries
    .forEach(entry => {
      buildComponent(entry)
        .then(component => {
          fs.writeFile(`${DIST_PATH}/${entry}.html`, component, () => {})
        })
        .catch(console.error)
    })
})
