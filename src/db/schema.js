const DB_VERSION = 1

export const tables = {
  BOARDS: 'Boards'
}

const initializeSchema = db => {
  const schema = db.schema.create('trello-clone', DB_VERSION)

  // Boards
  //
  schema.createTable(tables.BOARDS)
    .addColumn('id_board', db.Type.STRING)
    .addColumn('name', db.Type.STRING)
    .addPrimaryKey(['id_board'])

  return schema
}

export default initializeSchema

