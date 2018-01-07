import ShadowElement from './components/ShadowElement'

class TrelloClone extends ShadowElement {
  constructor() {
    super()

    this.$ = {
      db: null
    }

    this.render = this.render.bind(this)
  }

  connectedCallback() {
    this.render()
  }

  get db() {
    if (!this.$.db) {
      this.$.db = this.shadowRoot.querySelector('trello-query')
    }

    return this.$.db
  }

  render() {
    this.update(`
      <tc-header></tc-header>

      <tc-router>
        <tc-route path="/" element="tc-boards"></tc-route>
      </tc/router>

      <trello-query></trello-query>
    `)
  }
}

window.customElements.define('trello-clone', TrelloClone)
