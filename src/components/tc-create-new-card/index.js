import ShadowElement from '../ShadowElement'
import withQuery from '../withQuery'

class CreateNewCard extends ShadowElement {
  constructor() {
    super('#tc-create-new-card')

    this.$ = {
      text: null,
      form: null,
      input: null,
      add: null,
      cancel: null
    }

    this.handleForm = this.handleForm.bind(this)
    this.toggleIsAdding = this.toggleIsAdding.bind(this)
  }

  static get observedAttributes() { return ['adding'] }

  connectedCallback() {
    this.runOnLoad(() => {
      this.$.text = this.shadowRoot.querySelector('.js-create-new-card')
      this.$.form = this.shadowRoot.querySelector('form')
      this.$.input = this.shadowRoot.querySelector('textarea')
      this.$.cancel = this.shadowRoot.querySelector('.js-cancel')
      this.$.add = this.shadowRoot.querySelector('.js-add')

      this.$.form.addEventListener('submit', this.handleForm)
      this.$.add.addEventListener('click', this.handleForm)
      this.$.text.addEventListener('click', this.toggleIsAdding)
      this.$.cancel.addEventListener('click', this.toggleIsAdding)
    })
  }

  attributeChangedCallback() {
    this.update()
  }

  get adding() {
    return this.hasAttribute('adding')
  }

  set adding(value) {
    if (value) {
      this.setAttribute('adding', '')
    } else {
      this.removeAttribute('adding')
    }
  }

  get listId() {
    return this.getAttribute('list')
  }

  set listId(listId) {
    this.setAttribute('list', listId)
  }

  handleForm(event) {
    event.preventDefault()

    const title = this.$.input.value

    if (!title) return

    this.query.addCard({ id_list: this.listId, title })
      .then(() => {
        this.adding = false
        this.$.form.reset()
      })
  }

  toggleIsAdding(event) {
    event.preventDefault()
    event.stopPropagation()

    this.adding = !this.adding
  }

  update() {
    if (this.adding) {
      this.$.form.classList.add('visible')
      this.$.text.classList.remove('visible')

      this.$.input.focus()
    } else {
      this.$.form.classList.remove('visible')
      this.$.text.classList.add('visible')
    }
  }
}

window.customElements.define('tc-create-new-card', withQuery(CreateNewCard))
