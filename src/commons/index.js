import uuidv1 from 'js-uuid'

export const uuid = uuidv1

export const mapKeyValueWithoutId = id => object =>
  Object.keys(object)
    .filter(key => key !== id)
    .map(key => [key, object[key]])

export const appendSetStatementsIntoQuery = (query, propertiesToUpdate, table) =>
  propertiesToUpdate
    .reduce((query, [key, value]) => {
      return query.set(table[key], value)
    }, query)
