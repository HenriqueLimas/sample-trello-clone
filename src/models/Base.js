let _db = null

export default class Base {
  constructor(db) {
    _db = db
  }

  get db() {
    return _db
  }

  get table() {
    return this.db.getSchema().table(this.tableName)
  }

  observe(query, handler) {
    this.db.observe(query, handler)
  }

  unobserve(query, handler) {
    this.db.unobserve(query, handler)
  }
}
