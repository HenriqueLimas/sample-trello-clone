import events, { actions } from '../utils/events'
import { globals } from '../commons'

import ShadowElement from './ShadowElement'

class Boards extends ShadowElement {
  constructor() {
    super()

    this.boards = []

    this.render = this.render.bind(this)
    this.updateBoards = this.updateBoards.bind(this)
  }

  get model() {
    return globals().boards
  }

  connectedCallback() {
    events.on(actions.GLOBALS_READY, () => {
      const query = this.model.getAll()

      this.model.observe(query, this.updateBoards)

      query.exec()
        .then(results => {
          this.boards = results

          this.render()
        })
    })
  }

  updateBoards(changes) {
    changes.forEach(change => {
      this.boards = change.object
    })

    this.render()
  }

  render() {
    this.update(`
      <section class="boards">
        <h1>Boards</h1>

        <main class="list">
          ${this.boards.map(board => `
            <div class="board">
              <p class="board__name js-board__name">
                ${board.name}
              </p>
            </div>
          `)}
        </main>
      </section>
    `)
  }
}

window.customElements.define('tc-boards', Boards)
