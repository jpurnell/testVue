import { Cookies } from 'quasar'
import config from './../config/index'
import { browserLangConfig, defaultLang } from './../config/browser.lang'

export default async ({ ssrContext }) => {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  let browserLangServerArray = ssrContext.req.headers['accept-language'] || defaultLang
  let browserLangServer = initAcceptLanguage(browserLangServerArray)
  // let cookie = ssrContext.req.headers['cookie']
  let cookieArray = ssrContext.req.headers['cookie']
  // console.log(cookieArray, 'server cookies')
  if (cookieArray) {
    cookieArray = cookieArray.split('; ')
    cookieArray.forEach(a => {
      let keyValue = a.split('=')
      if (keyValue[0] === 'lang') {
        let langs = langsList()
        if (langs.indexOf(keyValue[1]) !== -1) {
          cookies.set(keyValue[0], decodeURI(keyValue[1]), { path: '/' })
        } else {
          cookies.set(keyValue[0], browserLangServer, { path: '/' })
        }
      } else {
        cookies.set(keyValue[0], decodeURI(keyValue[1]), { path: '/' })
      }
    })
  }
  if (!cookies.get('lang')) {
    cookies.set('lang', browserLangServer, { path: '/' })
    ssrContext.lang = browserLangServer
  } else {
    ssrContext.lang = cookies.get('lang')
  }
  ssrContext.matomoSiteId = config[ssrContext.lang].matomoSiteId || config[defaultLang].matomoSiteId
}

function initAcceptLanguage (langs) {
  let lang = defaultLang
  if (langs.indexOf(';') !== -1) {
    let langsArray = langs.split(';')
    let langFirst = langsArray[0]
    if (langFirst.indexOf(',') !== -1) {
      let langArray = langFirst.split(',')
      lang = langArray[0]
    } else {
      lang = langFirst
    }
  } else {
    if (langs.indexOf(',') !== -1) {
      let langArray = langs.split(',')
      lang = langArray[0]
    } else {
      lang = langs
    }
  }
  lang = lang.toLowerCase().replace(/\s/g, '')
  return checkLang(lang)
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

function langsList () {
  return browserLangConfig.map(item => {
    return item.value
  })
}
