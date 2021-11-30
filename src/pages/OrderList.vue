<template>
  <q-page class="history">
    <div class="account-page clearfix">
      <account-block cur-tab="tab1" :title="myOrders"></account-block>
      <div class="order faq">
        <h2>{{ myOrders }}</h2>
        <div class="row">
          <div class="col-12" v-if="ready">
            <div v-if="orders.length > 0" class="lists">
              <order-list
                ref="orderlist"
                :orders="orders"
                @getOrderList="getOrderList"
                @toPay="toPay"
              />
            </div>
            <div class="empty" v-else>
              <p>{{ orderEmpty }}</p>
              <router-link class="shopping" :to="{name: 'home'}">
                <link-btn-2 :text="toHome" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <paystatus
      ref="paystatus"
      :email="currentEmail"
      :order-id="currentSelectId"
      :order-internal-id="currentInternalId"
      :old-payment-method="currentPaymentMethod"
      :curreny="currentCurrency"
      :from-order="true"
      @closePayConfirm="closePayConfirm"
    />
  </q-page>
</template>

<script>
import { listOrder } from './../api/api'
import Accountblock from './../components/AccountBlock'
import OrderList from './../components/order/OrderList'
import paystatus from './../components/checkout/PayStatus'
import linkBtn2 from './../components/ui/Button2'

export default {
  name: 'history',
  components: {
    'account-block': Accountblock,
    'order-list': OrderList,
    'link-btn-2': linkBtn2,
    paystatus
  },
  data () {
    return {
      orders: [],
      queryOrderStatus: '',
      status: ['Pending', 'Pending Offline', 'Canceled', 'Complete', 'Processing', 'Shipped', 'Closed'],
      currentSelectId: '',
      currentInternalId: '',
      currentPaymentMethod: '',
      currentCurrency: '',
      metaDescription: '',
      metaKeywords: '',
      ready: false
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
    myOrders: function () {
      return this.$i18n.t('$common.$labels.myOrders')
    },
    title: function () {
      return `${this.$i18n.t('$common.$labels.orders')} - ${this.$i18n.t('$common.$labels.myAccount')}`
    },
    orderEmpty: function () {
      return this.$i18n.t('$common.$validation.orderEmpty')
    },
    toHome: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    },
    currentEmail: function () {
      return this.$q.cookies.has('email') ? decodeURIComponent(this.$q.cookies.get('email')) : ''
    }
  },
  methods: {
    getOrderList () {
      let formdata = {}
      if (this.queryOrderStatus) {
        formdata.order_status = this.queryOrderStatus
      }
      listOrder(formdata).then(data => {
        console.log('orders data', data)
        this.orders = data
        this.ready = true
      }).catch(e => {
        console.log(e)
        this.ready = true
      })
    },
    toPay (orderId, orderInternalId, paymentMethod, currency) {
      console.log(orderId, paymentMethod, currency)
      this.currentSelectId = orderId
      this.currentInternalId = orderInternalId
      this.currentPaymentMethod = paymentMethod
      this.currentCurrency = currency
      // this.$refs.paystatus.toPay()
    },
    closePayConfirm () {
      console.log('close pay confirm')
      this.currentSelectId = ''
      this.currentInternalId = ''
      this.currentPaymentMethod = ''
      this.currentCurrency = ''
    }
  },
  created () {
    this.queryOrderStatus = this.$route.query.type || ''
    this.getOrderList()
  },
  beforeRouteUpdate (to, from, next) {
    this.queryOrderStatus = to.query.type
    this.getOrderList()
    next()
  }
}
</script>

<style lang="scss" scoped>
.lists {
  margin: 20px 0 0;
}
.empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.order-menu-pc {
  height: 60px;
  justify-content: flex-start;
}

@media screen and (#{$bp-660}) {
  .account-page {
    .order {
      max-width: 100%;
      padding: 0 10px;
    }
  }
}
</style>
