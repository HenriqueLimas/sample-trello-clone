import ShadowElement from '../ShadowElement'

class Card extends ShadowElement {
  constructor() {
    super('#tc-card')

    this.$ = {
      title: null
    }
  }

  get title() {
    return this.getAttribute('title')
  }

  set title(title) {
    return this.setAttribute('title', title)
  }

  get cardId() {
    return this.getAttribute('card')
  }

  set cardId(cardId) {
    return this.setAttribute('card', cardId)
  }

  connectedCallback() {
    this.runOnLoad(() => {
      this.init()
    })
  }

  init() {
    this.$.title = this.shadowRoot.querySelector('.js-card-title')

    this.$.title.textContent = this.title
  }
}

window.customElements.define('tc-card', Card)
