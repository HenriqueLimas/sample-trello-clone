const fs = require('fs')
const mkdirp = require('mkdirp')
const sass = require('node-sass')


const BASE_PATH = 'src/styles/'
const DIST_PATH = 'dist/styles'

const appShellEntries = [
  'app-shell'
]

const components = [
  'components/List',
  'components/Lists',
  'components/BoardDetails',
  'components/CreateNewBoard',
  'components/CreateNewList'
]

const processCss = entry =>
  new Promise((resolve, reject) => {
    sass.render({
      file: BASE_PATH + entry + '.scss',
      outFile: `${entry}.css`,
      sourceMap: process.env !== 'production',
      sourceMapContents: true
    }, (err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })

const writeFile = fileName => results => {
  const css = results.reduce((css, result) => css + result.css, '')
  const sourcemap = results.reduce((map, result) => result.map ? map + result.map : map, '')

  fs.writeFile(`${DIST_PATH}/${fileName}.css`, css, () => {})
  if (sourcemap) fs.writeFile(`${DIST_PATH}/${fileName}.css.map`, sourcemap, () => {})
}


mkdirp(DIST_PATH, err => {
  if (err) return console.error(err)

  Promise.all(appShellEntries.map(processCss))
    .then(writeFile('app-shell'))
    .then(() => console.log('App shell generated with success!'))
    .catch(console.error)
})

mkdirp(DIST_PATH + '/components', err => {
  if (err) return console.error(err)

  Promise.all(
    components
      .map(entry =>
        processCss(entry)
        .then(result => writeFile(entry)([result]))
        .catch(err => console.error(`Error on ${entry}: `, err))
      )
  )
  .then(() => console.log('Styles generated with success!'))
})
