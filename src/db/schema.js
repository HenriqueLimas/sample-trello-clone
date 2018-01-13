const DB_VERSION = 1

export const tables = {
  BOARDS: 'Boards',
  LISTS: 'Lists'
}

const initializeSchema = db => {
  const schema = db.schema.create('trello-clone', DB_VERSION)

  // Boards
  //
  schema.createTable(tables.BOARDS)
    .addColumn('id_board', db.Type.STRING)
    .addColumn('name', db.Type.STRING)
    .addPrimaryKey(['id_board'])

  // Lists
  //
  schema.createTable(tables.LISTS)
    .addColumn('id_list', db.Type.STRING)
    .addColumn('id_board', db.Type.STRING)
    .addColumn('name', db.Type.STRING)
    .addPrimaryKey(['id_list'])
    .addForeignKey('fk_boards_id', {
      local: 'id_board',
      ref: `${tables.BOARDS}.id_board`
    })

  return schema
}

export default initializeSchema

