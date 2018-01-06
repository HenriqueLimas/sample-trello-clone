import ShadowElement from './ShadowElement'

class CreateNewBoard extends ShadowElement {
  constructor() {
    super()

    this.$ = {
      text: null,
      form: null,
      input: null,
      add: null,
      cancel: null
    }

    this.isAdding = false

    this.render = this.render.bind(this)
    this.handleForm = this.handleForm.bind(this)
    this.toggleIsAdding = this.toggleIsAdding.bind(this)
  }

  get query() {
    if (!this.$.db) {
      this.$.db = document.querySelector('trello-clone').db
    }

    return this.$.db
  }

  connectedCallback() {
    this.render()

    this.$.text = this.shadowRoot.querySelector('.js-create-new-board')
    this.$.form = this.shadowRoot.querySelector('form')
    this.$.input = this.shadowRoot.querySelector('input')
    this.$.cancel = this.shadowRoot.querySelector('.js-cancel')
    this.$.add = this.shadowRoot.querySelector('.js-add')

    this.$.form.addEventListener('submit', this.handleForm)
    this.$.add.addEventListener('click', this.handleForm)
    this.$.text.addEventListener('click', this.toggleIsAdding)
    this.$.cancel.addEventListener('click', this.toggleIsAdding)
  }

  handleForm(event) {
    event.preventDefault()

    const name = this.$.input.value

    if (!name) return

    this.query.addBoard({ name })
      .then(() => {
        this.$.form.reset()
        this.isAdding = false

        this.render()
      })
  }

  toggleIsAdding(event) {
    event.preventDefault()

    this.isAdding = !this.isAdding

    this.render()

    if (this.isAdding) {
      this.$.input.focus()
    }
  }

  render() {
    this.update(`
      <link rel="stylesheet" href="/styles/components/CreateNewBoard.css">

      <div class="board">
        <form class="${this.isAdding ? 'visible' : ''}">
          <input name="name" type="text" />
          <div class="form-actions">
            <a class="add js-add" href="#">Add</a>
            <a class="cancel js-cancel" href="#">Cancel</a>
          </div>
        </form>

        <a class="create-new-board js-create-new-board ${this.isAdding ? '' : 'visible'}" href="#">Create new board...</a>
      </div>
    `)
  }

}

window.customElements.define('tc-create-new-board', CreateNewBoard)
