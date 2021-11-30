import Vue from 'vue'
import Vuex from 'vuex'
import lang from './lang/index'
import site from './site/index'
import prod from './product/index'
import cart from './cart/index'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      lang,
      site,
      prod,
      cart
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
