<template>
  <div class="right-icon-wrapper">
      <div class="mobile-menu-trigger lt-sm" :class="switchAccount || isShowLang ? 'secondary-menu-open' : ''">
        <!-- <q-icon name="icon-drawer" size="26px" v-show="!isShowMoreMenu" /> -->
        <div id="openMenu" class="open-menu" :class="[isShowMoreMenu ? 'active' : null]" @click="showMoreMenu">
          <span class="icon-drawer"></span>
          <span class="icon-close"></span>
        </div>
        <div class="menu-overlay" :class="[isShowMoreMenu ? 'open' : null]">
          <mobile-right-drawer
            class="mobile-menu-panel"
            :screen-width="screenWidth"
            :is-show="isShowMoreMenu"
            @hideRightDrawer="hideRightDrawer"
            @toggleLangMenu="toggleLangMenu"
            @scrollControl="scrollControl"
            @toggleCurrency="toggleCurrency"
            @toggleAccountMenu="toggleAccountMenu"
          />
        </div>
      </div>
      <div class="search">
        <div id="openMenu" class="open-menu" :class="[isShowSearchInput ? 'active' : null]" @click="toggleSearch">
          <span class="icon-search"><strong>{{searchLabel}}</strong></span>
          <span class="icon-close"></span>
        </div>
        <div class="menu-overlay" :class="[isShowSearchInput ? 'open' : null]">
          <form :class="[isShowSearchInput ? 'active' : '', 'search-box']">
            <p>
              <span class="search-input-wrapper">
                <label class="hidden" for="tSearchString">{{i18n('$common.$labels.productSearch')}}</label>
                <input
                  :placeholder="searchLabel"
                  name="tSearchString"
                  id="tSearchString"
                  ref="tSearchString"
                  v-model="query"
                  type="search"
                  @keydown.enter.prevent="toSearch"
                  v-on:focus="focus()"
                />
                <span class="searchSuggest" v-if="searchSuggest.length !== 0 && query !== ''">
                  <q-item v-for="(item, key) in searchSuggest" :key="key" clickable manual-focus v-close-popup @click="suggestToSearch(item.title)">
                    <q-item-section  class="site-link"><a>{{ item.title }}</a></q-item-section>
                  </q-item>
                </span>
              </span>
              <button type="button" value="Search" id="searchSubmit" class="btn-white" @click="toSearch"><span>{{searchText}}</span></button>
            </p>
          </form>
        </div>
      </div>
      <div class="global-sites">
        <div id="openMenu" class="open-menu no-mob" :class="[isShowLang ? 'active' : null]" @click="toggleLangMenu">
          <span class="icon-location"><strong>International Sites</strong></span>
          <span class="icon-close"></span>
        </div>
        <div class="menu-overlay" :class="[isShowLang ? 'open' : null]">
          <span class="icon-close mob-only" @click="toggleLangMenu"></span>
          <lang-list @toggleLangMenu="toggleLangMenu" />
        </div>
      </div>
      <currency v-show="!isEu" class="currency-selector" @toggleCurrency="toggleCurrency" :hideCurrency="hideCurrency" :isShowCurrency="isShowCurrency" />
      <div class="account-btn-area">
        <div id="openMenu" class="open-menu no-mob" :class="[switchAccount ? 'active' : null]" @click="toggleAccountMenu">
          <span class="icon-user"></span>
          <span class="icon-close" />
        </div>
        <div class="menu-overlay" :class="[switchAccount ? 'open' : null]">
            <account
              :switch-account="switchAccount"
              @hasLogin="loginSuccess"
              @toggleAccountMenu="toggleAccountMenu"
              ref="accountMenu"
            />
        </div>
      </div>
    <div id="shop-cart" class="cart-btn-area" :class="switchMiniCart ? 'hover': ''" @mouseenter="mouseEnterCart" @mouseleave="mouseLeaveCart">
      <router-link class="cart-btn" :to="{name: 'cart'}" :aria-label="i18n('$common.$headings.shoppingCart')" @click.prevent="goCart" id="shoppingcart">
        <span id="cartSumQty" v-show="showCartQty"><span v-if="showCartQty" id="bubble-cnt" class="count">{{ cartQty }}</span></span>
        <span class="hidden" v-html="i18n('$common.$headings.shoppingCart')" />
      </router-link>
      <div class="drop-shopcart clear" v-show="switchMiniCart">
        <q-btn v-if="false" flat round icon="icon-bag" :class="['q-mr-xs', switchMiniCart ? 'hover' : null]" @click="goCart" />
        <div :class="['mini-cart', 'gt-xs', showMaskBgColor ? '' : 'mini-cart-top']">
          <keep-alive>
            <mini-cart :switch-mini-cart="switchMiniCart" />
          </keep-alive>
        </div>
      </div>
    </div>
    <div v-show="showDialogMask" :class="['dialog-mask', showMaskBgColor ? '' : 'transparent']" @click="hideDialogMask"><div class="bg"></div></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
import langList from './LangListEU'
import currency from './Currency'
import miniCart from './MiniCart'
import account from './Account'
import mobileRightDrawer from './RightDrawer'
export default {
  name: 'RightBtn',
  components: {
    'lang-list': langList,
    currency,
    'mini-cart': miniCart,
    account,
    'mobile-right-drawer': mobileRightDrawer
  },
  data () {
    return {
      query: '',
      switchMiniCart: false,
      // switchAccount: false,
      showDialogMask: false,
      showMaskBgColor: true,
      isShowSearchInput: false,
      isShowMoreMenu: false,
      isShowLang: false,
      isShowCurrency: false,
      searchSuggest: [],
      menuOpen: false,
      scrollY: '0px'
    }
  },
  props: {
    screenWidth: {
      type: Number,
      default: 1024
    },
    hideCurrency: {
      type: Boolean,
      default: false
    },
    leftDrawerOpen: {
      type: Boolean,
      default: false
    },
    isNavFixed: {
      type: Boolean,
      default: false
    },
    headerHeight: {
      type: Number,
      default: 80
    }
  },
  computed: {
    ...mapState({
      cartQty: state => state.cart.cartQty,
      bought: state => state.cart.bought,
      needShowLogin: state => state.site.needShowLogin,
      suggest: state => state.site.searchSuggest,
      isEu: state => state.site.isEU
    }),
    switchAccount: {
      set (needShowLogin) {
        this.setNeedShowLogin(needShowLogin)
      },
      get () {
        return this.needShowLogin
      }
    },
    searchLabel: function () {
      return this.$i18n.t('$common.$labels.productSearch')
    },
    searchText: function () {
      return this.$i18n.t('$common.$labels.search')
    },
    unit: function () {
      return this.$i18n.t('$common.$labels.item')
    },
    units: function () {
      return this.$i18n.t('$common.$labels.items')
    },
    searchValidation: function () {
      return this.$i18n.t('$common.$validation.emptySearch')
    },
    unitLable: function () {
      return this.cartQty > 1 ? this.units : this.unit
    },
    showCartQty: function () {
      return parseInt(this.cartQty, 10) > 0
    },
    isCheckoutPage () {
      return this.$route.name === 'checkout'
    },
    mobileAccountPop: function () {
      if (this.isCheckoutPage) {
        return true
      } else {
        return this.screenWidth < 600
      }
    }
  },
  watch: {
    bought: function (newVal, oldVal) {
      if (newVal && !this.isEu) {
        this.switchMiniCart = true
        this.showMiniCart(true)
        this.backTop()
        // for cn // this.showDialogMask = true
        this.showMaskBgColor = true
        let vue = this
        setTimeout(function () {
          vue.hideDialogMask()
          vue.switchMiniCart = false
        }, 10000)
      }
    },
    $route: function (newVal, oldVal) {
      this.hideDialogMask()
      this.hideSearch()
      this.showMiniCart(false)
    },
    query: function () {
      this.focus()
    },
    suggest: function (newVal, oldVal) {
      this.searchSuggest = newVal
    },
    leftDrawerOpen: function (newVal, oldVal) {
      // console.log('leftDrawerOpen', newVal, oldVal)
      if (newVal) {
        this.closeAll()
        // console.log('menus open', this.anyMenuIsOpen())
        if (!this.anyMenuIsOpen()) {
          this.scrollControl(true)
        }
      } else {
        this.scrollControl(false)
      }
    },
    needShowLogin: function (newVal, oldVal) {
      // console.log('watch needShowLogin', this.needShowLogin)
      // watches changes for 'needShowLogin' for multiple components
      if (!this.leftDrawerOpen && !this.isShowMoreMenu) {
        newVal ? this.scrollControl(true) : this.scrollControl(false)
      }
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setNeedShowLogin',
        'setHasLoginSuccess',
        'getSearchSuggest'
      ]
    ),
    ...mapActions(
      'cart',
      [
        'saveBoughtStatus'
      ]
    ),
    i18n: function (value) {
      return this.$i18n.t(value)
    },
    toggleSearch () {
      this.isShowSearchInput = !this.isShowSearchInput
      this.menuOpen = !this.menuOpen
      if (this.isShowSearchInput === true) {
        this.$refs.tSearchString.focus()
      }
      this.scrollControl()
    },
    toggleLangMenu (scrollControl = true) {
      // console.log('toggleLangMenu', scrollControl)
      this.isShowLang = !this.isShowLang
      this.menuOpen = !this.menuOpen
      if (scrollControl) {
        this.scrollControl()
      }
    },
    toggleAccountMenu () {
      if (this.needShowLogin) {
        this.setNeedShowLogin(false)
      } else {
        this.setNeedShowLogin(true)
      }
      this.menuOpen = !this.menuOpen
      this.hideSearch()
    },
    toggleCurrency (scrollControl = true) {
      // console.log('toggleCurrency')
      this.isShowCurrency = !this.isShowCurrency
      this.menuOpen = !this.menuOpen
      if (scrollControl) {
        this.scrollControl()
      }
      this.hideSearch()
    },
    closeAll () {
      this.isShowSearchInput = false
      this.isShowLang = false
      this.setNeedShowLogin(false)
      this.isShowCurrency = false
      // this.menuOpen = !this.menuOpen
    },
    anyMenuIsOpen () {
      if (this.isShowSearchInput || this.isShowLang || this.needShowLogin || this.isShowCurrency) {
        return true
      } else {
        return false
      }
    },
    hideSearch () {
      this.isShowSearchInput = false
    },
    backTop () {
      try {
        const el = document.getElementById('rightIcon')
        const target = getScrollTarget(el)
        const offset = el.offsetTop
        const duration = 300
        setScrollPosition(target, offset, duration)
      } catch { }
    },
    suggestToSearch (title) {
      this.isShowSearchInput = false
      this.$router.push({ name: 'search', query: { q: title } })
      this.query = ''
      this.searchSuggest = []
      this.$q.loading.show({
        delay: 400 // ms
      })
    },
    toSearch () {
      if (this.query) {
        this.isShowSearchInput = false
        this.$router.push({ name: 'search', query: { q: this.query } })
        this.query = ''
      } else {
        this.$q.notify({
          message: this.searchValidation,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      }
      this.toggleSearch()
    },
    toSearchPage () {
      this.$router.push({ name: 'search' })
    },
    showMiniCart (status) {
      // this.switchMiniCart = status
      // console.log('showMiniCart ', status)
      // for cn // this.$emit('calculateHeaderHeight')
      if (!status) {
        this.saveBoughtStatus(false)
      }
      this.showMaskBgColor = false
      this.switchMiniCart = status
    },
    mouseEnterCart () {
      if (!this.switchMiniCart) {
        this.showMiniCart(true)
      }
    },
    mouseLeaveCart () {
      if (!this.showMaskBgColor) {
        this.showMiniCart(false)
      }
    },
    hideAccount () {
      this.setNeedShowLogin(false)
    },
    loginSuccess () {
      this.toggleAccountMenu()
      this.setHasLoginSuccess(true)
    },
    setSecondaryAcctDialogOpen (status) {
      this.secondaryAcctDialogOpen = status
    },
    goCart () {
      this.$router.push({ name: 'cart' })
      this.hideDialogMask()
    },
    hideDialogMask () {
      if (this.showDialogMask) {
        this.showDialogMask = false
        this.showMaskBgColor = false
        this.showMiniCart(false)
        this.hideAccount()
      }
    },
    focus () {
      try {
        if (document.querySelector('input') === document.activeElement) {
          // console.log('focus', this.query)
          this.fuzzy_search(this.query.trim())
        }
      } catch { }
    },
    fuzzy_search (value) {
      var that = this
      if (!value) {
        that.searchSuggest = []
        return false
      }
      // 调取接口
      let params = {
        search_term: this.query
      }
      this.getSearchSuggest(params)
    },
    hideRightDrawer () {
      this.isShowMoreMenu = false
    },
    showMoreMenu () {
      this.isShowMoreMenu = !this.isShowMoreMenu
      this.menuOpen = !this.menuOpen
      this.scrollControl()
    },
    showLang (val) {
      this.isShowLang = val
    },
    setMenuWidth () {
      const mobileWidth = '100%'
      const desktopWidth = '50%'
      if (window.matchMedia('(min-width:1024px)').matches) {
        return desktopWidth
      } else {
        return mobileWidth
      }
    },
    scrollControl (open) {
      console.log('scrollControl', open, this.menuOpen)
      try {
        if (open !== undefined && open) {
          this.menuOpen = true
        } else if (open !== undefined && !open) {
          this.menuOpen = false
        }
        // const body = document.body
        // let scrollY = document.documentElement.style.getPropertyValue('--scroll-y')
        // if (this.menuOpen) {
        //   this.scrollY = document.documentElement.style.getPropertyValue('--scroll-y')
        //   body.style.position = 'fixed'
        //   body.style.width = '99%'
        //   body.style.right = '1%'
        //   body.style.top = '-'.concat(this.scrollY)
        // } else {
        //   this.scrollY = body.style.top
        //   body.style.position = ''
        //   body.style.width = ''
        //   body.style.right = ''
        //   body.style.top = ''
        //   window.scrollTo(0, parseInt(this.scrollY || '0') * -1)
        // }
      } catch { }
    }
  },
  mounted: function () {
    try {
      window.addEventListener('scroll', function () {
        document.documentElement.style.setProperty('--scroll-y', ''.concat(window.scrollY, 'px'))
      })
    } catch { }
  }
}
</script>

<style lang="scss" scoped>
.search button {
  @media screen and ($bp-1024-min) {
    width: 30%;
  }
}
.dialog-mask {
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   bottom: 0;
   z-index: 1;
   .bg {
      position: fixed;
      // top: 110px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
   }
}
</style>
<style lang="scss">
// CSS Menu Transition/Width
.menu-overlay {
  transition: .6s;
  &.open {
    width: 50% !important;
    @media screen and (max-width: 1025px) {
      width: 100% !important;
    }
  }
}
// Menu Buttons Positions
// -- Position With Currency Enabled --
// #openMenu {
//   .search & {
//     right: 330px;
//     @media screen and (max-width: 800px) {
//       right: 210px;
//     }
//     @media screen and (max-width: 660px) {
//       right: 125px;
//     }
//   }
//   .global-sites & {
//     right: 250px;
//     @media screen and (max-width: 800px) {
//       right: 165px;
//     }
//   }
//   .currency-selector & {
//     right: 180px;
//     @media screen and (max-width: 800px) {
//       right: 120px;
//     }
//   }
//   .account-btn-area & {
//     right: 110px;
//     @media screen and (max-width: 800px) {
//       right: 75px;
//     }
//   }
// }
// #shop-cart {
//   @media screen and ($bp-660) {
//     right: 38px;
//   }
// }
// -- Position Without Currency Enabled --
#openMenu {
  .search & {
    right: 250px;
    @media screen and (max-width: 800px) {
      right: 165px;
    }
    @media screen and (max-width: 660px) {
      right: 125px;
    }
  }
  .global-sites & {
    right: 180px;
    @media screen and (max-width: 800px) {
      right: 120px;
    }
  }
  .account-btn-area & {
    right: 110px;
    @media screen and (max-width: 800px) {
      right: 75px;
    }
  }
}
#shop-cart {
  @media screen and ($bp-660) {
    right: 40px;
  }
}
// -- End Position Without Currency Enabled --
// Other Styling
.search .search-input-wrapper {
  position: relative;
  width: 60%;
  input[type="search"] {
    width: 100%;
  }
  .searchSuggest {
    position: absolute;
    left: 0;
    top: 70px;
    background: #000000cc;
    width: 99%;
    border-radius: 3px;
    a {
      color: $white;
    }
  }
}
.global-sites {
  p {
    cursor: pointer;
  }
}
// Mobile Secondary Menu Styles
#q-app {
  .menu-overlay.open .icon-close {
    position: absolute;
    top: 10px;
    right: 17px;
    z-index: 100000000;
    &:before {
      font-size: 33px;
      line-height: 33px;;
    }
  }
  .global-sites,
  .currency-selector,
  .account-btn-area {
    @media screen and (max-width: 660px) {
      .menu-overlay {
        background: $white;
        transition-property: position;
      }
      .menu-overlay.open {
        z-index: 99999999;
        .icon-close {
          display: block;
        }
      }
      .icon-close {
        display: none;
      }
    }
  }
}
.pgcheckout .menu-overlay.open .icon-close {
  display: block;
}
.right-icon-wrapper {
  float: right;
  position: relative;
}
@media screen and (#{$bp-1024}) {
  header.fixed {
    position: relative;
  }
}
@media screen and (#{$bp-1024-min}) {
  header.fixed {
    .global-sites .icon-location,
    .account-btn-area .icon-user,
    .currency-selector .currency-icon {
      display: none;
    }
    .cart-btn-area {
      right: 50px;
    }
    .search #openMenu {
      right: 155px;
    }
  }
}
</style>
