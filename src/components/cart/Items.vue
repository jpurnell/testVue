<template>
  <div>
    <div>
      <div class="title gt-xs">
        <div class="title-checkout" v-if="isModify"></div>
        <div :class="['title-thumbnail', isModify ? 'title-thumbnail-modify' : '']"></div>
        <div class="title-name">{{ itemDescription }}</div>
        <div class="title-unit-price">{{ price }}</div>
        <div class="title-qty">{{ quantity }}</div>
        <div class="title-subtotal gt-xs">{{ total }}</div>
      </div>
    </div>
    <div class="item-line" v-for="item in items" :key="item.item_id">
      <div class="checkout-block flex items-center" v-if="isModify">
        <q-checkbox v-model="selection" :val="item.item_id" />
      </div>
      <div :class="['thumbnail-block', isModify ? 'thumbnail-block-modify' : '']">
        <!-- <router-link :to="{name: 'product', params: {p: item.url}}"> -->
        <q-img :src="item.thumbnail" :ratio="24/17" class="thumbnail" />
        <!-- </router-link> -->
      </div>
      <div class="name-block">
        <!-- Disable Link
        <router-link :to="{name: 'product', params: {p: item.url}}">
          {{ item.name }}
        </router-link> -->
        <span class="no-link">
          {{ item.name }}
        </span>
        <div v-if="item.options && item.options.length > 0">
          <span class="p-options" v-for="(options, index) in item.options" :key="index">
            {{options}}
          </span>
        </div>
        <span v-if="item.stock_info" class="p-tips">{{stockInfo(item.stock_info)}}</span>
        <span v-if="item.stock_threshold" class="p-tips">{{onlyStock(item.stock_threshold)}}</span>
        <span v-if="item.item_message" class="p-error">{{itemWarn(item.item_message)}}</span>
        <div class="lt-sm">
          <span v-if="item.market_price !== item.price" class="m-price">{{ item.market_price }}</span>
          <span :class="[isModify ? 'qty-block-left' : '']">{{ item.price }}</span>
        </div>
        <div class="lt-sm">
          <span :class="[isModify ? 'qty-block-left' : '']">{{total}}: {{ item.subtotal }}</span>
        </div>
        <span class="p-delete" @click="removeItem(item.item_id)">{{ deleteText }}</span>
      </div>
      <div class="unit-price-block gt-xs">
        <span v-if="item.market_price !== item.price" class="m-price">{{ item.market_price }}</span>
        <span class="p-price">{{ item.price }}</span>
      </div>
      <div class="qty-block">
        <set-qty
          ref="setQty"
          :item-id="item.item_id"
          :default-qty="parseInt(item.qty, 10)"
          :max-qty="10"
          :min-qty="1"
          :wait-data="waitData"
          @updateQty="updateQty"
          class="set-qty"
        >
        </set-qty>
        <div class="delete-block lt-sm" v-if="false">
          <q-btn flat icon="icon-trash" @click="removeItem(item.item_id)"></q-btn>
        </div>
      </div>
      <div class="subtotal-block gt-xs">
        <span class="p-price">{{ item.subtotal }}</span>
      </div>
      <!--<div class="delete-block gt-sm" v-if="isModify">
        <q-btn flat icon="icon-trash" @click="removeItem(item.item_id)"></q-btn>
      </div>-->
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import SetQty from './../SetQty.vue'
export default {
  components: {
    'set-qty': SetQty
  },
  data () {
    return {
      selection: []
    }
  },
  props: {
    isModify: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: function () {
        return []
      }
    },
    waitData: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    allItems: function () {
      return this.items.map(a => {
        return a.item_id
      })
    },
    itemDescription: function () {
      return this.$i18n.t('$common.$labels.itemDescription')
    },
    price: function () {
      return this.$i18n.t('$common.$labels.price')
    },
    quantity: function () {
      return this.$i18n.t('$common.$labels.quantity')
    },
    total: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    deleteText: function () {
      return this.$i18n.t('$common.$buttons.delete')
    }
  },
  watch: {
    selection: function (newVal, oldVal) {
      this.$emit('itemSelect', newVal)
    },
    waitData: function (newVal, oldVal) {
      if (newVal === false) {
        this.$q.loading.hide()
        this.setIsLoading(false)
      }
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setIsLoading'
      ]
    ),
    removeItem (id) {
      this.$q.loading.show({
        delay: 400
      })
      this.$emit('removeItem', id)
    },
    updateQty (itemId, qty) {
      this.setIsLoading(true)
      this.$emit('updateQty', itemId, qty)
    },
    resetQty (itemId, currentQty) {
      let currentItem = this.items.filter(a => {
        return a.item_id === itemId
      })
      let index = this.items.findIndex(a => {
        return a.item_id === itemId
      })
      let qty = currentItem[0].qty
      this.$refs.setQty[index].syncQty(qty)
    },
    setAll () {
      this.selection = this.allItems
    },
    setNotAll () {
      this.selection = []
    },
    itemWarn (text) {
      const reg = /"(.*?)"/g
      if (text) {
        let productName = reg.exec(text)
        if (productName && productName instanceof Array && productName.length > 1) {
          // console.log(productName[1])
          return this.$i18n.t('$common.$validation.cartItemWarn', { name: productName[1] })
        } else if (text === 'This product is out of stock.') {
          return this.$i18n.t('$common.$labels.outStock')
        } else {
          return text
        }
      } else {
        return text
      }
    },
    onlyStock (val) {
      return this.$i18n.t('$common.$validation.onlyOne', { number: val })
    },
    stockInfo (val) {
      return this.$i18n.t('$common.$validation.outStockTips', { tips: val })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  width: 100%;
  padding: 2% 2% 2% 1.3%;
  display: flex;
  justify-content: flex-start;
  text-transform: uppercase;
  line-height: 1;
  > div {
    font-family: $typography-main-heading;
  }
}
.item-line {
  padding: 1%;
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  border-top: 1px solid $borderColor;
}
.p-error {
  color: #f00;
}
.p-tips {
  color: $black;
  font-weight: 600;
}
.title-checkout,
.checkout-block,
.qty-block-checkout {
  width: 50px;
}
.title-thumbnail,
.thumbnail-block {
  width: 10%;
  margin: 0 12px 0 0;
  padding: 0 2% 0 0;
}
.thumbnail-block {
  .thumbnail {
    width: 100%;
  }
}
.title-name,
.name-block {
  width: 36%;
  margin: 0 12px 0 0;
}
.name-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  a {
    padding-bottom: 2px;
    color: $black;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  span {
    font-size: 14px;
    &.p-delete {
      text-decoration: underline;
      @media screen and (min-width: 769px) {
        position: relative;
        cursor: pointer;
        flex: 1;
        display: flex;
        align-items: flex-end;
      }
      // ie11 fix
      @media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
        flex: auto;
      }
    }
  }
}
.name-block a,
.name-block span {
  padding-top: 2px;
  display: block;
  line-height: 1.2;
}
.title-unit-price,
.unit-price-block {
  width: 13%;
  margin: 0 12px 0 0;
  text-align: right;
}
.title-qty,
.qty-block {
  width: 24%;
  margin: 0 12px 0 0;
}
.title-qty {
  text-align: center;
}
.qty-block {
  display: flex;
  justify-content: center;
}
.title-subtotal,
.subtotal-block {
  width: 13%;
  margin: 0 12px 0 0;
  text-align: right;
}
.m-price {
  display: block;
  text-decoration: line-through;
}

@media screen and (max-width: 768px) {
  .title-name,
  .name-block {
    width: 26%;
  }
  .title-thumbnail-modify,
  .thumbnail-block-modify {
    display: none;
  }
  .gt-xs,
  .title {
    display: none;
  }
  .lt-sm {
    display: block !important;
  }
  .item-line {
    padding: 2%;
    flex-wrap: wrap;
    &:first-child {
      border: none;
    }
  }
  .thumbnail-block {
    width: 20%;
    margin: 0;
  }
  .name-block {
    width: 80%;
    margin: 0;
    justify-content: start;
  }
  .qty-block {
    width: 100%;
    margin: 0;
    justify-content: flex-end;
    align-items: center;
    .lt-sm {
      margin-left: 20%;
    }
  }
  .edit-mode {
    .qty-block {
      .lt-sm {
        margin-left: 0;
      }
    }
  }
  .set-qty {
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>

<style lang="scss">
.qty-block {
  .action {
    width: 35px;
  }
}
</style>
