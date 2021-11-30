<template>
  <q-card class="mini-cart-panel mobile-mini-cart-dialog">
    <q-card-section v-if="items.length > 0">
      <div class="mini-cart-header">
        <span class="header">{{addSuccessHeading}}</span>
      </div>
      <div class="items-list scroll">
        <div v-for="item in items" :key="item.item_id" class="row p-item">
          <div class="col-12 p-info">
            <span class="p-name">{{item.name}}</span>
            <span class="p-option">{{item.options.join(',')}}</span>
          </div>
          <div class="col-12 p-price-block">
            <div class="p-price">{{item.price}}</div>
            <div class="p-qty">{{qtyLabel}}: {{item.qty}}</div>
          </div>
        </div>
      </div>
      <div class="mini-cart-buttons">
        <router-link :to="{name: 'checkout'}" v-if="canCheckout" class="link">
          <link-btn-2 :text="toCheckout" />
        </router-link>
        <router-link :to="{name: 'cart'}" class="link to-cart">
          <link-btn-2 :text="toCart" color="white" />
        </router-link>
      </div>
    </q-card-section>
  </q-card>
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
      canCheckout: true
    }
  },
  computed: {
    ...mapState({
      cartInfo: state => state.cart.cart,
      bought: state => state.cart.bought,
      justAdded: state => state.cart.justAdded
    }),
    toCart: function () {
      return this.$i18n.t('$common.$buttons.toCart')
    },
    toCheckout: function () {
      return this.$i18n.t('$common.$buttons.toCheckout')
    },
    addSuccessHeading: function () {
      return this.$i18n.t('$common.$headings.addSuccessHeading')
    },
    qtyLabel: function () {
      return this.$i18n.t('$common.$labels.qty')
    }
  },
  watch: {
    justAdded: {
      handler: function (newVal, oldVal) {
        // console.log('...cart mini.. cart info handler', newVal)
        if (newVal) {
          this.items = Object.assign([], newVal.items).reverse()
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
        'saveBoughtStatus'
      ]
    ),
    init () {
      if (this.justAdded.items && this.justAdded.items.length > 0) {
        this.items = Object.assign([], this.justAdded.items).reverse()
      } else {
        this.items = []
      }
      this.saveBoughtStatus(false)
    }
  },
  created () {
    // console.log('...cart mini.. cart info created')
    this.init()
  }
}
</script>

<style lang="scss" scoped>
.mini-cart-panel {
  width: 100%;
  padding: 16px 16px 0;
  background: #ececec;
  line-height: 1;
}
.subtotal {
  text-align: right;
}
.mini-cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: $primary;
  color: $white;
  padding: 10px 2%;
  span {
    text-transform: uppercase;
  }
}
.header {
  font-size: 16px;
}
.items-list {
  max-height: 250px;
  margin-bottom: 10px;
  border: 1px solid $brandgrey1;
  padding: 0 2%;
}
.p-item {
  padding: 5px 0;
  margin: 5px 0 5px;
  border-bottom: 1px solid $brandgrey1;
  &:last-of-type {
    border: none;
  }
}
.p-info {
  span {
    display: block;
    line-height: 20px;
  }
}
.p-name {
  // font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  overflow: hidden;
  text-align: left;
  margin-bottom: 4px;
}
.p-option {
  font-size: 14px;
  color: #999;
}
.p-qty,
.p-price {
  line-height: 20px;
  font-size: 14px;
  // text-align: right;
}
.p-qty {
  color: #666;
}
.link {
  display: block;
  // margin: 0 0 10px;
}
.link-btn-2 {
  width: 100%;
}
.btn-main {
  margin-bottom: 10px;
}
.to-cart {
  .link-btn-2 {
    &:hover {
      background: $black;
      color: $white;
    }
  }
}
</style>
