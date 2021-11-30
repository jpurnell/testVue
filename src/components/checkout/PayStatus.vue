<template>
  <div>
    <q-dialog v-model="isShowPayStatusConfirmPop" persistent>
      <q-card :class="['pay-status-confirm', lang]">
        <q-card-section>
          <div class="pay-status-heading">{{payStatusTitle}} - {{paymentMethodName}}</div>
          <q-btn v-if="fromOrder" unelevated icon="icon-close" color="dark" size="11px" class="close-payment-method" @click="closeConfirm" />
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <div class="pay-status-confirm-content">
            <p>{{payStatusContent}}</p>
            <div v-if="paymentMethod === 'banktransfer'">
              <p>{{bankTransferTips}}</p>
              <p v-html="paymentInstruction" class="bankinfo"></p>
            </div>
            <div v-else>
              <p>{{isPaySuccess}}</p>
              <p class="window-block-tips">{{windowBlockTips}}</p>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="around">
          <link-btn-2 :text="changePaymentLabel" color="black" @click="showPaymentMethod" class="full-width btn" />
          <link-btn-2 :text="paySuccess" @click="toSuccess" class="full-width btn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isShowPayment">
      <q-card :class="['pay-status-confirm', lang]">
        <q-card-section>
          <q-btn flat round dense icon="icon-close" v-close-popup class="close-payment-method" />
          <payment @updatePaymentMethod="updatePaymentMethod" :current-currency="currency" :pop="true" />
        </q-card-section>
        <q-card-actions align="center" class="checkout-sticky-container">
          <link-btn-2 :text="paynow" @click="toPay" class="full-width btn" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { mapState } from 'vuex'
import { getPayUrl } from './../../api/api'
import { paymentMethodConfigEU, paymentMethodConfigCN } from './../../config/payment.method'
import payment from './PaymentMethod'
import linkBtn2 from './../../components/ui/Button2'

export default {
  components: {
    payment,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      isPay: false,
      isWechatPayNative: false,
      wechatPayQRcode: '',
      isShowPayment: false,
      currentPaymentMethod: '',
      second: 0,
      qrCodeloader: false,
      isShowPayStatusConfirmPop: false,
      wechatParams: {}
    }
  },
  props: {
    orderId: {
      type: String,
      default: ''
    },
    orderInternalId: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    oldPaymentMethod: {
      type: String,
      default: ''
    },
    currency: {
      type: String,
      default: ''
    },
    notWatch: {
      type: Boolean,
      default: false
    },
    paymentInstruction: {
      type: String,
      default: ''
    },
    fromOrder: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      isEu: state => state.site.isEU
    }),
    payStatusTitle: function () {
      return this.$i18n.t('$common.$labels.payMethod')
    },
    payStatusContent: function () {
      return this.$i18n.t('$common.$labels.payStatusContent', { orderNumber: this.orderId })
    },
    changePaymentLabel: function () {
      return this.$i18n.t('$common.$buttons.changePayment')
    },
    paySuccess: function () {
      return this.$i18n.t('$common.$buttons.paySuccess')
    },
    isPaySuccess: function () {
      return this.$i18n.t('$common.$validation.isPaySuccess')
    },
    wechatPayQrcodeTitle: function () {
      return this.$i18n.t('wechatPayQrcodeTitle')
    },
    wechatPayQrcodeTips: function () {
      return this.$i18n.t('wechatPayQrcodeTips')
    },
    bankTransferTips: function () {
      return this.$i18n.t('$common.bankTransferTips', { email: this.email })
    },
    windowBlockTips: function () {
      return this.$i18n.t('$common.$validation.windowBlockTips')
    },
    paynow: function () {
      return this.$i18n.t('$common.$buttons.paynow')
    },
    isShowWechatQrcode: function () {
      return this.isPay && this.isWechatPayNative
    },
    isShowPayStatusConfirm: function () {
      return this.isPay && !this.isShowWechatQrcode
    },
    paymentMethod: function () {
      return this.currentPaymentMethod || this.oldPaymentMethod
    },
    paymentMethodName: function () {
      let payMethodConfig = this.isEu ? paymentMethodConfigEU : paymentMethodConfigCN
      let current = payMethodConfig.filter(a => {
        return a.value === this.paymentMethod
      })
      if (current.length > 0) {
        return current[0].en
      } else {
        return ''
      }
    },
    platform: function () {
      return this.$q.platform
    }
  },
  watch: {
    orderId: function (newVal, oldVal) {
      console.log('order Id', newVal, oldVal)
      if (!this.notWatch) {
        this.currentPaymentMethod = ''
        if (newVal) {
          this.toPay()
        }
      }
    },
    isShowPayStatusConfirm: function (newVal, oldVal) {
      // this.isShowPayStatusConfirmPop = newVal
    },
    code: function (newVal, oldVal) {
      if (newVal) {
        this.toPay()
      }
    }
  },
  methods: {
    showPaymentMethod () {
      this.isShowPayment = true
      this.isWechatPayNative = false
    },
    updatePaymentMethod (val) {
      this.currentPaymentMethod = val
      this.isWechatPayNative = false
    },
    toPay () {
      let ua = typeof window !== 'undefined' ? window.navigator.userAgent : ''
      if (this.paymentMethod === 'banktransfer') {
        this.isPay = true
        // this.isShowPayment = false
        // this.isShowPayStatusConfirmPop = true
        this.toSuccess()
      } else {
        let paymentMethod = this.paymentMethod
        if (this.paymentMethod === 'wechatpay') {
          if (ua.toLowerCase().indexOf('micromessenger') === -1) {
            if (this.platform.is.android || this.platform.is.ios) {
              paymentMethod = 'wechatpayh5'
            } else {
              paymentMethod = 'wechatpaynative'
            }
          }
        }
        let formdata = {
          order_id: this.orderId,
          payment: paymentMethod,
          lang: this.lang
        }
        if (this.code) {
          formdata.code = this.code
        }
        if (this.wechatParams.appId && this.code) {
          this.wechatPayJS(this.wechatParams)
        } else {
          getPayUrl(formdata).then(data => {
            let toPayUrl = data.redirect_url
            this.isPay = true
            this.isShowPayment = false
            console.log('paystatus go pay', paymentMethod, data)
            if (paymentMethod === 'wechatpaynative') {
              this.createWechatPayQRCode(toPayUrl)
            } else if (paymentMethod === 'wechatpay') {
              if (this.code) {
                let params = {
                  appId: data.redirect_url.appId,
                  timeStamp: data.redirect_url.timeStamp,
                  nonceStr: data.redirect_url.nonceStr,
                  package: data.redirect_url.package,
                  signType: data.redirect_url.signType,
                  paySign: data.redirect_url.paySign
                }
                this.wechatParams = Object.assign({}, params)
                this.wechatPayJS(params)
              } else {
                this.redirectPage(toPayUrl)
              }
            } else if (data.method && data.method.toLocaleLowerCase() === 'post') {
              let params = data.params
              this.postPage(toPayUrl, params)
            } else {
              this.redirectPage(toPayUrl)
            }
          }).catch(error => {
            console.log(error)
          })
        }
      }
    },
    wechatPayJS (params) {
      let _this = this
      if (window.WeixinJSBridge) {
        window.WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          params,
          function (res) {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              _this.$q.notify({
                message: '支付成功',
                position: 'center',
                timeout: '3000',
                classes: 'notify'
              })
            }
          }
        )
      }
    },
    createWechatPayQRCode (url) {
      let _this = this
      var opts = {
        errorCorrectionLevel: 'Q',
        type: 'image/png',
        rendererOpts: {
          quality: 1
        }
      }
      QRCode.toDataURL(url, opts, function (err, url) {
        if (err) throw err
        _this.wechatPayQRcode = url
        _this.qrcodeCountDown()
      })
      this.isWechatPayNative = true
    },
    refreshQRCode () {
      this.toPay()
    },
    qrcodeCountDown () {
      this.second = 7200000
      let countdown = window.setInterval(() => {
        if (this.second === 0) {
          window.clearInterval(countdown)
        } else {
          this.second--
        }
      }, 1000)
    },
    redirectPage (url) {
      // this.isShowPayStatusConfirmPop = true
      this.toSuccess()
      let platform = this.$q.platform
      if (!url || url === '') {
        return false
      }
      try {
        if (platform.is.android || platform.is.ios) {
          // window.location.replace(url)
          window.location.href = url
        } else {
          window.open(url, '_blank')
        }
      } catch { }
    },
    postPage (url, params) {
      console.log('paystatus postpage 0', url, params)
      try {
        let tempForm = document.createElement('form')
        tempForm.action = url
        tempForm.target = '_self'
        tempForm.method = 'post'
        tempForm.style.display = 'none'
        console.log('paystatus postpage 1', url, params)
        for (let item in params) {
          console.log('paystatus postpage 2', item, params[item])
          let opt = document.createElement('textarea')
          opt.name = item
          opt.value = params[item]
          tempForm.appendChild(opt)
        }
        document.body.appendChild(tempForm)
        console.log('paystatus postpage 3', tempForm, url, params)
        tempForm.submit()
      } catch (error) {
      }
    },
    toSuccess () {
      this.$q.sessionStorage.set('createdOrderId', this.orderId)
      this.$q.sessionStorage.set('createdOrderInternalId', this.orderInternalId)
      this.$q.sessionStorage.set('paymentMethod', this.paymentMethod)
      this.$router.replace({ name: 'orderSuccess' })
    },
    closeConfirm () {
      this.isShowPayStatusConfirmPop = false
      this.currentPaymentMethod = ''
      this.$emit('closePayConfirm')
    }
  }
}
</script>

<style lang="scss" scoped>
.pay-status-confirm {
  width: 400px;
  .q-card__section {
    padding: 10px 16px;
  }
  .q-card__actions {
    padding: 16px;
  }
}
.pay-status-heading {
  font-size: 16px;
}
.pay-status-confirm-content {
  padding: 16px;
  p {
    padding: 0;
    margin: 0;
    text-align: left;
    font-size: 14px;
    line-height: 20px;
  }
  .bankinfo {
    padding: 10px 0;
    text-align: left;
  }
  .window-block-tips {
    padding: 10px 0;
    font-size: 12px;
  }
}
.btn {
  padding: 6px 16px;
  margin: 0 0 10px;
}
.close-payment-method {
  position: absolute;
  right: 0;
  top: 0;
}
.wechat-qrcode {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: #fafafa;
}
.qrcode {
  width: 300px;
  height: 300px;
  margin-bottom: 20px;
  position: relative;
}
.refresh-block {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.8);
  position: absolute;
  left: 0;
  top: 0;
}
.site-logo {
  width: 60px;
  height: 60px;
}
.icon-rhrlogo {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
