import ShadowElement from './ShadowElement'
import withQuery from './withQuery'

class Lists extends ShadowElement {
  constructor() {
    super('#tc-lists')

    this.$ = {
      list: null,
      listContainer: null,
      createList: null
    }

    this.boardLists = new Set()

    this.init = this.init.bind(this)
    this.updateLists = this.updateLists.bind(this)
    this.createListElement = this.createListElement.bind(this)
  }

  get boardId() {
    return this.getAttribute('board')
  }

  set boardId(boardId) {
    this.setAttribute('board', boardId)
  }

  connectedCallback() {
    this.runOnLoad(() => {
      try {
        this.init()
      } catch (error) {
        this.query.addEventListener(this.query.events.INITIALIZED, this.init)
      }
    })
  }

  disconnectedCallback() {
    this.query.unobserve(this.queryList, this.updateLists)
  }

  init() {
    this.$.list = this.shadowRoot.querySelector('.js-list')
    this.$.createList = this.shadowRoot.querySelector('.js-create-new-list')

    this.$.createList.querySelector('tc-create-new-list')
      .boardId = this.boardId

    this.queryList = this.query.getListsQuery(this.boardId)

    this.query.observe(this.queryList, this.updateLists)

    this.queryList.exec()

    this.query.removeEventListener(this.query.events.INITIALIZED, this.init)
  }

  updateLists(changes) {
    const listsFromDB = changes[0].object

    this.listsToAdd = listsFromDB.filter(list => {
      return !this.boardLists.has(list.id_list)
    })

    this.update()
  }

  createListElement(list) {
    const listContainer = this.create('div')
    const $list = this.create('tc-list')

    listContainer.classList.add('list-item')

    $list.name = list.name
    $list.listId = list.id_list

    listContainer.appendChild($list)

    return listContainer
  }

  update() {
    this.listsToAdd
      .map(this.createListElement)
      .forEach(element => {
        this.$.list.insertBefore(element, this.$.createList)
      })
  }
}

window.customElements.define('tc-lists', withQuery(Lists))
