const state = {
  lang: 'en',
  storeId: '62',
  storeCode: 'mandarinoriental_en',
  currency: 'EUR',
  employcode: '',
  fromStoreId: ''
}

const getters = {
  getLang: (state, getters, rootState) => {
    return state.lang
  },
  getStoreId: (state, getters) => {
    return state.storeId
  },
  getStoreCode: (state, getters) => {
    return state.storeCode
  },
  getEmployCode: (state, getters) => {
    return state.employcode
  }
}

const actions = {
  setLang ({ commit }, lang) {
    commit('saveLang', lang)
  },
  setStoreId ({ commit }, storeid) {
    commit('saveStoreId', storeid)
  },
  setFromStoreId ({ commit }, storeid) {
    commit('saveFromStoreId', storeid || '')
  },
  setStoreCode ({ commit }, storeCode) {
    commit('saveStoreCode', storeCode)
  },
  setCurrency ({ commit }, currency) {
    commit('saveCurrency', currency)
  },
  setEmploy ({ commit }, code) {
    commit('saveEmploy', code)
  }
}

const mutations = {
  saveLang (state, lang) {
    state.lang = lang
  },
  saveStoreId (state, storeId) {
    state.storeId = storeId
  },
  saveFromStoreId (state, storeId) {
    state.fromStoreId = storeId
  },
  saveStoreCode (state, storeCode) {
    state.storeCode = storeCode
  },
  saveCurrency (state, currency) {
    state.currency = currency
  },
  saveEmploy (state, code) {
    state.employcode = code
  }
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
