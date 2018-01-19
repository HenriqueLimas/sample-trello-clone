import ShadowElement from './ShadowElement'
import withQuery from './withQuery'

class CreateNewList extends ShadowElement {
  constructor() {
    super('#tc-create-new-list')

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
    this.$.text = this.shadowRoot.querySelector('.js-create-new-list')
    this.$.form = this.shadowRoot.querySelector('form')
    this.$.input = this.shadowRoot.querySelector('input')
    this.$.cancel = this.shadowRoot.querySelector('.js-cancel')
    this.$.add = this.shadowRoot.querySelector('.js-add')

    this.$.form.addEventListener('submit', this.handleForm)
    this.$.add.addEventListener('click', this.handleForm)
    this.$.text.addEventListener('click', this.toggleIsAdding)
    this.$.cancel.addEventListener('click', this.toggleIsAdding)
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

  get boardId() {
    return this.getAttribute('board')
  }

  set boardId(boardId) {
    this.setAttribute('board', boardId)
  }

  handleForm(event) {
    event.preventDefault()

    const name = this.$.input.value

    if (!name) return

    this.query.addList({ id_board: this.boardId, name })
      .then(() => {
        this.adding = false
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
      this.$.form.reset()
    }
  }
}

window.customElements.define('tc-create-new-list', withQuery(CreateNewList))
