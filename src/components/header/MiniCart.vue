<template>
  <div class="mini-cart-panel in-header">
    <div  v-if="ready">
      <div v-if="items.length > 0">
        <div id="DIVitemHead" v-show="false">
          <span class="header">{{shoppingCart}}</span>
          <span class="total-qty">{{totalQty}}</span>
        </div>
        <div id="DIVcartSumItemsList">
          <ul
            v-for="item in items"
            :key="item.item_id"
          >
            <li class="col-2" v-if="false">
              <q-img
                :src="item.thumbnail"
                :ratio="24/17"
              />
            </li>
            <li class="Qty">{{item.qty}}</li>
            <li class="ItemDescr">
              <span class="p-name">{{item.name}}</span>
              <span v-for="option in item.options" :key="option" class="p-option">{{option}}</span>
              <!-- <span class="p-option">{{item.options.join(',')}}</span> -->
            </li>
            <li class="Price">
              <strike
                v-if="item.market_price !== item.price"
                class="m-price"
              >{{ item.market_price }}</strike>
              <!-- {{item.subtotal}} -->
              {{item.price}}
            </li>
          </ul>
        </div>
        <ul class="cart-summary">
          <li>
            <label>{{ subTotalLabel }}:</label>
            <span>{{ subTotal }}</span>
          </li>
          <li  v-if="originalTotal !== subTotal">
            <label>{{ originalTotalLabel }}:</label>
            <span><del>{{ originalTotal }}</del></span>
          </li>
          <li v-if="savedTotal !== ''">
            <label>{{ saveTotalLabel }}:</label>
            <span>{{ savedTotal }}</span>
          </li>
        </ul>
        <div class="mini-cart-action flex justify-between">
          <router-link
            :to="{name: 'cart'}"
            class="to-cart"
          >
            <link-btn-2
              :text="toCart"
              color="white"
            />
          </router-link>
          <router-link
            :to="{name: 'checkout'}"
            v-if="canCheckout"
          >
            <link-btn-2 :text="toCheckout" />
          </router-link>
          <router-link
            :to="{name: 'cart'}"
            v-else
          >
            <link-btn-2 :text="toCheckout" />
          </router-link>
        </div>
      </div>
      <div v-else>
        <div id="DIVcartSumItemsList">
            <ul>
                <li>{{ cartEmpty }}</li>
            </ul>
        </div>
      </div>
    </div>
    <spinner v-else type="component" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import linkBtn2 from './../ui/Button2'

export default {
  components: {
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      items: [],
      subTotal: '',
      grandTotal: '',
      discountAmount: '',
      ready: false,
      canCheckout: true,
      originalTotal: '',
      savedTotal: '',
      miniCartIndex: 0
    }
  },
  props: {
    switchMiniCart: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      cartQty: state => state.cart.cartQty,
      cartInfo: state => state.cart.cart,
      bought: state => state.cart.bought,
      cartIndex: state => state.cart.cartIndex
    }),
    subTotalLabel: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    toCart: function () {
      return this.$i18n.t('$common.$buttons.toCart')
    },
    toCheckout: function () {
      return this.$i18n.t('$common.$buttons.toCheckout')
    },
    cartEmpty: function () {
      return this.$i18n.t('$common.$validation.cartEmpty')
    },
    shoppingCart: function () {
      return this.$i18n.t('$common.$headings.shoppingCart')
    },
    totalQty: function () {
      return this.$i18n.t('$common.bagproductnum', { total_qty: this.cartQty })
    },
    originalTotalLabel: function () {
      return this.$i18n.t('$common.$labels.originalPrice')
    },
    saveTotalLabel: function () {
      return this.$i18n.t('$common.youSaved')
    }
  },
  watch: {
    cartInfo: {
      handler: function (newVal, oldVal) {
        // console.log('..header... cart info')
        let items = []
        if (newVal.items && newVal.items.length > 0) {
          for (let i = 0; i < newVal.items.length; i++) {
            let nameArr = newVal.items[i].name.split(' | ')
            items.push({
              'name': nameArr[0],
              'price': newVal.items[i].price,
              'options': newVal.items[i].options,
              'qty': newVal.items[i].qty,
              'item_id': newVal.items[i].product_id + newVal.items[i].item_id,
              'thumbnail': newVal.items[i].thumbnail,
              'market_price': newVal.items[i].market_price
            })
          }
          this.items = items
          this.subTotal = newVal.subtotal_total
          this.grandTotal = newVal.grand_total
          this.originalTotal = newVal.original_subtotal
          this.savedTotal = newVal.saved_amount
          this.discountAmount = newVal.discount_amount
          this.canCheckout = newVal.can_checkout
        } else {
          this.items = []
          this.subTotal = ''
        }
        this.ready = true
      },
      deep: true
    },
    switchMiniCart: function (newVal, oldVal) {
      if (newVal && !this.bought && this.cartIndex > this.miniCartIndex) {
        // console.log('show header mini cart')
        this.miniCartIndex = this.cartIndex
        this.initCart()
      }
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'getCartInfo'
      ]
    ),
    initCart () {
      this.getCartInfo().then(data => {
        // console.log(data)
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.initCart()
    this.miniCartIndex = this.cartIndex
  }
}
</script>

<style lang="scss">
.cart-summary li label {
    padding: 0;
    width: 60%;
    text-align: right;
    float: left;
}
// .mini-cart #DIVcartSumItemsList {
//   max-height: 50vh;
//   overflow-y: auto;
//   padding: 0 10px 10px 0;
//   margin-bottom: 10px;
// }
</style>
