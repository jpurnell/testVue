// import 'autotrack/lib/plugins/clean-url-tracker'
// import 'autotrack/lib/plugins/event-tracker'
// import 'autotrack/lib/plugins/url-change-tracker'

function loadPlugin () {
  if (!window.ga) {
    return false
  }
  // ga('require', 'cleanUrlTracker')
  // ga('require', 'eventTracker')
  // ga('require', 'urlChangeTracker')
}

function ecList (productInfo, currency) {
  if (!window.ga) {
    return false
  }
  let impressionFieldObject = {
    id: '',
    name: '',
    brand: '',
    category: '',
    variant: '',
    list: '',
    list_name: '',
    position: 0,
    list_position: 0,
    price: 0,
    dimension1: ''
  }
  impressionFieldObject = Object.assign(impressionFieldObject, productInfo)
  ga('set', 'currencyCode', currency)
  ga('ec:addImpression', impressionFieldObject)
}

function ecClick (productInfo, listPage, currency) {
  if (!window.ga) {
    return false
  }
  let productFieldObject = {
    id: '',
    name: '',
    brand: '',
    category: '',
    variant: '',
    price: 0,
    quantity: 0,
    coupon: '',
    position: 0,
    list_position: 0,
    dimension1: ''
  }
  productFieldObject = Object.assign(productFieldObject, productInfo)
  ga('set', 'currencyCode', currency)
  ga('ec:addProduct', productFieldObject)
  ga('ec:setAction', 'click', {
    'list': listPage
  })
}

function ecDetail (productInfo, currency) {
  if (!window.ga) {
    return false
  }
  let productFieldObject = {
    id: '',
    name: '',
    brand: '',
    category: '',
    variant: '',
    price: 0,
    quantity: 0,
    coupon: '',
    position: 0,
    list_position: 0,
    dimension1: ''
  }
  productFieldObject = Object.assign(productFieldObject, productInfo)
  ga('set', 'currencyCode', currency)
  ga('ec:addProduct', productFieldObject)
  ga('ec:setAction', 'detail')
}

function ecAddtoCart (productInfo, currency) {
  if (!window.ga) {
    return false
  }
  let productFieldObject = {
    id: '',
    name: '',
    brand: '',
    category: '',
    variant: '',
    price: 0,
    quantity: 0,
    coupon: '',
    position: 0,
    list_position: 0,
    dimension1: ''
  }
  productFieldObject = Object.assign(productFieldObject, productInfo)
  ga('set', 'currencyCode', currency)
  ga('ec:addProduct', productFieldObject)
  ga('ec:setAction', 'add')
}

function ecRemove (productInfo, currency) {
  if (!window.ga) {
    return false
  }
  let productFieldObject = {
    id: '',
    name: '',
    brand: '',
    category: '',
    variant: '',
    price: 0,
    quantity: 0,
    coupon: '',
    position: 0,
    list_position: 0,
    dimension1: ''
  }
  productFieldObject = Object.assign(productFieldObject, productInfo)
  ga('set', 'currencyCode', currency)
  ga('ec:addProduct', productFieldObject)
  ga('ec:setAction', 'remove')
}

function ecCheckout (cart, currency) {
  if (!window.ga) {
    return false
  }
  ga('set', 'currencyCode', currency)
  cart.forEach((productInfo) => {
    let productFieldObject = {
      id: '',
      name: '',
      brand: '',
      category: '',
      variant: '',
      price: 0,
      quantity: 0,
      coupon: '',
      position: 0,
      list_position: 0,
      dimension1: ''
    }
    productFieldObject = Object.assign(productFieldObject, productInfo)
    ga('ec:addProduct', productFieldObject)
  })
  ga('ec:setAction', 'checkout', {
    'step': 1,
    'option': ''
  })
}

function ecOrderSubmit (productInfo, currency) {
  if (!window.ga) {
    return false
  }
  let actionFieldObject = {
    id: '',
    affiliation: '',
    revenue: 0,
    tax: 0,
    shipping: 0,
    coupon: '',
    list: '',
    items: [],
    step: 1,
    option: '',
    checkout_step: 1,
    checkout_option: ''
  }
  actionFieldObject = Object.assign(actionFieldObject, productInfo)
  ga('set', 'currencyCode', currency)
  ga('ec:setAction', 'purchase', actionFieldObject)
}

function ecPromotions (promotionInfo) {
  if (!window.ga) {
    return false
  }
  let promoFieldObject = {
    id: '',
    name: '',
    creative: '',
    creative_name: '',
    position: '',
    creative_slot: ''
  }
  promoFieldObject = Object.assign(promoFieldObject, promotionInfo)
  ga('ec:addPromo', promoFieldObject)
  ga('ec:setAction', 'promo_click')
}

function ecommerceAdd (productInfo) {
  if (!window.ga) {
    return false
  }
  let item = {
    id: '',
    name: '',
    sku: '',
    category: '',
    price: 0,
    quantity: 0,
    currency: ''
  }
  item = Object.assign(item, productInfo)
  ga('ecommerce:addItem', item)
  // ga('newTracker.ecommerce:addItem', item)
}

function ecommerceOrder (orderInfo, productInfos) {
  if (!window.ga) {
    return false
  }
  let transaction = {
    id: '',
    affiliation: '',
    revenue: '',
    shipping: '',
    tax: '',
    currency: ''
  }
  transaction = Object.assign(transaction, orderInfo)
  ga('ecommerce:addTransaction', transaction)
  // ga('newTracker.ecommerce:addTransaction', transaction)
  productInfos.forEach(productInfo => {
    ecommerceAdd(productInfo)
  })
  ga('ecommerce:send')
  // ga('newTracker.ecommerce:send')
  // ga('ecommerce:clear')
}

function eventNewSubscriber (location) {
  if (!window.ga) {
    return false
  }
  ga('send', 'event', 'eNews Subscription', 'Subscribe', location, 1)
}

export {
  loadPlugin,
  ecList,
  ecClick,
  ecDetail,
  ecAddtoCart,
  ecRemove,
  ecCheckout,
  ecOrderSubmit,
  ecPromotions,
  ecommerceOrder,
  eventNewSubscriber
}
