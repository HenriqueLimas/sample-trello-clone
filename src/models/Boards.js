import { uuid } from '../commons'
import { tables } from '../db/schema'
import Base from './Base'

export default class Boards extends Base {
  constructor(db) {
    super(db)

    this.tableName = tables.BOARDS
  }

  getAll() {
    return this.db.select().from(this.table)
  }

  add({ name, description }) {
    const row = this.table.createRow({
      id_board: uuid(),
      name,
      description
    })

    return this.db.insertOrReplace().into(this.table).values([row]).exec();
  }
}
