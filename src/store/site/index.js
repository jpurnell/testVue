import { getNavigation, getHomePage, getHomePageMobile, getSearchSuggest, getPromotion, faviList, addToFavi, faviRemove } from '../../api/api'
const state = {
  session: '',
  title: '',
  siteNav: [],
  homePc: {},
  homeMobile: {},
  needShowLogin: false,
  hasLoginSuccess: false,
  searchSuggest: [],
  promotion: {},
  faviList: [],
  faviHash: [],
  defaultCountry: '',
  isMar: false,
  isEU: true,
  pageLoading: false
}

const getters = {
  getSiteNav: (state, getters, rootState) => {
    return state.siteNav
  }
}

const actions = {
  setSiteNav ({ commit }, urlKey) {
    let params = {}
    if (urlKey) {
      params.url_key = urlKey
    }
    getNavigation(params).then(data => {
      commit('saveSiteNav', { nav: data })
    }).catch(error => {
      console.log(error)
    })
  },
  setSession ({ commit }, session) {
    commit('saveSession', session)
  },
  setTitle ({ commit }, title) {
    commit('saveTitle', title)
  },
  setHomePc ({ commit }, params) {
    return new Promise((resolve, reject) => {
      getHomePage(params).then(data => {
        console.log('homepage', data)
        commit('saveHomePc', { home: data })
        resolve()
      }).catch(error => {
        console.log(error, 'home error')
        reject()
      })
    })
  },
  setHomeMobile ({ commit }, params) {
    getHomePageMobile(params).then(data => {
      commit('saveHomeMobile', { home: data })
    }).catch(error => {
      console.log(error)
    })
  },
  setNeedShowLogin ({ commit }, params) {
    commit('saveNeedShowLogin', params)
  },
  setHasLoginSuccess ({ dispatch, commit }, params) {
    if (params) {
      dispatch('cart/getCartInfo', null, { root: true })
    }
    commit('saveHasLoginSuccess', params)
  },
  getSearchSuggest ({ commit }, params) {
    getSearchSuggest(params).then(data => {
      console.log('getSearchSuggest', data)
      commit('saveSearchSuggest', { suggest: data })
    }).catch(error => {
      console.log(error, 'getSearchSuggest error')
    })
  },
  setPromotion ({ commit }) {
    getPromotion({}).then(data => {
      commit('savePromotion', { promotion: data })
    }).catch(error => {
      console.log(error)
    })
  },
  getFaviList ({ commit }, params) {
    // return new Promise((resolve, reject) => {
    faviList(params).then(data => {
      console.log('getFaviList', data)
      commit('saveFaviList', { list: data })
      // resolve()
    }).catch(error => {
      console.log(error, 'getFaviList error')
      // reject()
    })
    // })
  },
  setToFavi ({ dispatch }, params) {
    addToFavi(params).then(data => {
      console.log('setToFavi', data)
      dispatch('getFaviList')
    }).catch(error => {
      console.log(error, 'setToFavi error')
    })
  },
  setFaviRemove ({ dispatch }, params) {
    faviRemove(params).then(data => {
      console.log('setFaviRemove', data)
      dispatch('getFaviList')
    }).catch(error => {
      console.log(error, 'setFaviRemove error')
    })
  },
  setDefaultCountry ({ commit }, params) {
    console.log('setDefaultCountry', this.defaultCountry, params)
    commit('saveDefaultCountry', params)
  },
  setIsLoading ({ commit }, params) {
    commit('saveIsLoading', params)
  }
}

const mutations = {
  saveSiteNav (state, { nav }) {
    state.siteNav = Object.assign([], nav)
  },
  saveSession (state, session) {
    state.session = session
  },
  saveTitle (state, title) {
    console.log(title, 'title')
    state.title = title
  },
  saveHomePc (state, { home }) {
    state.homePc = home
  },
  saveHomeMobile (state, { home }) {
    state.homeMobile = home
  },
  saveNeedShowLogin (state, isNeed) {
    state.needShowLogin = isNeed
  },
  saveHasLoginSuccess (state, hasLoginSuccess) {
    state.hasLoginSuccess = hasLoginSuccess
  },
  saveSearchSuggest (state, home) {
    console.log('saveSearchSuggest', home)
    state.searchSuggest = home.suggest
  },
  savePromotion (state, { promotion }) {
    console.log('savePromotion', promotion)
    state.promotion = promotion
  },
  saveFaviList (state, { list }) {
    console.log('saveFaviList', list)
    state.faviList = list
    let hash = {}
    Object.keys(list).forEach(o => {
      // console.log('update faviList 1-0', o, data[o])
      hash[list[o].id] = list[o].item_id
    })
    state.faviHash = hash
  },
  saveDefaultCountry (state, newCountry) {
    console.log('saveDefaultCountry', newCountry)
    state.defaultCountry = newCountry
  },
  saveIsLoading (state, value) {
    state.pageLoading = value
  }
}

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state
}
