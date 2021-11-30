<template>
  <div>
    <q-scroll-observer @scroll="scrollHandler" />
    <q-resize-observer @resize="onResize" />
    <promoBanner
      :promoIsActive="promotion.promoIsActive"
      :promoDaysLeft="promotion.promoDaysLeft"
      :promoEnds="promotion.promoEnd"
    />
    <div
      ref="cart"
      class="shopping-cart-container clearfix normal-mode"
    >
      <div class="edit">
        <h1>{{ shoppingCartText }}</h1>
        <!-- Steven requested that this feature be removed, but CN site still needs it -->
        <div class="edit-btn-container" v-show="false">
          <q-btn
            class="edit-btn"
            v-if="items.length > 0"
            flat
            :is-modify="!isMobileScreen"
            :to="{name: 'cartEdit'}"
            icon-right="icon-pencil"
            size="16px"
            :label="edit"
            no-wrap
          />
        </div>
      </div>
      <!-- <spinner v-show="!ready" :type="'page'" /> -->
      <div
        class="cart"
        v-if="ready"
      >
        <div v-if="items.length > 0">
          <div class="content">
            <items
              ref="items"
              :items="items"
              :wait-data="waitData"
              @removeItem="removeItem"
              @updateQty="updateQty"
            />
          </div>
          <div class="action">
            <div class="row total">
              <div class="col-6 total-label"><label>{{ subTotalText }}</label></div>
              <div class="col-6 total-value"><span>{{ subTotal }}</span></div>
            </div>
            <div
              class="row total"
              v-if="isNotEmpty(discountAmount)"
            >
              <div class="col-6 total-label"><label>{{ discountText }}</label></div>
              <div class="col-6 total-value"><span>{{ discountAmount }}</span></div>
            </div>
            <!-- <div class="row total" v-if="shippingAmount!==''">
              <div class="col-6 total-label"><label>{{ shippingAmountTxt }}</label></div>
              <div class="col-6 total-value"><span>{{ shippingAmount }}</span></div>
            </div> -->
            <!-- <div class="row total">
              <div class="col-6 total-label"><label>{{ totalText }}</label></div>
              <div class="col-6 total-value"><span>{{ grandTotal }}</span></div>
            </div> -->
            <div class="row total" v-if="isEu && originalTotal !== subTotal">
              <div class="col-6 total-label"><label>{{ originalTotalText }}</label></div>
              <div class="col-6 total-value m-price"><span>{{ originalTotal }}</span></div>
            </div>
            <div class="row total" v-if="isEu && savedTotal !== ''">
              <div class="col-6 total-label"><label>{{ savedTotalText }}</label></div>
              <div class="col-6 total-value"><span>{{ savedTotal }}</span></div>
            </div>
          </div>
          <div class="row action-btn" ref="checkout">
            <router-link :to="{name: 'home'}">
              <link-btn-2
                :text="cartEmptyBuy"
                color="white"
              />
            </router-link>
            <router-link
              :to="{name: 'checkout'}"
              v-if="canCheckout"
              class="checkout-btn"
            >
              <link-btn-2 :text="checkoutText"/>
            </router-link>
          </div>
        </div>
        <div
          class="empty"
          v-else
        >
          <div class="empty-content">
            <p>{{ cartEmpty }}</p>
            <div class="empty-action">
              <router-link :to="{name: 'home'}">
                <link-btn-2
                  :text="cartEmptyBuy"
                  color="white"
                />
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <spinner v-else type="page" height="200px" />
    </div>
    <q-page-sticky
      v-show="items.length > 0 && isShowFooter"
      expand
      position="bottom"
      class="p-footer"
    >
      <q-toolbar class="footer-bar">
        <div><strong>{{ totalText }}: {{ subTotal }}</strong></div>
        <router-link
          :to="{name: 'checkout'}"
          v-if="canCheckout"
        >
          <link-btn-2 :text="checkoutText" />
        </router-link>
      </q-toolbar>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { dom } from 'quasar'
import { deleteCartItem, updateCartItem } from './../api/api'
import StoreId from './../mixins/StoreId'
import notify from './../mixins/Notify'
// import confirm from './../components/ui/Confirm'
import linkBtn2 from './../components/ui/Button2'
import cartItemns from './../components/cart/Items'
import promoBanner from './../components/promotion/Banner'

const { width } = dom
export default {
  components: {
    items: cartItemns,
    'link-btn-2': linkBtn2,
    promoBanner
  },
  data () {
    return {
      isMobileScreen: false,
      items: [],
      subTotal: '',
      grandTotal: '',
      discountAmount: '',
      metaDescription: '',
      metaKeywords: '',
      originalTotal: '',
      savedTotal: '',
      ready: false,
      canCheckout: true,
      waitData: false,
      pageReady: false,
      isShowFooter: false,
      shippingAmount: ''
    }
  },
  meta () {
    return {
      // sets document  title
      title: this.shoppingCartText,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`,
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
      cartInfo: state => state.cart.cart,
      promotion: state => state.site.promotion,
      isEu: state => state.site.isEU
    }),
    shoppingCartText: function () {
      return this.$i18n.t('$common.$headings.shoppingCart')
    },
    itemDescription: function () {
      return this.$i18n.t('$common.$labels.itemDescription')
    },
    priceText: function () {
      return this.$i18n.t('$common.$labels.price')
    },
    quantityText: function () {
      return this.$i18n.t('$common.$labels.quantity')
    },
    deleteText: function () {
      return this.$i18n.t('$common.$buttons.delete')
    },
    discountText: function () {
      return this.$i18n.t('$common.$labels.discount')
    },
    subTotalText: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    totalText: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    originalTotalText: function () {
      return this.$i18n.t('$common.$labels.originalPrice')
    },
    savedTotalText: function () {
      return this.$i18n.t('$common.youSaved')
    },
    checkoutText: function () {
      return this.$i18n.t('$common.$buttons.toCheckout')
    },
    cartEmpty: function () {
      return this.$i18n.t('$common.$validation.cartEmpty')
    },
    cartEmptyBuy: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    },
    edit: function () {
      return this.$i18n.t('$common.$labels.edit')
    },
    shippingAmountTxt: function () {
      return this.$i18n.t('$common.$labels.shippingAmmount')
    },
    allChecked: function () {
      var notChecked = this.items.findIndex(o => {
        return !o.checked
      })
      if (notChecked === -1) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    cartInfo: {
      handler (newVal, oldVal) {
        console.log(newVal)
        if (newVal.items) {
          this.items = Object.assign([], newVal.items)
          this.subTotal = newVal.subtotal_total
          this.grandTotal = newVal.grand_total
          this.originalTotal = newVal.original_subtotal
          this.savedTotal = newVal.saved_amount
          this.discountAmount = newVal.discount_amount
          this.canCheckout = newVal.can_checkout
          this.shippingAmount = newVal.shipping_amount
        } else {
          this.items = []
        }
      },
      deep: true
    },
    lang: function (val, oldVal) {
      this.initCart()
    },
    currency: function (val, oldVal) {
      this.initCart()
    }
  },
  mixins: [StoreId, notify],
  methods: {
    ...mapActions(
      'cart',
      [
        'getCartInfo'
      ]
    ),
    checked (itemId) {
      var index = this.getCurrentItemIndex(itemId)
      this.items[index].checked = !this.items[index].checked
    },
    getCurrentItemIndex (itemId) {
      var index = this.items.findIndex(o => {
        return o.item_id === itemId
      })
      return index
    },
    initCart () {
      this.getCartInfo().then(data => {
        this.ready = true
        this.waitData = false
      }).catch(error => {
        console.log(error)
      })
    },
    updateQty (itemId, qty) {
      this.updateItem(itemId, qty)
    },
    updateItem (itemId, qty) {
      let formdata = {
        item_id: itemId,
        qty: qty
      }
      this.waitData = true
      updateCartItem(formdata).then(data => {
        console.log(data)
        this.initCart()
      }).catch(error => {
        console.log(error)
        let msg = this.$i18n.t('$common.$validation.addErrorTips')
        this.msgAlert(msg)
        let currentItem = this.items.filter(a => {
          return a.item_id === itemId
        })
        if (currentItem.length > 0) {
          let currentQty = currentItem[0].qty
          if (qty > parseInt(currentQty, 10)) {
            this.$refs.items.resetQty(itemId, qty)
          }
        } else {
          this.$refs.items.resetQty(itemId, qty)
        }
        this.waitData = false
      })
    },
    removeItem (itemId) {
      /*
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$headings.confirmDelete'),
        message: this.$i18n.t('Would you like to delete ?', { item: '' }),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true,
        changeBtnStyle: true
      }).onOk(() => {
        // var index = this.getCurrentItemIndex(itemId)
        // this.items.splice(index, 1)
        this.deleteItem(itemId)
      }).onCancel(() => {

      }).onDismiss(() => {

      })
      */
      this.deleteItem(itemId)
    },
    deleteItem (itemId) {
      let formdata = {
        item_id: itemId
      }
      deleteCartItem(formdata).then(data => {
        console.log(data)
        this.initCart()
        this.$q.loading.hide()
      }).catch(error => {
        console.log(error)
      })
    },
    isNotEmpty (val) {
      const regex = /[1-9]+/g
      return regex.test(val)
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
      let tag = this.$refs.cart
      if (tag) {
        return width(tag)
      } else {
        return 1024
      }
    },
    scrollHandler () {
      if (this.pageReady) {
        let top = this.getBtnPosition()
        let screenWidth = this.getScreenWidth()
        console.log('checkout button', top)
        if (top < 0 && screenWidth < 600) {
          this.isShowFooter = true
          try {
            document.querySelector('body').classList.add('footer-bar-active')
          } catch {}
        } else {
          this.isShowFooter = false
          try {
            document.querySelector('body').classList.remove('footer-bar-active')
          } catch {}
        }
      }
    },
    getBtnPosition () {
      let tag = this.$refs.checkout
      if (tag) {
        let descriptionPosition = tag.getBoundingClientRect()
        return descriptionPosition.top
      } else {
        return 0
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.pageReady = true
    })
    this.getScreenWidth()
    try {
      document.querySelector('body').classList.add('pgcart')
    } catch { }
  },
  created () {
    this.initCart()
  },
  beforeDestroy () {
    try {
      document.querySelector('body').classList.remove('pgcart')
    } catch { }
  }
}
</script>

<style lang="scss" scoped>
.shopping-cart-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2% 0 72px;
  @media screen and ($bp-768) {
    padding-top: 4%;
  }
}
.edit,
.cart {
  padding: 0 5%;
}
.edit {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  @media screen and ($bp-768) {
    margin: 20px 0;
  }
}
.edit-btn-container {
  display: flex;
  flex-direction: column-reverse;
}
.content {
  margin-top: 0;
}
.content,
.empty {
  border: 1px solid $borderColor;
  background: $white;
}
.empty-content {
  padding: 1%;
  p {
    margin: 0 0 1em;
  }
}
.empty-action {
  .link-btn-2 {
    display: inline-block;
    &:hover {
      background: $black;
      color: $white;
    }
  }
}
.action {
  width: 420px;
  margin: 0 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 11px 0 32px;
  & > div {
    width: 100%;
    padding: 2% 0 4%;
  }
}
.action-btn {
  width: 100%;
  justify-content: space-between;
  @media screen and (#{$bp-768}) {
    flex-direction: column-reverse;
  }
}
.action-btn {
  a {
    display: block;
    @media screen and (#{$bp-768-min}) {
      min-width: 45%;
    }
    @media screen and (#{$bp-960-min}) {
      min-width: 340px;
    }
    @media screen and (#{$bp-768}) {
      width: 100%;
      margin: 8px auto;
    }
  }
}
.checkout-btn > .link-btn-2 {
  width: 100%;
}
.link-btn-2 {
  @media screen and ($bp-768) {
    width: 100%;
  }
}
.total {
  width: 100%;
}
.total label,
.total span {
  font-family: $typography-font-family;
  font-size: 1.1em;
}
.total-label,
.total-value {
  text-align: right;
}
.p-footer {
  z-index: 999;
}
.m-price {
  display: block;
  text-decoration: line-through;
}

@media screen and (max-width: 768px) {
  .edit {
    h1 {
      font-size: 32px;
      line-height: 30px;
      letter-spacing: 0.1px;
    }
  }
  .action {
    width: 100%;
    a {
      margin: 0 auto;
    }
  }
  .total-label {
    text-align: left;
  }
  .empty-content {
    padding: 3%;
  }
}
@media screen and (max-width: 599px) {
  .edit {
    & > .q-btn {
      font-size: 12px;
      .q-icon {
        font-size: 1.2em;
      }
    }
  }
}
</style>

<style lang="scss">
.shopping-cart-container {
  .link-btn-2 {
    &.white {
      border: 1px solid $black;
    }
  }
}
</style>
