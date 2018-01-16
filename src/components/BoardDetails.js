import ShadowElement from './ShadowElement'
import withQuery from './withQuery'

class BoardDetails extends ShadowElement {
  constructor() {
    super('#tc-board-details')

    this.$ = {
      title: null
    }

    this.board = null

    this.init = this.init.bind(this)
  }

  get boardId() {
    return this.getAttribute('id')
  }

  static get observedAttributes() { return ['id'] }

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

    this.query.fetchBoard(this.boardId)
      .then(board => {
        this.board = board

        this.$.title.textContent = board.name
      })
  }
}

window.customElements.define('tc-board-details', withQuery(BoardDetails))
