<template><div  class="promo-wrapper" :class="[categoryId, promoDaysLeft > 3 ? 'initial' : 'last-call']">
  <div class="container">
  <div class="top-promo">
  <div class="promo-inner">
    <div class="before-name">
      <span class="save"></span>
      <span class="pr-copy2"></span>
      <span class="upto"></span>
      <strong><sup class="percentage"></sup></strong>
      <span class="pr-first"></span>
    </div>
    <div class="pr-name" id="banProdName">
      <span v-if="replacementName !== ''" class="replacementName">{{replacementName}}</span>
      <span v-if="replacementName === ''" id="currentProdName" class="currentName">{{prodName}}<span class="asterisk"> *</span></span>
    </div>
    <div class="after-name">
      <span class="pr-copy3"></span>
    </div>
    <div class="countdown" v-if="promoDaysLeft < 3">
      &nbsp;<span class="pr-ends">{{countdownCopy}}*</span><span class="pr-altend"></span>
    </div>
  </div>
  </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    promoIsActive: {
      type: Boolean,
      default: false
    },
    promoDaysLeft: {
      type: Number,
      default: 0
    },
    prodName: {
      type: String,
      default: ''
    },
    promoEnds: {
      type: String,
      default: ''
    },
    categoryId: {
      type: String,
      default: ''
    },
    replacementName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // countdownCopy: ''
    }
  },
  computed: {
    countdownCopy () {
      switch (this.promoDaysLeft) {
        case 0:
          return this.$i18n.t('$common.$promotion.endsToday')
        case 1:
          return this.$i18n.t('$common.$promotion.endsTomorrow')
        case 2:
          return this.$i18n.t('$common.$promotion.ends') + this.$i18n.t('$common.$promotion.' + this.promoEnds)
        default:
          return ''
      }
    }
  }
}
</script>
