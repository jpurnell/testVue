<template>
  <div>
    <div class="more-menu-panel" v-show="true">
      <div class="close-btn-container">
      </div>
      <div class="content" scroll>
        <template v-if="isLogin">
          <div class="line line-islogin">
            <q-icon name="icon-user" />
            <div>
              <h4>{{toAccount}}</h4>
              <p>{{allName}}</p>
            </div>
          </div>
          <ul class="user-menu">
            <li @click="closePanel">
              <router-link :to="{name: 'orderList'}" class="account_li">{{ allOrders }}</router-link>
            </li>
            <li @click="closePanel">
              <router-link :to="{name: 'wishlist'}" class="account_li">{{ likeList }}</router-link>
            </li>
            <li @click="closePanel">
              <router-link :to="{name: 'edit'}" class="account_li">{{ accountSet }}</router-link>
            </li>
            <li @click="closePanel">
              <router-link :to="{name: 'addressList'}" class="account_li">{{ addressManage }}</router-link>
            </li>
            <li @click="closePanel">
              <router-link :to="{name: 'logout'}"><span class="logout">{{ loginOut }}</span></router-link>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="line account-line" @click="toggleAccountMenu">
            <q-icon name="icon-user" />
            <div>
              <h4>{{toAccount}}</h4>
            </div>
          </div>
          <ul @click="toggleAccountMenu">
            <li>{{toLogin}}</li>
          </ul>
        </template>
        <div class="line language-line" @click="toggleLangMenu">
          <q-icon name="icon-location" />
          <div>
            <h4 class="lang-currency-heading">{{languageSelection}}</h4>
          </div>
        </div>
        <ul @click="toggleLangMenu">
          <li>{{langCurrentSelector}}<span>{{currentLang}}</span></li>
        </ul>
        <template v-if="!isEu">
          <div class="line currency-line" @click="toggleCurrency">
            <q-icon :name="currencyCurrentIcon" />
            <div>
              <h4 class="lang-currency-heading">{{currencySelection}}</h4>
            </div>
          </div>
          <ul @click="toggleCurrency">
            <li>{{currencyCurrentSelector}}</li>
          </ul>
        </template>
        <!-- <account :switch-account="isShowAccount" :has-close="true" @hideAccount="hideAccount" @hasLogin="loginSuccess" /> -->
        <!-- <lang-switch :is-show="isShowLang" :has-close="true" @hideLang="hideLang" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import langswitch from './LangSwitchM'
// import account from './AccountForm'
export default {
  components: {
    // 'lang-switch': langswitch,
    // account
  },
  data () {
    return {
      currencyIcon: {
        EUR: 'icon-eur',
        GBP: 'icon-gbp',
        CHF: 'icon-chf',
        RON: 'icon-ron',
        PLN: 'icon-pln',
        SEK: 'icon-sek',
        CZK: 'icon-czk',
        DKK: 'icon-dkk',
        AED: 'icon-aed',
        CNY: 'icon-cny', // needs to be created & added to iconset
        JPY: 'icon-cny', // needs to be created & added to iconset
        AUD: 'icon-dollar',
        USD: 'icon-dollar',
        HKD: 'icon-dollar',
        SGD: 'icon-dollar',
        KRW: 'icon-krw' // needs to be created & added to iconset
      },
      isShowAccount: false,
      isShowLang: false,
      isShowCurrency: false,
      isLogin: false
    }
  },
  props: {
    screenWidth: {
      type: Number,
      default: 1023
    },
    isShow: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  computed: {
    ...mapState({
      currentLang: state => state.lang.lang,
      currentCurrency: state => state.lang.currency,
      needShowLogin: state => state.site.needShowLogin,
      hasLoginSuccess: state => state.site.hasLoginSuccess,
      isEu: state => state.site.isEU
    }),
    toLogin: function () {
      return this.$i18n.t('$common.$headings.loginHeading')
    },
    toAccount: function () {
      return this.$i18n.t('$common.$labels.myAccount')
    },
    languageSelection: function () {
      return this.$i18n.t('$common.$headings.languageSelection')
    },
    currencySelection: function () {
      return this.$i18n.t('$common.$labels.currencySelection')
    },
    selected: function () {
      return this.$i18n.t('$common.$labels.selected')
    },
    langCurrentSelector () {
      // let lang = this.currentLang
      return `${this.selected}: `
    },
    currencyCurrentSelector () {
      return `${this.selected}: ${this.currentCurrency}`
    },
    currencyCurrentIcon () {
      return this.currencyIcon[this.currentCurrency] || this.currencyIcon['EUR']
    },
    firstName: function () {
      return this.$q.cookies.get('firstname') || ''
    },
    lastName: function () {
      return this.$q.cookies.get('lastname') || ''
    },
    allName: function () {
      let firstName = this.firstName
      if (firstName === '*') {
        firstName = ''
      }
      let lastName = this.lastName
      if (lastName === '**') {
        lastName = ''
      }
      return firstName + ' ' + lastName
    },
    allOrders: function () {
      return this.$i18n.t('$common.$labels.orders')
    },
    likeList: function () {
      return this.$i18n.t('$common.$labels.wishlist')
    },
    accountSet: function () {
      return this.$i18n.t('$common.$headings.settings')
    },
    addressManage: function () {
      return this.$i18n.t('$common.$labels.addresses')
    },
    loginOut: function () {
      return this.$i18n.t('$common.$buttons.logOut')
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setNeedShowLogin',
        'setHasLoginSuccess'
      ]
    ),
    checkLogin () {
      this.isLogin = parseInt(this.$q.cookies.get('isLogin'), 10) === 1 || false
    },
    toggleAccountMenu () {
      this.$emit('toggleAccountMenu', false)
    },
    showLang () {
      this.isShowLang = true
    },
    toggleCurrency () {
      this.$emit('toggleCurrency', false)
    },
    loginSuccess () {
      this.hideAccount()
      this.isLogin = true
      this.setHasLoginSuccess(true)
      this.$emit('hideRightDrawer')
    },
    hideAccount () {
      this.isShowAccount = false
    },
    hideLang () {
      this.isShowLang = false
    },
    closePanel () {
      this.$emit('scrollControl', false)
      this.$emit('hideRightDrawer')
    },
    toggleLangMenu () {
      this.$emit('toggleLangMenu', false)
    }
  },
  watch: {
    isShow: function (newVal, oldVal) {
      this.checkLogin()
    },
    // needShowLogin: function (newVal, oldVal) {
    //   if (newVal && this.screenWidth < 600) {
    //     this.isShowAccount = true
    //   }
    // },
    isShowAccount: function (newVal, oldVal) {
      if (!newVal) {
        this.setNeedShowLogin(false)
      }
    },
    screenWidth: function (newVal, oldVal) {
      if (newVal > 1024) {
        this.isShowAccount = false
        this.isShowLang = false
        this.isShowCurrency = false
        this.closePanel()
      }
    },
    hasLoginSuccess: function (newVal, oldVal) {
      if (newVal) {
        this.isLogin = newVal
      }
    }
    // needShowLogin: function (newVal, oldVal) {
    //   if (newVal === true) {
    //     // this.isLogin = true
    //   }
    // }
  },
  created () {
    this.checkLogin()
  }
}
</script>
