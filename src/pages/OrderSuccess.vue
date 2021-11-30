<template>
  <q-page class="order_success">
    <div class="row">
      <div class="col-12 col-md-6">
        <div class="col-block">
          <div v-if="!orderId" class="order-pending">
            <h2>Payment Pending</h2>
            <div class="h2-content">
              Your payment has failed or was canceled. If you would still like to receive your order, please re-submit your payment.
              <!-- <button>Add PayStatus Button</button> -->
            </div>
          </div>
          <div v-if="orderId && paymentCanceled" class="order-confirmed">
            <h2>{{i18n('$common.$labels.orderNum')}} : #{{orderId}} - {{i18n('Canceled')}}</h2>
            <div class="h2-content">
              <p>{{i18n('$common.$successPage.canceled_1')}}</p>
              <p class="canceled-2" v-html="i18n('$common.$successPage.canceled_2')"></p>
              <p>{{customerServiceEmail}}</p>
              <p>{{thankYouAgain}}</p>
            </div>
          </div>
          <div v-if="orderId && paymentDeclined" class="order-confirmed">
            <h2>{{i18n('$common.$labels.orderNum')}} : #{{orderId}} - {{i18n('Canceled')}}</h2>
            <div class="h2-content">
              <p>{{i18n('$common.$successPage.declined_1')}}</p>
              <p>{{declined_2}}</p>
              <p>{{i18n('$common.$successPage.declined_3')}} #{{orderId}}</p>
              <p>{{thankYouAgain}}</p>
            </div>
          </div>
          <div v-if="orderId && paymentUncertain" class="order-confirmed">
            <h2>{{i18n('$common.$labels.orderNum')}} : #{{orderId}}</h2>
            <div class="h2-content">
              <p>{{i18n('$common.$successPage.uncertain_1')}}</p>
              <p class="canceled-2" v-html="i18n('$common.$successPage.canceled_2')"></p>
              <p>{{customerServiceEmail}}</p>
              <p>{{thankYouAgain}}</p>
            </div>
          </div>
          <div v-if="orderId && !paymentFailed && !paymentUncertain" class="order-confirmed">
            <h2>{{i18n('$common.$labels.orderNum')}} : #{{orderId}}</h2>
            <div class="h2-content">
              <!-- <h1>{{i18n(paymentMethodLabel)}}</h1> -->
              <p>{{thankYou}}</p>
              <p>{{successTips}}</p>
              <template v-if="paymentMethodValue !== ''">
                <template v-if="paymentMethodValue === 'ingenico_cc'">
                  <p>{{i18n('$common.$successPage.creditCard')}}</p>
                </template>
                <template v-if="paymentMethodValue === 'banktransfer'">
                  <p>{{i18n('$common.$successPage.bankTransfer_1')}}</p>
                  <p class="text-weight-bold">{{i18n('$common.$successPage.bankTransfer_2')}}</p>
                  <p>{{i18n('$common.$successPage.bankTransfer_3')}}</p>
                  <p>{{bankTransfer_4}}</p>
                  <div class="success_tab">
                    <div class="row">
                      <div class="col-3"><span class="text-weight-bold">{{i18n('$common.$labels.accountHolder')}}</span></div>
                      <div class="col address">
                        <span class="text-weight-bold" >HOTELS AT HOME</span>
                        <span class="row">163 rue de la Belle Etoile</span>
                        <span class="row">Business Park Paris Nord 2 – Bât 6B</span>
                        <span class="row">95700 ROISSY EN FRANCE</span>
                        <span class="row">FRANCE</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-3"><span class="text-weight-bold">{{i18n('$common.$labels.orderNum')}}</span></div>
                      <div class="col">
                        <span>#{{orderId}} - {{shippingName}}</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-3"><span class="text-weight-bold">{{i18n('$common.$labels.amount')}}</span></div>
                      <div class="col">
                        <span>{{grandTotal}}</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-3"><span class="text-weight-bold">{{i18n('$common.$labels.bank')}} ({{i18n('$common.$labels.optional')}})</span></div>
                      <div class="col">
                        <span>CRÉDIT DU NORD - STADIUM ENTREPRISES - 3, RUE FRANCIS DE PRESSENSÉ 93200 SAINT-DENIS</span>
                      </div>
                    </div>
                    <div class="row" v-if="paymentMethodValue === 'banktransfer'">
                      <div class="col-3"><span class="text-weight-bold">RIB</span></div>
                      <div class="col rib-col">
                        <div class="row head q-mb-sm">
                          <div class="col"><span class="text-weight-bold">{{bank}}</span></div>
                          <div class="col"><span class="text-weight-bold">{{guichet}}</span></div>
                          <div class="col"><span class="text-weight-bold">{{accountNumber}}</span></div>
                          <div class="col"><span class="text-weight-bold">{{ribId}}</span></div>
                        </div>
                        <div class="row">
                          <div class="col"><span>30076</span></div>
                          <div class="col"><span>02137</span></div>
                          <div class="col"><span>12353100200</span></div>
                          <div class="col"><span>65</span></div>
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-3"><span class="text-weight-bold">IBAN</span></div>
                      <div class="col">
                        <span>FR76 3007 6021 3712 3531 0020 065</span>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-3"><span class="text-weight-bold">BIC / SWIFT</span></div>
                      <div class="col">
                        <span>NORDFRPP</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-weight-bold">{{i18n('$common.$successPage.bankTransfer_5')}}</p>
                  <p>{{i18n('$common.$successPage.bankTransfer_6') + email}}</p>
                  <p>{{i18n('$common.$successPage.bankTransfer_7')}}</p>
                </template>
                <template v-if="paymentMethodValue === 'checkmo'">
                  <p>{{i18n('$common.$successPage.check_1')}}</p>
                  <p class="bold">{{i18n('$common.$successPage.check_2')}}</p>
                  <p>{{check3}}</p>
                  <p>{{check4}}</p>
                  <p v-html="i18n('$common.$successPage.check_5')"></p>
                  <div class="success_adress">
                    <ul>
                      <li>
                        <span class="bold">HOTELS AT HOME</span>
                        <span>163 rue de la Belle Etoile</span>
                        <span>Business Park Paris Nord 2 – Bât 6B</span>
                        <span>95700 ROISSY EN FRANCE</span>
                        <span>FRANCE</span>
                      </li>
                    </ul>
                  </div>
                  <p class="text-weight-bold">{{i18n('$common.$successPage.bankTransfer_5')}}</p>
                  <p>{{i18n('$common.$successPage.bankTransfer_6') + email}}</p>
                </template>
              </template>
              <q-spinner v-else size="50px" />
              <p>{{i18n('$common.$successPage.afterSalesEmail')}} <span>{{siteEmail}}.</span></p>
              <p>{{thankYouAgain}}</p>
            </div>
          </div>
          <div v-if="orderId && !paymentFailed" class="shipping-address">
            <h2>{{shippingTitle}}</h2>
            <div class="h2-content">
              <template v-if="initDetailReady">
                <p>{{shippingName}}</p>
                <p>{{shippingAddress}}</p>
                <p>{{shippingCity}}, {{shippingRegion ? shippingRegion + ', ' : null }}{{shippingPostalCode}}</p>
                <p>{{shippingCountry}}</p>
                <p>T: {{shippingTel}}</p>
              </template>
              <q-spinner v-else size="50px" />
            </div>
          </div>
          <div v-if="orderId && !paymentFailed" class="shipping-method">
            <h2>{{shippingMethodTitle}}</h2>
            <div class="h2-content">
              <p v-if="initDetailReady">{{ shippingCarrierTrans }}</p>
              <q-spinner v-else size="50px" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="orderId" class="col-12 col-md-6">
        <div class="col-block">
          <items
            :cart-items="items"
            :discount-amount="discountAmount"
            :grand-total="grandTotal"
            :shipping-discount="shippingDiscount"
            :shipping-fee="shippingFee"
            :subtotal-total="subtotalTotal"
            :lang="lang"
          />
        </div>
        <!-- <div class="col-block gt-sm" v-if="!paymentFailed && !paymentUncertain">
          <hotel-selector />
        </div> -->
      </div>
    </div>
    <!-- <div class="row lt-md mobile-suv" v-if="!paymentFailed">
      <div class="col-12">
        <div class="col-block">
          <hotel-selector />
        </div>
      </div>
    </div> -->
    <!-- <div class="col-12" v-if="!paymentFailed">
      <div class="col-block">
        <member-card v-if="showMemberCardForm" />
      </div>
    </div> -->
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import { detailOrder } from './../api/api'
import { ecommerceOrder } from './../tracking/analytics'
// import { addressCN, country, countryCN } from './../config/china.address'
import { country } from './../config/europe.address'
import { paymentMethodConfigEU, paymentMethodConfigCN } from './../config/payment.method'
import items from './../components/checkout/Items'
// import hotelSelector from './../components/order/HotelsSelector'
// import memberCard from './../components/order/MemberCard'
// import { formatPrice } from './../utils/format'

export default {
  components: {
    items
    // 'hotel-selector': hotelSelector,
    // 'member-card': memberCard
  },
  data () {
    return {
      orderInternalId: '',
      orderId: '',
      email: '',
      detail: {},
      shippingName: '',
      shippingCountry: '',
      shippingCity: '',
      shippingAddress: '',
      shippingTel: '',
      shippingCarrier: '',
      currentPaymentMethod: '',
      fapiao: {},
      billingName: '',
      billingPhone: '',
      billingCountry: '',
      billingCity: '',
      billingAddress: '',
      discountAmount: '',
      shippingDiscount: '',
      shippingFee: '',
      subtotalTotal: '',
      grandTotal: '',
      metaDescription: '',
      metaKeywords: '',
      isLogin: false,
      items: [],
      showMemberCardForm: false,
      shippingPostalCode: '',
      shippingRegion: '',
      initDetailReady: false
    }
  },
  meta () {
    return {
      // sets document title
      title: this.orderConfirm,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      }
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      currency: state => state.lang.currency,
      hasLoginSuccess: state => state.site.hasLoginSuccess,
      isEu: state => state.site.isEU
    }),
    orderConfirm: function () {
      return this.$i18n.t('$common.$validation.orderConfirm')
    },
    orderNumber: function () {
      return this.$i18n.t('$common.yourOrderNumber', { orderId: this.orderId })
    },
    thankYou: function () {
      return this.$i18n.t('$common.$successPage.thankYouForPurchase', { siteName: this.$i18n.t('$local.siteName') })
    },
    successTips: function () {
      return this.$i18n.t('$common.$successPage.successTips', { email: this.email })
    },
    customerServiceEmail: function () {
      return this.$i18n.t('$common.$successPage.customerServiceEmail', { email: this.$i18n.t('$local.siteEmail') })
    },
    declined_2: function () {
      return this.$i18n.t('$common.$successPage.declined_2', { tel: this.$i18n.t('$local.tel400') }, { email: this.$i18n.t('$local.siteEmail') })
    },
    shippingTitle: function () {
      return this.$i18n.t('$common.$headings.shipAddress')
    },
    shippingMethodTitle: function () {
      return this.$i18n.t('$common.$headings.shipInfo')
    },
    bankTransfer_4: function () {
      return this.$i18n.t('$common.$successPage.bankTransfer_4', { siteName: this.$i18n.t('$local.siteName') })
    },
    siteEmail: function () {
      return this.$i18n.t('$local.siteEmail')
    },
    thankYouAgain: function () {
      return this.$i18n.t('$common.$successPage.thankYouAgain', { siteName: this.$i18n.t('$local.siteName') })
    },
    check3: function () {
      return this.$i18n.t('$common.$successPage.check_3', { amount: this.grandTotal })
    },
    check4: function () {
      return this.$i18n.t('$common.$successPage.check_4', { orderId: this.orderId })
    },
    bank: function () {
      return this.$i18n.t('$common.$labels.bank')
    },
    ribId: function () {
      return this.$i18n.t('$common.$labels.ribId')
    },
    accountNumber: function () {
      return this.$i18n.t('$common.$labels.accountNumber')
    },
    guichet: function () {
      return this.$i18n.t('$common.$labels.guichet')
    },
    payments: function () {
      return this.isEu ? paymentMethodConfigEU : paymentMethodConfigCN
    },
    paymentMethodLabel: function () {
      let paymentMethod = ''
      if (this.currentPaymentMethod) {
        this.payments.forEach(o => {
          if (o.value === this.currentPaymentMethod) {
            paymentMethod = o.en
          }
        })
      }
      return paymentMethod
    },
    paymentMethodValue: function () {
      let paymentMethod = ''
      if (this.currentPaymentMethod) {
        this.payments.forEach(o => {
          if (o.value === this.currentPaymentMethod) {
            paymentMethod = o.value
          }
        })
      }
      return paymentMethod
    },
    shippingCarrierTrans: function () {
      return this.$i18n.t(this.shippingCarrier)
    },
    paymentCanceled: function () {
      if (this.$route.name === 'oGonePaymentCanceled') {
        return true
      } else {
        return false
      }
    },
    paymentDeclined: function () {
      if (this.$route.name === 'oGonePaymentDenied') {
        return true
      } else {
        return false
      }
    },
    paymentUncertain: function () {
      if (this.$route.name === 'oGonePaymentUncertain') {
        return true
      } else {
        return false
      }
    },
    paymentFailed: function () {
      if (this.paymentCanceled || this.paymentDeclined) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    hasLoginSuccess: function (newVal, oldVal) {
      if (newVal) {
        this.$q.sessionStorage.remove('createdOrderId')
        this.$q.sessionStorage.remove('createdOrderInternalId')
        this.$q.sessionStorage.remove('orderInfo')
        this.$q.sessionStorage.remove('orderItemsInfo')
        this.$q.sessionStorage.remove('paymentMethod')
        this.$router.replace({ name: 'Homepage' })
      }
    }
  },
  methods: {
    initDetail () {
      let formdata = {
        order_id: this.orderInternalId
      }
      if (this.orderInternalId && this.isLogin) {
        detailOrder(formdata).then(data => {
          this.detail = Object.assign({}, this.detail, data)
          this.currentPaymentMethod = this.detail.order_payment_method
          this.cartItems(this.detail.order_items)
          if (this.detail.order_shipping_address) {
            this.shippingName = this.detail.order_shipping_address.split(',')[0]
            this.shippingAddress = this.detail.order_shipping_address.split(',')[1].replace(/\|/gi, ' ')
            this.shippingCity = this.detail.order_shipping_address.split(',')[2]
            this.shippingRegion = this.initRegion(this.detail.order_shipping_address.split(',')[3])
            this.shippingPostalCode = this.detail.order_shipping_address.split(',')[4]
            this.shippingCountry = this.detail.order_shipping_address.split(',')[5]
            this.shippingTel = this.detail.order_shipping_phone
            this.billingName = this.detail.order_billing_address.split(',')[0]
            this.billingPhone = this.detail.order_billing_phone
            this.billingCity = this.detail.order_billing_address.split(',')[2] + ' ' + this.initRegion(this.detail.order_billing_address.split(',')[3]) + this.detail.order_billing_address.split(',')[4]
            this.billingAddress = this.detail.order_billing_address.split(',')[1].replace(/\|/gi, ' ')
          }
          this.shippingCarrier = this.detail.order_shipping_method
          this.discountAmount = data.order_discount_amount
          this.shippingDiscount = data.order_shipping_discount
          this.shippingFee = data.order_shipping_amount
          this.subtotalTotal = data.order_subtotal
          this.grandTotal = data.order_grand_total
          if (data.order_fapiao_data) {
            this.fapiao = Object.assign({}, data.order_fapiao_data)
          }
          this.initDetailReady = true
        }).catch(e => {
          console.log(e)
        })
      } else {
        let info = this.$q.sessionStorage.getItem('orderInfo')
        let itemsInfo = this.$q.sessionStorage.getItem('orderItemsInfo')
        this.currentPaymentMethod = this.$q.sessionStorage.getItem('paymentMethod')
        console.log('info', info)
        console.log('itemsInfo', itemsInfo)
        if (info !== null) {
          this.shippingName = `${info.shipping_address.firstname} ${info.shipping_address.lastname}`
          this.shippingAddress = `${info.shipping_address.street.replace(/\|/gi, ' ')}`
          this.shippingCity = `${info.shipping_address.city}`
          this.shippingRegion = `${info.shipping_address.region}`
          this.shippingPostalCode = `${info.shipping_address.postcode}`
          this.shippingCountry = `${this.showCountry(info.shipping_address.country_id)}`
          this.shippingTel = `${info.shipping_address.telephone}`
        }

        // if (info.fapiao) {
        //   this.fapiao = Object.assign({}, info.fapiao)
        //   if (info.billing_address) {
        //     this.billingName = `${info.billing_address.firstname}${info.billing_address.lastname}`
        //     this.billingCountry = `${this.showCountry(info.billing_address.country_id)}`
        //     this.billingCity = `${info.billing_address.city} ${this.showRegion(info.billing_address.region)}`
        //     this.billingAddress = `${info.billing_address.street.replace(/\|/gi, ' ')}`
        //     this.billingPhone = `${info.billing_address.telephone}`
        //   }
        // }
        if (itemsInfo !== null) {
          this.items = itemsInfo.items
          this.discountAmount = itemsInfo.discountAmount
          this.shippingDiscount = itemsInfo.shippingDiscount
          this.shippingFee = itemsInfo.shippingFee
          this.subtotalTotal = itemsInfo.subtotalTotal
          this.grandTotal = itemsInfo.grandTotal
          this.shippingCarrier = itemsInfo.shippingCarrier
          // Update Transaction Data Layer for Guest Users
          // this.updateTransactionDataLayer()
        }
        this.initDetailReady = true
      }
      if (this.$route.name === 'oGonePaymentSuccess') {
        let gaOrderInfo = this.$q.sessionStorage.getItem('gaOrderInfo')
        let gaOrderItems = this.$q.sessionStorage.getItem('gaOrderItems')
        if (gaOrderInfo !== null && gaOrderItems !== null) {
          ecommerceOrder(gaOrderInfo, gaOrderItems)
        }
      }
      this.$q.sessionStorage.remove('gaOrderInfo')
      this.$q.sessionStorage.remove('gaOrderItems')
    },
    initRegion (val) {
      if (val.indexOf(' ') !== -1) {
        let regionZip = val.split(' ')
        if (regionZip.length === 3) {
          return `${this.showRegion(regionZip[1])} ${regionZip[2]}`
        } else {
          return val
        }
      } else {
        return val
      }
    },
    showCountry (val) {
      let currentCountry = ''
      country.forEach((o, index) => {
        if (o.value === val) {
          currentCountry = country[index].label
        }
      })
      return currentCountry
    },
    showRegion (val) {
      let region = ''
      //   Object.keys(addressCN).forEach(o => {
      //     if (o === val) {
      //       if (this.lang === 'zh-CN') {
      //         region = addressCN[o].name
      //       } else {
      region = val
      //       }
      //     }
      //   })
      return region
    },
    cartItems: function (orderItems) {
      let items = []
      Object.keys(orderItems).forEach(key => {
        items.push({
          name: orderItems[key].item_name,
          qty: orderItems[key].item_qty,
          subtotal: orderItems[key].item_row_total,
          price: orderItems[key].item_price,
          options: orderItems[key].options,
          market_price: orderItems[key].item_price,
          sku: orderItems[key].item_sku
        })
      })
      console.log('detail', items)
      this.items = items
      // Update Transaction Data Layer for Logged In Users
      // this.updateTransactionDataLayer()
    },
    i18n: function (val) {
      return this.$i18n.t(val)
    }
    // updateTransactionDataLayer () {
    //   let productDataLayerItems = []
    //   let shippingFeeFinal = this.$q.sessionStorage.getItem('shippingFeeFinal')
    //   let tax = this.$q.sessionStorage.getItem('createdOrderTaxAmmount')
    //   let totalExclTax = this.$q.sessionStorage.getItem('totalExclTax')
    //   let quantity = this.$q.sessionStorage.getItem('createdOrderTotalQuantity')
    //   let orderCurrency = this.$q.sessionStorage.getItem('orderCurrency')
    //   // console.log('updateTransactionDataLayer items', this.items)
    //   Object.keys(this.items).forEach(key => {
    //     // console.log('updateTransactionDataLayer forEach', this.items[key])
    //     productDataLayerItems.push({
    //       name: this.items[key].name,
    //       sku: this.items[key].sku,
    //       price: formatPrice(this.items[key].price),
    //       quantity: this.items[key].qty
    //       // category: ''
    //     })
    //   })
    //   window.dataLayer.transaction = {
    //     id: this.orderId,
    //     totalShipping: formatPrice(shippingFeeFinal),
    //     totalTax: formatPrice(tax),
    //     totalCost: formatPrice(totalExclTax), // Subtotal i.e. cart total without taxes and shipping
    //     totalQuantity: quantity, // dynamic, total number of all items in cart
    //     shipCountry: this.showCountryId(this.shippingCountry), // dynamic Country Code
    //     shipState: this.showStateId(this.shippingRegion), // dynamic State Code
    //     currencyCode: orderCurrency,
    //     campaignId: '100l51', // static value used on ALL sites
    //     products: productDataLayerItems
    //   }
    // }
  },
  mounted () {
    this.orderId = this.$q.sessionStorage.getItem('createdOrderId')
    this.orderInternalId = this.$q.sessionStorage.getItem('createdOrderInternalId')
    this.email = this.$q.sessionStorage.getItem('createdOrderEmail')
    this.showMemberCardForm = this.$q.sessionStorage.getItem('showMemberCard')
    this.initDetail()
    console.log('routeName', this.$route.name)
    try {
      document.querySelector('body').classList.add('pgcheckout')
      if (this.$q.sessionStorage.has('isSameasShip')) {
        this.isSameasShip = JSON.parse(this.$q.sessionStorage.getItem('isSameasShip'))
        // if (!this.isSameasShip) {
        // this.getShipping()
        // }
      }
    } catch { }
  },
  created () {
    if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pgcheckout')
    } catch { }
  }
}
</script>

<style lang="scss" scoped>
.order_success {
  max-width: 1440px;
  padding: 50px 0;
  line-height: 1.1em;
  margin: 0 auto;
  h1 {
    padding: 0;
    margin: 0;
    font-size: 20px;
  }
  .shopping {
    display: inline-block;
  }
}
.title {
  margin: 0 1em 1em;
}
.link {
  text-align: right;
}
.col-block {
  margin: 0 8px 16px;
  padding: 0 8px 16px;
}
.h2-content {
  padding: 3%;
  background: $white;
  margin: 0 0 1em;
  border: 1px solid $borderColor;
}
.shipping-address {
  p {
    margin-bottom: 0;
  }
}
.bold {
  font-weight: 600;
}

@media screen and (max-width: 599px) {
  .order_success {
    padding: 10px;
    .shopping {
      width: 100%;
    }
  }
}
</style>

<style lang="scss">
// $
@import "~src/css/layouts/checkoutPageHeader";
.order_success {
  h2 {
    padding: 2% 4%;
    background: rgba($borderColor, .5);
    font-size: 1em;
    line-height: normal;
  }
}
.order-confirmed {
  p {
    span {
      display: inline-block;
    }
  }
}
.success_adress {
  border: 1px dotted #000;
  margin: 0 0 15px 15px;
  display: inline-block;
  ul {
    list-style: none;
    padding: 15px;
    margin: 0;
  }
  span {
    display: block;
  }
}
.success_tab {
  margin-top: 0;
  margin-bottom: 16px;
  padding: 15px;
  background: $borderColor;
  & > .row {
    padding-bottom: 20px;
  }
  @media screen and (max-width: 800px) {
    & > .row {
      flex-direction: column;
      .col {
        max-width: 400px;
      }
    }
    .col-3 {
      margin-bottom: 10px;
      width: 100%;
      padding-bottom: 7px;
    }
  }
}

.rib-col {
  // @media screen and (max-width: 1300px) {
    display: inline-flex;
    .row {
      flex-direction: column;
      .col {
        margin-bottom: 5px;
      }
      &.head {
        .col {
          span {
            &:after {
              content: ":";
            }
          }
        }
      }
      &:last-of-type {
        margin-left: 25px;
        .col {
          line-height: 12px;
        }
      }
    }
  // }
}
.order_success {
  .q-spinner {
    display: block;
    margin: 25px auto;
  }
}
@media screen and (max-width: 599px) {
  .order_success {
    font-size: 14px;
  }
  h2 {
    font-size: 1rem;
  }
  .en {
    .order_success {
      h2 {
        font-size: 1rem;
      }
    }
  }
}
.canceled-2 > span {
  display: inline-block;
}
</style>
