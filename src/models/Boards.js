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

  add({ name }) {
    const row = this.table.createRow({
      id_board: uuid(),
      name
    })

    return this.db.insertOrReplace().into(this.table).values([row]).exec();
  }

  getBoard(id_board) {
    return this.db.select().from(this.table)
      .where(this.table.id_board.eq(id_board))
  }
}
