import { showCartQty, addToCart, showCart, checkGloablRegion } from '../../api/api'

export function saveProductIdToState ({ commit }, productId) {
  console.log('action', productId)
  commit('setProductId', productId)
}

export function getGloablRegion ({ commit }) {
  // console.log('store cart action getGloablRegion 1', checkGloablRegion())
  // let formdata = {}
  checkGloablRegion().then(data => {
    // console.log('store cart action getGloablRegion 2', data)
    if (data && data.length > 0) {
      let returnData = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        returnData.push({
          label: element.name,
          value: element.id,
          regions: element.regions
        })
      }
      commit('updateGloablRegion', returnData)
    }
  }).catch(error => {
    console.log(error)
  })
}

export function setCartQty ({ dispatch }) {
  let formdata = {}
  showCartQty(formdata).then(data => {
    dispatch('setCartQtyDriect', data.total_qty)
  }).catch(error => {
    console.log(error)
  })
}

export function setCartQtyDriect ({ commit }, qty) {
  commit('saveCartQty', qty)
}

export function setCartInfo ({ commit }, info) {
  commit('saveCartInfo', { info: info })
}

export function setJustAdded ({ commit }, info) {
  commit('updateJustAdded', { info: info })
}

export function setCartIndex ({ commit }) {
  commit('incrementCartIndex')
}

export function saveBoughtStatus ({ commit }, status) {
  commit('setBoughtStatus', status)
}

export function buyProduct ({ dispatch }, formdata) {
  return new Promise((resolve, reject) => {
    console.log('buyProduct', formdata)
    addToCart(formdata).then(data => {
      dispatch('setJustAdded', data)
      // debug missing data during add to cart post
      console.log('buyProduct data', data)
      dispatch('setCartIndex')
      dispatch('getCartInfo').then(data => {
        dispatch('saveBoughtStatus', true)
      })
      resolve(data)
    }).catch(error => {
      dispatch('setCartQty')
      reject(error)
    })
  })
}

export function getCartInfo ({ dispatch }) {
  return new Promise((resolve, reject) => {
    let formdata = {}
    showCart(formdata).then(data => {
      let qty = 0
      if (data.items) {
        if (data.items.length > 0) {
          data.items.forEach(o => {
            qty = qty + parseInt(o.qty, 10)
          })
        }
        dispatch('setCartInfo', data)
      } else {
        dispatch('setCartInfo', {})
      }
      dispatch('setCartQtyDriect', qty)
      resolve(data)
    }).catch(error => {
      console.log(error)
      reject(error)
    })
  })
}
