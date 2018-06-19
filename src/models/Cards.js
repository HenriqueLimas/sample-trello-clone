import { uuid, mapKeyValueWithoutId, appendSetStatementsIntoQuery } from '../commons'
import { tables } from '../db/schema'
import Base from './Base'

const mapKeyValueWithoutCardId = mapKeyValueWithoutId('id_card')

export default class Cards extends Base {
  constructor(db) {
    super(db)

    this.tableName = tables.CARDS
  }

  getAll(id_list) {
    return this.db.select()
      .from(this.table)
      .where(this.table.id_list.eq(id_list))
  }

  add({ id_list, title }) {
    const row = this.table.createRow({
      id_card: uuid(),
      id_list,
      title
    })

    return this.db.insertOrReplace().into(this.table).values([row]).exec()
  }

  moveCard({ id_card, id_list }) {
    return this.update({ id_card, id_list })
  }

  update(card) {
    let query = this.db.update(this.table)

    const propertiesToUpdate = mapKeyValueWithoutCardId(card)

    query = appendSetStatementsIntoQuery(query, propertiesToUpdate, this.table)

    return query
      .where(this.table.id_card.eq(card.id_card))
      .exec()
  }

  removeCard(id_card) {
    return this.db
      .delete()
      .from(this.table)
      .where(this.table.id_card.eq(id_card))
      .exec()
  }
}
