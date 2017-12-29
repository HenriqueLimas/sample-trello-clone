import { innerHTML } from '../utils/diffhtml'

class ShadowElement extends HTMLElement {
  constructor() {
    super()

    this.attachShadow({ mode: 'open' })
  }

  update(html) {
    innerHTML(this.shadowRoot, html)
  }
}

export default ShadowElement
