import lf from 'lovefield'
import initializeSchema from '../db/schema'

import BoardModel from '../models/Boards'

class TrelloQuery extends HTMLElement {
  constructor() {
    super()

    this.db = null
    this.initialized = false
    this.results = {}
    this.queries = {}
  }

  get events() {
    return {
      INITIALIZED: 'db_initialized'
    }
  }

  connectedCallback() {
    if (!this.db) {
      initializeSchema(lf).connect()
        .then(database => {
          this.boards = new BoardModel(database)

          this.db = database
          this.initialized = true

          this.dispatchDbInitialized()
        })
    }
  }

  dispatchDbInitialized() {
    const event = new Event(this.events.INITIALIZED)

    this.dispatchEvent(event)
  }

  getBoardsQuery() {
    if (!this.queries.boards) {
      this.queries.boards = this.boards.getAll()
    }

    return this.queries.boards
  }

  observeBoards(callback) {
    return this.db.observe(this.getBoardsQuery(), callback)
  }

  unobserveBoards(callback) {
    return this.db.unobserve(this.getBoardsQuery(), callback)
  }

  fetchBoards() {
    return this.getBoardsQuery().exec().then(results => {
      this.results.boards = results

      return results
    })
  }
}

window.customElements.define('trello-query', TrelloQuery)
