import config from './../config/index'
import { defaultLang } from './../config/browser.lang'

const install = function (Vue) {
  Vue.prototype.$trackPageView = (options) => {
    const { lang, title, url } = options
    // console.log(lang)
    // console.log(title)
    // console.log(url)
    if (typeof window !== 'undefined') {
      if (window._paq) {
        let _paq = window._paq
        let siteId = config[lang].matomoSiteId || config[defaultLang].matomoSiteId
        _paq.push(['setSiteId', siteId])
        _paq.push(['setDocumentTitle', title || window.title])
        _paq.push(['setCustomUrl', url])
        _paq.push(['trackPageView'])
      }
      if (window.ga) {
        ga('set', 'title', title || window.title)
        // ga('newTracker.set', 'title', title || window.title)
        ga('set', 'page', url)
        // ga('newTracker.set', 'page', url)
        // ga('set', 'location', url)
        ga('send', 'pageview')
        // ga('newTracker.send', 'pageview')
      }
    }
  }
}

export default install
