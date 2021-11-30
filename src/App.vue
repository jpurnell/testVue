<template>
  <div ref="myapp" id="q-app" :class="lang">
    <q-resize-observer @resize="onResize" />
    <router-view />
    <!-- Disable Email sign-up, per MO Brand request -->
    <!-- <q-dialog no-route-dismiss v-model="firstVisit" class="first-visit-popup" id="firstVisitPopup" @hide="changeFirstVisit">
      <div class="emailCapture first-visit-card">
        <div class="signup-wrap">
          <a v-close-popup class="icon-close" @click="changeFirstVisit"><span class="hidden">Close</span></a>
          <div>
            <h2>{{subscribePop}}</h2>
            <p>{{subscribeParagraph}}</p>
            <div class="subscribe-form">
              <subscribe :is-popup="true" @closePop="closePop" />
            </div>
            <p class="subscribe-form">{{disclosure}}</p>
          </div>
        </div>
      </div>
    </q-dialog> -->
    <q-dialog no-route-dismiss v-model="firstConfirm" class="first-visit-popup" id="firstVisitPopup" @hide="changeFirstConfirm">
      <div class="first-pop-confirm">
        <q-card>
          <q-card-section>
            <div class="first-visit-header">
              <a v-close-popup class="first-confirm-close" @click="changeFirstConfirm">X</a>
            </div>
            <div class="first-confirm-header">
              <h3 v-html="subscription"></h3>
            </div>
          </q-card-section>
          <q-card-section>
            <link-btn :text="shopNow" @click="changeFirstConfirm" />
          </q-card-section>
        </q-card>
      </div>
    </q-dialog>
  </div>
</template>

<script>
/* eslint-disable */

/* eslint-enable */
import { dom } from 'quasar'
import { mapState, mapActions } from 'vuex'
import { getSessionId, checkGlobal } from './api/api'
// import Subscribe from './components/Subscribe'
import linkBtn from './components/ui/Button2'
const { width } = dom
const hahIcons = {
  'chevron_right': 'icon-right-arrow',
  'chevron_left': 'icon-right-arrow',
  'arrow_drop_down': 'icon-down',
  'error': 'icon-error',
  'close': 'icon-close',
  'cancel': 'icon-close'
}
export default {
  name: 'App',
  components: {
    // subscribe: Subscribe,
    'link-btn': linkBtn
  },
  data () {
    return {
      firstVisit: false,
      firstConfirm: false,
      isMobileScreen: false
    }
  },
  computed: {
    ...mapState({
      session: state => state.site.session,
      title: state => state.site.title,
      lang: state => state.lang.lang
    }),
    subscribePop: function () {
      return this.$i18n.t('$local.subscribePop')
    },
    subscribeParagraph: function () {
      return this.$i18n.t('$local.subscribeParagraph')
    },
    subscription: function () {
      return this.$i18n.t('$local.subscriptionSuccess')
    },
    shopNow: function () {
      return this.$i18n.t('$common.$buttons.shopNow')
    },
    session: function () {
      return this.$q.cookies.get('PHPSESSID') || ''
    }
  },
  watch: {
    session: function (newVal, oldVal) {
      this.setCartQty()
    },
    $route: function (newVal, oldVal) {
      // console.log('app watch $route new route', newVal, oldVal)
      // if (newVal.name !== 'category' && newVal.name !== 'product') {
      this.$nextTick(() => {
        let options = {
          lang: this.lang,
          url: this.$route.fullPath
        }
        this.$trackPageView(options)
      })
      // }
    },
    isMobileScreen: function (newVal, oldVal) {
      if (newVal) {
        this.firstVisit = false
      }
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'setCartQty'
      ]
    ),
    ...mapActions(
      'site',
      [
        'setSession'
      ]
    ),
    setSessionId () {
      if (!this.$q.cookies.has('PHPSESSID') && !this.session) {
        let formdata = {}
        getSessionId(formdata).then(data => {
          // console.log('PHPSESSID', data.session_id)
          this.setSession(data.session_id)
          this.$q.cookies.set('PHPSESSID', data.session_id, { path: '/' })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    checkIsGlobal () {
      if (!this.$route.query.referrer) {
        let formdata = {}
        checkGlobal(formdata).then(data => {
          // console.log(data.redirect_url)
          if (data.redirect_url) {
            window.location = data.redirect_url
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    changeFirstVisit () {
      this.firstVisit = false
      this.$q.cookies.set('firstVisit', 'no', { path: '/' })
    },
    closePop (val) {
      this.changeFirstVisit()
      if (val) {
        this.firstConfirm = true
      }
    },
    changeFirstConfirm () {
      this.firstConfirm = false
    },
    onResize () {
      let screenWidth = this.getScreenWidth()
      if (screenWidth < 600) {
        this.isMobileScreen = true
      } else {
        this.isMobileScreen = false
      }
    },
    getScreenWidth () {
      let tag = this.$refs.myapp
      if (tag) {
        return width(tag)
      } else {
        return 1024
      }
    }
  },
  mounted () {
    this.$q.cookies.set('rwflag', 1, { path: '/' })
    this.setCartQty()
    this.getScreenWidth()
    this.firstVisit = !this.$q.cookies.get('firstVisit')
    if (this.isMobileScreen) {
      this.firstVisit = false
    }
  },
  created () {
    // this.firstVisit = !this.$q.cookies.get('firstVisit')
    this.checkIsGlobal()
    this.setSessionId()
    // Set default icons to use HAH icon
    this.$q.iconMapFn = (iconName) => {
      const icon = hahIcons[iconName]
      if (icon !== void 0) {
        return { icon: icon }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.fullscreen {
  z-index: 9000;
}
.first-confirm-close {
  width: 40px;
  height: 30px;
  display: block;
  text-align: right;
  cursor: pointer;
  color: $white;
  position: absolute;
  right: -16px;
  top: -30px;
  right: 0;
  top: -10px;
  font-size: 30px;
}
.first-confirm-close {
  margin: 0;
  position: absolute;
  display: inline-block;
  padding: 5px;
  color: #fff;
  width: 40px;
  height: 30px;
  font-size: 40px;
  text-align: center;
  z-index: 12;
  right: -20px;
  top: -20px;
  right: -10px;
  top: -10px;
  font-size: 25px;
}
.first-pop-confirm {
  width: 600px;
  .q-card {
    border-radius: 0;
    padding: 3%;
    background: $white;
  }
  .q-card__section--vert {
    padding: 0;
  }
  .link-btn-2 {
    display: inline-block;
  }
}

@media screen and (min-width: 600px) {
  .q-dialog__inner--minimized {
    & > div {
      &.first-visit-card {
        max-width: 700px;
        border-left: 0;
        @media screen and (min-width: 660px) and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
          margin-left: 0;
          margin-right: 0;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.first-confirm-header {
  h3 {
    margin-bottom: 10px;
    font-size: 1.5em;
  }
  & > div {
    color: $black;
    margin: 0 0 1em;
    font-size: 2em;
    strong {
      display: block;
      text-transform: uppercase;
      font-size: 2em;
      font-weight: 400;
      line-height: 1;
    }
  }
}
.fixed-bottom {
  .footer-bar {
    @media only screen and (device-width: 414px) and (device-height: 896px) {
      padding-bottom: 34px;
    }
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      padding-bottom: 34px;
    }
  }
}
#firstVisitPopup .q-dialog__backdrop {
  background-color: rgba(0,0,0,.2);
}
</style>
