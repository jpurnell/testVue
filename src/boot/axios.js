import axios from 'axios'
import { Cookies } from 'quasar'
import md5 from 'crypto-js/md5'

let url = process.env.NODE_ENV === 'development' ? 'https://stage.shopmo.com/' : 'https://api.shopmo.com/'
if (process.env.NODE_ENV === 'local') {
  url = ''
}
/*
let url = 'https://api.shoporientexpress.com/'
if (process.env.NODE_ENV === 'local' || process.env.MODE === 'ssr') {
  url = ''
} else if (process.env.NODE_ENV === 'development') {
  url = 'https://stage.shopmo.com/'
} else {
  url = 'https://api.shoporientexpress.com/'
}
*/

const axiosInstance = axios.create({
  baseURL: url,
  timeout: 3000000,
  withCredentials: true
  /*
  transformResponse: [function (data) {
    return data
  }]
  */
})

// axiosInstance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

let apiList = []
const CancelToken = axios.CancelToken

function removePending (currentApiConfig) {
  for (let p in apiList) {
    if (apiList[p].u === `${currentApiConfig.url}&${JSON.stringify(currentApiConfig.data)}&${JSON.stringify(currentApiConfig.params)}&${currentApiConfig.method}`) {
      apiList[p].f()
      apiList.splice(p, 1)
    }
  }
}

function serializerParams (o) {
  if (o instanceof Object) {
    let params = []
    Object.keys(o).sort().forEach(key => {
      let query = `${key}=${o[key]}`
      params.push(query)
    })
    return params.join('&')
  } else {
    return o
  }
}

axiosInstance.interceptors.request.use(config => {
  removePending(config)
  config.cancelToken = new CancelToken(c => {
    apiList.push({ u: `${config.url}&${JSON.stringify(config.data)}&${JSON.stringify(config.params)}&${config.method}`, f: c })
  })
  return config
})

axiosInstance.interceptors.response.use(response => {
  removePending(response.config)
  return response
})

export default async ({ store, router, Vue, ssrContext }) => {
  const cookies = process.env.SERVER
    ? Cookies.parseSSR(ssrContext)
    : Cookies
  axiosInstance.defaults.paramsSerializer = function (params) {
    let storeId = store.state.lang.storeId
    let currency = store.state.lang.currency
    let storeCode = store.state.lang.storeCode
    let employcode = store.state.lang.employcode || cookies.get('employcode') || ''
    params.SID = cookies.get('PHPSESSID') || ''
    if (storeId) {
      params.store_id = storeId
    }
    if (storeCode) {
      params.___store = storeCode
    }
    if (currency) {
      params.currency = currency
    }
    if (employcode) {
      params['promo-tag'] = employcode
    }
    return serializerParams(params)
  }

  let headertoken = md5('hahsh').toString()
  axiosInstance.defaults.headers.common['Services'] = headertoken

  /*
  axiosInstance.defaults.transformRequest = [(data, headers) => {
    if (data) {
      let postData = JSON.parse(data)
      let storeId = store.state.lang.storeId
      if (Cookies.has('PHPSESSID')) {
        postData.SID = Cookies.get('PHPSESSID')
      }
      if (storeId) {
        postData.store_id = storeId
      }
      return JSON.stringify(postData)
    }
  }]
  */

  axiosInstance.defaults.transformResponse = [(response) => {
    if (response) {
      try {
        let data = JSON.parse(response)
        if (data.code === '0' && data.message === 'login required') {
          Cookies.set('isLogin', '0', { path: '/' })
          store.dispatch('site/setHasLoginSuccess', false)
          Cookies.remove('email', { path: '/' })
          Cookies.remove('firstname', { path: '/' })
          Cookies.remove('lastname', { path: '/' })
          // router.push({ name: 'login' })
        } else {
          return data
        }
      } catch (e) {
        return response
      }
    } else {
      return response
    }
  }]

  Vue.prototype.$axios = axios
}

export { axiosInstance }
