<template>
  <div>
    <template v-if="category && category.id">
      <category-normal :category="category" :url-key="urlKey" :lang="lang">
        <promoBanner
          :banner="category.banner"
          :banner-mobile="category.banner_mobile"
          :promoIsActive="category.promoIsActive"
          :promoDaysLeft="category.promoDaysLeft"
          :prodName="category.name"
          :promoEnds="category.promoEnd"
          :categoryId="category.promoCategoryId"
          :replacementName="category.promoCategoryReplacementName"
        />
      </category-normal>
      <gift-card v-if="category.id === '432' && false" />
    </template>
    <template v-else>
      <div class="net-error" v-if="!leave">
        <h4>{{refreshHeading}}</h4>
        <p>{{refreshTips}}</p>
        <div class="link">
          <link-btn-2 :text="refreshBtn" @click="initCategory" />
        </div>
      </div>
      <div v-else class="height-fixer">
        <spinner type="page" v-show="!this.$q.loading.isActive" />
      </div>
    </template>
  </div>
</template>

<script>
/* eslint-disable */

/* eslint-enable */
import { scroll } from 'quasar'
import { mapState, mapActions, mapMutations } from 'vuex'
import promoBanner from './../components/promotion/Banner'
import categoryNormal from './../components/product/CategoryNormal'
import linkBtn2 from './../components/ui/Button2'
// import langConfig from './../config/index'
import giftCard from './../components/home/GiftCard'

const { getScrollTarget, setScrollPosition } = scroll

export default {
  components: {
    promoBanner,
    'category-normal': categoryNormal,
    'link-btn-2': linkBtn2,
    'gift-card': giftCard
  },
  data () {
    return {
      /*
      category: {
        id: '',
        name: '',
        description: '',
        keywords: '',
        short_description: '',
        url: '',
        image: '',
        landing_page: '',
        children: [],
        breadcrumbs: []
      },
      */
      hotelsIds: [],
      leave: true,
      urlKey: ''
    }
  },
  computed: {
    ...mapState({
      stateStoreId: state => state.lang.storeId,
      stateNav: state => state.site.siteNav,
      lang: state => state.lang.lang,
      currency: state => state.lang.currency,
      category: state => state.prod.category,
      hasLoginSuccess: state => state.site.hasLoginSuccess,
      faviHash: state => state.site.faviHash
    }),
    refreshHeading: function () {
      return this.$i18n.t('$common.$validation.refreshHeading')
    },
    refreshTips: function () {
      return this.$i18n.t('$common.$validation.refreshTips')
    },
    refreshBtn: function () {
      return this.$i18n.t('$common.$buttons.refresh')
    },
    title: function () {
      if (this.category) {
        return this.category.meta_title || this.category.page_title || this.category.name
      } else {
        return ''
      }
    },
    meta_description: function () {
      if (this.category) {
        return this.category.meta_description || ''
      } else {
        return ''
      }
    },
    meta_keyword: function () {
      if (this.category) {
        return this.category.meta_keyword || ''
      } else {
        return ''
      }
    },
    isHotelsCategory: function () {
      if (this.category && this.category.id) {
        if (this.hotelsIds.indexOf(this.category.id) !== -1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    dataTag: function () {
      if (this.category) {
        if (this.lang || this.category.name || this.category.id) {
          return `${this.lang}${this.category.name}${this.category.id}`
        } else {
          return ''
        }
      } else {
        return ''
      }
    },
    pageDescription: function () {
      let description = this.category.description || ''
      return description.replace(/<\/?[^>]+(>|$)/g, '')
    },
    hrefData () {
      if (this.category && this.category.hreflangs) {
        let hreflangs = this.category.hreflangs
        let hrefData = {}
        let canonicalLink = ''
        if (typeof window !== 'undefined') {
          canonicalLink = window.location.href
        }
        // Order Hreflangs Manually
        let hrefOrder = ['en-us', 'en-ie', 'en', 'fr', 'de', 'es']
        hrefOrder.forEach(key => {
          if (hreflangs[key] !== null) {
            hrefData[key] = {
              'href': hreflangs[key],
              'hreflang': key,
              'ref': 'alternate'
            }
          }
          if (key === this.lang) {
            canonicalLink = hreflangs[key]
          }
        })
        hrefData['canonical'] = {
          'href': canonicalLink,
          'ref': 'canonical'
        }
        return hrefData
      } else {
        return false
      }
    }
  },
  meta () {
    return {
      // sets document title
      title: this.title,
      // optional; sets final title as "Index Page - My Website", useful for multiple level meta
      // titleTemplate: title => `${title} - ${this.$i18n.t('$local.siteTitle')}`,
      // meta tags
      meta: {
        description: { name: 'description', content: this.meta_description },
        keywords: { name: 'keywords', content: this.meta_keyword },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        ogTitle: { name: 'og:title', content: this.category.name },
        // ogType: { name: 'og:type', content: 'website' },
        ogDescription: { name: 'og:description', content: '<headline>' + this.category.name + '</headline>' + '<details>' + this.pageDescription + '</details>' },
        ogUrl: { name: 'og:url', content: 'https://shopmo.com/' + this.lang + '/c/' + this.urlKey },
        ogImage: { name: 'og:image', content: this.category.image }
        // ogSiteName: { name: 'og:site_name', content: 'shopmo.com' }
      },
      link: this.hrefData
    }
  },
  watch: {
    stateNav: function (newValue, oldValue) {
      console.log('new value', newValue)
    },
    currency: function (val, oldVal) {
      this.initCategory()
    },
    // lang: function (newVal, oldVal) {
    //   if (newVal) {
    //     this.initCategory(langConfig[oldVal].storeId)
    //   }
    // },
    // 'category.id': function (newVal, oldVal) {
    //   console.log('category watch category.id', newVal)
    //   if (newVal) {
    //     this.initCategoryData()
    //   }
    // },
    dataTag: function (newVal, oldVal) {
      window.scrollTo(0, 0)
      console.log('category watch dataTag 0', oldVal, '>>>', newVal, this.category, this.category.url, this.$route)
      // console.log('product watch product.name', this.product.breadcrumbs[0].url + '_' + this.product.url, this.$route)
      if (newVal) {
        let newUrl = ''
        newUrl = this.category.url
        console.log('category watch dataTag 1', this.lang, newUrl)
        if (newUrl && this.lang) {
          this.$router.push({
            params: {
              lang: this.lang,
              c: newUrl
            }
          })
        }
        this.setIsLoading(false)
        console.log('category watch dataTag 2', newUrl, this.$route)
      }
      if (this.isLogin) {
        this.updateFav()
      }
    },
    hasLoginSuccess: function (newVal, oldVal) {
      console.log('search watch hasLoginSuccess', newVal, this.isLogin)
      this.isLogin = true
      this.getFaviList()
    },
    faviHash: function (newVal, oldVal) {
      console.log('category watch faviHash', newVal, this.isLogin)
      if (this.isLogin) {
        this.updateFav()
      }
    }
  },
  methods: {
    ...mapActions(
      'prod',
      ['getCategoryAction']
    ),
    ...mapActions(
      'site',
      [
        'getFaviList',
        'setIsLoading'
      ]
    ),
    ...mapMutations(
      'prod',
      [
        'saveCategory'
      ]
    ),
    initCategory (fromStoreId) {
      let params = {
        url_key: this.urlKey
      }
      if (fromStoreId) {
        params.from_store_id = fromStoreId
      }
      this.getCategoryAction(params)
    },
    updateFav () {
      // this.lists = data
      if (this.category.children && this.category.children.length > 0) {
        for (let i = 0; i < this.category.children.length; i++) {
          const item = this.category.children[i]
          console.log('update faviList 1-1', i, this.category.children[i], this.faviHash[item.id])
          if (this.faviHash[item.id]) {
            this.category.children[i].isFavi = true
            this.category.children[i].item_id = this.faviHash[item.id]
          }
        }
      }
      console.log('update faviList 2', this.faviHash, this.category)
    },
    createCategory (urlKey) {
      this.urlKey = urlKey
      // this.initCategory()
    },
    initCategoryData () {
      if (!this.category.id) {
        this.initCategory()
        return false
      }
      this.tracking()
      // this.initMetadataLink()
    },
    tracking () {
      let options = {
        lang: this.lang,
        title: this.title,
        url: this.$route.fullPath
      }
      this.$trackPageView(options)
    },
    setLeave () {
      let _this = this
      setTimeout(() => {
        if (!_this.category.id) {
          _this.leave = false
        }
      }, 60000)
    },
    scrollToElement (el) {
      if (el) {
        const target = getScrollTarget(el)
        const offset = el.offsetTop
        const duration = 1000
        setScrollPosition(target, offset, duration)
      }
    },
    anchorMove () {
      try {
        if (this.$route.hash && document.querySelector(decodeURI(this.$route.hash))) {
          this.scrollToElement(document.querySelector(decodeURI(this.$route.hash)))
        }
      } catch { }
    }
  },
  props: {
    closeMenuFired: {
      type: Boolean,
      default: false
    }
  },
  created () {
    if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  updated () {
    try {
      var AOS = require('aos')
      AOS.init()
    } catch { }
  },
  mounted () {
    this.urlKey = this.$route.params.c
    this.initCategoryData()
    this.setLeave()
    this.setIsLoading(false)
    if (this.isLogin) {
      this.getFaviList()
      this.updateFav()
    }
    try {
      this.$nextTick(() => {
        this.anchorMove()
        var AOS = require('aos')
        AOS.init()
      })
    } catch { }
  },
  beforeMount () {
    try {
      document.querySelector('body').classList.add('pgcategory')
    } catch { }
  },
  beforeRouteUpdate (to, from, next) {
    this.setLeave()
    this.createCategory(to.params.c)
    next()
  },
  beforeRouteLeave (to, from, next) {
    console.log(to.name, 'leave')
    if (to.name !== 'category') {
      this.leave = true
      this.saveCategory({})
    }
    next()
    try {
      document.querySelector('body').classList.remove('pgcategory')
      document.body.id = ''
    } catch { }
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pgcategory')
    } catch { }
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    let params = {
      url_key: currentRoute.params.c
    }
    console.log('category preFetch 1:', store.state.lang.fromStoreId)
    if (store.state.lang.fromStoreId) {
      params.from_store_id = store.state.lang.fromStoreId
    }
    return new Promise((resolve, reject) => {
      store.dispatch('prod/getCategoryAction', params).then(() => {
        console.log(store.state)
        resolve()
      }).catch(error => {
        reject(error)
      })
    }).then(() => {
      console.log('store save end')
    }).catch(error => {
      console.log('store save error', error)
      if (error === 'Invalide category.') {
        let url = `/${store.state.lang.lang}/404`
        redirect(url)
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.net-error {
  max-width: 1440px;
  padding: 0 16px;
  margin: 0 auto;
  h4 {
    font-size: 2rem;
    font-family: $typography-font-family;
    text-transform: uppercase;
  }
  .link {
    display: inline-block;
  }
}
.content {
  min-height: 50vh;
}
.height-fixer {
  min-height: 50vh;
}
@media screen and (max-width: 599px) {
  .net-error {
    text-align: center;
    .link-btn-2 {
      padding-left: 10px;
    }
  }
}
</style>
