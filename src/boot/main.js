import { Platform, Cookies } from 'quasar'
import config from './../config/index'
import { browserLangConfig, defaultLang } from './../config/browser.lang'
import { currency } from './../config/currency'
import store from './../store/site/index'

export function getIsEu () {
  return store.state.isEU
}

// "async" is optional
export default async ({ app, router, store, ssrContext }) => {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  const platform = process.env.SERVER
    ? Platform.parseSSR(ssrContext)
    : Platform

  let spaBrowserLangServer = defaultLang
  if (typeof window !== 'undefined' && window.navigator) {
    let userLang = window.navigator.language || navigator.userLanguage || defaultLang
    let userLangletter = userLang.toLowerCase()
    if (userLangletter === 'zh' || userLangletter === 'zh-cn' || userLangletter === 'zh-tw' || userLangletter === 'zh-hk') {
      spaBrowserLangServer = 'zh-CN'
    } else {
      spaBrowserLangServer = checkLang(userLangletter)
    }
  }
  let browserLangServer = cookies.get('lang') || spaBrowserLangServer
  browserLangServer = checkLang(browserLangServer)
  router.beforeEach((to, from, next) => {
    const { params } = to
    const { lang } = params

    if (to.query) {
      let employCodeFromCookie = cookies.get('employcode')
      if (to.query['promo-tag']) {
        let employcode = to.query['promo-tag']
        console.log('employcode', employcode)
        store.dispatch('lang/setEmploy', employcode)
        cookies.set('employcode', employcode, { path: '/' })
      } else if (employCodeFromCookie) {
        store.dispatch('lang/setEmploy', employCodeFromCookie)
      }
    }

    if (lang) {
      if (lang === 'cn' || lang === 'CN' || lang === 'zh_cn' || lang === 'zh-cn' || lang === 'zh_CN') {
        app.i18n.locale = 'zh-CN'
      } else {
        let langs = Object.keys(config)
        // console.log(langs)
        if (langs.indexOf(lang) !== -1) {
          app.i18n.locale = lang
        } else {
          if (platform.is.desktop || (platform.is.mobile && !platform.is.cordova)) {
            app.i18n.locale = browserLangServer
          }
          if (lang === 'wechatpay') {
            next({ name: 'wechatPay', params: { lang: app.i18n.locale }, query: to.query })
          /*
          } else if (lang === 'c') {
            next({ name: 'wechatPay', params: { lang: app.i18n.locale }, query: to.query })
          } else if (lang === 'p') {
            console.log(to.params)
            next({ name: 'product', params: { lang: app.i18n.locale, p: params.p }, query: to.query })
          */
          } else {
            next({ name: 'error404', params: { lang: app.i18n.locale } })
          }
        }
      }
    } else {
      if (platform.is.desktop || (platform.is.mobile && !platform.is.cordova)) {
        app.i18n.locale = browserLangServer
      }
    }
    params.lang = app.i18n.locale
    cookies.set('lang', app.i18n.locale, { path: '/' })
    // 更新保存lang至store
    let storeId = config[app.i18n.locale].storeId || config[defaultLang].storeId
    let storeCode = config[app.i18n.locale].storeCode || config[defaultLang].storeCode
    store.dispatch('lang/setStoreId', storeId)
    store.dispatch('lang/setStoreCode', storeCode)
    store.dispatch('lang/setLang', app.i18n.locale)
    setMatomoSiteId(app.i18n.locale)

    let currentCurrency
    if (getIsEu() === true) {
      currentCurrency = 'EUR'
    } else {
      currentCurrency = 'CNY'
    }
    if (cookies.has('currency')) {
      let currentCookie = cookies.get('currency')
      let currencyFilter = currency.filter(item => {
        return item.value === currentCookie
      })
      if (currencyFilter.length > 0) {
        currentCurrency = currentCookie
      }
    }
    store.dispatch('lang/setCurrency', currentCurrency)

    let isLogin = cookies.get('isLogin')
    if (to.path === '/') {
      next({ name: 'home', params: { lang: app.i18n.locale }, query: to.query })
    } else {
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (parseInt(isLogin, 10) !== 1) {
          // console.log('not login')
          next({ name: 'login', params: { lang: app.i18n.locale } })
        } else {
          next()
        }
      } else if (to.matched.some(record => record.meta.requiresNotLogin)) {
        if (parseInt(isLogin, 10) !== 1) {
          next()
        } else {
          next({ name: 'orderList', params: { lang: app.i18n.locale } })
        }
      } else {
        next()
      }
    }
  })
}

function checkLang (lang) {
  var browserLang = defaultLang
  browserLangConfig.forEach(item => {
    if (item.match.indexOf(lang) !== -1) {
      browserLang = item.value
    }
  })
  return browserLang
}

function setMatomoSiteId (lang) {
  if (typeof window !== 'undefined' && window._paq) {
    let _paq = window._paq
    let siteId = config[lang].matomoSiteId || config[defaultLang].matomoSiteId
    _paq.push(['setSiteId', siteId])
  }
}
