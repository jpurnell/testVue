<template>
  <q-page class="order-detail">
    <div class="account-page clearfix" v-if="detail.order_increment_id">
      <account-block :title="orderDetail" :is-show-back="true"></account-block>
      <div class="row details-container">
        <div class="col-12 col-lg-8 detail-left">
          <div class="row item-th-line gt-xs">
            <div class="col-7 col-sm-6">{{ itemDescription }}</div>
            <div class="col-2 col-sm-3 qty">{{ unitPrice }}</div>
            <div class="col-3 col-sm-3 price-value">{{ subTotal }}</div>
          </div>
          <div class="row item-line" v-for="(item, key) in detail.order_items" :key="key">
            <div class="col-12 col-sm-6">
              <div class="row">
                <router-link :to="{name: 'product', params: { p: item.item_url}}" class="gt-sm">
                  <q-img class="img" :ratio="24/17" :src="item.item_image" />
                </router-link>
                <div class="column info">
                  <router-link :to="{name: 'product', params: { p: item.item_url}}">
                    <div class="title">{{ item.item_name.split("|")[0] }}</div>
                    <div class="col sku">{{ item.item_name.split("|")[1] }}</div>
                  </router-link>
                  <!-- <div class="buy-again" @click="buyProductAgain(item.item_sku)"><span>{{ buyAgain }}</span></div> -->
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-3 qty"><span class="label-mob lt-sm">{{ unitPrice }}: </span>{{item.item_price }} <span class="gt-xs">x{{ item.item_qty }}</span></div>
            <div class="col-12 lt-sm qty-mob"><span class="label-mob lt-sm">{{ quantity }}: </span>{{ item.item_qty }}</div>
            <div class="col-12 col-sm-3 price-value">
              <span><span class="label-mob lt-sm">{{ subTotal }}: </span>{{ item.item_row_total }}</span>
              <div class="buy-again" @click="buyProductAgain(item.item_sku)"><span>{{ buyAgain }}</span></div>
            </div>
          </div>
          <div class="line"></div>
          <div class="row total-line">
            <div class="col price-value">{{ subTotalLabel }}</div>
            <div class="price-value">{{ detail.order_subtotal }}</div>
          </div>
          <div class="row total-line" v-if="detail.order_discount_amount && isNotEmpty(detail.order_discount_amount)">
            <div class="col price-value">{{ discountLable }}</div>
            <div class="price-value">{{ detail.order_discount_amount }}</div>
          </div>
          <div class="row total-line" v-if="detail.order_shipping_amount && isNotEmpty(detail.order_shipping_amount)">
            <div class="col price-value">{{ shipping }}</div>
            <div class="price-value">{{ detail.order_shipping_amount }}</div>
          </div>
          <div class="row total-line" v-if="detail.order_shipping_discount && isNotEmpty(detail.order_shipping_discount)">
            <div class="col price-value">{{ shippingDiscountLabel }}</div>
            <div class="price-value">{{ detail.order_shipping_discount }}</div>
          </div>
          <div class="row total-line total-line-total">
            <div class="col price-value">{{ total }}</div>
            <div class="price-value">{{ detail.order_grand_total }}</div>
          </div>
          <div class="action">
            <div class="link-btn" @click="toPay" v-if="isShowPaynow(detail.order_status, detail.order_payment_method)">
              <link-btn :text="paynow"/>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4 detail-right">
          <div class="order-item order-details">
            <div class="title">{{ orderInfo }}</div>
            <div>{{ orderNum }}:&nbsp;{{ detail.order_increment_id }}</div>
            <div><span class="order-date-label">{{ orderDate }}:&nbsp;</span>{{ detail.order_date.replace(",", "").split(" ")[0] }}</div>
            <div>{{ orderStatus }}: {{ i18n(detail.order_status) }}</div>
          </div>
          <div class="line" />
          <div class="order-item">
            <div class="title">{{ shippingInfo }}</div>
            <div class="subtitle">{{ receivePerson }}</div>
            <div class="info">{{ this.shippingName }}</div>
            <div class="info">{{ this.shippingAddress }}</div>
            <div class="info">{{ this.shippingAddressLine2 }}</div>
            <div class="info">{{detail.order_shipping_phone}}</div>
            <div class="subtitle">{{ logisticsTracking }}</div>
            <div class="info">{{ i18n(detail.order_shipping_method) }}</div>
            <div class="info">
              <div v-for="tracking in detail.order_tracking_data" :key="tracking.number">
                <a :href="tracking.query_url" target="_blank" class="external" rel="nofollow">
                  <span class="tracking">{{ logisticsTracking }}</span>
                </a>
              </div>
            </div>
          </div>
          <div class="line"></div>
          <div class="order-item pay-method">
            <div class="title">{{ payMethod }}</div>
            <div class="info">{{ paymentMethod }}</div>
            <div class="info" v-if="detail.order_payment_instruction">
              <div v-html="detail.order_payment_instruction"></div>
            </div>
          </div>
          <div v-if="detail.order_fapiao_data && detail.order_fapiao_data.type">
            <div class="line"></div>
            <div class="order-item">
              <div class="title">{{ fapiaoInfo }}</div>
              <div class="subtitle">{{ invoiceType }}</div>
              <div class="info">
                {{ detail.order_fapiao_data.type === '0' ? eFapiao : vatFapiao }}
                <span style="padding-left: 10px;" v-if="detail.order_fapiao_data.type === '0' && detail.order_fapiao_data.url">
                  <a @click="downloadEInvoice" class="download"> {{download}} </a>
                </span>
              </div>
              <div class="subtitle">{{ businessName }}</div>
              <div class="info">{{ eFapiaoTitle(detail.order_fapiao_data.title) }}</div>
              <div class="subtitle" v-if="detail.order_fapiao_data.taxcode">{{ uscctaxId }}</div>
              <div class="info" v-if="detail.order_fapiao_data.taxcode">{{ detail.order_fapiao_data.taxcode  }}</div>
              <template v-if="detail.order_fapiao_data.type === '1'">
                <div class="item-content">
                  <label class="subtitle">{{ registeredAddress }}:</label>
                  <div class="info">{{ detail.order_fapiao_data.address }}</div>
                </div>
                <div class="item-content">
                  <label class="subtitle">{{ registeredPhone }}:</label>
                  <div class="info">{{ detail.order_fapiao_data.phone }}</div>
                </div>
                <div class="item-content">
                  <label class="subtitle">{{ bankName }}:</label>
                  <div class="info">{{ detail.order_fapiao_data.bank }}</div>
                </div>
                <div class="item-content">
                  <label class="subtitle">{{ bankAccount }}:</label>
                  <div class="info">{{ detail.order_fapiao_data.account }}</div>
                </div>
                <div class="item-content" v-if="detail.order_fapiao_data.shipping">
                  <label class="subtitle">{{ logisticsTracking }}:</label>
                  <div class="info">{{ detail.order_fapiao_data.shipping }}</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
    <paystatus
      ref="paystatus"
      :email="currentEmail"
      :order-id="detail.order_increment_id"
      :order-internal-id="detail.order_id"
      :old-payment-method="currentPaymentMethod"
      :curreny="detail.order_currency"
      :not-watch="true"
      :from-order="true"
    />
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { detailOrder, cancelOrder, getInvoiceUrl } from './../api/api'
import { tid } from './../utils/format'
import { addressCN, countryCN } from './../config/china.address'
import { country } from './../config/europe.address'
import { paymentMethodConfigEU, paymentMethodConfigCN } from './../config/payment.method'
import Accountblock from '../components/AccountBlock'
import confirm from './../components/ui/Confirm'
import linkBtn from './../components/ui/Button2'
import paystatus from './../components/checkout/PayStatus'

export default {
  name: 'orderDetail',
  components: {
    'account-block': Accountblock,
    'link-btn': linkBtn,
    paystatus
  },
  data () {
    return {
      orderId: '',
      detail: {},
      currentPaymentMethod: '',
      metaDescription: '',
      metaKeywords: '',
      shippingName: '',
      shippingCity: '',
      shippingAddress: '',
      billingName: '',
      billingPhone: '',
      billingCity: '',
      billingAddress: ''
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
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
      isEu: state => state.site.isEU
    }),
    title: function () {
      return `${this.$i18n.t('$common.$labels.myOrders')} - ${this.$i18n.t('$common.$labels.myAccount')}`
    },
    orderDetail: function () {
      return this.$i18n.t('$common.$labels.myOrders')
    },
    orderNum: function () {
      return this.$i18n.t('$common.$labels.orderNum')
    },
    orderDate: function () {
      return this.$i18n.t('$common.$labels.orderDate')
    },
    orderAmount: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    payMethod: function () {
      return this.$i18n.t('$common.$labels.payMethod')
    },
    logisticsTracking: function () {
      return this.$i18n.t('$common.$labels.logisticsTracking')
    },
    goodsInfo: function () {
      return this.$i18n.t('$common.$labels.itemDescription')
    },
    goodsAmount: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    discount: function () {
      return this.$i18n.t('$common.$labels.discount')
    },
    shipping: function () {
      return this.$i18n.t('$common.$labels.shipping')
    },
    shippingDiscountLabel: function () {
      return this.$i18n.t('$common.$labels.shippingDiscount')
    },
    invoiceType: function () {
      return this.$i18n.t('$common.$labels.invoiceType')
    },
    registeredAddress: function () {
      return this.$i18n.t('$common.$labels.registeredAddress')
    },
    registeredPhone: function () {
      return this.$i18n.t('$common.$labels.registeredPhone')
    },
    bankName: function () {
      return this.$i18n.t('$common.$labels.bankName')
    },
    bankAccount: function () {
      return this.$i18n.t('$common.$labels.bankAccount')
    },
    businessName: function () {
      return this.$i18n.t('$common.$labels.businessName')
    },
    payments: function () {
      return this.isEu ? paymentMethodConfigEU : paymentMethodConfigCN
    },
    subTotalLabel: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    discountLable: function () {
      return this.$i18n.t('$common.$labels.discount')
    },
    total: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    paynow: function () {
      return this.$i18n.t('$common.$buttons.paynow')
    },
    itemDescription: function () {
      return this.$i18n.t('$common.$labels.itemDescription')
    },
    unitPrice: function () {
      return this.$i18n.t('$common.$labels.price')
    },
    subTotal: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    buyAgain: function () {
      return this.$i18n.t('$common.$buttons.buyAgain')
    },
    shippingInfo: function () {
      return this.$i18n.t('$common.$headings.shipInfo')
    },
    orderInfo: function () {
      return this.$i18n.t('$common.$labels.orderInfo')
    },
    orderStatus: function () {
      return this.$i18n.t('$common.$labels.status')
    },
    receivePerson: function () {
      return this.$i18n.t('$common.$labels.address')
    },
    vatFapiao: function () {
      return this.$i18n.t('$common.$labels.vatFapiao')
    },
    download: function () {
      return this.$i18n.t('$common.$labels.download')
    },
    quantity: function () {
      return this.$i18n.t('$common.$labels.quantity')
    },
    paymentMethod: function () {
      let paymentMethod = ''
      if (this.currentPaymentMethod) {
        this.payments.forEach(o => {
          if (o.value === this.currentPaymentMethod) {
            paymentMethod = o.en
          }
        })
      }
      return this.$i18n.t(paymentMethod)
    },
    currentEmail: function () {
      return this.$q.cookies.has('email') ? decodeURIComponent(this.$q.cookies.get('email')) : ''
    },
    shippingAddressLine2: function () {
      if (this.detail.order_shipping_address) {
        if (this.detail.order_shipping_address.indexOf(',') !== -1) {
          let line = this.detail.order_shipping_address.split(',')
          if (line.length === 5) {
            return `${line[2]}, ${this.initRegion(line[3])}, ${line[4]}`
          } else {
            return this.detail.order_shipping_address
          }
        } else {
          return this.detail.order_shipping_address
        }
      } else {
        return ''
      }
    },
    billingAddressLine2: function () {
      if (this.detail.order_billing_address) {
        if (this.detail.order_billing_address.indexOf(',') !== -1) {
          let line = this.detail.order_billing_address.split(',')
          if (line.length === 5) {
            return `${line[2]} ${this.initRegion(line[3])} ${this.showCountry(line[4])}`
          } else {
            return this.detail.order_billing_address
          }
        } else {
          return this.detail.order_billing_address
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'buyProduct'
      ]
    ),
    initDetail () {
      let formdata = {
        order_id: this.orderId
      }
      if (this.orderId) {
        detailOrder(formdata).then(data => {
          console.log(data)
          this.detail = Object.assign({}, this.detail, data)
          this.currentPaymentMethod = this.detail.order_payment_method
          if (this.detail.order_shipping_address) {
            this.shippingName = this.detail.order_shipping_address.split(',')[0]
            this.shippingCity = this.detail.order_shipping_address.split(',')[2] + this.initRegion(this.detail.order_shipping_address.split(',')[3]) + this.detail.order_shipping_address.split(',')[4]
            this.shippingAddress = this.detail.order_shipping_address.split(',')[1].replace(/\|/gi, ' ')
            this.billingName = this.detail.order_billing_address.split(',')[0]
            this.billingPhone = this.detail.order_billing_phone
            this.billingCity = this.detail.order_billing_address.split(',')[2] + this.initRegion(this.detail.order_billing_address.split(',')[3]) + this.detail.order_billing_address.split(',')[4]
            this.billingAddress = this.detail.order_billing_address.split(',')[1].replace(/\|/gi, ' ')
          }
        }).catch(e => {
          console.log(e)
        })
      }
    },
    cancel () {
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$headings.confirmDelete'),
        message: this.$i18n.t('Would you like to delete ?', { item: '' }),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true
      }).onOk(() => {
        this.cancelConfirm()
      }).onCancel(() => {

      }).onDismiss(() => {

      })
    },
    cancelConfirm () {
      let formdata = {
        order_id: this.orderId
      }
      cancelOrder(formdata).then(data => {
        console.log(data)
        this.initDetail()
      }).catch(e => {
        console.log(e)
      })
    },
    toPay () {
      this.$refs.paystatus.toPay()
    },
    i18n (value) {
      return this.$i18n.t(value)
    },
    initRegion (val) {
      if (val.indexOf(' ') !== -1) {
        let regionZip = val.split(' ')
        if (regionZip.length === 3) {
          return ` ${this.showRegion(regionZip[1])} ${regionZip[2]}`
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
        if (val.indexOf(o.label) !== -1) {
          if (this.lang === 'zh-CN') {
            currentCountry = countryCN[index].label
          } else {
            currentCountry = o.label
          }
        }
      })
      return currentCountry
    },
    showRegion (val) {
      let region = ''
      Object.keys(addressCN).forEach(o => {
        if (o === val) {
          if (this.lang === 'zh-CN') {
            region = addressCN[o].name
          } else {
            region = val
          }
        }
      })
      return region
    },
    buyProductAgain (sku) {
      let formdata = {
        product: [
          {
            product_id: sku,
            qty: '1'
          }
        ]
      }
      this.buyProduct(formdata).then(data => {
        console.log(data)
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: this.$i18n.t('$common.$labels.outStock'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      })
    },
    isNotEmpty (val) {
      const regex = /[1-9]+/g
      return regex.test(val)
    },
    isShowPaynow (status, paymentMethod) {
      return status === 'Pending' && paymentMethod === 'ingenico_cc'
    },
    eFapiaoTitle (val) {
      if (!val) {
        return val
      }
      if (val.toLowerCase() === 'personal') {
        return this.$i18n.t(val)
      } else {
        return val
      }
    },
    downloadEInvoice () {
      let formdata = {
        order_id: this.detail.order_increment_id,
        tid: tid('hah_tmall')
      }
      getInvoiceUrl(formdata).then(data => {
        if (data) {
          let platform = this.$q.platform
          let url = data
          if (platform.is.android || platform.is.ios) {
            window.location.href = url
          } else {
            window.open(url, '_blank')
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.orderId = this.$route.query.oid
    this.initDetail()
  }
}
</script>

<style lang="scss" scoped>
.detail-left {
  padding: 30px 30px 50px 30px;
  @media screen and (#{$bp-1200}) {
    padding-left: 20px;
  }
}
.detail-left {
  .order-head {
    font-size: 16px;
  }
  .img {
    width: 150px;
    margin-right: 20px;
  }
  .info {
    justify-content: space-between;
    padding-right: 10px;
    .sku {
      color: #999;
    }
  }
  .title {
    display: inline-block;
  }
  @media screen and (max-width: 660px) {
    .info {
      width: 100%;
      flex-direction: row;
      padding-right: 0;
    }
    .title {
      font-size: 18px;
    }
    .price-value {
      text-align: left;
    }
    .qty {
      span {
        margin-left: 0;
        color: initial;
        font-size: initial;
      }
      .quantity {
        display: block;
      }
    }
    .label-mob {
      text-transform: capitalize;
    }
    .item-line > div,
    .price-value > span {
      padding-bottom: 5px;
    }
  }
}
.detail-left {
  .total {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .line {
    border-bottom: 1px solid #f1f1f1;
    margin-bottom: 20px;
  }
}
.buy-again {
  display: inline-block;
  font-size: 14px;
  color: $black;
  cursor: pointer;
  span {
    border-bottom: 1px solid #999;
    text-transform: capitalize;
  }
}
.detail-right {
  padding: 30px 2px 50px 20px;
  border-left: 1px solid #f1f1f1;
  @media screen and (#{$bp-960}) {
    padding: 20px;
  }
  .order-item {
      padding-right: 3%;
      .title {
        font-size: 18px;
        text-transform: uppercase;
        font-family: $typography-secondary-heading;
        letter-spacing: 0.2em;
      }
      .subtitle {
        margin: 10px 0 5px 0;
        text-transform: uppercase;
      }
      .info {
        font-size: 14px;
        .tracking {
          border-bottom: 1px solid #000;
          margin-right: 10px;
        }
      }
    }
    .order-item.pay-method .title,
    .order-item.order-details .title {
      margin-bottom: 5px;
    }
    .line {
      border-bottom: 1px solid #f1f1f1;
      margin-top: 20px;
      margin-bottom: 20px;
    }
}
.detail {
  padding: 50px 0;
}
.card {
  margin-bottom: 30px;
}
.id-time {
  display: flex;
  justify-content: space-between;
}
.item-th-line {
  padding: 0 0 15px;
  border-bottom: 1px solid #f1f1f1;
  text-transform: uppercase;
}
.item-line {
  padding: 15px 0;
  font-size: 16px;
  border-bottom: 1px solid #f1f1f1;
}
.qty {
  span {
    color: #999;
    font-size: 16px;
    margin-left: 20px;
  }
}
.price-value {
  text-align: right;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}
.total-line {
  font-size: 16px;
  div {
    &:nth-child(2) {
      width: 140px;
    }
  }
}
.total-line-total {
  font-size: 18px;
}
.action {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  .q-btn {
    margin: 0 10px;
    font-size: 16px;
  }
}
.download {
  cursor: pointer;
}
.details-container {
  max-width: $container-width;
  margin: 0 auto;
  @media screen and (#{$bp-1200}) {
    flex-direction: column-reverse
  }
}
@media screen and (max-width: 850px) {
  .order-date-label {
    display: none;
  }
}
@media screen and (#{$bp-1200}) {
  .id-time {
    font-size: 16px;
    .item-block {
      background: #fff;
      padding: 20px 10px;
      margin-bottom: 10px;
      .row {
        justify-content: space-between;
        align-items: center;
      }
      .head {
        h1 {
          padding: 0;
          font-size: 20px;
        }
        .order-status {
          color: $primary;
        }
        .tracking {
          color: #000;
          font-size: 14px;
          .q-icon {
            margin-right: 5px;
          }
        }
      }
      .item-content {
        color: 999;
        font-size: 14px;
        display: flex;
        label {
          width: 180px;
          display: inline-block;
        }
        span {
          color: #000;
        }
        & > div {
          display: inline-block;
          vertical-align: top;
          flex: 1;
        }
      }
      .taxcode {
        align-items: flex-end;
      }
      a {
        width: 100%;
        .img {
          width: 100px;
        }
        .product-info {
          display: flex;
          .product-title {
            margin: 0 10px;
            flex: 1;
          }
          .title {
            color: #000;
          }
          .sku {
            color: #999;
          }
        }
      }
      .product-btn {
        margin-top: 10px;
        .q-btn {
          margin-left: 10px;
          font-weight: normal;
        }
      }
      .order-total {
        font-size: 16px;
        color: #000;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .fapiao {
        border-bottom: 1px solid #eee;
        .q-item {
          padding: 0;
        }
      }
    }
  }

}
</style>

<style lang="scss">
@media screen and (max-width: 599px) {
  .fapiao {
    .q-item {
      padding: 0;
    }
    .q-card__section {
      padding: 0;
    }
  }
}
</style>
