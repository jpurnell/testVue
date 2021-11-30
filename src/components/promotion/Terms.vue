<template>
  <p v-if="promotion !== '' && promotion.promoIsActive && employcode === ''" class="t-c">
    *{{termsCopy}}
  </p>
  <p v-else v-show="showSpecialBanner" class="t-c">
    *<template v-if="employcode === 'EMPLOYEES15'">{{i18n('$local.$promo.$terms.EMPLOYEES15')}}</template>
    <template v-if="employcode === 'FANS10'">{{i18n('$local.$promo.$terms.FANS10')}}</template>
    <template v-if="employcode === 'ELITEFANS15'">{{i18n('$local.$promo.$terms.ELITEFANS15')}}</template>
    <template v-if="employcode === 'OWNERS20'">{{i18n('$local.$promo.$terms.OWNERS20')}}</template>
    <template v-if="employcode === 'STAYONEDEGREE'">{{i18n('$local.$promo.$terms.STAYONEDEGREE')}}</template>
    <template v-if="employcode === 'HOLIDAY15'">{{i18n('$local.$promo.$terms.HOLIDAY15')}}</template>
  </p>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      termsCopy: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      currency: state => state.lang.currency,
      promotion: state => state.site.promotion,
      employcode: state => state.lang.employcode
    }),
    showSpecialBanner () {
      switch (this.employcode) {
        case 'EMPLOYEES15':
        case 'FANS10':
        case 'ELITEFANS15':
        case 'OWNERS20':
        case 'STAYONEDEGREE':
        case 'HOLIDAY15':
          return true
        default:
          return false
      }
    }
  },
  watch: {
    lang: function (newVal, oldVal) {
      this.initData()
    },
    currency: function (newVal, oldVal) {
      this.initData()
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setPromotion'
      ]
    ),
    initData () {
      this.unwatchPromotion = this.$watch('promotion', (newVal) => {
        if (newVal) {
          this.setTermsCopy()
          this.unwatchPromotion()
        }
      })
      this.setPromotion()
    },
    setTermsCopy () {
      if (this.promotion.promotion_text) {
        let promoText = ''
        switch (this.currency) {
          case 'EUR':
            promoText = this.promotion.promotion_text
            break
          case 'GBP':
            promoText = this.promotion.promotion_text_gbp
            break
          case 'CHF':
            promoText = this.promotion.promotion_text_chf
            break
          case 'RON':
            promoText = this.promotion.promotion_text_leu
            break
          case 'PLN':
            promoText = this.promotion.promotion_text_pln
            break
          case 'SEK':
            promoText = this.promotion.promotion_text_sek
            break
          case 'CZK':
            promoText = this.promotion.promotion_text_czk
            break
          case 'DKK':
            promoText = this.promotion.promotion_text_dkk
            break
          case 'AED':
            promoText = this.promotion.promotion_text_aed
            break
          default:
            promoText = this.promotion.promotion_text
        }
        this.termsCopy = promoText
      }
    },
    i18n (value) {
      return this.$i18n.t(value)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style lang="scss">
// $ force import variables
// @import "~src/css/base/variables";
@import "~src/css/banners/base";
// @import "~src/css/banners/base_eu";
// @import "~src/css/banners/ProductNameModification_EU";
// @import "~src/css/banners/sitewideOfferAllPages";
</style>

<style lang="scss" scoped>
.t-c {
   margin: 0 0 4% 0;
   text-align: center;
   font-size: 12px;
   line-height: 30px;
   padding: 0 10px;
}
</style>
