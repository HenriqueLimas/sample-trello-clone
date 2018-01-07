const withQuery = Component => {
  Object.defineProperty(Component.prototype, 'query', {
    get: function() {
      this.$ = this.$ || {}

      if (!this.$.db) {
        this.$.db = document.querySelector('trello-clone').db
      }

      return this.$.db
    }
  })

  return Component
}

export default withQuery
