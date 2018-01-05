import ShadowElement from './components/ShadowElement'

class TrelloClone extends ShadowElement {
  constructor() {
    super()

    this.render = this.render.bind(this)
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.update(`
      <tc-header></tc-header>

      <tc-boards></tc-boards>
    `)
  }
}

window.customElements.define('trello-clone', TrelloClone)
