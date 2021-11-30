const routes = [
  {
    path: '/'
  },
  {
    path: '/:lang',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'home', path: '', component: () => import('pages/Index-EU') },
      { name: 'category', path: 'c/:c', component: () => import('pages/Category') },
      { name: 'product', path: 'p/:c*/:p', component: () => import('pages/Product') },
      { name: 'search', path: 'search', component: () => import('pages/Search') },
      { name: 'checkout', path: 'checkout', component: () => import('pages/Checkout-EU') },
      { name: 'orderSuccess', path: 'ordersuccess', component: () => import('pages/OrderSuccess') },
      { name: 'oGonePaymentSuccess', path: 'ccordersuccess', component: () => import('pages/OrderSuccess') },
      { name: 'oGonePaymentCanceled', path: 'paymentcanceled', component: () => import('pages/OrderSuccess') },
      { name: 'oGonePaymentUncertain', path: 'paymentuncertain', component: () => import('pages/OrderSuccess') },
      { name: 'oGonePaymentDenied', path: 'paymenterror', component: () => import('pages/OrderSuccess') },
      { name: 'paySuccess', path: 'paysuccess', component: () => import('pages/OrderSuccess') },
      { name: 'payError', path: 'payerror', component: () => import('pages/PayError') },
      { name: 'account', path: 'account', component: () => import('pages/OrderList'), meta: { requiresAuth: true } },
      { name: 'forgetpwd', path: 'forgetpwd', component: () => import('pages/Forgetpwd'), meta: { requiresNotLogin: true } },
      { name: 'register', path: 'register', component: () => import('pages/Register'), meta: { requiresNotLogin: true } },
      { name: 'login', path: 'login', component: () => import('pages/Login'), meta: { requiresNotLogin: true } },
      { name: 'logout', path: 'logout', component: () => import('pages/Logout') },
      { name: 'contactus', path: 'contact-us', component: () => import('pages/ContactUs') },
      { name: 'wishlist', path: 'mywishlist', component: () => import('pages/WishList'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/:lang/account',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'edit', path: 'edit', component: () => import('pages/AccountEdit'), meta: { requiresAuth: true } },
      { name: 'setPassword', path: 'setPassword', component: () => import('pages/SetNewPassword'), meta: { requiresNotLogin: true } }
    ]
  },
  {
    path: '/:lang/address',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'addressList', path: '', component: () => import('pages/AddressList'), meta: { requiresAuth: true } }
    ]
  },
  {
    path: '/:lang/order',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'orderList', path: '', component: () => import('pages/OrderList'), meta: { requiresAuth: true } },
      { name: 'orderDetail', path: 'detail', component: () => import('pages/OrderDetail'), meta: { requiresAuth: true } }
    ]
  },
  // {
  //   path: '/:lang/invoice',
  //   component: () => import('layouts/MyLayout'),
  //   children: [
  //     { name: 'invoiceList', path: '', component: () => import('pages/InvoiceList'), meta: { requiresAuth: true } },
  //     { name: 'invoiceNew', path: 'add', component: () => import('pages/InvoiceForm'), meta: { requiresAuth: true } },
  //     { name: 'invoiceEdit', path: 'edit', component: () => import('pages/InvoiceForm'), meta: { requiresAuth: true } }
  //   ]
  // },
  {
    path: '/:lang/cart',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'cart', path: '', component: () => import('pages/Cart') },
      { name: 'cartEdit', path: 'edit', component: () => import('pages/CartEdit') }
    ]
  },
  {
    path: '/:lang/help',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'help', path: ':note', component: () => import('pages/Help') }
    ]
  },
  // {
  //   path: '/:lang/sales',
  //   component: () => import('layouts/Empty'),
  //   children: [
  //     { name: 'sales', path: ':note', component: () => import('pages/LuckyDraw') }
  //   ]
  // },
  // {
  //   path: '/:lang/promotions',
  //   component: () => import('layouts/MyLayout'),
  //   children: [
  //     { name: 'luckydraw', path: ':note/:code*', component: () => import('pages/LuckyDraw') }
  //   ]
  // },
  // {
  //   path: '/:lang/preview',
  //   component: () => import('layouts/Empty'),
  //   children: [
  //     { name: 'previewCMSPage', path: ':note', component: () => import('pages/PreviewCMSPage') }
  //   ]
  // },
  // {
  //   path: '/:lang/wechatpay',
  //   component: () => import('layouts/MyLayout'),
  //   children: [
  //     { name: 'wechatPay', path: '', component: () => import('pages/WechatPay') }
  //   ]
  // },
  // {
  //   path: '/:lang/boutiques',
  //   name: 'boutiques',
  //   component: () => import('pages/Boutiques'),
  //   meta: { requiresNoFirstPop: true }
  // },
  // {
  //   path: '/:lang/entryterms',
  //   component: () => import('pages/Entryterms')
  // },
  // {
  //   path: '/:lang/splash',
  //   name: 'splash',
  //   component: () => import('pages/Splash')
  // },
  // {
  //   name: 'test',
  //   path: '/:lang/test',
  //   component: () => import('pages/Test')
  // },
  {
    path: '/:lang',
    alias: '*',
    component: () => import('layouts/MyLayout'),
    children: [
      { name: 'error404', path: '404', alias: '*', component: () => import('pages/Error404') }
    ]
  }
]

// Always leave this as last one
/*
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404')
  })
}
*/

export default routes
