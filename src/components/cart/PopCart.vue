<template>
  <q-card class="mini-cart-panel lightbox">
    <q-toolbar>
      <q-btn flat round dense icon="icon-close" v-close-popup size="10px" />
    </q-toolbar>
    <q-card-section v-if="items.length > 0">
      <div id="DIVcartSumItems" class="clearfix">
        <h2>{{addSuccessHeading}}</h2>
        <div class="item-wrap scroll">
          <ul v-for="item in items" :key="item.item_id">
            <li class="ItemImage">
              <img :src="item.thumbnail" />
            </li>
            <li class="ItemDesc">
              <h3 class="p-name">{{item.name}}</h3>
              <p class="p-option">{{item.options.join(', ')}}</p>
              <del v-if="item.market_price !== item.price" class="p-price market-price">{{item.market_price}}</del>
              <p class="p-price">{{item.price}}</p>
              <p class="p-qty">{{qtyLabel}}: {{item.qty}}</p>
            </li>
          </ul>
        </div>
        <p class="clear cart-continue" v-close-popup>
          <span>{{cartEmptyBuy}}</span>
        </p>
        <div class="totals">
          <div class="inner-totals">
            <span class="cart-items">
              <em>{{ totalQty }}</em>
            </span>
            <ul class="cart-summary">
              <li>
                <label>{{ subTotalLabel }}:</label>
                <span>{{ subTotal }}</span>
              </li>
              <li  v-if="originalSubtotal !== subTotal" class="cross-out">
                <label>{{ originalSubtotalLabel }}:</label>
                <span>{{ originalSubtotal }}</span>
              </li>
            </ul>
          </div>
          <div class="cart-buttons clearfix">
            <p class="button left" v-if="canCheckout">
              <router-link :to="{name: 'cart'}" class="btn-plain">{{toCart}}</router-link>
            </p>
            <p class="button right" v-if="canCheckout">
              <router-link :to="{name: 'checkout'}" class="btn-main">{{toCheckout}}</router-link>
            </p>
            <p class="button right" v-else>
              <router-link :to="{name: 'cart'}" class="btn-main">{{toCheckout}}</router-link>
            </p>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      items: [],
      subTotal: '',
      originalSubtotal: '',
      canCheckout: false
    }
  },
  computed: {
    ...mapState({
      cartInfo: state => state.cart.cart,
      cartQty: state => state.cart.cartQty,
      bought: state => state.cart.bought,
      justAdded: state => state.cart.justAdded
    }),
    toCart: function () {
      return this.$i18n.t('$common.$buttons.toCart')
    },
    subTotalLabel: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    originalSubtotalLabel: function () {
      return this.$i18n.t('$common.$labels.originalPrice')
    },
    toCheckout: function () {
      return this.$i18n.t('$common.$buttons.toCheckout')
    },
    addSuccessHeading: function () {
      return this.$i18n.t('$common.$headings.addSuccessHeading')
    },
    cartEmptyBuy: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    },
    totalQty: function () {
      return this.$i18n.t('$common.bagproductnum', { total_qty: this.cartQty })
    },
    qtyLabel: function () {
      return this.$i18n.t('$common.$labels.qty')
    }
  },
  watch: {
    cartInfo: {
      handler: function (newVal, oldVal) {
        // console.log('...cart pop.. cart info handler', newVal)
        if (newVal) {
          this.items = Object.assign([], newVal.items).reverse()
          this.subTotal = newVal.subtotal_total
          this.originalSubtotal = newVal.original_subtotal
        } else {
          this.items = []
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'saveBoughtStatus',
        'setJustAdded'
      ]
    ),
    init () {
      // console.log('...cart pop.. init 0', this.cartInfo, this.justAdded)
      if ((this.cartInfo.items && this.cartInfo.items.length > 0) || (this.justAdded.items && this.justAdded.items.length > 0)) {
        // console.log('...cart pop.. init 1', this.justAdded.items, this.cartInfo)
        let items = []
        if (this.justAdded.items && this.justAdded.items.length > 0) {
          // for (let i = 0; i < this.justAdded.items.length; i++) {
          for (let i = this.justAdded.items.length - 1; i >= 0; i--) {
            let nameArr = this.justAdded.items[i].name.split(' | ')
            let options = []
            // console.log('...cart pop.. init 3', nameArr)
            if (nameArr.length > 1) {
              for (let j = 1; j < nameArr.length; j++) {
                options.push(nameArr[j])
              }
            }
            items.push({
              'name': nameArr[0],
              'price': this.justAdded.items[i].price,
              'market_price': this.justAdded.items[i].market_price,
              'options': this.justAdded.items[i].options,
              'qty': this.justAdded.items[i].qty,
              'item_id': this.justAdded.items[i].product_id,
              'thumbnail': this.justAdded.items[i].thumbnail
            })
          }
        }
        // console.log('...cart pop.. init 2', this.justAdded.items, items)
        this.items = Object.assign([], items).reverse()
        this.subTotal = this.justAdded.subtotal_total
        this.originalSubtotal = this.cartInfo.original_subtotal
        this.canCheckout = this.cartInfo.can_checkout
      } else {
        this.items = []
      }
      this.saveBoughtStatus(false)
    }
  },
  created () {
    // console.log('...cart pop.. cart info created')
    this.init()
  },
  beforeDestroy () {
    // console.log('...cart pop.. cart info beforeDestroy')
    this.setJustAdded({})
  }
}
</script>

<style lang="scss" scoped>
.mini-cart-panel {
  width: 100%;
}
.p-info {
  padding-left: 2%;
  span {
    display: block;
    line-height: 1.2em;
  }
}
.p-name {
  overflow: hidden;
  text-align: left;
  white-space: break-spaces;
  text-overflow: ellipsis;
  font-size: 1.5em;
}
.p-option {
  color: #999;
}
// .p-qty,
// .p-price {
//   line-height: 20px;
//   text-align: left;
// }
.p-qty {
  color: #666;
}
// .link {
//   display: block;
//   margin: 0 0 10px;
//   font-size: 0.8em;
// }
.link-btn-2 {
  width: 100%;
}
.to-cart {
  .link-btn-2 {
    &:hover {
      background: $black;
      color: $white;
    }
  }
}
.p-img {
  padding: 0 2% 0 0;
}
.subtotal {
  padding: 3% 2% 5% 2%;
  // font-size: 1.2em;
  .subprice {
    text-align: right;
    line-height: 1.2em;
    del {
      display: inline-block;
    }
  }
}

.cart-continue {
  padding: 0 2%;
  color: $primary;
  cursor: pointer;
  text-transform: uppercase;
}
.cross-out {
  span {
    text-decoration: line-through;
  }
}
</style>
<style lang="scss">
@media (min-width: 600px) {
  .q-dialog__inner--minimized {
    & > div {
      &.mini-cart-panel {
        max-width: 690px;
        .q-toolbar {
          position: absolute;
          top: 0px;
          right: 0px;
          padding: 0;
          width: 29px;
          height: 29px;
          min-height: 29px;
          z-index: 3;
          button {
            background-color: #2b2e35;
            color: $white;
            border-radius: 0;
            width: 29px;
            height: 29px;
          }
        }
      }
    }
  }
}
</style>
