import ShadowElement from '../ShadowElement'
import withQuery from '../withQuery'

class BoardDetails extends ShadowElement {
  constructor() {
    super('#tc-board-details')

    this.$ = {
      title: null,
      container: null,
      lists: null
    }

    this.board = null

    this.init = this.init.bind(this)
  }

  get boardId() {
    return this.getAttribute('id')
  }

  connectedCallback() {
    this.addEventListener('load', () => {
      try {
        this.init()
      } catch (error) {
        this.query.addEventListener(this.query.events.INITIALIZED, this.init)
      }
    })
  }

  init() {
    this.$.title = this.shadowRoot.querySelector('.js-title')
    this.$.container = this.shadowRoot.querySelector('.js-container')
    this.$.lists = this.create('tc-lists')
    this.$.lists.boardId = this.boardId

    this.query.fetchBoard(this.boardId)
      .then(board => {
        this.board = board

        this.$.title.textContent = board.name
        this.$.container.appendChild(this.$.lists)
      })
  }
}

window.customElements.define('tc-board-details', withQuery(BoardDetails))
