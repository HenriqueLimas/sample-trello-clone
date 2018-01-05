import './TrelloClone'
import './components/Header'
import './components/Boards'

import lf from 'lovefield'
import initializeSchema from './db/schema'

import { initGlobals } from './commons'

import BoardModel from './models/Boards'


const init = () => {
  const db = initializeSchema(lf)

  db.connect()
    .then(db => {
      console.log('DB connected')
      const boards = new BoardModel(db)

      initGlobals({
        boards
      })

    }, error => {
      console.error('Error on connecting to DB', error)
    })
}

init()
