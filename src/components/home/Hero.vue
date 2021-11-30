<template>
  <div class="hero-wrap" :class="[promoActive ? 'hp-promo' : '']">
      <a :href="link" class="main-hp" id="HP-Hero">
          <div v-animate>
            <div class="stack">
              <div>
                <h1 v-if="promoActive">
                  <span class="pr-ends" v-show="daysLeft <= 2">{{endsCopy}}</span>
                  {{daysLeft > 3 ? initialCopy : lcCopy}}*
                </h1>
                <h1 v-else>{{heading}}</h1>
              </div>
              <p class="btn-main">
                  <span>{{btnTxt}}</span>
              </p>
            </div>
          </div>
          <div class="hp-img-wrap">
              <picture>
                  <source :srcset="imgFill" media="(max-width: 768px)">
                  <img :src="imgSrc" :alt="alt(i18n('$local.$product.test'))" class="loading" data-was-processed="true">
              </picture>
          </div>
      </a>
    </div>
</template>
<script>
export default {
  props: {
    heading: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    btnTxt: {
      type: String,
      default: ''
    },
    imgFill: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    },
    promotion: {
      type: Object
    },
    promoActive: {
      type: Boolean,
      default: false
    },
    initialCopy: {
      type: String,
      default: ''
    },
    lcCopy: {
      type: String,
      default: ''
    },
    daysLeft: {
      type: Number,
      default: 0
    },
    lang: {
      type: String,
      default: 'en'
    }
  },
  computed: {
    endsCopy () {
      switch (this.daysLeft) {
        case 0:
          return this.$i18n.t('$common.$promotion.hpEndsToday')
        case 1:
          return this.$i18n.t('$common.$promotion.hpEndsTomorrow')
        case 2:
          return this.$i18n.t('$common.$promotion.hpEnds') + this.$i18n.t('$common.$promotion.' + this.promotion.promoEnd)
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hero-wrap {
	max-width: 1440px;
	margin: auto;
	position: relative;
	z-index: 1;
	min-height: 200px;
	.main-hp {
		display: block;
		margin: 0 auto;
		line-height: 0;
	}
	h1 {
		.pr-ends {
			line-height: 1em;
		}
	}
}
</style>
