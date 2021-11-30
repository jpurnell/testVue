<template>
  <q-layout view="hHh Lpr lFr" ref="mylayout" @scroll="scrollLayoutHandler" :class="[pageName, routeChangeInProgress || pageLoading ? 'cursor-progress' : '']">
    <!-- <q-scroll-observer @scroll="scrollLayoutHandler" /> -->
    <top-banner />
    <header class="clearfix" ref="header" :class="isNavFixed ? 'fixed': ''">
      <div class="header-wrapper">
        <router-link :to="{name: 'home'}">
          <div class="logo-wrapper" :class="isNavFixed ? '': 'no-fix'">
            <h2 class="main-logo"><span>{{ brand }}</span></h2>
            <p>{{i18n('$local.headerTagline')}}</p>
          </div>
        </router-link>
        <right-icon @showSearch="showSearch" :screen-width="screenWidth" :leftDrawerOpen="leftDrawerOpen" :isNavFixed="isNavFixed" :headerHeight="headerHeight" @calculateHeaderHeight="calculateHeaderHeight" />
        <div class="main-nav">
          <div id="openMenu" class="open-menu" :class="[leftDrawerOpen? 'active' : '']" @click="leftDrawerOpen = !leftDrawerOpen">
            <span class="icon-menu"></span>
            <span class="icon-close"></span>
          </div>
          <div class="menu-overlay" :class="[leftDrawerOpen? 'open' : '']">
            <nav role="navigation" class="nav-block">
              <navigation  @closeMenu="leftDrawerOpen = false"/>
            </nav>
          </div>
        </div>
      </div>
      <div class="cookie-block" v-if="isEu">
        <cookie />
      </div>
    </header>
    <!--//Mobile 导航-->
    <q-page-container class="content">
      <div :class="['page-block', screenWidth > 1023 ? 'page-block-pc' : '']">
        <router-view :closeMenuFired="leftDrawerOpen"/>
      </div>
      <footer>
        <footer-top :screen-width="screenWidth" @initFooterHeight="initFooterHeight" />
        <!-- <div ref="footerTop" style="height: 0px;"></div> -->
        <footer-bottom @initFooterHeight="initFooterHeight" />
      </footer>
      <div class="progress-wrap" :class="scrollTop > 50 ? 'active-progress' : ''" @click="scrollToTop()" v-show="showScrollToTop">
          <svg class="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
              <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" ref="progressPath"/>
          </svg>
      </div>
    </q-page-container>
    <q-dialog v-model="isShowMobileMiniCart" position="bottom" class="lt-xs">
      <miniCart />
    </q-dialog>
    <q-dialog v-if="isEu" v-model="isShowPopCart" class="mini-cart-panel-dialog">
      <popCart />
    </q-dialog>
    <div ref="screen">
      <q-resize-observer @resize="onResize" />
    </div>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { openURL, scroll } from 'quasar'
import navigation from '../components/header/Navigation'
import righticon from '../components/header/RightIcon'
import miniCart from '../components/cart/MiniCart'
import popCart from '../components/cart/PopCart'
import footer from '../components/footer/Footer'
import footerFixed from '../components/footer/FooterFixed'
import notify from './../mixins/Notify'
import cookie from '../components/Cookies'
import topBanner from '../components/header/TopBanner.vue'

const { getScrollTarget, setScrollPosition } = scroll

export default {
  name: 'MyLayout',
  components: {
    navigation,
    'right-icon': righticon,
    'footer-top': footer,
    'footer-bottom': footerFixed,
    'top-banner': topBanner,
    miniCart,
    popCart,
    cookie
  },
  data () {
    return {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      screenWidth: 1024,
      pageReady: false,
      isLogin: false,
      isNavFixed: false,
      query: '',
      isShowMobileMiniCart: false,
      isShowAccount: false,
      footerFixedHeight: 0,
      isShowSearch: false,
      isShowPopCart: false,
      scrollTop: 0,
      pathLength: '',
      headerHeight: 80,
      routeChangeInProgress: false
    }
  },
  computed: {
    ...mapState({
      cartQty: state => state.cart.cartQty,
      cartInfo: state => state.cart.cart,
      bought: state => state.cart.bought,
      needShowLogin: state => state.site.needShowLogin,
      lang: state => state.lang.lang,
      pageLoading: state => state.site.pageLoading,
      isEu: state => state.site.isEU,
      employcode: state => state.lang.employcode
    }),
    brand: function () {
      return this.$i18n.t('$local.siteName')
    },
    pageName: function () {
      return `header-${this.$route.name}`
    },
    layFooterMargin: function () {
      if (this.screenWidth <= 768) {
        return `0px`
      } else {
        return `${this.footerFixedHeight}px`
      }
    },
    showScrollToTop () {
      if (this.$route.name === 'home' || this.$route.name === 'category') {
        return true
      } else {
        return true
      }
    },
    isCheckoutPage () {
      switch (this.$route.name) {
        case 'checkout':
        case 'orderSuccess':
        case 'oGonePaymentSuccess':
        case 'oGonePaymentCanceled':
        case 'oGonePaymentUncertain':
        case 'oGonePaymentDenied':
        case 'paySuccess':
        case 'payError':
          return true
        default:
          return false
      }
    },
    urlParameters () {
      if (this.employcode) {
        return '?promo-tag=' + this.employcode
      } else {
        return ''
      }
    }
  },
  watch: {
    bought: function (newVal, oldVal) {
      console.log('MyLayout bought', newVal, oldVal)
      if (newVal && this.screenWidth < 600) {
        this.isShowMobileMiniCart = true
      } else if (newVal && this.screenWidth >= 600) {
        this.isShowPopCart = true
      }
      // if (newVal) {
      // this.backtoTop()
      // }
    },
    isShowMobileMiniCart: function (newVal, oldVal) {
      if (!newVal) {
        this.saveBoughtStatus(false)
      }
    },
    screenWidth: function (newVal, oldVal) {
      if (newVal > 599) {
        this.isShowMobileMiniCart = false
      }
      this.saveBoughtStatus(false)
    },
    needShowLogin: function (newVal, oldVal) {
      if (newVal && this.screenWidth < 1024) {
        this.isShowAccount = true
      }
    },
    isShowAccount: function (newVal, oldVal) {
      if (!newVal) {
        this.setNeedShowLogin(false)
      }
    },
    $route: function (newVal, oldVal) {
      this.$q.loading.hide()
      this.routeChangeInProgress = false
      this.setIsLoading(false)
    },
    isNavFixed: function (newVal, oldVal) {
      if (newVal) {
        // bugfix for menu positioning when header switches to fixed
        // window.scrollBy(0, 1)
      }
    }
  },
  mixins: [notify],
  methods: {
    ...mapActions(
      'site',
      [
        'setNeedShowLogin',
        'setHasLoginSuccess',
        'setPromotion',
        'setIsLoading'
      ]
    ),
    openURL,
    ...mapActions(
      'cart',
      [
        'saveBoughtStatus'
      ]
    ),
    showSearch (status) {
      if (this.query) {
        this.isShowSearch = false
        this.$router.push({ name: 'search', query: { q: this.query } })
        this.query = ''
      }
    },
    toSearch () {
      if (this.query) {
        this.isShowSearchInput = false
        this.isShowSearch = false
        this.$router.push({ name: 'search', query: { q: this.query } })
        this.query = ''
      }
    },
    getScreenWidth () {
      // let  tag = this.$refs.screen
      let tag = this.$refs.mylayout
      if (tag) {
        this.screenWidth = tag.width
      } else {
        this.screenWidth = 1024
      }
    },
    onResize (size) {
      // console.log(size)
      this.screenWidth = size.width
    },
    scrollLayoutHandler (info) {
      if (this.$route.name === 'home' || this.$route.name === 'category') {
        this.updateProgress()
      }
      let tag = this.$refs.footerTop
      if (tag) {
        let footer = tag.getBoundingClientRect()
        // console.log(footer.bottom, window.innerHeight, info.direction)
        if (info.direction === 'down') {
          if (footer.bottom < window.innerHeight) {
          } else {
          }
        } else {
          if (footer.bottom >= window.innerHeight) {
          } else {
          }
        }
      }
      if (this.pageReady) {
        let top = this.getNavPosition()
        // console.log('nav top', top, this.screenWidth)
        if (top && this.screenWidth > 960 && !this.isCheckoutPage) {
          this.isNavFixed = true
        } else {
          this.isNavFixed = false
        }
      }
      // console.log(this.scrollTop, window.scrollY)
    },
    getNavPosition () {
      let headerOffset = this.$refs.header.getBoundingClientRect().top
      // console.log('nav Top 2', headerOffset, window.pageYOffset)
      return Math.abs(window.pageYOffset) > headerOffset
    },
    back () {
      this.$router.back()
    },
    showAccount () {
      this.isShowAccount = true
    },
    loginSuccess () {
      this.isShowAccount = false
      this.isLogin = true
      this.setHasLoginSuccess(true)
    },
    checkLogin () {
      this.isLogin = parseInt(this.$q.cookies.get('isLogin'), 10) === 1 || false
    },
    initFooterHeight (val) {
      // console.log('footerFixed', val)
      this.footerFixedHeight = val
    },
    scrollToTop () {
      window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    backtoTop () {
      let el = this.$refs.header
      const target = getScrollTarget(el)
      const offset = el.offsetTop
      const duration = 500
      console.log('backtoTop', target, offset, duration)
      setScrollPosition(target, offset, duration)
    },
    i18n (value) {
      return this.$i18n.t(value)
    },
    calculateHeaderHeight () {
      this.headerHeight = this.$refs.header.clientHeight
    },
    initProgress () {
      try {
        var progressPath = this.$refs.progressPath
        this.pathLength = progressPath.getTotalLength()
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none'
        progressPath.style.strokeDasharray = this.pathLength + ' ' + this.pathLength
        progressPath.style.strokeDashoffset = this.pathLength
        progressPath.getBoundingClientRect()
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear'
      } catch {}
    },
    updateProgress () {
      this.scrollTop = window.scrollY
      var progressPath = this.$refs.progressPath
      var scroll = this.scrollTop
      var body = document.body
      var html = document.documentElement
      var bodyHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
      var height = bodyHeight - window.innerHeight
      var progress = this.pathLength - (scroll * this.pathLength / height)
      progressPath.style.strokeDashoffset = progress
    }
  },
  mounted () {
    this.pageReady = true
    this.getScreenWidth()
    this.checkLogin()
    this.initProgress()
  },
  beforeRouteUpdate (to, from, next) {
    this.routeChangeInProgress = true
    next()
  }
}
</script>

<style lang="scss">
// $
@import "~src/css/base/normalize";
@import "~src/css/base/mixins";
@import "~src/css/base/grid";
@import "~src/css/base/typography";
@import "~src/css/base/buttonsInputs";
@import "~src/css/modules/skeletonLoading.scss"; /*Should always be here*/
@import "~src/css/europe/q-styles.scss";
@import "~src/css/europe/europe.scss";

@import "~src/css/modules/header";
  // EU Only Header Partials
  @import "~src/css/modules/header/currency";
  @import "~src/css/europe/modules/header/account";
  @import "~src/css/europe/modules/header/mobile-menu";
@import "~src/css/modules/navigations/breadcrumb";
@import "~src/css/modules/navigations/top-nav";
  @import "~src/css/europe/modules/navigations/top-nav";
@import "~src/css/modules/footer";
  @import "~src/css/europe/modules/footer";
@import "~src/css/modules/flex";
@import "~src/css/modules/plugins";
@import "~src/css/modules/swiper";
// @import "~src/css/modules/lightbox";

@import "~src/css/layouts/homePage";
  @import "~src/css/europe/layouts/homePage";
@import "~src/css/layouts/categoryPage";
  @import "~src/css/europe/layouts/categoryPage";
@import "~src/css/layouts/searchPage";
@import "~src/css/layouts/productPage";
@import "~src/css/layouts/cartPage";
// @import "~src/css/layouts/checkoutPage";
@import "~src/css/layouts/nonProductPages";

@import "~src/css/transitions/fades";
@import "~src/css/transitions/scroll-animations";
@import "~src/css/transitions/button-fills";
//@import "~src/css/transitions/pinnedHeader";

@import "~src/css/banners/topPromo_base";

@import "~src/css/ie/ie";

// CN Only
// @import "~src/css/china/china.scss";
// @import "~src/css/china/layouts/checkoutPage.scss";
// @import "~src/css/china/layouts/productPage.scss";
// @import "~src/css/china/modules/footer.scss";
 </style>
