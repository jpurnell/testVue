<template>
  <div class="pay-error">
    <div class="pay-error-content">
      <div>
        <h1>{{ payErrorHeading }}</h1>
        <p>{{ payErrorTips }}</p>
      </div>
      <div class="link">
        <link-btn-2 :text="paynow" @click="toPay" />
        <router-link class="shopping" :to="{name: 'home'}">
          <link-btn-2 :text="toHome" color="black" />
        </router-link>
      </div>
    </div>
    <paystatus
      ref="paystatus"
      :email="email"
      :order-id="orderId"
      :order-internal-id="orderInternalId"
      :old-payment-method="currentPaymentMethod"
      :curreny="orderCurrency"
      :not-watch="true"
      :from-order="true"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import paystatus from './../components/checkout/PayStatus'
import linkBtn2 from './../components/ui/Button2'
export default {
  components: {
    paystatus,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      orderId: '',
      orderInternalId: '',
      email: '',
      currentPaymentMethod: '',
      orderCurrency: '',
      metaDescription: '',
      metaKeywords: ''
    }
  },
  meta () {
    return {
      // sets document title
      title: this.payErrorHeading,
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
      hasLoginSuccess: state => state.site.hasLoginSuccess
    }),
    payErrorHeading: function () {
      return this.$i18n.t('$common.$validation.payErrorHeading')
    },
    payErrorTips: function () {
      return this.$i18n.t('$common.$validation.payErrorTips')
    },
    paynow: function () {
      return this.$i18n.t('$common.$buttons.paynow')
    },
    toHome: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    }
  },
  methods: {
    toPay () {
      this.$refs.paystatus.toPay()
    }
  },
  mounted () {
    this.orderId = this.$q.sessionStorage.getItem('createdOrderId') || ''
    this.orderInternalId = this.$q.sessionStorage.getItem('createdOrderInternalId') || ''
    this.email = this.$q.sessionStorage.getItem('createdOrderEmail') || ''
    this.currentPaymentMethod = this.$q.sessionStorage.getItem('paymentMethod') || ''
    this.orderCurrency = this.$q.sessionStorage.getItem('orderCurrency') || ''
    if (this.orderId && this.orderInternalId && this.email && this.currentPaymentMethod && this.orderCurrency) {
      console.log('pay again')
    } else {
      this.$router.replace({ name: 'home' })
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-error {
  max-width: 1440px;
  margin: 0 auto;
  padding: 4% 5% 72px;
  h1 {
    font-size: 50px;
    line-height: 47.6px;
    letter-spacing: 0.5px;
    margin: 0 0 0.5em;
    padding: 0;
    text-transform: uppercase;
  }
  p {
    font-size: 0.875em;
    line-height: 1.857em;
    margin-bottom: 1em;
  }
}
.pay-error-content {
  min-height: 300px;
}
.link {
  display: flex;
  justify-content: flex-start;
  a {
    display: block;
    margin-left: 50px;
  }
}
@media screen and (max-width: 660px) {
  .pay-error {
    padding-top: 5%;
    padding-bottom: 122px;
    h1 {
      font-size: 34px;
      line-height: 30px;
      letter-spacing: 0.1px;
    }
  }
  .pay-error-content {
    padding: 3% 5% 0;
  }
}
@media screen and (max-width: 599px) {
  .link {
    flex-direction: column;
    a {
      margin-left: 0;
    }
    .link-btn-2 {
      margin: 0 0 10px;
    }
  }
}
</style>
