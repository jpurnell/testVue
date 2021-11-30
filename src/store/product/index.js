import { getCategory, getProduct } from '../../api/api'
const state = {
  category: {},
  product: {},
  prodPageLoading: false
}

const getters = {
  storeCategory: (state) => {
    return state.category
  },
  storeProduct: (state) => {
    return state.product
  }
}

const actions = {
  getCategoryAction ({ commit }, params) {
    return new Promise((resolve, reject) => {
      commit('productIsLoading', true)
      getCategory(params).then(data => {
        commit('productIsLoading', false)
        console.log('category data', data)
        if (data.meta_title) {
          commit('site/saveTitle', data.meta_title, { root: true })
        }
        commit('saveCategory', { category: data })
        resolve(data)
      }).catch(error => {
        console.log(error, 'category info error')
        commit('saveCategory', { category: {} })
        reject(error)
      })
    })
  },
  getProductAction ({ commit }, params) {
    // console.log('getProductAction product params', params)
    return new Promise((resolve, reject) => {
      getProduct(params).then(data => {
        commit('saveProduct', { product: data })
        resolve(data)
      }).catch(error => {
        console.log(error, 'product info error')
        commit('saveProduct', { product: {} })
        if (error === 'Invalide product.') {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
}

const mutations = {
  saveCategory (state, { category }) {
    state.category = Object.assign({}, category)
  },
  saveProduct (state, { product }) {
    state.product = Object.assign({}, product)
  },
  productIsLoading (state, value) {
    state.prodPageLoading = value
  }
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
