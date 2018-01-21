import ShadowElement from './ShadowElement'
import withQuery from './withQuery'

class Boards extends ShadowElement {
  constructor() {
    super('#tc-boards')

    this.$ = {
      list: null,
      createItem: null
    }

    this.boards = new Set()

    this._init = this._init.bind(this)
    this.update = this.update.bind(this)
    this.createItem = this.createItem.bind(this)
    this.updateBoards = this.updateBoards.bind(this)
  }

  connectedCallback() {
    this.runOnLoad(() => {
      try {
        this._init()
      } catch (error) {
        this.query.addEventListener(this.query.events.INITIALIZED, this._init)
      }
    })
  }

  _init() {
    this.$.list = this.shadowRoot.querySelector('.js-list')
    this.$.createItem = this.shadowRoot.querySelector('.js-create-item')

    this.query.observeBoards(this.updateBoards)

    this.query.fetchBoards()

    this.query.removeEventListener(this.query.events.INITIALIZED, this._init)
  }

  createItem({ id_board, name }) {
    const exists = this.shadowRoot.querySelector(`.js-board[data-id="${id_board}"]`)

    if (exists) {
      return exists
    }

    const item = this.create('li')
    const anchor = this.create('tc-link')
    const board = this.create('div')
    const text = this.create('span')

    item.setAttribute('data-id', id_board)
    item.setAttribute('class', 'item js-board col-xs-12 col-md-6 col-lg-3')
    anchor.setAttribute('to', `/${id_board}`)
    board.setAttribute('class', 'board')
    text.setAttribute('class', 'board__name js-board__name')

    text.textContent = name

    board.appendChild(text)
    anchor.appendChild(board)
    item.appendChild(anchor)

    return item
  }

  disconnectedCallback() {
    this.query.unobserveBoards(this.updateBoards)
  }

  updateBoards(changes) {
    const boardsFromDB = changes[0].object

    this.boardsToAdd = boardsFromDB.reduce((boardsToAdd, board) => {
      if (!this.boards.has(board.id_board)) {
        boardsToAdd.push(board)
      }

      return boardsToAdd
    }, [])

    this.update()
  }

  update() {
    this.boardsToAdd.forEach(board => {
      const item = this.createItem(board)
      this.$.list.insertBefore(item, this.$.createItem)
      this.boards.add(board.id_board)
    })

    this.boardsToAdd = []
  }
}

window.customElements.define('tc-boards', withQuery(Boards))
