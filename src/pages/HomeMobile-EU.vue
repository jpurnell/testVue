<template>
  <div>
    <!-- <promoBanner
      :promoIsActive="promotion.promoIsActive"
      :promoDaysLeft="promotion.promoDaysLeft"
      :promoEnds="promotion.promoEnd"
      :is-home="true"
    />
    <div v-if="promotion.promoIsActive" class="bmsm-mobile" :class="promoCountdownClass" ><bmsm-chart /></div>
    <template v-if="isDev">
      <div v-if="promotion.promoIsActive" class="bmsm-mobile" :class="'ends-date'" ><bmsm-chart /></div>
      <div v-if="promotion.promoIsActive" class="bmsm-mobile" :class="'ends-tomorrow'" ><bmsm-chart /></div>
      <div v-if="promotion.promoIsActive" class="bmsm-mobile" :class="'ends-today'" ><bmsm-chart /></div>
    </template> -->
    <div class="mobile-cta">
      <a class="full-width" :href="i18n('mattressBaseSet', 'prodUrl')" id="HP_hero_bed-mob">
        <picture>
          <source srcset="./../assets/images/misc/fill.gif" media="(min-width: 769px)">
          <img src="./../assets/images/banners/mo-bed-mob.jpg" :alt="i18n('$local.$category.bed')" @load="emitTopImageLoaded">
        </picture>
        <span>{{i18n('$local.$category.bed')}} ></span>
      </a>
      <div class="mob-bedding clear">
        <a :href="i18n('bedBedding', 'catUrl')" id="HP-title-bedding">
          <h2 class="mob-title">{{i18n('$local.$category.bedding')}}</h2>
        </a>
          <ul>
            <li>
              <a :href="i18n('beddingSets', 'catUrl')" id="HP_bedding_sets_mob"><span>{{i18n('$local.$product.beddingSets')}} ></span>
                  <p>
                      <picture>
                          <source srcset="./../assets/images/misc/fill.gif" media="(min-width: 769px)">
                          <img src="./../assets/images/banners/hp-bedding-mob.jpg" :alt="i18n('$local.$product.beddingSets')">
                      </picture>
                  </p>
              </a>
          </li>
          <li>
            <a :href="i18n('linens', 'catUrl')" id="HP_linens_mob"><span>{{i18n('$local.$category.linens')}} ></span>
                <p>
                    <picture>
                        <source srcset="./../assets/images/misc/fill.gif" media="(min-width: 769px)">
                        <img src="./../assets/images/banners/hp-bedding-sets-mob.jpg" :alt="i18n('$local.$category.linens')">
                    </picture>
                </p>
            </a>
        </li>
          </ul>
      </div>
      <div class="mob-bath-spa clear">
        <a :href="i18n('bathSpa', 'catUrl')" id="HP-title-bath-spa">
          <h2 class="mob-title">{{i18n('$local.$category.bathSpa')}}</h2>
        </a>
        <a class="mob-single" :href="i18n('robes', 'catUrl')" id="HP_bath_body_mob">

          <picture>
            <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
            <img src="./../assets/images/banners/HP-Bath-Spa-mob.jpg" :alt="i18n('$local.$category.bathSpa')">
          </picture>
        </a>
        <ul>
          <li>
          <a :href="i18n('signatureTowels', 'catUrl')" id="CTA-Towels-mob"><span>{{i18n('$local.$category.towels')}} ></span>
            <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/HP-Towels-mob.jpg" :alt="i18n('$local.$category.towels')">
                </picture>
            </p>
        </a>
        </li>
        <li>
        <a :href="i18n('bathBody', 'catUrl')" id="CTA-lotion-mob"><span>{{i18n('$local.$category.bathBody')}} ></span>
          <p>
            <picture>
                <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                <img class="lazy" src="./../assets/images/banners/hp-bath-body-mob.jpg" :alt="i18n('$local.$category.bathBody')">
            </picture>
        </p>
        </a>
        </li>
        </ul>
      </div>
      <div class="mob-little-fans clear">
        <a :href="i18n('littleFans', 'catUrl')" id="HP-title-bath-spa">
          <h2 class="mob-title">{{i18n('$local.$category.littleFans')}}</h2>
        </a>
        <ul>
        <li>
        <a :href="i18n('minimoLinens', 'catUrl')" id="CTA-little-fans-bedding-mob"><span>{{i18n('$local.$category.miniMoLinens')}} ></span>
        <p>
            <picture>
                <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                <img class="lazy" src="./../assets/images/banners/hp-little-fans-bedding-mob.jpg" :alt="i18n('$local.$category.miniMoLinens')">
            </picture>
        </p>
        </a>
        </li>

        <li>
        <a :href="i18n('minimoRobe', 'prodUrl')" id="CTA-little-fans-robe-mob"><span>{{i18n('$local.$product.minimoRobe')}} ></span>
          <p>
            <picture>
                <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                <img class="lazy" src="./../assets/images/banners/HP-MiniMORobe-mob.jpg" :alt="i18n('$local.$product.minimoRobe')">
            </picture>
        </p>
        </a>
        </li>
        </ul>
    </div>
    <div class="mob-gifts clear clearfix">
         <a :href="i18n('signatureGifts', 'catUrl')" id="HP-title-gifts">
          <h2 class="mob-title">{{i18n('$local.$hpCopy.signatureHeading')}}</h2>
        </a>
        <a class="mob-single" :href="i18n('slippers', 'prodUrl')" id="CTA-gifts-mob">
          <picture>
            <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
            <img src="./../assets/images/banners/hp-slippers.jpg" :alt="i18n('$local.$category.bed')">
          </picture>
        </a>
        <ul>

        <li>
        <a :href="i18n('swimShorts', 'prodUrl')" id="CTA-Shorts-mob"><span>{{i18n('$local.$category.swimShorts')}} ></span>
        <p>
            <picture>
                <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                <img class="lazy" src="./../assets/images/banners/hp-exclusives-mob.jpg" :alt="i18n('$local.$category.swimShorts')">
            </picture>
        </p>
        </a>
        </li>

        <li>
        <a :href="i18n('giftThrow', 'prodUrl')" id="CTA-fpo-mob"><span>{{i18n('$local.$product.giftThrow')}} ></span>
          <p>
            <picture>
                <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                <img class="lazy" src="./../assets/images/banners/HP-Throw-mob.jpg" :alt="i18n('$local.$category.bed')">
            </picture>
        </p>
        </a>
        </li>
        </ul>
    </div>

    <div class="mob-exclusives clear clearfix">
        <a :href="i18n('hotelExclusives', 'catUrl')" id="HP-title-exclusives">
          <h2 class="mob-title">{{i18n('$local.$category.hotelExclusives')}}</h2>
        </a>
        <ul>
          <li>
            <a :href="i18n('fanByVivienne', 'prodUrl')" id="CTA-Kimono-mob"><span>{{i18n('$local.$product.fanByVivienne')}} ></span>
              <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/hp-hotel-exclusives-fan-mob.jpg" :alt="i18n('$local.$product.fanByVivienne')">
                </picture>
            </p>
            </a>
          </li>
          <li>
            <a :href="i18n('scarfByJim', 'prodUrl')" id="CTA-Kimono-mob"><span>{{i18n('$local.$product.scarfByJim')}} ></span>
              <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/hp-hotel-exclusives-scarf-mob.jpg" :alt="i18n('$local.$product.scarfByJim')">
                </picture>
            </p>
            </a>
          </li>
          <li>
            <a :href="i18n('cookbooks', 'catUrl')" id="CTA-Kimono-mob"><span>{{i18n('$local.$category.cookbooks')}} ></span>
              <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/hp-hotel-exclusives-books-mob.jpg" :alt="i18n('$local.$category.cookbooks')">
                </picture>
            </p>
            </a>
          </li>
          <li>
            <a :href="i18n('hongKongIceBucket', 'prodUrl')" id="CTA-Kimono-mob"><span>{{i18n('$local.$product.hongKongIceBucket')}} ></span>
              <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/hp-hotel-exclusives-ice-bucket-mob.jpg" :alt="i18n('$local.$product.hongKongIceBucket')">
                </picture>
            </p>
            </a>
          </li>
          <li>
            <a :href="i18n('japaneseYukata', 'prodUrl')" id="CTA-Kimono-mob"><span>{{i18n('$local.$product.japaneseYukata')}} ></span>
              <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/hp-yukatas-mob.jpg" :alt="i18n('$local.$product.japaneseYukata')">
                </picture>
            </p>
            </a>
          </li>
          <li>
            <a :href="i18n('tasselTowels', 'catUrl')" id="CTA-turkish-towels-mob"><span>{{i18n('$local.$category.tasselTowels')}} ></span>
            <p>
                <picture>
                    <source srcset="images/misc/fill.gif" media="(min-width: 769px)">
                    <img class="lazy" src="./../assets/images/banners/hp-tassel-towels-mob.jpg" :alt="i18n('$local.$category.tasselTowels')">
                </picture>
            </p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { getHomePageMobile } from './../api/api'
// import promoBanner from './../components/promotion/Banner'
// import noLrgImage from './../assets/images/products/MAR-no-lrg.jpg'
export default {
  name: 'HomeMobile',
  components: {
    // promoBanner,
  },
  data () {
    return {
      title: '',
      metaDescription: '',
      metaKeywords: '',
      banner: '',
      bannerMobile: '',
      lists: [],
      isDev: false
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        ogTitle: { name: 'og:title', content: this.title },
        ogType: { name: 'og:type', content: 'website' },
        ogUrl: { name: 'og:url', content: 'https://shopmo.com/' + this.lang },
        ogImage: { name: 'og:image', content: 'https://shopmo.com/statics/img/mobile/renaissance-signature-bedding-set_mob.jpg' },
        ogSiteName: { name: 'og:site_name', content: 'shopmo.com' }
      }
    }
  },
  computed: {
    ...mapState({
      homePc: state => state.site.homePc,
      lang: state => state.lang.lang,
      promotion: state => state.site.promotion
    }),
    lang: function () {
      console.log('lang', this.$store.state, this.$store.state.lang.lang)
      return '/' + this.$store.state.lang.lang
    },
    promoCountdownClass: function () {
      switch (this.promotion.promoDaysLeft) {
        case 0:
          return 'ends-today'
        case 1:
          return 'ends-tomorrow'
        case 2:
          return 'ends-date'
        default:
          return ''
      }
    }
  },
  watch: {
    lang: function (val, oldVal) {
      this.initPage()
    },
    'homePc.page_title': function (val, oldVal) {
      console.log('homePc.page_title', this, this.homePc)
      this.homeInit(this.homePc)
    }
  },
  methods: {
    homeInit (val) {
      console.log('home m home init', val)
      this.title = val.page_title || val.meta_title || ''
    },
    initPage () {
      console.log('getHomePageMobile initPage', this.homePc, this)
      this.banner = this.homePc.banner || ''
      this.bannerMobile = this.homePc.banner_mobile || ''
      this.title = this.homePc.meta_title || ''
      this.metaDescription = this.homePc.meta_description || ''
      this.metaKeywords = this.homePc.meta_keyword || ''
    },
    i18n (value, type) {
      if (type === 'prodUrl') {
        return this.lang + '/p/' + this.$i18n.t('$local.$urls.$product.' + value)
      } else if (type === 'catUrl') {
        return this.lang + '/c/' + this.$i18n.t('$local.$urls.$category.' + value)
      } else if (type === 'hpCopy') {
        return this.$i18n.t('$local.$hpCopy.' + value)
      } else if (type === 'prodName') {
        return this.$i18n.t('$local.$products.' + value)
      } else {
        return this.$i18n.t(value)
      }
    },
    emitTopImageLoaded () {
      this.$emit('topImageLoaded')
    }
  },
  created () {
    this.initPage()
  },
  mounted () {
    this.isDev = process.env.NODE_ENV === 'development'
  }
}
</script>
