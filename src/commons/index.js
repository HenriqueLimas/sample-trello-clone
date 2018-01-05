import uuidv1 from 'js-uuid'

let _globals = {}
export const uuid = uuidv1

export const initGlobals = globals => {
  _globals = Object.assign({}, _globals, globals)
}

export const globals = () => Object.assign({}, _globals)
