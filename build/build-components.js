const fs = require('fs')
const mkdirp = require('mkdirp')
const minify = require('html-minifier').minify

const sass = require('node-sass')
const buildJs = require('./transpile-javascript')

const DIST_PATH = 'dist/src/components'
const BASE_PATH = 'src/components/'
const isProduction = process.env.NODE_ENV === 'production'

const STYLE_REGEXP = /<style inject><\/style>/

const entries = [
  'trello-clone',
  'tc-header',
  'tc-boards',
  'tc-board-details',
  'tc-create-new-board',
  'tc-create-new-list',
  'tc-list',
  'tc-lists',
  'tc-query',
  'tc-router',
]

const buildStyles = (entry, template) => {
  return new Promise((resolve, reject) => {
    if (!template.match(STYLE_REGEXP)) {
      return resolve('')
    }

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
  return readTemplate(entry)
    .then(template => {
      const process = [
        buildJs(BASE_PATH + entry + '/index.js'),
        buildStyles(entry, template)
      ]

      return Promise.all(process)
      .then(([script, styles]) => {
        template = template
          .replace(STYLE_REGEXP, `<style>${styles}</style>`)
          .concat(`<script>${script.code}</script>`)

        if (isProduction) {
          return minify(template)
        }

        return template
      })
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
