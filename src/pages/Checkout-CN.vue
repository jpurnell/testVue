<template>
  <q-page>
    <div class="checkout-page">
      <div class="checkout">
      <h1>{{ checkoutText }}</h1>
      <q-no-ssr>
        <div class="row content q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <customer
              ref="customer"
              v-if="!isLogin"
              @changeEmail="changeEmail"
              @checkNeedRegister="checkNeedRegister"
              @showLogin="showLogin"
            />
            <div class="address">
              <h2>{{ addressHeading }}</h2>
              <div>
                <addresslist
                  ref="addressSelector"
                  :address-list="addresses"
                  @changeAddress="changeAddress"
                  v-if="addresses.length > 0 && isLogin && !isShowNewAddressForm"
                />
                <transition>
                  <q-btn
                    unelevated
                    outline
                    rounded
                    color="white"
                    text-color="black"
                    :label="newAddress"
                    @click="showNewAddressForm"
                    v-if="isLogin && !isShowNewAddressForm && addresses.length !== 0"
                    class="btn-add"
                  />
                  <q-btn
                    unelevated
                    outline
                    rounded
                    color="white"
                    text-color="black"
                    class="btn-add"
                    :label="addressListLabel"
                    icon="icon-list"
                    @click="showAddressSelector"
                    v-if="isLogin && isShowNewAddressForm"
                  />
                </transition>
                <div class="address-form" v-if="addresses.length === 0 || isShowNewAddressForm">
                  <addressinfo
                    ref="address"
                    :only-one-col="true"
                    :address-edit="JSON.stringify(addressEdit)"
                    @countryChange="countryChange"
                    @regionChange="regionChange"
                  >
                    <template v-slot:otherfields>
                      <div class="field" v-if="isLogin">
                        <q-checkbox class="save-address" v-model="isSaveAddress" :label="saveInaddressBook" color="primary" dense />
                      </div>
                    </template>
                  </addressinfo>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <payment ref="paymentMethod" :country="country" @updatePaymentMethod="updatePaymentMethod" />
            <invoice ref="invoice" :is-login="isLogin" v-show="!hideInvoice" />
            <div class="shippingmethod">
              <h2>{{ shippingMethodHeading }}</h2>
              <div class="shippingMethod-form">
                <div class="shipping-method">{{ i18n(shippingCarrier) }}  {{ shippingFee }}</div>
                <div class="shipping-desc" v-if="shippingPolicy">{{ shippingPolicy }}</div>
                <div v-html="annonce"></div>
                <div v-if="notShipping">{{notShippingText}}</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4">
            <items
              :cart-items="checkoutItems"
              :discount-amount="discountAmount"
              :grand-total="grandTotal"
              :shipping-discount="shippingDiscount"
              :shipping-fee="shippingFee"
              :subtotal-total="subtotalTotal"
              :is-show-modify="true"
            />
            <div class="action gt-xs" v-if="!notShipping">
              <div @click="submit">
                <link-btn :text="submitOrderText" />
              </div>
            </div>
          </div>
        </div>
      </q-no-ssr>
      </div>
      <div class="lt-sm footer-placeholder">
        <q-page-sticky expand position="bottom" class="lt-sm p-footer">
          <q-toolbar class="footer-bar">
            <q-space />
            <link-btn :text="submitOrderText" @click="submit" v-if="!notShipping" />
          </q-toolbar>
        </q-page-sticky>
      </div>
    </div>
    <paystatus
      ref="paystatus"
      :email="currentEmail"
      :order-id="orderId"
      :order-internal-id="orderInternalId"
      :old-payment-method="paymentMethod"
      :currency="orderCurrency"
      :payment-instruction="paymentInstruction"
    />
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { showCart, listAddress, checkoutShipping, submitOrder, createAddress, createInvoice } from './../api/api'
import { removeSpace } from './../utils/validation'
import { ecommerceOrder } from './../tracking/analytics'
import notify from './../mixins/Notify'
import StoreId from './../mixins/StoreId'
import linkBtn from './../components/ui/Button'
import customer from './../components/checkout/Customer'
import addresslist from './../components/checkout/Address'
import addressinfo from './../components/address/AddressFields'
import payment from './../components/checkout/PaymentMethod'
import invoice from './../components/checkout/Invoice'
import items from './../components/checkout/Items'
import paystatus from './../components/checkout/PayStatus'
import _ from 'lodash'

export default {
  components: {
    customer,
    addresslist,
    addressinfo,
    payment,
    invoice,
    items,
    'link-btn': linkBtn,
    paystatus
  },
  data () {
    return {
      email: '',
      discountAmount: '',
      grandTotal: '',
      shippingCarrier: '',
      shippingDiscount: '',
      shippingFee: '',
      shippingPolicy: '',
      subtotalTotal: '',
      shippingFeeFinal: '',
      orderId: '',
      orderInternalId: '',
      hideInvoice: false,
      notShipping: false,
      notShippingText: '',
      addresses: [],
      userAddressListloader: false,
      isSaveAddress: false,
      isShowNewAddressForm: false,
      isLogin: false,
      currentSelectAddress: {},
      items: [],
      cartItems: [],
      annonce: '',
      needRegister: false,
      metaDescription: '',
      metaKeywords: '',
      orderCurrency: '',
      paymentMethod: '',
      paymentInstruction: '',
      addressEdit: {
        firstname: '',
        lastname: '',
        telephone: '',
        country_id: 'CN',
        region: '',
        city: '',
        street: '',
        postcode: ''
      },
      firstLoad: true,
      country: 'CN'
    }
  },
  meta () {
    return {
      // sets document title
      title: this.checkoutText,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`,
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
      cartQty: state => state.cart.cartQty,
      hasLoginSuccess: state => state.site.hasLoginSuccess
    }),
    checkoutText: function () {
      return this.$i18n.t('$common.$labels.checkout')
    },
    submitOrderText: function () {
      return this.$i18n.t('$common.$buttons.paynow')
    },
    addressHeading: function () {
      return this.$i18n.t('$common.$headings.shipInfo')
    },
    newAddress: function () {
      return this.$i18n.t('$common.$buttons.newAddress')
    },
    addressListLabel: function () {
      return this.$i18n.t('$common.$labels.addressBook')
    },
    saveInaddressBook: function () {
      return this.$i18n.t('$common.saveInaddressBook')
    },
    shippingMethodHeading: function () {
      return this.$i18n.t('$common.$headings.shipInfo')
    },
    shippingTips: function () {
      return this.$i18n.t('$common.shippingTips', { tel400: this.$i18n.t('$local.tel400') })
    },
    notShippingTips: function () {
      return this.$i18n.t('$common.$validation.notShipping')
    },
    checkoutItems: function () {
      if (this.items.length > 0) {
        return this.items
      } else {
        return this.cartItems
      }
    },
    currentEmail: function () {
      if (this.isLogin) {
        return decodeURIComponent(this.$q.cookies.get('email'))
      } else {
        return this.email
      }
    },
    currentInvoice: function () {
      if (!this.hideInvoice) {
        let needInvoice = '' || this.$refs.invoice.panel
        let invoiceValue = {
          type: '',
          title: '',
          taxt_code: '',
          address: '',
          phone: '',
          bank: '',
          bank_account: ''
        }
        if (needInvoice === '' || needInvoice === 'none') {
          return ''
        } else if (needInvoice === 'e-invoice') {
          invoiceValue.type = '0'
          if (this.$refs.invoice.epanel === 'personal') {
            invoiceValue.title = this.$i18n.t('个人')
            return { validation: true, fapiao: invoiceValue }
          } else if (this.$refs.invoice.epanel === 'business') {
            invoiceValue.title = this.$refs.invoice.normal.title
            invoiceValue.taxt_code = this.$refs.invoice.normal.uscc
            if (removeSpace(invoiceValue.title)) {
              return { validation: true, fapiao: invoiceValue, billing_address: this.billingAddress, needSave: this.$refs.invoice.showEInvoiceForm }
            } else {
              return { validation: false }
            }
          } else {
            return { validation: false }
          }
        } else if (needInvoice === 'vat-invoice') {
          invoiceValue.type = '1'
          invoiceValue.title = this.$refs.invoice.vat.businessName
          invoiceValue.taxt_code = this.$refs.invoice.vat.taxId
          invoiceValue.address = this.$refs.invoice.vat.registeredAddress
          invoiceValue.phone = this.$refs.invoice.vat.registeredPhone
          invoiceValue.bank = this.$refs.invoice.vat.bankName
          invoiceValue.bank_account = this.$refs.invoice.vat.bankAccount
          console.log('invoiceValue', invoiceValue)
          if (removeSpace(invoiceValue.title) && removeSpace(invoiceValue.address) && removeSpace(invoiceValue.phone) && removeSpace(invoiceValue.bank) && removeSpace(invoiceValue.bank_account)) {
            return { validation: true, fapiao: invoiceValue, billing_address: this.billingAddress, needSave: this.$refs.invoice.showVatInvoiceForm }
          } else {
            return { validation: false }
          }
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    billingAddress: function () {
      let billingAddress = {}
      if (this.$refs.invoice.isSameasShip) {
        if (this.currentSelectAddress && this.currentSelectAddress.fristname && !this.isShowNewAddressForm) {
          billingAddress = Object.assign(billingAddress, this.currentSelectAddress)
        } else {
          billingAddress = Object.assign(billingAddress, this.currentAddress)
        }
      } else {
        billingAddress = Object.assign({}, this.$refs.invoice.billingAddress)
      }
      return billingAddress
    },
    currentAddress: function () {
      if (this.$refs.address && this.$refs.address.address) {
        return this.$refs.address.address
      } else {
        return {}
      }
    }
  },
  watch: {
    addresses: function (newValue, oldValue) {
      if (newValue.length > 0) {
        let address = {
          firstname: newValue[0].firsname,
          lastname: newValue[0].lastname,
          street: `${newValue[0].street.join(' ')}`,
          city: newValue[0].city,
          country_id: newValue[0].country_id,
          region: newValue[0].region,
          postcode: newValue[0].postcode,
          telephone: newValue[0].telephone
        }
        this.currentSelectAddress = Object.assign({}, this.currentSelectAddress, address)
        this.changeAddress(address)
      }
    },
    currency: function (val, oldVal) {
      if (this.items.length > 0) {
        this.getShipping()
      } else {
        this.getCartQty()
      }
    },
    isShowNewAddressForm: function (val, oldVal) {
      if (!val) {
        if (this.currentSelectAddress.country_id === 'CN') {
          this.hideInvoice = false
        } else {
          this.hideInvoice = true
        }
      }
    },
    hasLoginSuccess: function (newVal, oldVal) {
      if (newVal) {
        this.isLogin = true
        this.getAddressList()
      }
    }
  },
  mixins: [notify, StoreId],
  methods: {
    ...mapActions(
      'site',
      [
        'setNeedShowLogin'
      ]
    ),
    ...mapActions(
      'cart',
      [
        'setCartInfo',
        'setCartQtyDriect'
      ]
    ),
    changeEmail (val) {
      this.email = val
    },
    checkNeedRegister (value) {
      this.needRegister = value
    },
    countryChange (value) {
      this.country = value
      if (value === 'CN') {
        this.hideInvoice = false
      } else {
        this.hideInvoice = true
      }
      if (value) {
        if ((this.isLogin && this.userAddressListloader) || !this.isLogin) {
          this.getShipping()
        }
      } else {
        this.getCartQty()
      }
    },
    regionChange (value) {
      if ((this.isLogin && this.userAddressListloader) || !this.isLogin) {
        this.getShipping()
      }
    },
    changeAddress (value) {
      this.isShowNewAddressForm = false
      this.currentSelectAddress = Object.assign({}, this.currentSelectAddress, value)
      this.country = value.country_id
      console.log(this.country, 'country')
      if (value.country_id) {
        if (value.country_id === 'CN') {
          this.hideInvoice = false
        } else {
          this.hideInvoice = true
        }
        this.getShipping(value)
      } else {
        this.getCartQty()
      }
    },
    getShipping (value) {
      if (this.paymentMethod) {
        let paymentMethod = this.paymentMethod
        let formdata = {
          email: this.currentEmail,
          payment: paymentMethod
        }
        if (value) {
          formdata.shipping_address = value
        } else {
          if (this.currentSelectAddress && this.currentSelectAddress.firstname && !this.isShowNewAddressForm) {
            formdata.shipping_address = this.currentSelectAddress
          } else {
            formdata.shipping_address = this.$refs.address.address
          }
        }
        if (formdata.shipping_address && formdata.shipping_address.country_id) {
          this.countShipping(formdata.shipping_address)
        }
      }
    },
    countShipping (value) {
      let formdata = {
        email: this.currentEmail,
        payment: this.paymentMethod,
        shipping_address: value
      }
      console.log(this.hideInvoice, '隐藏发票')
      if (!this.hideInvoice && this.currentInvoice !== '' && this.currentInvoice.validation) {
        if (this.$refs.invoice.isSameasShip) {
          formdata.billing_address = formdata.shipping_address
        } else {
          formdata.billing_address = this.currentInvoice.billing_address
        }
      }
      return new Promise((resolve, reject) => {
        checkoutShipping(formdata).then(data => {
          console.log(data)
          this.annonce = data.annonce
          this.discountAmount = data.totals.discount_amount
          this.grandTotal = data.totals.grand_total
          this.shippingCarrier = data.totals.shipping_carrier
          this.shippingDiscount = data.totals.shipping_discount
          this.shippingFee = data.totals.shipping_fee
          this.subtotalTotal = data.totals.subtotal_total
          this.shippingFeeFinal = data.totals.final_shipping_fee
          this.notShipping = false
          this.notShippingText = ''
          this.shippingPolicy = data.shipping_policy || ''
          this.items = data.items
          resolve()
        }).catch(error => {
          console.log(error)
          if (error === 'create order failed, no shipping method available.' || error === 'Please make sure the shipping address you entered is correct. If you do not see a shipping option here, please contact customer support to obtain a quote for shipping to your destination.' || error === 'We are sorry that the scent product(s) and/or amenities you would like to purchase cannot be shipped to addresses outside mainland China. We suggest that you visit our Europe or USA site via the Country/Region selector to place the order.') {
            this.annonce = ''
            this.discountAmount = ''
            this.grandTotal = ''
            this.shippingCarrier = ''
            this.shippingDiscount = ''
            this.shippingFee = ''
            this.subtotalTotal = ''
            this.shippingFeeFinal = ''
            this.notShipping = true
            this.shippingPolicy = ''
            this.items = []
            if (error === 'create order failed, no shipping method available.' || error === 'Please make sure the shipping address you entered is correct. If you do not see a shipping option here, please contact customer support to obtain a quote for shipping to your destination.') {
              this.notShippingText = this.shippingTips
            } else {
              this.notShippingText = this.notShippingTips
            }
            this.getCartQty()
          }
          reject()
        })
      })
    },
    throttleSubmit () {
      let email = this.currentEmail
      let formdata = {
        email: email,
        payment: this.paymentMethod
      }
      if (!this.isLogin) {
        if (!this.$refs.customer.checkForm()) {
          return false
        }
        if (this.needRegister) {
          formdata.create_customer = '1'
          formdata.password = this.$refs.customer.password
        }
      }
      console.log(this.currentSelectAddress, 'default address')
      console.log('验证地址簿', this.validationAddress())
      if (!this.validationAddress()) {
        return false
      }
      console.log('验证发票', this.validationInvoice())
      if (!this.validationInvoice()) {
        return false
      }
      if (this.currentSelectAddress && this.currentSelectAddress.firstname && !this.isShowNewAddressForm) {
        formdata.shipping_address = this.currentSelectAddress
      } else {
        formdata.shipping_address = this.$refs.address.address
      }
      if (!this.hideInvoice && this.currentInvoice !== '' && this.currentInvoice.validation) {
        formdata.fapiao = this.currentInvoice.fapiao
        if (this.$refs.invoice.isSameasShip) {
          formdata.billing_address = formdata.shipping_address
        } else {
          if (!this.$refs.invoice.checkVatAddress()) {
            return false
          }
          formdata.billing_address = this.currentInvoice.billing_address
        }
      }
      this.countShipping(formdata.shipping_address).then(() => {
        submitOrder(formdata).then(data => {
          console.log(data)
          this.firstLoad = false
          this.orderId = data.order_id
          this.orderCurrency = this.currency
          this.orderInternalId = data.internal_order_id
          this.$q.sessionStorage.set('createdOrderId', this.orderId)
          this.$q.sessionStorage.set('createdOrderInternalId', this.orderInternalId)
          this.$q.sessionStorage.set('createdOrderEmail', this.currentEmail)
          this.$q.sessionStorage.set('showMemberCard', data.show_member_card)
          this.$q.sessionStorage.set('orderInfo', formdata)
          this.$q.sessionStorage.set('paymentMethod', this.paymentMethod)
          this.$q.sessionStorage.set('orderCurrency', this.orderCurrency)
          let detail = {
            items: this.checkoutItems,
            discountAmount: this.discountAmount,
            grandTotal: this.grandTotal,
            shippingDiscount: this.shippingDiscount,
            shippingFee: this.shippingFee,
            subtotalTotal: this.subtotalTotal,
            shippingCarrier: this.shippingCarrier
          }
          this.$q.sessionStorage.set('orderItemsInfo', detail)
          if (data.session_id) {
            this.sessionId = data.session_id
            this.$q.cookies.set('PHPSESSID', this.sessionId, { path: '/' })
            if (this.needRegister && data.new_login && data.new_login === '1') {
              if (data.email) {
                this.$q.cookies.set('email', data.email, { path: '/' })
              }
              if (data.firstname) {
                this.$q.cookies.set('firstname', data.firstname, { path: '/' })
              }
              if (data.lastname) {
                this.$q.cookies.set('lastname', data.lastname, { path: '/' })
              }
              this.$q.cookies.set('isLogin', '1', { path: '/' })
            }
          }
          if (this.isSaveAddress) {
            this.saveCurrentAddress()
          }
          if (this.currentInvoice !== '' && this.currentInvoice.validation && this.currentInvoice.needSave) {
            this.saveCurrentInvoice()
          }
          if (data.payment_instruction && this.paymentMethod === 'banktransfer') {
            this.paymentInstruction = data.payment_instruction
          }
          // this.$refs.paystatus.toPay()
          this.$q.sessionStorage.remove('checkoutEmail')
          this.$q.sessionStorage.remove('checkoutAddress')
          this.$q.sessionStorage.remove('checkoutInvoice')
          this.gaEcommerce()
          this.getCartQty()
          let total = this.grandTotal.split('¥')[1].replace(/(^\s*)|(\s*$)/g, '').replace(/,/gi, '')
          try {
            console.log('mamoto trackEcommerceOrder', this.orderId + '', Number(total))
            window._paq.push(['trackEcommerceOrder',
              this.orderId + '', // (Required) orderId
              Number(total) // (Required) revenue
            ])
          } catch (error) {
          }
        }).catch(error => {
          console.log(error)
          if (error === 'create order failed, no shipping method available.') {
            this.msgAlert(error)
          } else if (error === 'create order failed, empty cart.') {
            this.$router.replace({ name: 'cart' })
          } else {
            this.msgAlert(error)
          }
        })
      })
    },
    submit: _.throttle(function () {
      this.throttleSubmit()
    }, 2000, { 'trailing': false }),
    updatePaymentMethod (val) {
      this.paymentMethod = val
      if ((this.isLogin && this.userAddressListloader) || !this.isLogin) {
        this.getShipping()
      }
    },
    pushMatomo (data) {
      if (data.items && data.items.length && data.items.length > 0) {
        data.items.forEach(o => {
          console.log('pushMatomo', o)
          window._paq.push(['addEcommerceItem',
            o.sku, // (Required) productSKU
            o.name, // (Optional) productName
            o.options, // (Optional)  productCategory
            Number(o.price.split('¥')[1].replace(/(^\s*)|(\s*$)/g, '').replace(/,/gi, '')), // (Recommended) price
            o.qty // (Optional, defaults to 1) quantity
          ])
        })
      }
      try {
        let total = data.subtotal_total.split('¥')[1].replace(/(^\s*)|(\s*$)/g, '').replace(/,/gi, '')
        console.log('pushMatomo', total)
        window._paq.push(['trackEcommerceCartUpdate', Number(total)])
      } catch (error) {
      }
    },
    getCartQty () {
      let formdata = {}
      showCart(formdata).then(data => {
        console.log(data)
        let qty = 0
        if (data.items) {
          this.cartItems = data.items
          if (data.items.length > 0) {
            data.items.forEach(o => {
              qty = qty + parseInt(o.qty, 10)
            })
          }
        }
        this.items = []
        this.shippingCarrier = ''
        this.shippingDiscount = ''
        this.shippingFee = ''
        this.discountAmount = data.discount_amount
        this.grandTotal = data.grand_total
        this.subtotalTotal = data.subtotal_total
        this.setCartQtyDriect(qty)
        this.setCartInfo(data)
        if (this.firstLoad && qty === 0) {
          this.$router.replace({ name: 'cart' })
        }
        this.pushMatomo(data)
      }).catch(error => {
        console.log(error)
      })
    },
    getAddressList () {
      let formdata = {}
      listAddress(formdata).then(data => {
        console.log(data)
        if (data.length > 0) {
          this.addresses = data
        }
        this.userAddressListloader = true
      }).catch(e => {
        console.log(e)
      })
    },
    showNewAddressForm () {
      this.isShowNewAddressForm = true
    },
    showAddressSelector () {
      this.isShowNewAddressForm = false
    },
    saveCurrentAddress () {
      let formdata = this.$refs.address.address
      createAddress(formdata).then(data => {
        console.log(data)
      }).catch(error => {
        console.log(error)
      })
    },
    saveCurrentInvoice () {
      let formdata = this.currentInvoice.fapiao
      createInvoice(formdata).then(data => {
        console.log(data)
      }).catch(e => {
        console.log(e)
      })
    },
    i18n (value) {
      return this.$i18n.t(value)
    },
    showLogin (value) {
      this.setNeedShowLogin(value)
    },
    validationAddress () {
      if (this.currentSelectAddress && this.currentSelectAddress.firstname && !this.isShowNewAddressForm) {
        console.log('选择地址簿')
        return true
      } else {
        console.log('验证输入地址')
        return this.$refs.address.checkForm()
      }
    },
    validationInvoice () {
      if (this.$refs.invoice.panel === 'e-invoice' && this.$refs.invoice.epanel === 'business') { // 公司发票
        return this.$refs.invoice.checkEForm()
      } else if (this.$refs.invoice.panel === 'vat-invoice') { // 增值税发票
        return this.$refs.invoice.checkVatForm()
      } else {
        return true
      }
    },
    saveInputs () {
      if (this.items.length > 0) {
        if (this.email) {
          this.$q.sessionStorage.set('checkoutEmail', this.email)
        }
        if (this.$refs.address && this.$refs.address.address) {
          let address = {
            firstname: '',
            lastname: '',
            telephone: '',
            country_id: '',
            region: '',
            city: '',
            street: '',
            postcode: ''
          }
          this.$q.sessionStorage.set('checkoutAddress', Object.assign(address, this.$refs.address.address))
        }
        if (this.$refs.invoice) {
          let invoice = {
            fapiao_type: '',
            fapiao_title: '',
            tax_code: '',
            address: '',
            phone: '',
            bank: '',
            account: '',
            isSameasShip: true
          }
          if (this.$refs.invoice.panel === 'e-invoice') {
            invoice.fapiao_type = '0'
            if (this.$refs.invoice.epanel === 'business') {
              invoice.fapiao_title = this.$refs.invoice.normal.title
              invoice.tax_code = this.$refs.invoice.normal.uscc
            }
          } else if (this.$refs.invoice.panel === 'vat-invoice') {
            invoice.fapiao_type = '1'
            invoice.fapiao_title = this.$refs.invoice.vat.businessName
            invoice.tax_code = this.$refs.invoice.vat.taxId
            invoice.address = this.$refs.invoice.vat.registeredAddress
            invoice.phone = this.$refs.invoice.vat.registeredPhone
            invoice.bank = this.$refs.invoice.vat.bankName
            invoice.account = this.$refs.invoice.vat.bankAccount
          }
          if (!this.$refs.invoice.isSameasShip) {
            invoice.isSameasShip = false
            invoice.billingAddress = this.billingAddress
          }
          this.$q.sessionStorage.set('checkoutInvoice', invoice)
        }
      }
    },
    gaEcommerce () {
      let orderInfo = {
        id: this.orderId,
        affiliation: '',
        revenue: this.getCurrencyValue(this.grandTotal),
        shipping: this.getCurrencyValue(this.shippingFeeFinal),
        tax: '',
        currency: this.orderCurrency
      }
      let items = []
      this.checkoutItems.forEach(item => {
        items.push({
          id: this.orderId,
          name: item.name,
          sku: item.sku,
          category: '',
          price: this.getCurrencyValue(item.price),
          quantity: item.qty,
          currency: this.orderCurrency
        })
      })
      ecommerceOrder(orderInfo, items)
    },
    getCurrencyValue (value) {
      if (value.indexOf(' ') !== -1) {
        let valueArr = value.split(' ')
        if (valueArr.length > 1) {
          return valueArr[1]
        } else {
          return value
        }
      } else {
        return value
      }
    }
  },
  created () {
    if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
      this.isLogin = true
      this.getAddressList()
    } else {
      this.isLogin = false
    }
    if (this.$q.sessionStorage.has('checkoutAddress')) {
      this.addressEdit = Object.assign({}, this.$q.sessionStorage.getItem('checkoutAddress'))
      if (!this.addressEdit.country_id) {
        this.country = this.addressEdit.country_id
        this.getCartQty()
      }
    } else {
      this.getCartQty()
    }
  },
  beforeRouteLeave (to, from, next) {
    console.log(to)
    this.saveInputs()
    next()
  }
}
</script>
<style lang="scss">
.checkout-page {
  max-width: 1630px;
  margin: auto;
  padding: 0 3% 3%;
  line-height: 1.5em;
  background: $white;
  .address-form, .shippingMethod-form, .h2-content {
    border: 1px solid $beige;
    padding: 3%;
    line-height: 1.5em;
  }
}
</style>
