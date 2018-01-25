const DB_VERSION = 1

export const tables = {
  BOARDS: 'Boards',
  LISTS: 'Lists',
  CARDS: 'Cards'
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

  // Cards
  //
  schema.createTable(tables.CARDS)
    .addColumn('id_card', db.Type.STRING)
    .addColumn('id_list', db.Type.STRING)
    .addColumn('title', db.Type.STRING)
    .addColumn('description', db.Type.STRING)
    .addNullable(['description'])
    .addPrimaryKey(['id_card'])
    .addForeignKey('fk_list_id', {
      local: 'id_list',
      ref: `${tables.LISTS}.id_list`
    })

  return schema
}

export default initializeSchema

