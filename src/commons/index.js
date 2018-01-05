import uuidv1 from 'js-uuid'
import events, { actions } from '../utils/events'

let _globals = {}
export const uuid = uuidv1

export const initGlobals = globals => {
  _globals = Object.assign({}, _globals, globals)

  events.dispatch(actions.GLOBALS_READY)
}

export const globals = () => Object.assign({}, _globals)
