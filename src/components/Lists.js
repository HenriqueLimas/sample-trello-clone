import ShadowElement from './ShadowElement'
import withQuery from './withQuery'

class Lists extends ShadowElement {
  constructor() {
    super('#tc-lists')

    this.$ = {
      list: null,
      createList: null
    }

    this.boardLists = new Set()

    this.init = this.init.bind(this)
  }

  get boardId() {
    return this.getAttribute('board')
  }

  set boardId(boardId) {
    this.setAttribute('board', boardId)
  }

  connectedCallback() {
    if (!this.loaded) {
      this.addEventListener('load', this.init)
    } else {
      try {
        this.init()
      } catch (error) {
        this.query.addEventListener(this.query.events.INITIALIZED, this.init)
      }
    }
  }

  init() {
    this.$.createList = this.shadowRoot.querySelector('.js-create-new-list')

    this.$.createList.querySelector('tc-create-new-list')
      .boardId = this.boardId
  }
}

window.customElements.define('tc-lists', withQuery(Lists))
