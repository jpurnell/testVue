<template>
  <div class="promotion" v-if="promotionList.length > 0">
    <p v-for="(item, index) in promotionList" :key="index">{{item}}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getPromotion } from './../../api/api'
export default {
  data () {
    return {
      promotion: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      currency: state => state.lang.currency
    }),
    promotionList: function () {
      if (this.promotion.indexOf('*') !== -1) {
        let lists = this.promotion.split('*')
        return lists
      } else {
        if (this.promotion) {
          return [this.promotion]
        } else {
          return []
        }
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
    initData () {
      let formdata = {}
      getPromotion(formdata).then(data => {
        if (data.promotion_text) {
          let promoText = ''
          switch (this.currency) {
            case 'EUR':
              promoText = data.promotion_text
              break
            case 'GBP':
              promoText = data.promotion_text_gbp
              break
            case 'CHF':
              promoText = data.promotion_text_chf
              break
            case 'RON':
              promoText = data.promotion_text_leu
              break
            case 'PLN':
              promoText = data.promotion_text_pln
              break
            case 'SEK':
              promoText = data.promotion_text_sek
              break
            case 'CZK':
              promoText = data.promotion_text_czk
              break
            case 'DKK':
              promoText = data.promotion_text_dkk
              break
            case 'AED':
              promoText = data.promotion_text_aed
              break
            default:
              promoText = data.promotion_text
          }
          this.promotion = promoText
        }
      }).catch(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.initData()
  }
}
</script>
