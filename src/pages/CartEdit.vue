<template>
  <div>
    <q-scroll-observer @scroll="scrollHandler" />
    <q-resize-observer @resize="onResize" />
    <div
      ref="cart"
      class="shopping-cart edit-mode"
    >
      <div class="edit">
        <h1>{{ shoppingCartText }}</h1>
        <div class="edit-btn-container">
        <q-btn
          class="edit-btn"
          flat
          :to="{name: 'cart'}"
          icon="icon-left-arrow"
          :label="back"
          no-wrap
        />
        </div>
      </div>
      <div
        class="cart"
        v-if="ready"
      >
        <div v-if="items.length > 0">
          <div class="content">
            <items
              ref="items"
              :is-modify="true"
              :items="items"
              :wait-data="waitData"
              @removeItem="removeItem"
              @updateQty="updateQty"
              @itemSelect="itemSelect"
            />
          </div>
          <div class="action">
            <div class="row total">
              <div class="col-4 total-label"><label>{{ subTotalText }}</label></div>
              <div class="col-8 total-value"><span>{{ subTotal }}</span></div>
            </div>
            <div class="row total" v-if="isNotEmpty(discountAmount)">
              <div class="col-4 total-label"><label>{{ discountText }}</label></div>
              <div class="col-8 total-value"><span>{{ discountAmount }}</span></div>
            </div>
            <div class="row total">
              <div class="col-4 total-label"><label>{{ totalText }}</label></div>
              <div class="col-8 total-value"><span>{{ grandTotal }}</span></div>
            </div>
          </div>
          <div
            ref="checkout"
            class="flex justify-between action-all"
          >
            <q-checkbox
              v-model="isAll"
              :label="selectAllLabel"
              @input="isAllClick"
            />
            <div class="delete-btn">
              <link-btn-2
                color="black"
                :text="deleteLabel"
                @click="deleteAll"
              />
            </div>
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
    </div>
    <q-page-sticky
      v-show="items.length > 0 && isShowFooter"
      expand
      position="bottom"
      class="p-footer"
    >
      <q-toolbar class="footer-bar">
        <q-checkbox
          v-model="isAll"
          :label="selectAllLabel"
          @input="isAllClick"
        />
        <q-space />
        <div>
          <link-btn-2
            color="black"
            :text="deleteLabel"
            @click="deleteAll"
          />
        </div>
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

const { width } = dom
export default {
  components: {
    'link-btn-2': linkBtn2,
    items: cartItemns
  },
  data () {
    return {
      isMobileScreen: false,
      items: [],
      subTotal: '',
      grandTotal: '',
      discountAmount: '',
      originalTotal: '',
      savedTotal: '',
      isAll: false,
      isOldSelected: false,
      metaDescription: '',
      metaKeywords: '',
      ready: false,
      waitData: false,
      pageReady: false,
      isShowFooter: false
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
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
      cartInfo: state => state.cart.cart
    }),
    title: function () {
      return this.$i18n.t('$common.$labels.titleCartEdit')
    },
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
    cartEmpty: function () {
      return this.$i18n.t('$common.$validation.cartEmpty')
    },
    cartEmptyBuy: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    },
    selectAllLabel: function () {
      return this.$i18n.t('$common.$inputs.selectAll')
    },
    deleteLabel: function () {
      return this.$i18n.t('$common.$buttons.delete')
    },
    back: function () {
      return this.$i18n.t('$common.$buttons.back')
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
          this.discountAmount = newVal.discount_amount
          this.originalTotal = newVal.original_subtotal
          this.savedTotal = newVal.saved_amount
          this.canCheckout = newVal.can_checkout
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
    deleteAll () {
      let all = this.$refs.items.selection
      if (all.length <= 0) {
        this.msgAlert(this.$i18n.t('$common.$validation.cartChooseDelItem'))
        return false
      }
      /*
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$headings.confirmDelete'),
        message: this.$i18n.t('$common.$validation.deleteAll'),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true,
        changeBtnStyle: true
      }).onOk(() => {
        this.deleteItem(all.join(','))
      }).onCancel(() => {

      }).onDismiss(() => {

      })
      */
      this.deleteItem(all.join(','))
    },
    deleteItem (itemId) {
      let formdata = {
        item_id: itemId
      }
      deleteCartItem(formdata).then(data => {
        console.log('deleteCartItem', data)
        this.initCart()
        this.$refs.items.setNotAll()
        this.$q.loading.hide()
      }).catch(error => {
        console.log(error)
      })
    },
    isAllClick (val) {
      if (val) {
        this.$refs.items.setAll()
      } else {
        if (this.isOldSelected === null) {
          this.$refs.items.setAll()
        } else {
          this.$refs.items.setNotAll()
        }
      }
    },
    itemSelect (val) {
      if (val.length === 0) {
        this.isAll = false
        this.isOldSelected = false
      } else if (val.length !== this.items.length) {
        this.isAll = null
        this.isOldSelected = null
      } else if (val.length === this.items.length) {
        this.isAll = true
        this.isOldSelected = true
      }
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
        } else {
          this.isShowFooter = false
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
  },
  created () {
    this.initCart()
  }
}
</script>

<style lang="scss" scoped>
.shopping-cart {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2% 0 72px;
}
.edit,
.cart {
  padding: 0 5%;
}
.edit {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  position: relative;
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
.action-all {
  .delete-btn {
    display: block;
    width: 336px;
    margin: 8px 0 8px auto;
    font-size: 1.125em;
    line-height: 1em;
    [class*='btn'] {
      width: 100%;
    }
  }
}
.p-footer {
  z-index: 999;
}
.m-price {
  display: block;
  text-decoration: line-through;
}
.edit-btn-container {
  display: flex;
  flex-direction: column-reverse;
}

@media screen and (max-width: 660px) {
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
  .action-all {
    .delete-btn {
      width: 100%;
    }
  }
}
</style>
