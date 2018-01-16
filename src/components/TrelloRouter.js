class TrelloRouter extends HTMLElement {
  constructor() {
    super()

    this.previousRoute = null
    this.currentRoute = null
    this.loadingRoute = null
    this.isInitialized = false

    this.stateChangeHandler = this.stateChangeHandler.bind(this)
  }

  get utils() {
    return utilities
  }

  get router() {
    return this
  }

  connectedCallback() {
    this.init()
  }

  unconnectedCallback() {
    window.removeEventListener('popstate', this.stateChangeHandler, false)

    if (isIE || isEdge) {
      window.removeEventListener('hashchange', this.stateChangeHandler, false)
    }
  }

  init() {
    if (this.isInitialized) {
      return
    }

    this.isInitialized = true

    window.addEventListener('popstate', this.stateChangeHandler, false)

    if (isIE || isEdge) {
      window.addEventListener('hashchange', this.stateChangeHandler, false)
    }

    this.utils.stateChange(this.router)
  }

  go(path, options) {
    go(path, options)
  }

  stateChangeHandler() {
    return this.utils.stateChange(this.router)
  }
}

const isIE = 'ActiveXObject' in window;
const isEdge = !!window.navigator.userAgent.match(/Edge/)

const utilities = {
  parseUrl,
  stateChange,
  findRouteElement,
  testRoute,
  notFound,
  activateRoute,
  activateElement,
  deactivateRoute,
  addElementIntoDOM,
  updateRoutesSequence
}

function parseUrl(location) {
  let path, hash, search;

  if (typeof URL === 'function') {
    const nativeUrl = new URL(location)
    path = nativeUrl.pathname
    hash = nativeUrl.hash
    search = nativeUrl.search
  } else {
    const anchor = document.createElement('a')
    anchor.href = location

    path = anchor.pathname

    if (path.charAt(0) !== '/') {
      path = '/' + path
    }

    hash = anchor.hash
    search = anchor.search
  }

  return {
    path,
    hash,
    search
  }
}

function stateChange(router) {
  const url = parseUrl(window.location.href)

  const route = findRouteElement(router, url.path)

  if (!route) {
    return notFound()
  }

  activateRoute(router, route, url)
}

function findRouteElement(router, path) {
  let route = router.firstElementChild

  while(route) {
    if (route.tagName === 'TC-ROUTE' && testRoute(route.getAttribute('path'), path)) {
      return route
    }

    route = route.nextSibling
  }

  return null
}

function testRoute(path, pathToTest) {
  return path === pathToTest || segmentsMatch(path, pathToTest)
}

function segmentsMatch(routePath, urlPath) {
  const routeSegments = routePath.split('/').filter(path => path)
  const urlSegments = urlPath.split('/').filter(path => path)

  if (routeSegments.length !== urlSegments.length) {
    return null
  }

  const params = {}

  for (let i = 0, len = routeSegments.length; i < len; i++) {
    const routeSegment = routeSegments[i]
    const urlSegment = urlSegments[i]

    if (routeSegment === urlSegment) {
      continue
    }

    if (routeSegment.charAt(0) === ':') {
      params[routeSegment.substr(1)] = urlSegment
      continue
    }

    return null
  }

  return params
}

function notFound() {
  console.log('not found')
}

function activateRoute(router, route, url) {
  router.loadingRoute = route

  const element = document.createElement(route.getAttribute('element'))

  activateElement(router, route, element, url)
}

function activateElement(router, route, element, url) {
  updateRoutesSequence(router, route)

  deactivateRoute(router.previousRoute)

  addElementIntoDOM(router, element, url)
}

function updateRoutesSequence(router, route) {
  router.previousRoute = router.currentRoute
  router.currentRoute = route
  router.loadingRoute = null

  if (router.previousRoute) {
    router.previousRoute.removeAttribute('active')
  }

  router.currentRoute.setAttribute('active', '')
}

function deactivateRoute(route) {
  if (route) {
    let node = route.firstChild

    while(node) {
      let nodeToRemove = node
      node = node.nextSibling
      route.removeChild(nodeToRemove)
    }
  }
}

function addElementIntoDOM(router, element, url) {
  const routePath = router.currentRoute.getAttribute('path')

  mapParamsToProps(routePath, url, element)

  router.currentRoute.appendChild(element)
}

function mapParamsToProps(routePath, url, element) {
  const params = segmentsMatch(routePath, url.path)

  const queries = url.search.substr(1).split('&')
    .filter(search => search)
    .reduce((queries, search) => {
      const keyValue = search.split('=')

      return Object.assign({}, queries, {
        [keyValue[0]]: keyValue[1] || true
      })
    }, {})

  Object.keys(params)
    .forEach(key => {
      element.setAttribute(key, params[key])
    })

  Object.keys(queries)
    .forEach(key => {
      element.setAttribute(key, queries[key])
    })
}

function go(path, options={}) {
  const currentState = window.history.state

  if (options.replace) {
    window.history.replaceState(currentState, null, path)
  } else {
    window.history.pushState(currentState, null, path)
  }

  try {
    const popstateEvent = new PopStateEvent('popstate', {
      bubbles: false,
      cancelable: false,
      state: currentState
    })

    window.dispatchEvent(popstateEvent)
  } catch (error) {
    const fallbackEvent = document.createEvent('CustomEvent')
    fallbackEvent.initCustomEvent('popstate', false, false, { state: currentState })
    window.dispatchEvent(fallbackEvent)
  }
}

class TrelloLink extends HTMLElement {
  constructor() {
    super()

    this.$ = {
      link: null
    }
  }

  get to() {
    return this.getAttribute('to')
  }

  connectedCallback() {
    if (!this.getAttribute('to')) {
      throw new Error('tc-link: "to" attribute is required')
    }

    this.$.link = document.createElement('a')

    this.$.link.setAttribute('href', this.to)
    this.$.link.setAttribute('alt', this.getAttribute('alt'))
    this.$.link.setAttribute('class', this.getAttribute('class'))
    this.$.link.innerHTML = this.innerHTML

    this.$.link.addEventListener('click', event => {
      event.preventDefault()
      go(this.to)
    })

    this.innerHTML = ''
    this.appendChild(this.$.link)
  }
}

window.customElements.define('tc-router', TrelloRouter)
window.customElements.define('tc-route', class TrelloRoute extends HTMLElement {})
window.customElements.define('tc-link', TrelloLink, { extends: 'a' })
