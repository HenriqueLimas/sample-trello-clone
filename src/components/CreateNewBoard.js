import ShadowElement from './ShadowElement'

class CreateNewBoard extends ShadowElement {
  constructor() {
    super()

    this.$ = {
      board: null,
      form: null,
      input: null
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

    this.$.text = this.shadowRoot.querySelector('a')
    this.$.form = this.shadowRoot.querySelector('form')
    this.$.input = this.shadowRoot.querySelector('input')

    this.$.form.addEventListener('submit', this.handleForm)
    this.$.text.addEventListener('click', this.toggleIsAdding)
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
  }

  render() {
    this.update(`
      <link rel="stylesheet" href="/styles/components/CreateNewBoard.css">

      <div class="board">
        <form class="${this.isAdding ? 'visible' : ''}">
          <input name="name" type="text" />
        </form>

        <a class="${this.isAdding ? '' : 'visible'}" href="#">Create new board...</a>
      </div>
    `)
  }

}

window.customElements.define('tc-create-new-board', CreateNewBoard)
