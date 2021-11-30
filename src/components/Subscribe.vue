<template>
  <div>
    <template v-if="!isPopup">
      <div class="email-signup">
        <div id="ftr-email-signup2" class="subscribe clearfix" v-show="!submitSuccess">
          <h4 :class="['slogan', currentLang]" v-if="!isPopup">{{slogan}}</h4>
          <p>
            <label class="hidden" for="newsletterSubscribeFooter">{{emailSubscription}}</label>
            <input
              type="email"
              v-model="email"
              :placeholder="inputPlaceholder"
              v-on:keydown.13.prevent="submit"
              autocomplete="email"
              name="newsletterSubscribeFooter"
              id="newsletterSubscribeFooter"
            />
            <button v-if="!isPopup" id="emailAddress2btn" type="button" class="btn-main" @click="submit">{{btnText}}</button>
          </p>
        </div>
        <div v-show="!submitSuccess" class="disclaimer" v-html="disclaimer" v-if="isEu" />
        <div class="email-conf" v-show="submitSuccess">
          <h4 :class="[currentLang]" v-html="subscription"></h4>
        </div>
      </div>
    </template>
    <template v-if="isPopup">
      <p class="input-wrap">
        <label class="hidden" for="emailAddress1">{{emailSubscription}}</label>
        <input
          type="email"
          id="emailAddress1"
          class="emailfield"
          v-model="email"
          :placeholder="inputPlaceholder"
          v-on:keydown.13.prevent="submit"
          autocomplete="email"
          name="emailAddress1"
        />
        <input id="emailAddress1btn" type="button" :value="btnText" class="btn-main" @click="submit">
      </p>
      <p class="disclosure clear" v-html="disclaimer" v-if="isEu"></p>
      <p class="lb-continue" id="continueBtn" @click="emitClose(false)"><span>{{continueToSite}}</span></p>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { setSubscribe } from '../api/api'
import { checkEmail } from '../utils/validation'
import notify from './../mixins/Notify'
import { eventNewSubscriber } from './../tracking/analytics'
export default {
  name: 'subscribe',
  data () {
    return {
      email: '',
      waitingTips: false,
      submitSuccess: false
    }
  },
  props: {
    isPopup: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      currentLang: state => state.lang.lang,
      isEu: state => state.site.isEU
    }),
    slogan: function () {
      return this.$i18n.t('$local.subscribeFooter')
    },
    continueToSite: function () {
      return this.$i18n.t('$common.$buttons.continueToSite')
    },
    inputPlaceholder: function () {
      return this.$i18n.t('$common.$validation.forgetPWDTips1')
    },
    btnText: function () {
      return this.$i18n.t('$common.$buttons.subscribeBtn')
    },
    subscription: function () {
      return this.$i18n.t('$local.subscriptionSuccess')
    },
    disclaimer: function () {
      return this.$i18n.t('$common.disclaimer', { siteName: this.$i18n.t('$local.siteName') })
    },
    emailSubscription: function () {
      return this.$i18n.t('$common.$labels.emailSubscription')
    }
  },
  watch: {
    $route: function (newVal, oldVal) {
      this.email = ''
      this.submitSuccess = false
    }
  },
  mixins: [notify],
  methods: {
    submit () {
      if (this.waitingTips) {
        return false
      }
      if (!this.email) {
        let msg = this.$i18n.t('$common.$validation.emailAddressRequired')
        this.msgAlert(msg)
        return false
      }
      if (!checkEmail(this.email)) {
        let msg = this.$i18n.t('$common.$validation.emailErrorTips')
        this.msgAlert(msg)
        return false
      }
      this.waitingTips = true
      let source = this.isPopup ? 'lightbox' : 'footer'
      let formdata = {
        email: this.email,
        source: source
      }
      let msg = this.subscription
      setSubscribe(formdata).then(data => {
        this.sendCallBack(msg, true)
      }).catch(e => {
        // console.log(e)
        if (e === 'This email address is already subscribed.' || e === 'This email address is already assigned to another user.') {
          msg = this.$i18n.t(e)
        }
        this.sendCallBack(msg, false)
      })
    },
    sendCallBack (msg, result) {
      if (!result) {
        this.$q.notify({
          message: msg,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      } else {
        if (!this.isPopup) {
          this.submitSuccess = true
          eventNewSubscriber('footer')
        } else {
          eventNewSubscriber('lightbox')
        }
      }
      this.email = ''
      this.waitingTips = false
      this.emitClose(result)
    },
    emitClose (result) {
      if (this.isPopup) {
        this.$emit('closePop', result)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.disclaimer {
  font-size: .8em;
  padding-top: 0;
  display: block;
  color: $white;
  text-align: center;
  span {
    display: inline-block;
  }
}
.email-conf h4 {
  text-align: center;
  padding: 0;
}
</style>
