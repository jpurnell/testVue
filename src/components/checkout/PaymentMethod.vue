<template>
  <div>
    <h2>{{ paymentHeading }}</h2>
    <div class="h2-content">
      <q-list>
        <q-item tag="label" v-ripple v-for="(payment, index) in paymentList" :key="index" :class="payment.value" v-show="payment.value !== 'checkmo' || ischeckmo">
          <q-item-section avatar>
            <q-radio v-model="paymentMethod" :val="payment.value" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <template v-if="!isEu">
                <q-icon name="fab fa-alipay" color="blue" class="payment-icon" v-if="payment.value.indexOf('alipay') !== -1" />
                <q-icon name="fab fa-weixin" color="green" class="payment-icon" v-if="payment.value.indexOf('wechat') !== -1" />
                <q-icon name="fas fa-money-check" color="black" class="payment-icon"  v-if="payment.value.indexOf('banktransfer') !== -1" />
              </template>
              <template v-if="payment.value.indexOf('useepay') !== -1">
                <q-icon name="img:statics/svg/pay-visa.svg" size="2.5rem" class="payment-icon" />
                <q-icon name="img:statics/svg/pay-mastercard.svg" size="2.5rem" class="payment-icon" />
                <q-icon name="img:statics/svg/pay-jcb.svg" size="1.8rem" class="payment-icon" />
              </template>
              <span class="payment-label">{{ lang === 'zh-CN' ? payment.cn : $i18n.t(payment.en) }}</span>
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { paymentMethodConfigEU, paymentMethodConfigCN } from './../../config/payment.method'
export default {
  data () {
    return {
      paymentMethod: 'banktransfer'
    }
  },
  props: {
    currentCurreny: {
      type: String,
      default: ''
    },
    pop: {
      type: Boolean,
      default: false
    },
    country: {
      type: String,
      default: 'EN'
    },
    ischeckmo: {
      Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      currency: state => state.lang.currency,
      isEu: state => state.site.isEU
    }),
    payments: function () {
      return this.isEu ? paymentMethodConfigEU : paymentMethodConfigCN
    },
    paymentHeading: function () {
      return this.$i18n.t('$common.$labels.payMethod')
    },
    paymentMethodDefault: function () {
      if (this.isEu) {
        return 'banktransfer'
      } else {
        let platform = this.info
        if (platform.is.android || platform.is.ios) {
          let ua = typeof window !== 'undefined' ? window.navigator.userAgent : ''
          if (ua.toLowerCase().indexOf('micromessenger') !== -1) {
            return 'wechatpay'
          } else {
            return 'alipaymobile'
          }
        } else {
          return 'alipaypayment'
        }
      }
    },
    paymentList: function () {
      return this.ieEu ? this.payments : this.paymentListCN
    },
    paymentListCN: function () {
      let platform = this.info
      let currency = this.currentCurreny || this.currency
      if (platform.is.android || platform.is.ios) {
        return this.payments.filter(o => {
          let ua = typeof window !== 'undefined' ? window.navigator.userAgent : ''
          if (ua.toLowerCase().indexOf('micromessenger') !== -1) {
            if (this.pop) {
              return o.mobile && o.value !== 'alipaymobile' && o.value !== 'wechatpayh5' && o.value !== 'banktransfer' && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1
            } else {
              return o.mobile && o.value !== 'alipaymobile' && o.value !== 'wechatpayh5' && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1
            }
          } else {
            if (this.pop) {
              return o.mobile && o.value !== 'wechatpay' && o.value !== 'banktransfer' && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1
            } else {
              return o.mobile && o.value !== 'wechatpay' && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1
            }
          }
        })
      } else {
        return this.payments.filter(o => {
          if (this.pop) {
            return o.pc && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1 && o.value !== 'banktransfer'
          } else {
            if (this.country === 'CN' && currency !== 'CNY') {
              return o.pc && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1 && o.value !== 'banktransfer'
            } else {
              return o.pc && (o.lang === this.lang || o.lang === 'all') && o.currency.indexOf(currency) !== -1
            }
          }
        })
      }
    },
    info: function () {
      return this.$q.platform
    }
  },
  watch: {
    paymentMethod: function (newValue, oldValue) {
      this.$emit('updatePaymentMethod', newValue)
    },
    ischeckmo: function (newValue, oldValue) {
      if (!newValue) {
        this.paymentMethod = this.paymentMethodDefault
      }
    }
  },
  created () {
    this.paymentMethod = this.paymentMethodDefault
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
.payment-icon {
  font-size: 1.8rem;
  margin: 0 10px 0 0;
}
.payment-label {
  font-size: 16px;
}
.q-item {
  padding: 0;
}
</style>
