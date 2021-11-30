<template>
  <div>
    <spinner v-show="pageLoading" type="page" />
    <div v-show="!pageLoading" class="checkout content" id="pgCheckout">
      <h1>{{ checkoutText }}</h1>
      <q-no-ssr>
        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-6">
            <customer
              ref="customer"
              v-if="!isLogin"
              @changeEmail="changeEmail"
              @checkNeedRegister="checkNeedRegister"
              @showLogin="showLogin"
            />
            <h2>{{ shippingHeading }}</h2>
            <div class="h2-content">
              <addresslist
                ref="addressSelector"
                :address-list="addresses"
                :type="'default_shipping'"
                @changeAddress="changeAddress"
                v-if="addresses.length > 0 && isLogin && !isShowNewAddressForm"
              />
              <transition>
                <q-btn
                  unelevated outline rounded
                  color="white"
                  text-color="black"
                  :label="newAddress"
                  @click="showNewAddressForm"
                  v-if="isLogin && !isShowNewAddressForm && addresses.length !== 0"
                  class="btn-add"
                />
                <q-btn
                  unelevated outline rounded
                  color="white"
                  text-color="black"
                  class="btn-add"
                  :label="addressListLabel"
                  icon="icon-list"
                  @click="showAddressSelector"
                  v-if="isLogin && isShowNewAddressForm"
                />
              </transition>
              <div class="address-form" v-show="addresses.length === 0 || isShowNewAddressForm">
                <addressinfo
                  ref="address"
                  :only-one-col="true"
                  :address-edit="JSON.stringify(addressEdit)"
                  :address-type="'shipping'"
                  @countryChange="countryChange"
                  @regionChange="regionChange"
                  @zipChange="zipChange"
                >
                  <template v-slot:otherfields>
                    <div class="field moreoption" v-if="isLogin">
                      <q-checkbox class="save-address" v-model="isSaveAddress" :label="saveInaddressBook" color="primary" dense />
                    </div>
                  </template>
                </addressinfo>
              </div>
              <div class="address-form same-as-ship">
                <div class="field moreoption">
                  <q-checkbox class="save-address" v-model="isSameasShip" :label="sameasShip" color="primary" dense />
                </div>
              </div>
            </div>
            <div v-show="!isSameasShip">
              <h2>{{ billingHeading }}</h2>
              <div class="h2-content">
                <addresslist
                  ref="addressSelector"
                  :address-list="billingAddresses"
                  :type="'default_billing'"
                  @changeAddress="changeBillingAddress"
                  v-if="addresses.length > 0 && isLogin && !isShowNewBillingAddressForm"
                />
                <transition>
                  <q-btn
                    unelevated outline rounded
                    color="white"
                    text-color="black"
                    :label="newAddress"
                    @click="addNewBillingAddressForm"
                    v-if="isLogin && !isShowNewBillingAddressForm && addresses.length !== 0"
                    class="btn-add"
                  />
                  <q-btn
                    unelevated outline rounded
                    color="white"
                    text-color="black"
                    class="btn-add"
                    :label="addressListLabel"
                    icon="icon-list"
                    @click="addNewBillingAddressForm"
                    v-if="isLogin && isShowNewBillingAddressForm"
                  />
                </transition>
                <div class="address-form" v-show="addresses.length === 0 || isShowNewBillingAddressForm">
                  <addressinfo
                  ref="billingAddress"
                  :only-one-col="true"
                  :address-edit="JSON.stringify(billingAddressEdit)"
                  :address-type="'billing'"
                  :isShowNewBillingAddressForm="isShowNewBillingAddressForm"
                  @countryChange="billingCountryChange"
                  @regionChange="billingRegionChange"
                  @zipChange="billingZipChange"
                  >
                    <template v-slot:otherfields>
                      <div class="field moreoption" v-if="isLogin">
                        <q-checkbox class="save-address" v-model="isSaveBillingAddress" :label="saveInaddressBook" color="primary" dense />
                      </div>
                    </template>
                  </addressinfo>
                </div>
              </div>
            </div>
            <payment ref="paymentMethod" :country="country" :ischeckmo="checkmo" @updatePaymentMethod="updatePaymentMethod" />
            <q-dialog v-model="isShowBadTerms">
              <div class="bed-terms-wrapper">
                <q-btn flat dense icon="icon-close" size="md" v-close-popup class="close-terms" />
                <q-card :class="['bad-terms-confirm', lang]">
                  <q-card-actions align="center">
                    <div class="bad-terms-text" v-html="badTerms.bed_terms" />
                  </q-card-actions>
                </q-card>
              </div>
            </q-dialog>
            <h2>{{ shippingMethodHeading }}</h2>
            <div class="h2-content" v-if="!isShowLoading">
              <div class="shipping-method">{{ shippingCarrierText }}  {{ shippingFee }}</div>
              <div class="shipping-desc" v-show="shippingPolicy">{{ shippingPolicy }}</div>
              <div v-html="annonce"></div>
              <div v-show="notShipping">{{notShippingText}}</div>
            </div>
            <div class="h2-content loading" v-else>
              <spinner />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <items
              :cart-items="checkoutItems"
              :discount-amount="discountAmount"
              :grand-total="grandTotal"
              :shipping-discount="shippingDiscount"
              :shipping-fee="shippingFee"
              :subtotal-total="subtotalTotal"
              :tax="tax"
              :is-show-modify="true"
              :is-show-loading="isShowLoading"
              :lang="lang"
            />
            <!-- <div class="col-block gt-sm">
              <hotel-selector />
            </div> -->
            <div class="field checkbox" v-if="badTerms && badTerms.bed_terms_checkbox">
              <q-checkbox
                v-model="isBadTerms"
                />
                {{badTerms.bed_terms_checkbox}} <span class="link" @click="showBadTerms">{{badTerms.bed_terms_title}}</span>*
            </div>
            <p class="accept-terms">
              {{agreeToTerms1}}
              <router-link class="link" :to="{name: 'help', params: { note: termsUrl}}" target="_blank">{{generalSalesConditions}}</router-link>
              {{and}}
              <span><router-link class="link" :to="{name: 'help', params: { note: privacyUrl}}" target="_blank">{{privacyPolicy}}</router-link></span>
              {{agreeToTerms2}}
            </p>
            <div class="action gt-xs" v-show="!notShipping">
              <link-btn-2 :text="submitOrderText" @click="submit" :disable="checkShipping" />
            </div>
          </div>
        </div>
      </q-no-ssr>
      <q-page-sticky expand position="bottom" class="lt-sm p-footer" v-show="!notShipping">
        <q-toolbar class="footer-bar">
          <link-btn-2 :text="submitOrderText" @click="submit" v-show="!notShipping" :disable="checkShipping" />
        </q-toolbar>
      </q-page-sticky>
    </div>
    <paystatus
      v-show="!pageLoading"
      ref="paystatus"
      :email="currentEmail"
      :order-id="orderId"
      :order-internal-id="orderInternalId"
      :old-payment-method="paymentMethod"
      :currency="orderCurrency"
      :payment-instruction="paymentInstruction"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { showCart, listAddress, checkoutShipping, submitOrder, createAddress, createInvoice } from './../api/api'
import { removeSpace } from './../utils/validation'
import { formatPrice } from './../utils/format'
import { ecommerceOrder } from './../tracking/analytics'
import notify from './../mixins/Notify'
import StoreId from './../mixins/StoreId'
import linkBtn2 from './../components/ui/Button2'
import customer from './../components/checkout/Customer'
import addresslist from './../components/checkout/Address'
import addressinfo from './../components/address/AddressFields'
import payment from './../components/checkout/PaymentMethod'
// import invoice from './../components/checkout/Invoice'
// import billingaddress from './../components/checkout/BillingAddress'
import items from './../components/checkout/Items'
import paystatus from './../components/checkout/PayStatus'
// import hotelSelector from './../components/order/HotelsSelector'
import _ from 'lodash'

export default {
  components: {
    customer,
    addresslist,
    addressinfo,
    payment,
    // invoice,
    items,
    // 'hotel-selector': hotelSelector,
    // billingaddress,
    'link-btn-2': linkBtn2,
    paystatus
  },
  data () {
    return {
      email: '',
      discountAmount: '',
      grandTotal: '',
      totalExclTax: '',
      shippingCarrier: '',
      shippingDiscount: '',
      shippingFee: '',
      shippingPolicy: '',
      subtotalTotal: '',
      baseEuTotal: 0,
      shippingFeeFinal: '',
      orderId: '',
      orderInternalId: '',
      hideInvoice: false,
      notShipping: false,
      notShippingText: '',
      addresses: [],
      billingAddresses: [],
      userAddressListloader: false,
      isSaveAddress: false,
      isSaveBillingAddress: false,
      isShowNewBillingAddressForm: false,
      isShowNewAddressForm: false,
      isLogin: false,
      currentSelectAddress: {},
      currentSelectBillingAddress: {},
      items: [],
      cartItems: [],
      annonce: '',
      needRegister: false,
      metaDescription: '',
      metaKeywords: '',
      orderCurrency: '',
      paymentMethod: 'banktransfer',
      paymentInstruction: '',
      checkShipping: true,
      addressEdit: {
        firstname: '',
        lastname: '',
        company: '',
        telephone: '',
        country_id: '',
        region: '',
        city: '',
        street: '',
        postcode: ''
      },
      billingAddressEdit: {
        firstname: '',
        lastname: '',
        company: '',
        telephone: '',
        country_id: '',
        region: '',
        city: '',
        street: '',
        postcode: ''
      },
      firstLoad: true,
      country: '',
      billingCountry: '',
      billingRegion: '',
      isSameasShip: true,
      checkmo: false,
      badTerms: {},
      isBadTerms: false,
      isShowBadTerms: false,
      tax: '',
      isShowLoading: false
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
      cart: state => state.cart.cart,
      hasLoginSuccess: state => state.site.hasLoginSuccess,
      pageLoading: state => state.site.pageLoading
    }),
    checkoutText: function () {
      return this.$i18n.t('$common.$labels.checkout')
    },
    submitOrderText: function () {
      return this.$i18n.t('$common.$buttons.paynow')
    },
    billingHeading: function () {
      return this.$i18n.t('$common.$labels.billingInfo')
    },
    shippingHeading: function () {
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
    sameasShip: function () {
      return this.$i18n.t('$common.sameasShip')
    },
    generalSalesConditions: function () {
      return this.$i18n.t('$common.$labels.generalSalesConditions')
    },
    and: function () {
      if (this.lang === 'de') {
        return 'und die'
      } else {
        return this.$i18n.t('$common.and')
      }
    },
    privacyPolicy: function () {
      return this.$i18n.t('$common.$labels.privacyPolicy')
    },
    termsUrl: function () {
      return this.$i18n.t('$common.$urls.terms')
    },
    privacyUrl: function () {
      return this.$i18n.t('$common.$urls.privacy')
    },
    agreeToTerms1: function () {
      return this.$i18n.t('$common.agreeToTerms_1')
    },
    agreeToTerms2: function () {
      return this.$i18n.t('$common.agreeToTerms_2')
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
        let needInvoice = '' // || this.$refs.invoice.panel
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
            invoiceValue.title = this.$i18n.t('personal')
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
      // if (this.$refs.invoice.isSameasShip) {
      //   if (this.currentSelectAddress && this.currentSelectAddress.fristname && !this.isShowNewAddressForm) {
      //     billingAddress = Object.assign(billingAddress, this.currentSelectAddress)
      //   } else {
      //     billingAddress = Object.assign(billingAddress, this.currentAddress)
      //   }
      // } else {
      //   billingAddress = Object.assign({}, this.$refs.invoice.billingAddress)
      // }
      if (this.$refs.billingAddress && this.$refs.billingAddress.address) {
        return this.$refs.billingAddress.address
      } else {
        return {}
      }
    },
    currentAddress: function () {
      if (this.$refs.address && this.$refs.address.address) {
        return this.$refs.address.address
      } else {
        return {}
      }
    },
    currentCountry: function () {
      let billingCountry = this.billingCountry
      let country = this.country
      if (this.isLogin && this.currentSelectAddress.country_id) {
        if (this.isShowNewAddressForm) {
          country = this.$refs.address.address.country_id
          billingCountry = this.$refs.address.address.country_id
        } else {
          country = this.currentSelectAddress.country_id
          billingCountry = this.currentSelectAddress.country_id
        }
      }
      if (this.isLogin && this.currentSelectBillingAddress.country_id && !this.isSameasShip) {
        if (this.isShowNewBillingAddressForm) {
          billingCountry = this.$refs.billingAddress.address.country_id
        } else {
          billingCountry = this.currentSelectBillingAddress.country_id
        }
      }
      return {
        billingCountry, country
      }
    },
    shippingCarrierText: function () {
      return this.$i18n.t(this.shippingCarrier)
    }
  },
  watch: {
    addresses: function (newValue, oldValue) {
      if (newValue.length > 0) {
        let address = {
          firstname: newValue[0].firsname,
          lastname: newValue[0].lastname,
          street: `${newValue[0].street.join('|')}`,
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
    isShowNewBillingAddressForm: function (val, oldVal) {
      if (this.isSameasShip) {
        this.checkCheckmo(this.currentCountry.country)
      } else {
        this.checkCheckmo(this.currentCountry.billingCountry)
      }
      this.getShipping()
    },
    isShowNewAddressForm: function (val, oldVal) {
      if (!val) {
        if (this.currentSelectAddress.country_id === 'CN') {
          this.hideInvoice = false
        } else {
          this.checkmo = false
        }
      }
      if (this.isSameasShip) {
        this.checkCheckmo(this.currentCountry.country)
      } else {
        this.checkCheckmo(this.currentCountry.billingCountry)
      }
      this.getShipping()
    },
    hasLoginSuccess: function (newVal, oldVal) {
      if (newVal) {
        this.isLogin = true
        this.getAddressList()
      }
    },
    isBadTerms: function (newVal, oldVal) {
      if (newVal) {
        this.checkShipping = false
      }
    },
    isSameasShip: function (newVal, oldVal) {
      // console.log('watch isSameasShip', newVal, oldVal, this.country, this.billingCountry, this.currentSelectAddress.country_id, this.currentSelectBillingAddress.country_id)
      // let billingCountry = this.billingCountry
      // let country = this.country
      // if (this.isLogin && this.currentSelectAddress.country_id) {
      //   if (this.isShowNewAddressForm) {
      //     country = this.$refs.address.address.country_id
      //     billingCountry = this.$refs.address.address.country_id
      //   } else {
      //     country = this.currentSelectAddress.country_id
      //     billingCountry = this.currentSelectAddress.country_id
      //   }
      // }
      // if (this.isLogin && this.currentSelectBillingAddress.country_id && !this.isSameasShip) {
      //   if (this.isShowNewBillingAddressForm) {
      //     billingCountry = this.$refs.billingAddress.address.country_id
      //   } else {
      //     billingCountry = this.currentSelectBillingAddress.country_id
      //   }
      // }
      // console.log('watch isSameasShip 2', country, billingCountry)
      if (!newVal) {
        // this.getShipping()
        this.checkCheckmo(this.currentCountry.billingCountry)
      } else {
        this.checkCheckmo(this.currentCountry.country)
      }
      this.$q.sessionStorage.set('isSameasShip', newVal)
    },
    shippingFee: function (newVal, oldVal) {
      console.log('checkout watch shippingfee', newVal, '|', oldVal)
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
    msgAlert (msg) {
      this.$q.notify({
        message: msg,
        position: 'center',
        timeout: '3000',
        classes: 'notify'
      })
    },
    changeEmail (val) {
      this.email = val
    },
    checkNeedRegister (value) {
      this.needRegister = value
    },
    billingCountryChange (value) {
      console.log('checkout billingCountryChange', value, this.$refs.billingAddress.address, this.$refs.address.address)
      this.billingCountry = value
      this.$q.sessionStorage.set('billingCountry', value)
      // if (this.isSameasShip) {
      //   this.country = value
      //   this.$refs.address.address.country_id = value
      //   this.$refs.address.address.postcode = this.$refs.billingAddress.address.postcode
      // }
      // this.countryChange(value)
      if (!this.isSameasShip) {
        this.checkCheckmo(value)
      }
    },
    billingRegionChange (value) {
      // console.log('checkout billingRegionChange', value)
      if (value === 'getFromSaved') {
        this.region = ''
        this.regionChange('')
        if (!this.isSameasShip) {
          this.$refs.billingAddress.address.region = ''
        }
      }
      // if (this.isSameasShip) {
      //   this.region = value
      //   this.$refs.address.address.region = value
      //   this.regionChange(value)
      // }
    },
    billingZipChange (value) {
      console.log('checkout billingZipChange', value, this.$refs.billingAddress.address, this.$refs.address.address)
      // if (this.isSameasShip) {
      //   this.$refs.address.address.country_id = this.$refs.billingAddress.address.country_id
      //   this.$refs.address.address.postcode = this.$refs.billingAddress.address.postcode
      // }
      // this.countryChange(this.$refs.billingAddress.address.country_id)
    },
    countryChange (value) {
      console.log('checkout CountryChange', value, (this.isLogin && this.userAddressListloader) || !this.isLogin)
      this.country = value
      // if (value === 'CN') {
      //   this.hideInvoice = false
      // } else {
      //   this.hideInvoice = true
      // }
      this.$q.sessionStorage.set('shippingCountry', value)
      if (this.isSameasShip) {
        this.checkCheckmo(value)
      }
      if (value) {
        if ((this.isLogin && this.userAddressListloader) || !this.isLogin) {
          this.getShipping()
        }
      } else {
        this.getCartQty()
      }
    },
    checkCheckmo (value) {
      // console.log('checkCheckmo 1', this.baseEuTotal)
      try {
        let total = Number(this.baseEuTotal)
        let checkCartSubtotalTotal = total > 100 && total < 9999
        let country = value
        // if (!this.isSameasShip) {
        //   console.log('checkCheckmo 1-0', this.currentSelectAddress)
        //   if (this.currentSelectBillingAddress && this.currentSelectBillingAddress.firstname && !this.isShowNewBillingAddressForm) {
        //     console.log('checkCheckmo 1 throttleSubmit 0-2-b', this.currentSelectBillingAddress, this.$refs)
        //     country = this.currentSelectBillingAddress.country_id
        //   } else {
        //     console.log('checkCheckmo 1 throttleSubmit 0-3-b', this.currentBillingAddress, this.$refs, this.isSameasShip)
        //     country = this.$refs.billingAddress.address.country_id
        //   }
        // }
        // console.log('checkCheckmo 2', total, this, checkCartSubtotalTotal, this.isSameasShip, country)
        if (country === 'FR') {
          this.checkmo = true && checkCartSubtotalTotal
        } else {
          this.checkmo = false
        }
        // console.log('checkCheckmo 3', country, this.checkmo)
      } catch (error) {
        this.checkmo = false
      }
    },
    regionChange (value) {
      // console.log('checkout regionChange', value)
      if ((this.isLogin && this.userAddressListloader) || !this.isLogin) {
        this.getShipping()
      }
    },
    zipChange (value) {
      if (value) {
        this.getShipping()
      }
    },
    changeAddress (value) {
      this.isShowNewAddressForm = false
      this.currentSelectAddress = Object.assign({}, this.currentSelectAddress, value)
      this.country = value.country_id
      // console.log('changeAddress', this.country, 'country', value.country_id)
      if (value.country_id) {
        this.getShipping(value)
      } else {
        this.getCartQty()
      }
      if (this.isSameasShip) {
        if (value.country_id) {
          this.checkCheckmo(value.country_id)
        }
      }
    },
    changeBillingAddress (value) {
      // console.log('changeBillingAddress', value)
      this.isShowNewBillingAddressForm = false
      this.currentSelectBillingAddress = Object.assign({}, this.currentSelectBillingAddress, value)
      this.billingCountry = value.country_id
      // console.log('changeBillingAddress', this.currentSelectBillingAddress)
      // if (this.isSameasShip) {
      //   if (value.country_id) {
      //     this.getShipping(value)
      //   } else {
      //     this.getCartQty()
      //   }
      // }
      if (!this.isSameasShip) {
        this.checkCheckmo(value.country_id)
      }
    },
    getShipping (value) {
      // console.log('checkout getShipping 1', this.paymentMethod, this.$refs, value, this.isSameasShip, this.currentSelectBillingAddress, this.$refs.billingAddress.address, (this.currentSelectBillingAddress && this.currentSelectBillingAddress.firstname && !this.isShowNewBillingAddressForm), this.isShowNewBillingAddressForm, this)
      if (this.paymentMethod) {
        let paymentMethod = this.paymentMethod
        let formdata = {
          email: this.currentEmail,
          payment: paymentMethod
        }
        if (value) {
          formdata.shipping_address = value
        } else {
          // if (this.isSameasShip) {
          //   if (this.currentSelectAddress && this.currentSelectAddress.firstname && !this.isShowNewAddressForm) {
          //     formdata.shipping_address = this.currentSelectBillingAddress
          //   } else {
          //     formdata.shipping_address = this.$refs.billingAddress.address
          //   }
          // } else {
          if (this.currentSelectAddress && this.currentSelectAddress.firstname && !this.isShowNewAddressForm) {
            formdata.shipping_address = this.currentSelectAddress
          } else {
            formdata.shipping_address = this.$refs.address.address
          }
          // }
        }
        // console.log('checkout getShipping 2', formdata.shipping_address)
        if (formdata.shipping_address && formdata.shipping_address.country_id) {
          this.countShipping(formdata.shipping_address).then((data) => {
            console.log('getShipping countShipping', data)
          })
        }
      }
    },
    countShipping (value) {
      this.isShowLoading = true
      this.checkShipping = true
      // console.log('checkout countShipping', value, this, this.isSameasShip)
      let formdata = {
        email: this.currentEmail,
        payment: this.paymentMethod,
        shipping_address: value
      }
      if (this.isSameasShip) {
        formdata.billing_address = formdata.shipping_address
      } else {
        formdata.billing_address = this.$refs.billingAddress.address
      }
      // if (!this.hideInvoice && this.currentInvoice !== '' && this.currentInvoice.validation) {
      //   if (this.$refs.invoice.isSameasShip) {
      // formdata.billing_address = formdata.shipping_address
      //   } else {
      //     formdata.billing_address = this.currentInvoice.billing_address
      //   }
      // }
      // console.log('checkout countShipping 2', formdata, this.baseEuTotal)
      return new Promise((resolve, reject) => {
        checkoutShipping(formdata).then(data => {
          // console.log('checkout countShipping 3-0', data)
          this.annonce = data.annonce
          this.discountAmount = data.totals.discount_amount
          this.grandTotal = data.totals.grand_total
          this.shippingCarrier = data.totals.shipping_carrier
          this.shippingDiscount = data.totals.shipping_discount
          this.shippingFee = data.totals.shipping_fee
          this.subtotalTotal = data.totals.subtotal_total
          this.baseEuTotal = data.totals.base_grand_total
          this.tax = data.totals.tax || ''
          this.shippingFeeFinal = data.totals.final_shipping_fee
          this.notShipping = false
          this.checkShipping = false
          this.isShowLoading = false
          this.notShippingText = ''
          this.shippingPolicy = data.shipping_policy || ''
          this.items = data.items
          // console.log('checkout countShipping 3', this)
          // this.checkCheckmo(formdata.billing_address.country_id)
          resolve()
        }).catch(error => {
          // console.log('checkout countShipping 4-0 error', error)
          if (error === 'create order failed, no shipping method available.' || error === 'Please make sure your shipping address is a valid address. If your shipping address is valid, please call us for a quote to ship at your destination at: +33 1 41 51 51 51.' || error === 'We are sorry that the scent product(s) and/or amenities you would like to purchase cannot be shipped to addresses outside mainland China. We suggest that you visit our Europe or USA site via the Country/Region selector to place the order.') {
            this.annonce = ''
            this.discountAmount = ''
            this.grandTotal = ''
            this.shippingCarrier = ''
            this.shippingDiscount = ''
            this.shippingFee = ''
            this.subtotalTotal = ''
            this.baseEuTotal = ''
            this.shippingFeeFinal = ''
            this.notShipping = true
            this.shippingPolicy = ''
            this.items = []
            if (error === 'create order failed, no shipping method available.' || error === 'Please make sure your shipping address is a valid address. If your shipping address is valid, please call us for a quote to ship at your destination at: +33 1 41 51 51 51.') {
              this.notShippingText = this.shippingTips
            } else {
              this.notShippingText = this.notShippingTips
            }
            // console.log('checkout countShipping 4', this)
            this.isShowLoading = false
            this.getCartQty()
          }
          resolve()
        }).catch(function (res) {
          reject()
        })
      })
    },
    throttleSubmit () {
      // console.log('throttleSubmit 0', this)
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
      if (this.$refs.customer && this.$refs.customer.is_subscribed) {
        formdata.is_subscribe = 1
      } else {
        formdata.is_subscribe = 0
      }
      // console.log('throttleSubmit 0-1', 'this.$refs.address.address', this.$refs.address.address, 'this.$refs.billingAddress.address', this.$refs.billingAddress.address, 'this.currentSelectAddress', this.currentSelectAddress, 'this.currentSelectBillingAddress', this.currentSelectBillingAddress, 'this.isSameasShip', this.isSameasShip, this.badTerms, this.badTerms.bed_terms, this.isBadTerms)
      if ((this.badTerms && this.badTerms.bed_terms) && !this.isBadTerms) {
        let msg = this.$i18n.t('$common.$validation.bedTerms')
        this.msgAlert(msg)
        this.checkShipping = true
        return false
      }
      // shipping_address
      // SelectAddress
      if (this.currentSelectAddress && this.currentSelectAddress.firstname && !this.isShowNewAddressForm) {
        // console.log('throttleSubmit 0-2-s', this.currentSelectAddress)
        formdata.shipping_address = this.currentSelectAddress
      } else {
        // console.log('throttleSubmit 0-3-s', this.currentAddress, this.$refs.address.address, this.isSameasShip)
        formdata.shipping_address = this.$refs.address.address
      }
      // billing_address
      // SelectAddress
      if (this.currentSelectBillingAddress && this.currentSelectBillingAddress.firstname && !this.isShowNewBillingAddressForm) {
        // console.log('throttleSubmit 0-2-b', this.currentSelectBillingAddress, this.$refs.billingAddress.address)
        formdata.billing_address = this.currentSelectBillingAddress
      } else {
        // console.log('throttleSubmit 0-3-b', this.currentAddress, this.$refs.address.address, this.isSameasShip)
        formdata.billing_address = this.$refs.billingAddress.address
      }
      if (this.isSameasShip) {
        // console.log('throttleSubmit 1', this.$refs.billingAddress.address, typeof this.$refs.billingAddress.address)
        // formdata.shipping_address = formdata.billing_address
        formdata.billing_address = formdata.shipping_address
      // } else {
      //   formdata.billing_address = this.$refs.billingAddress.address
      }
      // console.log('throttleSubmit 2', this.currentSelectAddress, 'default address', formdata, this.validationAddress())
      // console.log('throttleSubmit 3', '验证地址簿', this.validationAddress())
      if (!this.validationAddress()) {
        return false
      }
      // console.log('throttleSubmit 3', formdata)
      this.countShipping(formdata.shipping_address).then(() => {
        // console.log('throttleSubmit 4', formdata)
        submitOrder(formdata).then(data => {
          // console.log('throttleSubmit 5')
          // console.log('submitOrder data', data)
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
          this.$q.sessionStorage.set('createdOrderTaxAmmount', this.tax)
          this.$q.sessionStorage.set('createdOrderTotalQuantity', this.cartQty)
          this.$q.sessionStorage.set('totalExclTax', this.totalExclTax)
          this.$q.sessionStorage.set('shippingFeeFinal', this.shippingFeeFinal)
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
            // if (this.needRegister && data.new_login && data.new_login === '1') {
            //   if (data.email) {
            //     this.$q.cookies.set('email', data.email, { path: '/' })
            //   }
            //   if (data.firstname) {
            //     this.$q.cookies.set('firstname', data.firstname, { path: '/' })
            //   }
            //   if (data.lastname) {
            //     this.$q.cookies.set('lastname', data.lastname, { path: '/' })
            //   }
            //   this.$q.cookies.set('isLogin', '1', { path: '/' })
            // }
          }
          if (this.isSaveAddress) {
            this.saveCurrentAddress(formdata.shipping_address)
          }
          if (this.isSaveBillingAddress) {
            this.saveCurrentAddress(formdata.billing_address)
          }
          // if (this.currentInvoice !== '' && this.currentInvoice.validation && this.currentInvoice.needSave) {
          //   this.saveCurrentInvoice()
          // }
          if (data.payment_instruction && this.paymentMethod === 'banktransfer') {
            this.paymentInstruction = data.payment_instruction
          }
          // this.$refs.paystatus.toPay()
          this.$q.sessionStorage.remove('checkoutEmail')
          this.$q.sessionStorage.remove('checkoutAddress')
          this.$q.sessionStorage.remove('checkoutBillingAddress')
          this.$q.sessionStorage.remove('checkoutInvoice')
          this.$q.sessionStorage.remove('shippingCountry')
          this.$q.sessionStorage.remove('billingCountry')
          this.$q.sessionStorage.remove('isSameasShip')
          this.gaEcommerce()
          this.getCartQty()
          // console.log('throttleSubmit 6')
        }).catch(error => {
          console.log(error)
          if (error === 'create order failed, empty cart.') {
            this.$router.replace({ name: 'cart' })
          } else {
            // console.log(error)
            let errorsArray = error.split('. ')
            console.log(errorsArray)
            for (const key in errorsArray) {
              this.errorMessageHandler(errorsArray[key])
            }
          }
        })
      }, () => {})
    },
    errorMessageHandler (error) {
      let errorMsg = error.replace(/\./g, '')
      console.log('errorMessageHandler:', errorMsg)
      switch (errorMsg) {
        case 'Please check the billing address information':
        case 'Please check the shipping address information':
          break
        case 'firstname is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.firstname'))
          break
        case 'lastname is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.lastName'))
          break
        case 'street is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.street'))
          break
        case 'city is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.city'))
          break
        case 'telephone is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.phone'))
          break
        case 'postcode is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.postCode'))
          break
        case 'countryId is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.country'))
          break
        case 'regionId is a required field':
          this.msgAlert(this.$i18n.t('$common.$validation.$required.region'))
          break
        case 'create order failed, no shipping method available':
        case 'create order failed, empty checkout data':
          break
        default:
          this.msgAlert(error)
          break
      }
    },
    submit: _.throttle(function () {
      this.throttleSubmit()
    }, 400, { 'trailing': false }),
    updatePaymentMethod (val) {
      this.paymentMethod = val
      if ((this.isLogin && this.userAddressListloader) || !this.isLogin) {
        this.getShipping()
      }
    },
    getCartQty () {
      let formdata = {}
      showCart(formdata).then(data => {
        console.log('cart data', data)
        let qty = 0
        if (data.items) {
          this.cartItems = data.items
          if (data.items.length > 0) {
            data.items.forEach(o => {
              qty = qty + parseInt(o.qty, 10)
            })
          }
        }
        if (!this.isLogin) {
          if (data.default_country && data.default_country !== '') {
            if (this.$q.sessionStorage.has('shippingCountry')) {
              let shippingCountry = this.$q.sessionStorage.getItem('shippingCountry')
              this.addressEdit.country_id = shippingCountry
            } else {
              this.addressEdit.country_id = data.default_country
            }
            if (this.$q.sessionStorage.has('billingCountry')) {
              let billingCountry = this.$q.sessionStorage.getItem('billingCountry')
              this.billingAddressEdit.country_id = billingCountry
            } else {
              this.billingAddressEdit.country_id = data.default_country
            }
          }
        }
        this.items = []
        // this.shippingCarrier = ''
        // this.shippingDiscount = ''
        // this.shippingFee = ''
        this.discountAmount = data.discount_amount
        this.grandTotal = data.grand_total
        this.totalExclTax = data.subTotal_exclude_tax
        this.subtotalTotal = data.subtotal_total
        // Prevent baseEuTotal from being set to 'undefined'
        // - Fixes bug where check orders show "banktransfer" success page
        if (data.base_grand_total !== undefined) {
          this.baseEuTotal = data.base_grand_total
        }
        this.setCartQtyDriect(qty)
        this.setCartInfo(data)
        if (this.firstLoad && qty === 0) {
          this.$router.replace({ name: 'cart' })
        }
        if (data.bed_terms) {
          this.badTerms = {
            bed_terms: data.bed_terms,
            bed_terms_checkbox: data.bed_terms_checkbox,
            bed_terms_title: data.bed_terms_title
          }
        }
        if (this.isSameasShip) {
          this.checkCheckmo(this.currentCountry.country)
        } else {
          this.checkCheckmo(this.currentCountry.billingCountry)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    getAddressList () {
      let formdata = {}
      listAddress(formdata).then(data => {
        if (data.address_list && data.address_list.length > 0) {
          let addressesList = []
          let billingAddressesList = []
          for (let index = 0; index < data.address_list.length; index++) {
            const element = data.address_list[index]
            console.log('getAddressList 0', element)
            if (element.default_shipping) {
              addressesList.splice(0, 0, element)
              billingAddressesList.push(element)
            } else if (element.default_billing) {
              addressesList.push(element)
              billingAddressesList.splice(0, 0, element)
            } else {
              addressesList.push(element)
              billingAddressesList.push(element)
            }
          }
          this.addresses = addressesList
          this.billingAddresses = billingAddressesList
          console.log('getAddressList', data)
        } else {
          console.log('getAddressList empty list')
          if (this.cart.default_country && this.cart.default_country !== '') {
            if (this.$q.sessionStorage.has('shippingCountry')) {
              let shippingCountry = this.$q.sessionStorage.getItem('shippingCountry')
              this.addressEdit.country_id = shippingCountry
            } else {
              this.addressEdit.country_id = this.cart.default_country
            }
            if (this.$q.sessionStorage.has('billingCountry')) {
              let billingCountry = this.$q.sessionStorage.getItem('billingCountry')
              this.billingAddressEdit.country_id = billingCountry
            } else {
              this.billingAddressEdit.country_id = this.cart.default_country
            }
          }
        }
        this.userAddressListloader = true
      }).catch(e => {
        console.log(e)
      })
    },
    addNewBillingAddressForm () {
      this.isShowNewBillingAddressForm = !this.isShowNewBillingAddressForm
    },
    showNewAddressForm () {
      this.isShowNewAddressForm = true
    },
    showAddressSelector () {
      this.isShowNewAddressForm = false
    },
    saveCurrentAddress (address) {
      createAddress(address).then(data => {
        console.log('saveCurrentAddress', data)
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
        // console.log('Select address book ')
        return true
      } else {
        // console.log('Verify input address ')
        // return this.$refs.address.checkForm()
        if (!this.isSameasShip) {
          let newShippingAddressValidated = false
          let newBillingAddressValidated = false
          if (this.isShowNewAddressForm) {
            this.$refs.address.checkForm()
            newShippingAddressValidated = this.$refs.address.checkForm()
          } else {
            newShippingAddressValidated = true
          }
          if (this.isShowNewBillingAddressForm) {
            this.$refs.billingAddress.checkForm()
            newBillingAddressValidated = this.$refs.billingAddress.checkForm()
          } else {
            newBillingAddressValidated = true
          }
          return newBillingAddressValidated && newShippingAddressValidated
        } else {
          return this.$refs.address.checkForm()
          // return this.$refs.billingAddress.checkForm()
        }
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
        console.log('saveInputs', this.$refs.billingAddress)
        if (this.$refs.billingAddress && this.$refs.billingAddress.address) {
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
          this.$q.sessionStorage.set('checkoutBillingAddress', Object.assign(address, this.$refs.billingAddress.address))
        }
        // if (this.$refs.invoice) {
        //     fapiao_type: '',
        //     fapiao_title: '',
        //     tax_code: '',
        //     address: '',
        //     phone: '',
        //     bank: '',
        //     account: '',
        //     isSameasShip: true
        //   }
        //   if (this.$refs.invoice.panel === 'e-invoice') {
        //     invoice.fapiao_type = '0'
        //     if (this.$refs.invoice.epanel === 'business') {
        //       invoice.fapiao_title = this.$refs.invoice.normal.title
        //       invoice.tax_code = this.$refs.invoice.normal.uscc
        //     }
        //   } else if (this.$refs.invoice.panel === 'vat-invoice') {
        //     invoice.fapiao_type = '1'
        //     invoice.fapiao_title = this.$refs.invoice.vat.businessName
        //     invoice.tax_code = this.$refs.invoice.vat.taxId
        //     invoice.address = this.$refs.invoice.vat.registeredAddress
        //     invoice.phone = this.$refs.invoice.vat.registeredPhone
        //     invoice.bank = this.$refs.invoice.vat.bankName
        //     invoice.account = this.$refs.invoice.vat.bankAccount
        //   }
        //   if (!this.$refs.invoice.isSameasShip) {
        //     invoice.isSameasShip = false
        //     invoice.billingAddress = this.billingAddress
        //   }
        //   this.$q.sessionStorage.set('checkoutInvoice', invoice)
        // }
      }
    },
    gaEcommerce () {
      let orderInfo = {
        id: this.orderId,
        affiliation: '',
        revenue: formatPrice(this.totalExclTax, this.lang),
        shipping: formatPrice(this.shippingFeeFinal, this.lang),
        tax: formatPrice(this.tax, this.lang),
        currency: this.orderCurrency
      }
      let items = []
      this.checkoutItems.forEach(item => {
        items.push({
          id: this.orderId,
          name: item.name,
          sku: item.sku,
          market_price: formatPrice(item.market_price, this.lang),
          category: '',
          price: formatPrice(item.price, this.lang),
          quantity: item.qty,
          currency: this.orderCurrency
        })
      })
      if (this.paymentMethod === 'ingenico_cc') {
        this.$q.sessionStorage.set('gaOrderInfo cc', orderInfo)
        this.$q.sessionStorage.set('gaOrderItems cc', items)
      } else {
        console.log('gaOrderInfo not-cc', orderInfo)
        console.log('gaOrderItems not-cc', items)
        ecommerceOrder(orderInfo, items)
      }
    },
    showBadTerms: function () {
      console.log('showBadTerms')
      this.isShowBadTerms = !this.isShowBadTerms
    }
  },
  created () {
    if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
      this.isLogin = true
      this.getAddressList()
    } else {
      this.isLogin = false
    }
    if (this.$q.sessionStorage.has('checkoutBillingAddress')) {
      this.billingAddressEdit = Object.assign({}, this.$q.sessionStorage.getItem('checkoutBillingAddress'))
      // if (!this.billingAddressEdit.country_id) {
      //   this.country = this.billingAddressEdit.country_id
      //   this.getCartQty()
      // }
    }
    if (this.$q.sessionStorage.has('checkoutAddress')) {
      this.addressEdit = Object.assign({}, this.$q.sessionStorage.getItem('checkoutAddress'))
      if (!this.addressEdit.country_id) {
        this.country = this.addressEdit.country_id
      }
      this.getCartQty()
    } else {
      this.getCartQty()
    }
  },
  mounted () {
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
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pgcheckout')
    } catch { }
  },
  beforeRouteLeave (to, from, next) {
    console.log('beforeRouteLeave', to)
    this.saveInputs()
    next()
  }
}
</script>

<style lang="scss" scoped>
.h2-content {
  padding: 3%;
  background: $white;
  margin: 0 0 1em;
  border: 1px solid $borderColor;
}
.address-form {
  @media screen and (min-width: 660px) {
    padding-top: 20px;
  }
  &.same-as-ship {
    padding-top: 20px;
  }
}
.checkout {
  max-width: 1630px;
  margin: auto;
  position: relative;
  padding: 0 3% 3% 3%;
  line-height: 1.1em;
  h1 {
    padding: 2% 0;
    margin: 0;
  }
}
.action {
  padding: 25px 0;
  display: flex;
  justify-content: flex-end;
  z-index: 998;
}
.shipping-desc {
  font-size: 12px;
  color: rgba(0,0,0,0.54);
}
.shipping-method {
  font-size: 16px;
}
.moreoption {
  margin-left: 0;
}
.link {
  text-decoration: underline;
  cursor: pointer;
}
.close-terms {
  color: $white;
  background: $black;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
}
.bed-terms-wrapper {
  width: 600px;
  min-height: 300px;
  position: relative;
  overflow: hidden;
}
.bad-terms-confirm,
.bad-terms-confirm .q-card__actions,
.bad-terms-text {
  max-height: calc(100vh - 108px);
}
.bad-terms-confirm {
  .q-card__actions {
    padding: 0;
  }
  .bad-terms-text {
    overflow: auto;
  }
}
.accept-terms {
  padding: 15px;
  background: #fff;
  border: 1px dotted #999;
  margin: 15px 0 0 0;
  clear: both;
  span {
    display: inline-block;
  }
}
@media screen and (max-width: 768px) {
  .checkout {
    h1 {
      font-size: 1.5em;
      letter-spacing: 0;
      padding: 20px 0 20px 2%;
    }
  }
}
@media screen and (max-width: 599px) {
  .checkout {
    padding: 0;
    .login {
      font-size: 14px;
      padding: 15px;
    }
    .content {
      margin: 0;
      & > div {
        padding: 0 10px;
      }
    }
    h2 {
      font-size: 16px;
      font-weight: normal;
    }
    .payment-label {
      font-size: 14px;
    }
    .item-th-line {
      font-size: 14px;
    }
    .item-line {
      font-size: 14px;
    }
  }
  .p-footer {
    z-index: 9999;
  }
  h2 {
    font-size: 16px;
    font-weight: normal;
  }
}
</style>

<style lang="scss">
@import "~src/css/layouts/checkoutPageHeader";
.pgcheckout {
  .content {
    // fixes bug with footer bar
    z-index: 1;
  }
  .main-nav {
    display: none;
  }
  .right-icon-wrapper  {
    @media screen and (max-width: 660px) {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    #shop-cart {
      @media screen and (max-width: 660px) {
        right: 0px;
      }
    }
  }
  // Copied from checkoutPage.scss partial, since we use different checkout CSS for EU
  // Hide Header Options
  .header-checkout .search-input,
  .header-checkout .action-block,
  .header-checkout .menu {
    display: none !important;
  }
  footer {
    @media screen and ($bp-660) {
      margin-bottom: 100px;
    }
  }
}
.checkout {
  h2 {
    padding: 2% 4%;
    background: rgba($borderColor, .5);
    margin-bottom: 0;
    font-size: 1em;
    font-family: $typography-main-heading;
    line-height: normal;
  }
  .title {
    width: auto;
  }
}
.mattressTerms {
  margin: 35px;
  li {
    margin: 0 35px 0.5em 0;
  }
}
</style>
