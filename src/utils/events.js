export const actions = {
  GLOBALS_READY: 'globals_ready'
}

class Events {
  constructor() {
    this.events = {
      [actions.GLOBALS_READY]: []
    }
  }

  on(eventName, callback) {
    this.events[eventName] = this.events[eventName] || []

    this.events[eventName].push(callback)
  }

  dispatch(eventName, data) {
    const listeners = this.events[eventName] || []

    listeners.forEach(callback => callback(data))
  }
}

export default new Events()
