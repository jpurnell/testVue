<template>
  <ul>
    <li>
      <p v-for="(currency, index) in currencies" :key="index">
        <a @click="changeCurrency(currency.value)" :active="currentCurrency === currency.value" :class="currentCurrency === currency.value ? 'active-currency' : ''">
          {{ currency.displayName }}
        </a>
      </p>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { currency } from './../../config/currency'
export default {
  name: 'CurrencyList',
  data () {
    return {
      currencies: currency
    }
  },
  computed: {
    ...mapState({
      currentCurrency: state => state.lang.currency
    })
  },
  methods: {
    ...mapActions(
      'lang', [
        'setCurrency'
      ]
    ),
    changeCurrency (val) {
      // console.log('changeCurrency')
      this.setCurrency(val)
      this.$q.cookies.set('currency', val, { path: '/' })
      this.$emit('hideRightDrawer')
      this.$emit('toggleCurrency')
    }
  }
}
</script>
