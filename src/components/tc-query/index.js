import lf from 'lovefield'
import initializeSchema from '../../db/schema'

import BoardModel from '../../models/Boards'
import ListModel from '../../models/Lists'
import CardModel from '../../models/Cards'

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
          this.lists = new ListModel(database)
          this.cards = new CardModel(database)

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

  getQuery(model) {
    if (!this.queries[model]) {
      this.queries[model] = this[model].getAll()
    }

    return this.queries[model]
  }

  getBoardsQuery() {
    return this.getQuery('boards')
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

  fetchBoard(id_board) {
    return this.boards
      .getBoard(id_board)
      .exec()
      .then(results => {
        return results[0]
      })
  }

  addBoard({ name }) {
    return this.boards.add({ name })
  }

  getListsQuery(id_board) {
    return this.lists.getAll(id_board)
  }

  observe(query, callback) {
    return this.db.observe(query, callback)
  }

  unobserve(query, callback) {
    return this.db.unobserve(query, callback)
  }

  addList({ id_board, name }) {
    return this.lists.add({ id_board, name })
  }

  getCardsQuery(id_list) {
    return this.cards.getAll(id_list)
  }

  addCard({ id_list, title }) {
    return this.cards.add({ id_list, title })
  }

  moveCard({ id_card, id_list }) {
    return this.cards.moveCard({ id_card, id_list })
  }

  updateCard(card) {
    return this.cards.update(card)
  }

  removeCard(id_card) {
    return this.cards.removeCard(id_card)
  }
}

window.customElements.define('trello-query', TrelloQuery)
