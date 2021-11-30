<template>
  <q-page>
    <div :class="['help-page container clearfix', currency]">
      <promoBanner
        :promoIsActive="promotion.promoIsActive"
        :promoDaysLeft="promotion.promoDaysLeft"
        :promoEnds="promotion.promoEnd"
      />
      <help-menu />
      <div>
          <spinner  v-if="this.content === '' && !isContactUs" type="page" />
          <div v-if="!isContactUs" ref="htstr" v-html="content" />
          <contact-us v-else />
      </div>
    </div>
  </q-page>
</template>

<script>
import { getCMSPage } from './../api/api'
import { mapState } from 'vuex'
import helpMenu from './../components/help/Menu'
import contactUs from './../components/help/ContactUs'
import promoBanner from './../components/promotion/Banner'

export default {
  components: {
    'help-menu': helpMenu,
    'contact-us': contactUs,
    promoBanner
  },
  data () {
    return {
      content: '',
      cmsUrl: '',
      title: '',
      metaDescription: '',
      metaKeywords: '',
      isContactUs: false
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      titleTemplate: title => `${title}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      }
    }
  },
  methods: {
    initData (fromStoreId) {
      let formdata = {
        url: this.cmsUrl
      }
      if (fromStoreId) {
        formdata.from_store_id = fromStoreId
      }
      getCMSPage(formdata).then(data => {
        this.title = data.meta_title || data.page_title || ''
        this.metaDescription = data.meta_description || ''
        this.metaKeywords = data.meta_keyword || ''
        this.content = data.content
        this.$nextTick(() => {
          this.anchorMove()
        })
      }).then(error => {
        console.log(error)
      })
    },
    anchorMove (id) {
      try {
        if (this.$route.hash && document.querySelector(decodeURI(this.$route.hash))) {
          document.querySelector(this.$route.hash).scrollIntoView()
          window.scrollBy(0, -250)
        }
      } catch { }
    }
  },
  computed: {
    ...mapState({
      currency: state => state.lang.currency,
      lang: state => state.lang.lang,
      fromStoreId: state => state.lang.fromStoreId,
      promotion: state => state.site.promotion
    })
  },
  watch: {
    lang: function (val, oldVal) {
      console.log('watch lang 1:', this.lang, this.fromStoreId)
      if (this.fromStoreId) {
        // params.from_store_id = store.state.lang.fromStoreId
        this.initData(this.fromStoreId)
      } else {
        this.initData()
      }
    }
  },
  created () {
    this.cmsUrl = this.$route.params.note
    if (this.cmsUrl === 'contact-us') {
      this.isContactUs = true
    } else {
      this.isContactUs = false
      this.initData()
    }
    // window.$q = this.$q
  },
  beforeRouteUpdate (to, from, next) {
    this.content = ''
    this.cmsUrl = to.params.note
    if (this.cmsUrl === 'contact-us') {
      this.isContactUs = true
    } else {
      this.isContactUs = false
      this.initData()
    }
    next()
  },
  mounted () {
    try {
      document.querySelector('body').classList.add('pgfaq')
    } catch { }
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pgfaq')
    } catch { }
  }
}
</script>

<style lang="scss">
// $
@import "~src/css/europe/shippingTable";
.shipping-chart,
.bed-shipping-chart {
  display: none;
}
#zoneTable th,
#zoneTable td {
  padding: 5px 0;
}
#zoneTable {
  td {
    border: none;
  }
}
.faq {
  table td {
    padding: 0 0 0 5px;
  }
  h4 {
    padding: 20px 0px;
  }
}
.help-page {
  .content {
    margin: 0;
  }
}
// Currency Chart Display Logic
.EUR .shipping-chart#EUR,
.EUR .bed-shipping-chart#EUR {
  display: block;
}
.GBP .shipping-chart#GBP,
.GBP .bed-shipping-chart#GBP {
  display: block;
}
.CHF .shipping-chart#CHF,
.CHF .bed-shipping-chart#CHF {
  display: block;
}
.RON .shipping-chart#LEU,
.RON .bed-shipping-chart#LEU {
  display: block;
}
.PLN .shipping-chart#PLN,
.PLN .bed-shipping-chart#PLN {
  display: block;
}
.SEK .shipping-chart#SEK,
.SEK .bed-shipping-chart#SEK {
  display: block;
}
.CZK .shipping-chart#CZK,
.CZK .bed-shipping-chart#CZK {
  display: block;
}
.DKK .shipping-chart#DKK,
.DKK .bed-shipping-chart#DKK {
  display: block;
}
.AED .shipping-chart#AED,
.AED .bed-shipping-chart#AED {
  display: block;
}
</style>
