import ShadowElement from './ShadowElement'

class Header extends ShadowElement {
  constructor() {
    super('#header')
  }
}

customElements.define('tc-header', Header)
