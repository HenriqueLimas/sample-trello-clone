import ShadowElement from '../ShadowElement'
import withQuery from '../withQuery'

class Cards extends ShadowElement {
  constructor() {
    super('#tc-cards')

    this.$ = {
      cards: null,
      createCard: null
    }

    this.cardLists = new Set()

    this.init = this.init.bind(this)
    this.updateCards = this.updateCards.bind(this)
    this.createCardElement = this.createCardElement.bind(this)
  }

  get listId() {
    return this.getAttribute('list')
  }

  set listId(listId) {
    this.setAttribute('list', listId)
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
    this.query.unobserve(this.queryCards, this.updateCards)
  }

  init() {
    this.$.cards = this.shadowRoot.querySelector('.js-cards')
    this.$.createCard = this.shadowRoot.querySelector('.js-create-new-card')

    this.$.createCard.querySelector('tc-create-new-card')
      .listId = this.listId

    this.queryCards = this.query.getCardsQuery(this.listId)

    this.query.observe(this.queryCards, this.updateCards)

    this.queryCards.exec()

    this.query.removeEventListener(this.query.events.INITIALIZED, this.init)
  }

  updateCards(changes) {
  }

  createCardElement(card) {
    const cardContainer = this.create('div')
    const cardElement = this.create('tc-card')

    cardContainer.classList.add('card-item')

    cardElement.title = card.title
    cardElement.cardId = card.id_card

    cardContainer.appendChild(cardElement)

    return cardContainer
  }

  update() {
    this.cardsToAdd
      .forEach(card => {
        const element = this.createCardElement(card)
        this.$cards.insertBefore(element, this.$.createCard)
        this.cardLists.add(card.id_card)
      })

    this.cardsToAdd = []
  }
}

window.customElements.define('tc-cards', withQuery(Cards))
