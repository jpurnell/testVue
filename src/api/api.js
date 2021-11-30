import { axiosInstance } from '../boot/axios'

export function httpsGet (url, params) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(url, '', {
        params: params
      })
      .then(response => {
        if (response.data && response.data.data && response.data.code === '1') {
          resolve(response.data.data)
        } else {
          if (response.data && response.data.message) {
            reject(response.data.message)
          } else {
            let message = 'error'
            reject(message)
          }
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function httpsPost (url, formdata) {
  return new Promise((resolve, reject) => {
    axiosInstance
      .post(url, JSON.stringify(formdata), {
        params: {}
      })
      .then(response => {
        if (response.data && response.data.data && response.data.code === '1') {
          resolve(response.data.data)
        } else {
          if (response.data && response.data.message) {
            reject(response.data.message)
          } else {
            let message = 'error'
            reject(message)
          }
        }
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getNavigation (params) {
  const url = '/hah_api/page/topmenu'
  return httpsGet(url, params)
}

export function getCategory (params) {
  const url = '/hah_api/catalog/category'
  return httpsGet(url, params)
}

export function getCategorySideNav (params) {
  const url = '/hah_api/page/leftmenu'
  return httpsGet(url, params)
}

export function getProduct (params) {
  const url = '/hah_api/catalog/product'
  return httpsGet(url, params)
}

export function searchProduct (params) {
  const url = '/hah_api/search/index'
  return httpsPost(url, params)
}

export function addToCart (formdata) {
  const url = '/hah_api/cart/add'
  return httpsPost(url, formdata)
}

export function addToFavi (formdata) {
  const url = '/hah_api/wishlist/add'
  return httpsPost(url, formdata)
}

export function initFaviStatus (formdata) {
  const url = '/hah_api/wishlist/status'
  return httpsPost(url, formdata)
}

export function showCart (formdata) {
  const url = '/hah_api/cart'
  return httpsGet(url, formdata)
}

export function showCartQty (formdata) {
  const url = '/hah_api/cart/sidebar'
  return httpsGet(url, formdata)
}

export function deleteCartItem (formdata) {
  const url = '/hah_api/cart/delete'
  return httpsGet(url, formdata)
}

export function updateCartItem (formdata) {
  const url = '/hah_api/cart/update'
  return httpsGet(url, formdata)
}

export function checkoutShipping (formdata) {
  const url = '/hah_api/checkout/index'
  return httpsPost(url, formdata)
}

export function submitOrder (formdata) {
  const url = '/hah_api/checkout/place'
  return httpsPost(url, formdata)
}

export function checkGloablRegion (formdata) {
  const url = '/hah_api/checkout/region'
  return httpsPost(url, formdata)
}

export function getPayUrl (formdata) {
  const url = '/hah_api/payment/index'
  return httpsGet(url, formdata)
}

export function getSessionId (formdata) {
  const url = '/hah_api/common/talk'
  return httpsGet(url, formdata)
}

export function setSubscribe (formdata) {
  const url = '/hah_api/newsletter/subscribe'
  return httpsGet(url, formdata)
}

export function registerUser (formdata) {
  const url = '/hah_api/customer/create'
  return httpsPost(url, formdata)
}

export function signIn (formdata) {
  const url = '/hah_api/customer/login'
  return httpsPost(url, formdata)
}

export function signOut (formdata) {
  const url = '/hah_api/customer/logout'
  return httpsGet(url, formdata)
}

export function getCaptcha (formdata) {
  const url = '/hah_api/account/captcha'
  return httpsPost(url, formdata)
}

export function getPassword (formdata) {
  const url = '/hah_api/account/forgot'
  return httpsPost(url, formdata)
}

export function setPassword (formdata) {
  const url = '/hah_api/account/reset'
  return httpsPost(url, formdata)
}

export function updateProfile (formdata) {
  const url = '/hah_api/account/update'
  return httpsPost(url, formdata)
}

export function changePassword (formdata) {
  const url = '/hah_api/account/password'
  return httpsPost(url, formdata)
}

export function listAddress (formdata) {
  const url = '/hah_api/address/index'
  return httpsGet(url, formdata)
}

export function createAddress (formdata) {
  const url = '/hah_api/address/create'
  return httpsPost(url, formdata)
}

export function updateAddress (formdata) {
  const url = '/hah_api/address/update'
  return httpsPost(url, formdata)
}

export function deleteAddress (formdata) {
  const url = '/hah_api/address/delete'
  return httpsPost(url, formdata)
}

export function listOrder (formdata) {
  const url = '/hah_api/order/index'
  return httpsPost(url, formdata)
}

export function detailOrder (formdata) {
  const url = '/hah_api/order/view'
  return httpsPost(url, formdata)
}

export function cancelOrder (formdata) {
  const url = '/hah_api/order/cancel'
  return httpsPost(url, formdata)
}

export function listInvoice (formdata) {
  const url = '/hah_api/fapiao/index'
  return httpsPost(url, formdata)
}

export function createInvoice (formdata) {
  const url = '/hah_api/fapiao/create'
  return httpsPost(url, formdata)
}

export function deleteInvoice (formdata) {
  const url = '/hah_api/fapiao/remove'
  return httpsPost(url, formdata)
}

export function getCMSPage (formdata) {
  const url = '/hah_api/page/cms'
  return httpsGet(url, formdata)
}

export function getHomePage (formdata) {
  const url = '/hah_api/page/home'
  return httpsGet(url, formdata)
}

export function getHomePageMobile (formdata) {
  const url = '/hah_api/page/mobile'
  return httpsGet(url, formdata)
}

export function getPromotion (formdata) {
  const url = '/hah_api/page/promo'
  return httpsGet(url, formdata)
}

export function checkGlobal (formdata) {
  const url = '/hah_api/common/region'
  return httpsGet(url, formdata)
}

export function contactUs (formdata) {
  const url = '/hah_api/contact/post'
  return httpsPost(url, formdata)
}

export function faviList (formdata) {
  const url = '/hah_api/wishlist/index'
  return httpsPost(url, formdata)
}

export function faviRemove (formdata) {
  const url = '/hah_api/wishlist/remove'
  return httpsPost(url, formdata)
}

export function luckyDraw (formdata) {
  const url = '/hah_api/draw/index'
  return httpsPost(url, formdata)
}

export function hotelsList (formdata) {
  const url = '/hah_api/hotel/index'
  return httpsPost(url, formdata)
}

export function saveHotel (formdata) {
  const url = '/hah_api/hotel/save'
  return httpsPost(url, formdata)
}

export function saveMemberCard (formdata) {
  const url = '/hah_api/membercard/index'
  return httpsPost(url, formdata)
}

export function getInvoiceUrl (formdata) {
  const url = '/hah_api/order/invoice'
  return httpsGet(url, formdata)
}

export function getSearchSuggest (formdata) {
  const url = '/hah_api/search/suggest'
  return httpsPost(url, formdata)
}
