export function setProductId (state, productId) {
  state.productId = productId
}

export function saveCartQty (state, qty) {
  state.cartQty = parseInt(qty, 10)
}

export function saveCartInfo (state, { info }) {
  state.cart = Object.assign({}, info)
}

export function setBoughtStatus (state, status) {
  state.bought = status
}

export function updateGloablRegion (state, data) {
  state.region = data
}

export function updateJustAdded (state, { info }) {
  state.justAdded = Object.assign({}, info)
}

export function incrementCartIndex (state) {
  state.cartIndex++
}
