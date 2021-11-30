<template>
  <div :class="['item-list', altItemsLayout ? 'altLayout' : 'standardLayout']">
    <q-resize-observer @resize="onResize" />
    <h2>{{ itemsHeading }}<router-link class="go-cart" :to="{name: 'cart'}" v-if="isShowModify"><q-icon v-show="false" name="icon-pencil"></q-icon>{{ editText }}</router-link></h2>
    <div class="h2-content" v-if="items.length > 0 && !isShowLoading">
      <div class="row item-th-line" v-show="!altItemsLayout">
        <div class="col-5">{{ product }}</div>
        <div class="col-1 qty">{{ qty }}</div>
        <div class="col-3 price-value">{{ priceLabel }}</div>
        <div class="col-3 total-value">{{ totalLabel }}</div>
      </div>
      <div class="row item-line" v-for="(item, index) in items" :key="index">
        <div class="col-5">
          {{ item.name }}
          <span v-if="item.options && item.options.length > 0" class="options">
            <em v-for="(option, optionIndex) in item.options" :key="optionIndex">{{option}}</em>
          </span>
          <div v-if="item.item_message" class="p-error">{{itemWarn(item.item_message)}}</div>
        </div>
        <div class="col-1 qty"><span v-show="altItemsLayout" class="alt-label">{{ quantity }}: </span>{{ item.qty }}</div>
        <div class="col-3 price-value">
          <span v-show="altItemsLayout" class="alt-label">{{ priceLabel }}: </span>
          <span class="market-price" v-show="item.market_price !== item.price"><strike>{{ item.market_price }}</strike></span>
          <span :class="['sale-price', item.market_price !== item.price ? 'discounted' : '']">{{ item.price }}</span>
        </div>
        <div class="col-3 total-value"><span v-show="altItemsLayout" class="alt-label">{{ totalLabel }}: </span>{{ item.subtotal }}</div>
      </div>
      <div class="row total-line first subtotal-line with-tax" v-if="tax && isNotEmpty(tax)">
        <!-- <div class="col-7 total-value">{{ subTotalVatIncluded }} : </div> -->
        <div class="col-7 total-value">{{ subTotalLabel }} : </div>
        <div class="col-5 total-value">{{ subtotalTotal }}</div>
      </div>
      <div class="row total-line first subtotal-line" v-else>
        <div class="col-7 total-value">{{ subTotalLabel }} : </div>
        <div class="col-5 total-value">{{ subtotalTotal }}</div>
      </div>
      <div class="row total-line discount-line" v-if="discountAmount && isNotEmpty(discountAmount)">
        <div class="col-7 total-value">{{ discountLable }} : </div>
        <div class="col-5 total-value">{{ discountAmount }}</div>
      </div>
      <div class="row total-line shipping-line" v-if="shippingFee && isNotEmpty(shippingFee)">
        <div class="col-7 total-value">{{ shipping }} : </div>
        <div class="col-5 total-value">{{ shippingFee }}</div>
      </div>
      <!-- We will not display tax row, but leaving it hidden for debug purposes -->
      <div class="row total-line tax-line" v-if="tax && isNotEmpty(tax)" v-show="false">
        <div class="col-7 total-value">{{ taxText }} : </div>
        <div class="col-5 total-value">{{ tax }}</div>
      </div>
      <div class="row total-line" v-if="shippingDiscount && isNotEmpty(shippingDiscount)">
        <div class="col-7 total-value">{{ shippingDiscountLabel }} : </div>
        <div class="col-5 total-value">{{ shippingDiscount }}</div>
      </div>
      <div class="row total-line">
        <div class="col-7 total-value">{{ orderTotalLabel }} : </div>
        <div class="col-5 total-value">{{ grandTotalValue }}</div>
      </div>
    </div>
    <spinner v-else type="component" height="100px" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      isMobileScreen: false,
      altLayoutBreakpoint: false
    }
  },
  props: {
    cartItems: {
      type: Array,
      default: function () {
        return []
      }
    },
    discountAmount: {
      type: String,
      default: ''
    },
    shippingDiscount: {
      type: String,
      default: ''
    },
    shippingFee: {
      type: String,
      default: ''
    },
    subtotalTotal: {
      type: String,
      default: ''
    },
    grandTotal: {
      type: String,
      default: ''
    },
    isShowModify: {
      type: Boolean,
      default: false
    },
    isShowLoading: {
      type: Boolean,
      default: false
    },
    tax: {
      type: String,
      default: ''
    },
    lang: {
      type: String,
      default: 'FR'
    }
  },
  computed: {
    itemsHeading: function () {
      return this.$i18n.t('$common.$headings.itemsInYourOrder')
    },
    editText: function () {
      return this.$i18n.t('$common.$labels.edit')
    },
    product: function () {
      return this.$i18n.t('$common.$labels.productDescription')
    },
    quantity: function () {
      return this.$i18n.t('$common.$labels.quantity')
    },
    qty: function () {
      return this.$i18n.t('$common.$labels.qty')
    },
    subTotalLabel: function () {
      return this.$i18n.t('$common.$labels.subTotal')
    },
    discountLable: function () {
      return this.$i18n.t('$common.$labels.discount')
    },
    shipping: function () {
      return this.$i18n.t('$common.$labels.shipping')
    },
    shippingDiscountLabel: function () {
      return this.$i18n.t('$common.$labels.shippingDiscount')
    },
    totalLabel: function () {
      return this.$i18n.t('$common.$labels.total')
    },
    orderTotalLabel: function () {
      return this.$i18n.t('$common.$labels.orderTotal')
    },
    subTotalVatIncluded: function () {
      return this.$i18n.t('$common.$labels.subTotalVatIncluded')
    },
    priceLabel: function () {
      return this.$i18n.t('$common.$labels.price')
    },
    items: function () {
      return this.cartItems
    },
    subTotalValue: function () {
      return this.subtotalTotal || this.subTotal
    },
    grandTotalValue: function () {
      return this.grandTotal || this.subTotal
    },
    taxText: function () {
      return this.$i18n.t('$common.$labels.tax')
    },
    altItemsLayout: function () {
      if (this.lang === 'de' || this.lang === 'es' || this.isMobileScreen || this.altLayoutBreakpoint) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    onResize () {
      let screenWidth = window.innerWidth
      if (screenWidth <= 960) {
        this.isMobileScreen = true
      } else {
        this.isMobileScreen = false
      }
      if (screenWidth <= 1100) {
        this.altLayoutBreakpoint = true
      } else {
        this.altLayoutBreakpoint = false
      }
    },
    isNotEmpty (val) {
      const regex = /[1-9]+/g
      return regex.test(val)
    },
    itemWarn (text) {
      const reg = /"(.*?)"/g
      if (text) {
        let productName = reg.exec(text)
        if (productName && productName instanceof Array && productName.length > 1) {
          console.log(productName[1])
          return this.$i18n.t('$common.$validation.cartItemWarn', { name: productName[1] })
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  created () {
    console.log(this.items, 'checkout items')
  }
}
</script>

<style lang="scss" scoped>
h2 {
  a {
    color: $accent;
    float: right;
    &:hover {
      text-decoration: underline;
    }
  }
}
.h2-content {
  margin: 0 0 1em;
  border: 1px solid $borderColor;
  &.loading {
    padding: 50px 0;
    .q-spinner {
      margin: 0 auto;
      display: block;
    }
  }
}
.item-th-line {
  padding: 3% 4%;
  text-transform: uppercase;
  border-bottom: 1px solid $borderColor;
}
.item-line {
  padding: 3% 4%;
  border-bottom: 1px solid $borderColor;
  font-size: 16px;
}
.options {
  display: block;
  color: #7b7b7b;
  em {
    font-style: normal;
    // padding-right: 10px;
    &:first-of-type:before {
      content: '';
    }
    &:before {
      content: ' - ';
    }
  }
}
.qty {
  text-align: center;
}
.price-value,
.total-value {
  text-align: right;
}
.total-line {
  padding: 12px 3%;
  &:last-child {
    font-size: 1.1em;
    font-family: $typography-main-heading;
  }
}
.p-error {
  color: #f00;
}
.altLayout {
  $altLabelLeftWidth: 90px;
  $altLabelLeftWidthDe: 125px;
  .item-line {
    flex-direction: column;
    [class*="col"] {
      width: 100%;
      padding: 5px 0;
    }
    .alt-label {
      display: inline-block;
      width: $altLabelLeftWidth;
      .de & {
        width: $altLabelLeftWidthDe;
      }
    }
    .market-price {
      display: inline-block;
    }
    .sale-price {
      &.discounted {
        display: block;
        margin-left: $altLabelLeftWidth;
        .de & {
          margin-left: $altLabelLeftWidthDe;
        }
      }
    }
  }
  .total-line {
    &.first {
      border-top: 1px solid $white;
    }
  }
}
.altLayout .item-line .qty,
.altLayout .item-line .total-value,
.altLayout .item-line .price-value {
  text-align: left;
}

@media screen and (max-width: 960px) {
  .market-price,
  .sale-price {
    display: inline-block;
  }
  .sale-price {
    &.discounted {
      display: block;
      margin-left: 132px;
    }
  }
}

@media screen and (max-width: 599px) {
  .item-th-line,
  .item-line {
    font-size: 14px;
  }
}
</style>
