const fs = require('fs')
const mkdirp = require('mkdirp')
const postcss = require('postcss')
const cssnext = require('postcss-cssnext')

const processor = postcss([
  cssnext({
    feature: {
      colorFunction: false,
      colorHwb: false,
      colorHsl: false,
      colorGray: false,
      colorHexAlpha: false
    }
  })
])

const appShellEntries = [
  'app.css'
]

const BASE_PATH = 'src/styles/'

const styles = []

const processCss = entry =>
  new Promise((resolve, reject) => {
    fs.readFile(BASE_PATH + entry, (err, css) => {
      if (err) return reject(err)

      processor.process(css, { in: BASE_PATH + entry, out: `dist/styles/${entry}` })
        .then(resolve, reject)
    })
  })

const writeFile = fileName => results => {
  const css = results.reduce((css, result) => css + result.css, '')
  const sourcemap = results.reduce((map, result) => result.map ? map + result.map : map, '')

  fs.writeFile(`dist/styles/${fileName}`, css, () => {})
  if (sourcemap) fs.writeFile(`dist/styles/${fileName}.map`, sourcemap, () => {})
}


mkdirp('dist/styles', err => {
  if (err) return console.error(err)

  Promise.all(
    appShellEntries.map(processCss)
  ).then(writeFile('app-shell.css'))

  styles
    .map(entry =>
      processCss(entry)
        .then(result => writeFile(entry)([result]))
    )
})
