import ShadowElement from '../ShadowElement'
import withQuery from '../withQuery'

class Card extends ShadowElement {
  constructor() {
    super('#tc-card')

    this.$ = {
      title: null
    }

    this.handleRemoveButton = this.handleRemoveButton.bind(this)
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

  disconnectedCallback() {
    this.$.removeButton.removeEventListener('click', this.handleRemoveButton)
  }

  init() {
    this.$.title = this.shadowRoot.querySelector('.js-card-title')
    this.$.removeButton = this.shadowRoot.querySelector('.js-card-remove-button')

    this.$.title.textContent = this.title

    this.$.removeButton.addEventListener('click', this.handleRemoveButton)
  }

  handleRemoveButton(event) {
    this.query.removeCard(this.cardId)
  }
}

window.customElements.define('tc-card', withQuery(Card))
