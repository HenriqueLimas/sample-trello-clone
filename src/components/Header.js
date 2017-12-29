import ShadowElement from './ShadowElement'

class Header extends ShadowElement {
  constructor() {
    super()

    this.render = this.render.bind(this)
  }

  connectedCallback() {
    this.render()
  }

  render() {
    this.update(`
      <header>
        <h1 class="logo">Trello Clone</h5>
      </header>

      <link rel="stylesheet" href="styles/components/Header.css">
    `)
  }
}

customElements.define('tc-header', Header)
