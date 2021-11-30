<template>
  <q-list bordered separator>
    <q-item
      v-for="(order, index) in orders"
      :key="index"
      class="order-item row"
    >
      <q-card flat class="col-12">
        <q-card-section :horizontal="true">
          <q-card-section class="row product gt-sm col-md-3 col-lg-2">
            <template v-for="(image, index) in order.image">
              <q-img
                v-if="index < 1"
                :key="index"
                class="img"
                contain
                position="0 0"
                :ratio="819/637"
                :src="image.item_image?image.item_image:''"
              />
            </template>
          </q-card-section>
          <q-card-section class="DateTime col-12 col-sm-6 col-md-4 col-lg-5">
            <span><span>{{ orderDate }}: </span>{{order.order_date.replace(",", "").split(" ")[0]}}</span>
            <span>{{ orderAmount }}:  {{order.order_grand_total}}</span>
            <span>{{ orderproductnum(order.total_qty) }}</span>
          </q-card-section>
          <q-card-section class="OrderDetails col-12 col-sm-6 col-md-5">
            <span class="order-num"><span>{{ orderNum }}: </span>{{order.order_increment_id}}</span>
            <span class="order-status"><span>{{ orderStatus }}: </span>{{ i18n(order.order_status) }}</span>
            <router-link class="detail" :to="{name: 'orderDetail', query: { oid: order.order_id}}"><span>{{ orderDetail }}</span></router-link>
            <div class="to-pay" @click="toPay(order.order_increment_id, order.order_id, order.order_payment_method, order.order_currency)" v-if="isShowPaynow(order.order_status, order.order_payment_method)">
              <link-btn-2 :text="paynow"/>
            </div>
            <!-- <div class="to-pay" @click="toBuyAgain(order.order_id)" v-if="isShowBuy(order.order_status)">
              <link-btn-2 :text="buyAgain"/>
            </div> -->
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-item>
  </q-list>
</template>

<script>
import { mapActions } from 'vuex'
import { detailOrder, cancelOrder } from '../../api/api'
import confirm from './../ui/Confirm'
import linkBtn2 from './../ui/Button2'

export default {
  data () {
    return {
      code: '',
      detail: {}
    }
  },
  props: {
    orders: {
      type: Array
    }
  },
  components: {
    'link-btn-2': linkBtn2
  },
  computed: {
    cancelBtn: function () {
      return this.$i18n.t('$common.$buttons.cancel')
    },
    paynow: function () {
      return this.$i18n.t('$common.$buttons.paynow')
    },
    orderEmpty: function () {
      return this.$i18n.t('$common.$validation.orderEmpty')
    },
    orderNo: function () {
      return this.$i18n.t('$common.$labels.orders')
    },
    orderTotal: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    orderNum: function () {
      return this.$i18n.t('$common.$labels.orderNum')
    },
    orderDate: function () {
      return this.$i18n.t('$common.$labels.orderDate')
    },
    orderStatus: function () {
      return this.$i18n.t('$common.$labels.status')
    },
    orderAmount: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    orderDetail: function () {
      return this.$i18n.t('$common.$buttons.seeDetails')
    },
    buyAgain: function () {
      return this.$i18n.t('$common.$buttons.buyAgain')
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'buyProduct'
      ]
    ),
    cancel (orderId) {
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$buttons.cancelOrder'),
        message: this.$i18n.t('$common.$validation.confirmCancelOrder', { item: '' }),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true
      }).onOk(() => {
        this.cancelConfirm(orderId)
      }).onCancel(() => {

      }).onDismiss(() => {

      })
    },
    cancelConfirm (orderId) {
      let formdata = {
        order_id: orderId
      }
      cancelOrder(formdata).then(data => {
        console.log(data)
        // this.getList()
        this.$emit('getOrderList')
      }).catch(e => {
        console.log(e)
      })
    },
    toPay (orderId, orderInternalId, paymentMethod, currency) {
      this.$emit('toPay', orderId, orderInternalId, paymentMethod, currency)
    },
    toBuyAgain (orderId) {
      console.log('tobuyagain', orderId)
      let formdata = {
        order_id: orderId
      }
      this.detail = {}
      if (orderId) {
        detailOrder(formdata).then(data => {
          console.log('tobuyagain detailOrder', data)
          this.detail = Object.assign({}, this.detail, data)
          this.buyProductAgain(data.order_items)
        }).catch(e => {
          console.log(e)
        })
      }
    },
    buyProductAgain (items) {
      let product = []
      for (let index = 0; index < items.length; index++) {
        const element = items[index]
        product.push({
          product_id: element.item_sku,
          qty: element.item_qty
        })
      }
      let formdata = { product }
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
    i18n (value) {
      return this.$i18n.t(value)
    },
    orderproductnum: function (qty) {
      return this.$i18n.t('$common.$labels.orderproductnum', { total_qty: qty })
    },
    isShowPaynow (status, paymentMethod) {
      return status === 'Pending' && paymentMethod === 'ingenico_cc'
    },
    isShowBuy (status) {
      return status === 'Canceled'
    }
  }
}
</script>

<style lang="scss">
// $
.content {
  background: none;
}
.to-pay {
  display: block;
  margin-top: 10px;
  .link-btn-2 {
    display: inline-block;
  }
}

.q-card__section {
  @media screen and (#{$bp-660}) {
    flex-direction: column;
    position: static;
  }
}
.q-card__section {
  & > span {
    display: block;
    line-height: 1.4em;
  }
  .OrderDetails {
    @media screen and (#{$bp-660-min}) {
      text-align: right;
    }
  }
  .detail {
    text-decoration: underline;
  }
  @media screen and (#{$bp-660}) {
    .DateTime,
    .OrderDetails {
      padding: 0;
    }
    .DateTime .order-num,
    .OrderDetails .order-num {
      width: calc(100% - 150px);
    }
    .link-btn-2 {
      width: 100%;
    }
  }
}
</style>
