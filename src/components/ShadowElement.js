import { innerHTML } from '../utils/diffhtml'

const ownerDocument = document.currentScript.ownerDocument

class ShadowElement extends HTMLElement {
  constructor(templateQuery) {
    super()

    this.templateQuery = templateQuery

    this.attachShadow({ mode: 'open' })

    this.importTemplate()
  }

  importTemplate() {
    if (!this.templateQuery) return

    this.loadStyle()
      .then(() => {
        ShadyCSS.prepareTemplate(this.template, this.tagName.toLowerCase())
        ShadyCSS.styleElement(this)

        const clone = document.importNode(this.template.content, true)
        this.shadowRoot.appendChild(clone)
      })
  }

  get template() {
    if (!this._template) {
      this._template = ownerDocument.querySelector(this.templateQuery)
    }

    return this._template
  }

  loadStyle() {
    return new Promise((resolve, reject) => {
      const style = this.template.content.querySelector('style[from]')

      const src = style.getAttribute('from')

      const req = new XMLHttpRequest()

      req.open('GET', src)

      req.addEventListener('load', event => {
        const response = event.target.responseText

        style.innerHTML = response
        resolve()
      })

      req.send()
    })
  }

  update(html) {
    innerHTML(this.shadowRoot, html)
  }
}

export default ShadowElement
