<template>
    <!-- Promo Tag Banners -->
  <div class="top-banner"  v-if="showSpecialBanner">
      <p v-html="i18n(specialBannerCopy) + '*'" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
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
    },
    specialBannerCopy () {
      switch (this.employcode) {
        case 'EMPLOYEES15':
          return '$local.$promo.$topBanner.EMPLOYEES15'
        case 'FANS10':
          return '$local.$promo.$topBanner.FANS10'
        case 'ELITEFANS15':
          return '$local.$promo.$topBanner.ELITEFANS15'
        case 'OWNERS20':
          return '$local.$promo.$topBanner.OWNERS20'
        case 'STAYONEDEGREE':
          return '$local.$promo.$topBanner.STAYONEDEGREE'
        case 'HOLIDAY15':
          return '$local.$promo.$topBanner.HOLIDAY15'
        default:
          return false
      }
    }
  },
  methods: {
    i18n (value) {
      return this.$i18n.t(value)
    }
  }
}
</script>
