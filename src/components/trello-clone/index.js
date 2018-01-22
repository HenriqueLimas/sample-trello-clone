import ShadowElement from '../ShadowElement'

class TrelloClone extends ShadowElement {
  constructor() {
    super('#trello-clone')

    this.$ = {
      db: null
    }
  }

  get db() {
    if (!this.$.db) {
      this.$.db = this.shadowRoot.querySelector('trello-query')
    }

    return this.$.db
  }
}

window.customElements.define('trello-clone', TrelloClone)
