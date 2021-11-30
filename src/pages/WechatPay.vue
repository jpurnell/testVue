<template>
  <div>
    <paystatus
      ref="paystatus"
      :code="code"
      :order-id="orderId"
      :order-internal-id="orderInternalId"
      :old-payment-method="paymentMethod"
      :currency="orderCurrency"
      v-if="code"
    />
  </div>
</template>

<script>
import paystatus from './../components/checkout/PayStatus'
export default {
  components: {
    paystatus
  },
  data () {
    return {
      orderId: '',
      orderInternalId: '',
      code: '',
      paymentMethod: 'wechatpay',
      orderCurrency: ''
    }
  },
  mounted () {
    this.orderId = this.$q.sessionStorage.getItem('createdOrderId') || ''
    this.orderInternalId = this.$q.sessionStorage.getItem('createdOrderInternalId') || ''
    this.orderCurrency = this.$q.sessionStorage.getItem('orderCurrency') || ''
    this.code = this.$route.query.code || ''
    console.log(this.code)
    this.$nextTick(() => {
      console.log(this.$refs)
      this.$refs.paystatus.toPay()
    })
  }
}
</script>

<style lang="scss" scoped>
</style>
