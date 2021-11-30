<template>
  <div class="footer-links">
    <div class="support">
      <div class="clearfix">
        <a :href="phoneTo" class="icon-phone">
          <span>{{ tel400 }}</span>
        </a>
        <router-link class="icon-email" :to="{name: 'help', params: { note: 'contact-us'}}">
          <span>{{ email }}</span>
        </router-link>
        <a @click="openOnlineService" class="icon-chat cursor-pointer">
          <span>{{ onlineService }}</span>
        </a>
        <router-link :to="{name: 'help', params: { note: 'faq'}}" class="icon-faq">
          <span>{{ faqs }}</span>
        </router-link>
        <span v-if="!isEu" @click="showQRcode" class="icon-qrcode">
          <span class="wechat" >
            <span class="qrcode">
              <q-img :src="qrcode" :alt="wechat" spinner-color="white" ratio="1" />
            </span>
          </span>
        </span>
      </div>
    </div>
    <recaptchaScript v-if="isEu"/>
    <q-dialog v-model="isShowQRcode" v-if="!isEu">
      <q-card class="popup-qrcode">
        <q-card-section>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section>
          <img :src="qrcode" :alt="wechat" class="qrcode-img" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <moor7 v-if="!isEu" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import config from './../../config/index'
import { defaultLang } from './../../config/browser.lang'
import recaptchaScript from './../help/RecaptchaScript'
import moor7 from './moor7'
export default {
  data () {
    return {
      isShowSendEmail: false,
      isShowQRcode: false,
      qrcode: require('./../../assets/img/qrcode-wechat.jpg')
    }
  },
  components: {
    moor7,
    recaptchaScript
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      isEu: state => state.site.isEU
    }),
    tel400: function () {
      return this.$i18n.t('$local.tel400')
    },
    phoneTo: function () {
      let tel = config[this.lang].tel || config[defaultLang].tel
      if (this.lang === 'zh-CN') {
        tel = config['zh-CN'].tel
      }
      return `tel:${tel}`
    },
    email: function () {
      return this.$i18n.t('$common.$labels.email')
    },
    onlineService: function () {
      return this.$i18n.t('$common.$labels.chatNow')
    },
    faqs: function () {
      return this.$i18n.t('$common.$labels.faqFooter')
    },
    privacy: function () {
      return this.$i18n.t('$common.$labels.privacyPolicy')
    },
    shippingUrl: function () {
      if (this.isEu) {
        return this.$i18n.t('$common.$urls.shipping')
      } else {
        return this.$i18n.t('$common.$urls.shippingCN')
      }
    },
    chatUrl: function () {
      if (this.isEu) {
        let chatId = config[this.lang].chatId || config[defaultLang].chatId
        return `https://lc.chat/now/2110591/${chatId}`
      } else {
        return ''
      }
    },
    privacyUrl: function () {
      return this.$i18n.t('$common.$urls.privacy')
    },
    termsOfUse: function () {
      return this.$i18n.t('$common.$labels.termsOfUse')
    },
    termsUrl: function () {
      return this.$i18n.t('$common.$urls.terms')
    },
    wechat: function () {
      return this.$i18n.t('$common.$labels.wechat')
    }
  },
  methods: {
    showQRcode () {
      this.isShowQRcode = true
    },
    openOnlineService () {
      if (this.isEu && typeof window !== 'undefined') {
        window.open(this.chatUrl, 'targetWindow', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=500')
      } else if (typeof window !== 'undefined') {
        if (window.qimoChatClick) {
          window.qimoChatClick()
        }
      }
    },
    init7moor () {
      if (typeof window !== 'undefined') {
        if (window.m7InitConfigure) {
          window.m7InitConfigure.getInitJsData()
          window.m7InitConfigure.init()
        }
      }
    }
  },
  updated () {
    if (!this.isEu) {
      this.init7moor()
    }
  },
  mounted () {
    if (!this.isEu) {
      this.init7moor()
    }
  }
}
</script>
