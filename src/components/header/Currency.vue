<template>
  <div>
    <div id="openMenu" class="open-menu no-mob" :class="[isShowCurrency ? 'active' : null]" @click="toggleCurrency">
      <span :class="[currencyCurrentIcon] + ' currency-icon'"></span>
      <span class="icon-close"></span>
    </div>
    <div class="menu-overlay" :class="[isShowCurrency ? 'open' : '']">
      <span class="icon-close mob-only" @click="toggleCurrency"></span>
      <currency-list @toggleCurrency="toggleCurrency" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import currencyList from './CurrencyList'
export default {
  name: 'Currency',
  components: {
    'currency-list': currencyList
  },
  data () {
    return {
      showCurrency: false,
      currencyIcon: {
        // CNY: 'icon-cny',
        // JPY: 'icon-cny',
        // AUD: 'icon-dollar',
        // USD: 'icon-dollar',
        // HKD: 'icon-dollar',
        // SGD: 'icon-dollar',
        // KRW: 'icon-krw'
        EUR: 'icon-eur',
        GBP: 'icon-gbp',
        CHF: 'icon-chf',
        RON: 'icon-ron',
        PLN: 'icon-pln',
        SEK: 'icon-dkk',
        CZK: 'icon-czk',
        DKK: 'icon-dkk',
        AED: 'icon-aed'
      }
    }
  },
  props: {
    hideCurrency: {
      type: Boolean,
      default: false
    },
    isShowCurrency: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      currentCurrency: state => state.lang.currency
    }),
    currencyCurrentIcon () {
      return this.currencyIcon[this.currentCurrency] || this.currencyIcon['EUR']
    }
  },
  methods: {
    hideSearch () {
      this.$emit('hideSearch')
    },
    toggleCurrency () {
      this.$emit('toggleCurrency')
    }
  },
  watch: {
    hideCurrency: function (oldVal, newVal) {
      this.showCurrency = false
    }
  }
}
</script>
