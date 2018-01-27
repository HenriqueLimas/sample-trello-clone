import ShadowElement from '../ShadowElement'

class List extends ShadowElement {
  constructor() {
    super('#tc-list')

    this.$ = {
      name: null,
      cardList: null
    }

    this.init = this.init.bind(this)
  }

  get listId() {
    return this.getAttribute('list')
  }

  set listId(listId) {
    this.setAttribute('list', listId)
  }

  get name() {
    return this.getAttribute('name')
  }

  set name(name) {
    this.setAttribute('name', name)
  }

  connectedCallback() {
    this.runOnLoad(() => {
      this.init()
    })
  }

  init() {
    this.$.name = this.shadowRoot.querySelector('.js-list-name')
    this.$.cardList = this.shadowRoot.querySelector('tc-cards')

    this.$.name.textContent = this.name

    this.$.cardList.listId = this.listId
  }
}

window.customElements.define('tc-list', List)
