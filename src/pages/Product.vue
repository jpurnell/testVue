<template>
  <div>
    <q-scroll-observer @scroll="scrollHandler" />
    <template v-if="product.id && isRouterAlive && !pageLoading">
      <!-- <promotion
        :banner="product.banner"
        :banner-mobile="product.banner_mobile"
        :promoIsActive="product.promoIsActive"
        :promoDaysLeft="product.promoDaysLeft"
        :prodName="product.breadcrumbs[product.breadcrumbs.length - 1] ? product.breadcrumbs[product.breadcrumbs.length - 1].name : ''"
        :promoEnds="product.promoEnd"
        :categoryId="product.promoCategoryId"
        :replacementName="product.promoCategoryReplacementName"
      /> -->
      <breadcrumb :breadcrumbs="product.breadcrumbs" :current="product.name" :sku="product.sku" />
      <div ref="product" class="product" :class="lang" :key="componentKey" itemscope itemtype="http://schema.org/Product">
        <meta itemprop="image" :content="metaImage" />
        <meta itemprop="sku" :content="productSku" />
        <h1 class="name" itemprop="name"><span itemprop="brand" itemscope itemtype="http://schema.org/Brand" style="display: none;"><span itemprop="name">{{hotelsName}} </span></span>{{product.name}}</h1>
        <div class="image-wrap clearfix">
          <div class="grid-4 left">
            <div class="item-image pic-buypanel">
              <div class="spinner">
                <q-spinner
                  color="primary"
                  size="4em"
                  :thickness="2"
                />
              </div>
              <div v-if="currentGallery && currentGallery.length > 0" class="product-pic">
                <q-carousel
                  ref="carousel"
                  swipeable
                  animated
                  transition-prev="slide-right"
                  transition-next="slide-left"
                  :autoplay="false"
                  v-model="slide"
                  :height="galleryHeight"
                  prev-icon="left-arrow"
                  next-icon="right-arrow"
                >
                  <q-carousel-slide v-for="(kv, index) in currentGallery" :key="index" :name="index" :ratio="1200/933" :img-src="typeof(kv) === 'string' ? kv : kv[0]" @click="showFullImg" class="color-slide" />
                </q-carousel>
                <template v-if="currentGallery && currentGallery.length > 1">
                  <div v-if="slide !== 0" class="customer-carousel-arrow prev" @click="carouselPrev">
                    <q-icon name="icon-left-arrow" color="white" />
                  </div>
                  <div v-if="slide !== currentGallery.length-1" class="customer-carousel-arrow next" @click="carouselNext">
                    <q-icon name="icon-right-arrow" color="white" />
                  </div>
                </template>
              </div>
              <div v-if="product.is_new === '1'" class="is-new">
                <div class="is-new-bg"></div>
                <label>NEW</label>
              </div>
              </div>
          </div>
          <div class="grid-6 right">
            <div class="cart-handler clearfix">
              <h2 class="name" itemprop="name" id="productName"><span itemprop="brand" itemscope itemtype="http://schema.org/Brand" style="display: none;"><span itemprop="name">{{hotelsName}} </span></span>{{product.name}}</h2>
              <options-panel
                v-if="product.url"
                :qty="selectQty"
                :qty-info="qtyInfo"
                :stock-info="stockInfo"
                :product="product"
                :show-price="showPrice"
                :market-show-price="showMktPrice"
                :selected-id="selectProduct"
                :select-options="selectOptions"
                :select-val="selectVal"
                :relation-disable="relationDisable"
                :relation-check-box-group="relationCheckBoxGroup"
                :relation-product="relationProduct"
                :lang="lang"
                :currency="currency"
                @showSizeChart="showSizeChart"
                @showBedBaseColors="showBedBaseColors"
                @showBedLegColors="showBedLegColors"
                @changeOption="selectOption"
                @updateSelectValId="updateSelectValId"
                @pushToSelectVal="pushToSelectVal"
                @updateQty="updateQty"
                @addtoCartPost="addtoCartPost"
                @changeRelation="changeRelation"
                @showPopImg="showFullImg"
              >
                <q-btn
                  flat
                  round
                  color="accent"
                  :icon="iconFavi"
                  @click="submitSwitchFavi"
                  class="favi"
                ><span class="hidden">{{i18n('$common.$labels.wishlist')}}</span></q-btn>
              </options-panel>
            </div>
          </div>
        </div>
        <div class="item-copy clear">
          <div ref="description"></div>
          <div id="tabs">
            <ul class="tab-links">
                <li :class="[tab === 'description' ? 'active' : '']" id="GA_Tab-1"  itemprop="description" @click="infoTabs('description')">
                  <a @click.prevent href="#tab-1"><span>{{description}}</span></a>
                </li>
                <li :class="[tab === 'information' ? 'active' : '']" id="GA_Tab-2" @click="infoTabs('information')">
                  <a @click.prevent href="#tab-2"><span>{{details}}</span></a>
                </li>
            </ul>
            <div id="tab-1" itemprop="description" v-html="product.description" v-show="tab === 'description'"></div>
            <div id="tab-2" v-html="product.information" v-show="tab === 'information'"></div>
          </div>
        </div>
        <section>
          <div class="similar-items clearfix">
            <h2>{{ relationProductLabel }}</h2>
            <ul class="relation clearfix" v-if="product.upsells_products && product.upsells_products.length > 0">
              <li v-for="(item, index) in product.upsells_products" :key="index">
                <div class="relation-item" v-if="index < 4" :key="item.product_id">
                  <router-link :to="{name: 'product', params: {p: item.url}}">
                    <h4 class="p-name">{{ item.name }}</h4>
                    <img :src="relationImage(item.image)" :alt="item.name" />
                    <span class="btn-main"><span>{{toViewText}}</span></span>
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>
      <q-dialog v-model="isShowSizeChart">
        <q-card style="max-width: 80vw;">
          <q-card-actions align="right">
            <q-btn flat icon="icon-close" v-close-popup />
          </q-card-actions>
          <q-card-section class="row items-center">
            <size-chart :size-chart-html="productSizeChart" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="isShowBedBaseColors">
        <q-card class="bed-base-modal">
          <q-card-actions align="right">
            <q-btn flat icon="icon-close" v-close-popup />
          </q-card-actions>
          <q-card-section class="row items-center">
            <bed-base-colors />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="isShowBedLegColors">
        <q-card class="bed-leg-modal">
          <q-card-actions align="right">
            <q-btn flat icon="icon-close" v-close-popup />
          </q-card-actions>
          <q-card-section class="row items-center">
            <leg-colors />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-dialog v-model="isShowOptionsPanel" full-width position="bottom">
        <q-card style="max-width: 100vw;" class="mobile-options-card-dialog">
          <q-card-actions align="right">
            <q-btn flat icon="icon-close" v-close-popup />
          </q-card-actions>
          <q-card-section class="row options-panel-mobile">
            <options-panel
              :qty="selectQty"
              :qty-info="qtyInfo"
              :stock-info="stockInfo"
              :product="product"
              :show-price="showPrice"
              :market-show-price="showMktPrice"
              :selected-id="selectProduct"
              :select-options="selectOptions"
              :select-val="selectVal"
              :relation-disable="relationDisable"
              :relation-check-box-group="relationCheckBoxGroup"
              :relation-product="relationProduct"
              :lang="lang"
              :currency="currency"
              :bottom="true"
              @showSizeChart="showSizeChart"
              @changeOption="selectOption"
              @updateSelectValId="updateSelectValId"
              @pushToSelectVal="pushToSelectVal"
              @updateQty="updateQty"
              @addtoCartPost="addtoCartPost"
              @changeRelation="changeRelation"
              @showPopImg="showFullImg"
              v-model="isShowAddCart"
            />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-page-sticky expand position="bottom" v-show="isShowFooter" class="p-footer">
        <q-toolbar class="footer-bar">
          <link-btn-2 :text="addtoCartText" @click="showOptionsPanel" />
        </q-toolbar>
      </q-page-sticky>
      <q-dialog
        v-model="fullscreen"
        full-width
        full-height
      >
        <div class="pop-slide">
          <template v-if="currentPopGallery && currentPopGallery.length > 0">
            <q-carousel
              ref="carouselPop"
              swipeable
              animated
              :autoplay="false"
              v-model="popSlide"
              :arrows="false"
              infinite
              keep-alive
              class="popup"
            >
              <q-carousel-slide v-for="(kv, index) in currentPopGallery" :key="index" :name="index">
                <div class="slide-item">
                  <img :src="kv" class="slide-img" />
                  <div class="product-popup-name"><span>{{popName}}</span></div>
                </div>
              </q-carousel-slide>
            </q-carousel>
            <div class="pop-slide-mask">
              <div class="pop-slide-mask-closearea" @click="closePopSlide"></div>
              <div class="pop-slide-nav">
                <img src="~assets/img/slide-mask.png" width="1200" height="624" alt="" @load="onSlideMaskLoad"/>
                <div class="pop-slide-mask-close" @click="closePopSlide" v-show="slideMaskLoaded">
                  <q-icon name="icon-close" color="white" size="18px" />
                </div>
                <template v-if="currentPopGallery && currentPopGallery.length > 1">
                  <div v-if="popSlide !== 0" class="customer-carousel-pop-arrow prev" @click="slidePrev">
                    <q-icon name="icon-right-arrow" color="white" class="left-arrow" />
                  </div>
                  <div v-if="popSlide !== currentPopGallery.length-1" class="customer-carousel-pop-arrow next" @click="slideNext">
                    <q-icon name="icon-right-arrow" color="white" />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </div>
      </q-dialog>
    </template>
    <template v-else>
      <div class="net-error" v-if="netError">
        <h4>{{refreshHeading}}</h4>
        <p>{{refreshTips}}</p>
        <div class="link">
          <link-btn-2 :text="refreshBtn" @click="initProduct" />
        </div>
      </div>
      <spinner v-else type="page" />
    </template>
    <q-resize-observer @resize="onResize" />
  </div>
</template>

<script>
/* eslint-disable */

/* eslint-enable */

import { dom } from 'quasar'
import { mapState, mapActions, mapMutations } from 'vuex'
import { addToFavi, initFaviStatus, faviRemove } from '../api/api'
import StoreId from './../mixins/StoreId'
// import promotion from './../components/promotion/Banner'
import linkBtn2 from './../components/ui/Button2'
import breadcrumb from './../components/product/Breadcrumb'
import sizechart from '../components/product/SizeChart'
import BedBaseColorsModal from '../components/product/BedBaseColorsModal'
import BedLegColorsModal from '../components/product/BedLegColorsModal'
import optionspanel from '../components/product/OptionsPanel'
import noImage from './../assets/images/products/MAN-no-lrg.jpg'
// import langConfig from './../config/index'

const { width } = dom

export default {
  mixins: [StoreId],
  components: {
    // promotion,
    breadcrumb,
    'size-chart': sizechart,
    'bed-base-colors': BedBaseColorsModal,
    'leg-colors': BedLegColorsModal,
    'options-panel': optionspanel,
    'link-btn-2': linkBtn2
  },
  data () {
    return {
      slide: 0,
      popSlide: 0,
      tab: 'description',
      fullscreen: false,
      gallery: ['/statics/img/fill.gif'],
      popGallery: [],
      query: {
        currency: 'EUR'
      },
      selectProduct: '',
      selectOptions: [],
      selectVal: [],
      selectQty: 1,
      isShowSizeChart: false,
      isShowBedBaseColors: false,
      isShowBedLegColors: false,
      isShowFooter: false,
      pageReady: false,
      isShowOptionsPanel: false,
      isShowOptionImg: false,
      isShowAddCart: true,
      currentImg: [],
      currentPopImg: [],
      isShowRelationImg: false,
      relationImg: '',
      relationName: '',
      qtyInfo: '',
      stockInfo: '',
      relationCheckBoxGroup: [],
      relationProduct: [],
      relationDisable: false,
      isFavi: false,
      faviProduct: '',
      faviItemId: '',
      urlKey: '',
      isLogin: false,
      screenWidth: 1024,
      netError: false,
      galleryHeight: '600px',
      isRouterAlive: true,
      componentKey: 0,
      slideMaskLoaded: false
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
        description: { name: 'description', content: this.metaDescription },
        keywords: { name: 'keywords', content: this.metaKeywords },
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
        ogTitle: { name: 'og:title', content: this.title },
        ogDescription: { name: 'og:description', content: this.productDescriptionMeta },
        ogUrl: { name: 'og:url', content: 'https://shopmo.com/' + this.lang + '/p/' + this.urlKey },
        ogImage: { name: 'og:image', content: this.metaImage }
      },
      link: this.hrefData
    }
  },
  computed: {
    ...mapState({
      product: state => state.prod.product,
      productId: state => state.cart.productId,
      cartQty: state => state.cart.cartQty,
      hasLoginSuccess: state => state.site.hasLoginSuccess,
      fromStoreId: state => state.lang.fromStoreId,
      lang: state => state.lang.lang,
      pageLoading: state => state.site.pageLoading
    }),
    showCartQty: function () {
      return parseInt(this.cartQty, 10) > 0
    },
    hotelsName: function () {
      return this.$i18n.t('$local.hotelName')
    },
    addtoCartText: function () {
      return this.$i18n.t('$common.$buttons.addtoCart')
    },
    description: function () {
      return this.$i18n.t('$common.$labels.description')
    },
    details: function () {
      return this.$i18n.t('$common.$labels.details')
    },
    relationProductLabel: function () {
      return this.$i18n.t('$common.$headings.ymal')
    },
    selectOptionTips: function () {
      return this.$i18n.t('$common.$validation.selectOption')
    },
    toViewText: function () {
      return this.$i18n.t('$common.$buttons.shopNow')
    },
    refreshHeading: function () {
      return this.$i18n.t('$common.$validation.refreshHeading')
    },
    refreshTips: function () {
      return this.$i18n.t('$common.$validation.refreshTips')
    },
    refreshBtn: function () {
      return this.$i18n.t('$common.$buttons.refresh')
    },
    loginText: function () {
      return this.$i18n.t('$common.$validation.wishlistGuest')
    },
    title: function () {
      if (this.product && this.product.meta_title) {
        return this.product.meta_title
      } else {
        return ''
      }
    },
    metaDescription: function () {
      if (this.product && this.product.meta_description) {
        return this.product.meta_description
      } else {
        return ''
      }
    },
    productDescriptionMeta () {
      if (this.product && this.product.description) {
        return this.product.description
      } else {
        return ''
      }
    },
    productSku () {
      if (this.product && this.product.sku) {
        return this.product.sku
      } else {
        return ''
      }
    },
    metaKeywords: function () {
      if (this.product && this.product.meta_keyword) {
        return this.product.meta_keyword
      } else {
        return ''
      }
    },
    metaImage: function () {
      if (this.isShowOptionImg && this.currentImg.length > 0) {
        return this.currentImg[0]
      } else if (this.gallery.length > 0) {
        return this.gallery[0]
      } else {
        return ''
      }
    },
    showPrice: function () {
      if (this.product.index && this.product.index instanceof Object && this.selectProduct) {
        return this.product.prices[this.selectProduct].price
      } else {
        return this.product.price
      }
    },
    showMktPrice: function () {
      if (this.product.index && this.product.index instanceof Object && this.selectProduct) {
        return this.product.prices[this.selectProduct].market_price
      } else {
        return this.product.market_price
      }
    },
    optionsSKUId: function () {
      if (this.product.index && this.product.index instanceof Object) {
        let key = Object.keys(this.product.index)
        let newKey = []
        key.forEach(id => {
          if (id.indexOf('|') !== -1) {
            let ids = id.split('|')
            ids.sort(function (a, b) {
              if (isNaN(a) || isNaN(b)) {
                return a > b ? 1 : -1
              }
              return a - b
            })
            newKey.push(ids.join('|'))
          } else {
            newKey.push(id)
          }
        })
        // // console.log(newKey, 'options index id')
        return newKey
      } else {
        return []
      }
    },
    dataTag: function () {
      if (this.product.id || this.product.name || this.urlKey) {
        return `${this.product.id}${this.product.name}${this.urlKey}`
      } else {
        return ''
      }
    },
    currentGallery: function () {
      if (this.isShowOptionImg) {
        return [this.currentImg]
      } else {
        return this.gallery
      }
    },
    currentPopGallery: function () {
      // console.log('computed popGallery', this)
      if (this.isShowRelationImg) {
        return [this.relationImg]
      } else if (this.isShowOptionImg) {
        return [this.currentPopImg]
      } else {
        return this.popGallery
      }
    },
    popName: function () {
      if (this.isShowRelationImg) {
        return this.relationName
      } else {
        return this.product.name
      }
    },
    productSizeChart: function () {
      if (!this.product.size_chart) {
        return ''
      }
      // console.log('productSizeChart 1', this.product)
      try {
        let chart = this.product.size_chart
        let col = []
        let row = []
        let leave1 = chart.split('<th class="text-center">')
        let leave2 = chart.split('<tbody>')
        let leave3 = leave2[1].split('<tr>')
        let desc = chart.split('<p style="font-size: 14px; text-align: center;">')[1].split('</p>')[0]
        for (let index = 1; index < leave1.length; index++) {
          const element = leave1[index]
          col.push(element.split('</th>')[0])
        }
        for (let index = 0; index < leave3.length; index++) {
          const element = leave3[index]
          if (element.indexOf('</td>') > 0) {
            let leave = element.split('</td>')
            let rowData = []
            for (let i = 0; i < leave.length; i++) {
              const e = leave[i]
              if (e.indexOf('<td class="text-center">') > 0) {
                rowData.push(e.split('<td class="text-center">')[1])
              }
            }
            row.push(rowData)
          }
        }
        // console.log('productSizeChart', leave1, leave2, leave3, col, row)
        return { title: col, data: row, desc: desc }
      } catch (error) {
        let chart = this.product.size_chart
        let col = []
        let row = []
        let leave1 = chart.split('<th class="text-center">')
        let leave2 = chart.split('<tbody>')
        let leave3 = leave2[1].split('<tr class="">')
        let desc = chart.split('<p class="tips">')[1].split('</p>')[0]
        for (let index = 1; index < leave1.length; index++) {
          const element = leave1[index]
          col.push(element.split('</th>')[0])
        }
        for (let index = 0; index < leave3.length; index++) {
          const element = leave3[index]
          if (element.indexOf('</td>') > 0) {
            let leave = element.split('</td>')
            let rowData = []
            for (let i = 0; i < leave.length; i++) {
              const e = leave[i]
              if (e.indexOf('<td class="text-center">') > 0) {
                rowData.push(e.split('<td class="text-center">')[1])
              }
            }
            row.push(rowData)
          }
        }
        // console.log('productSizeChart', leave1, leave2, leave3, col, row)
        return { title: col, data: row, desc: desc }
      }
    },
    iconFavi: function () {
      return this.isFavi ? 'icon-heart-filled' : 'icon-heart'
    },
    hrefData: function () {
      if (this.product && this.product.hreflangs) {
        let hreflangs = this.product.hreflangs
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
    },
    topProductName: function () {
      if (this.screenWidth <= 1010 || (this.lang === 'de' && this.screenWidth <= 1400)) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    selectOptions: function (val, oldVal) {
      let nowSelected = val.concat([])
      nowSelected.sort(function (a, b) {
        // eslint-disable-next-line no-useless-escape
        a = a.replace(/\"/g, '')
        // eslint-disable-next-line no-useless-escape
        b = b.replace(/\"/g, '')
        if (isNaN(a) || isNaN(b)) {
          return a > b ? 1 : -1
        }
        return a - b
      })
      let nowSelectedString = nowSelected.join('|')
      // eslint-disable-next-line no-useless-escape
      let newString = nowSelectedString.replace(/\"/g, '')
      if (this.optionsSKUId.indexOf(newString) !== -1) {
        this.selectProduct = newString
      } else {
        this.selectProduct = ''
      }
    },
    selectProduct: function (val, oldVal) {
      this.currentSKU()
    },
    currency: function (val, oldVal) {
      this.$router.go(0)
    },
    'product.related_products': {
      handler (val, oldVal) {
        // console.log(val, 'relation .....')
        if (val) {
          this.initRelationCheckBoxGroup()
        }
      },
      deep: true
    },
    relationProduct: {
      handler (val, oldVal) {
        // console.log(val, 'relation .....')
      },
      deep: true
    },
    productId: function (val, oldVal) {
      this.initCurrentProductFavi()
    },
    faviProduct: function (val, oldVal) {
      this.initCurrentProductFavi()
    },
    dataTag: function (val, oldVal) {
      console.log('dataTag  - product change watch')
      if (val) {
        this.initProductData()
      }
    },
    hasLoginSuccess: function (newVal, oldVal) {
      // console.log(newVal)
      this.isLogin = newVal
    },
    currentGallery: function (newVal, oldVal) {
      this.slide = 0
    },
    currentPopGallery: function (newVal, oldVal) {
      this.slide = 0
    },
    isLogin: function (newVal, oldVal) {
      this.initCurrentProductFavi()
    },
    lang: function (newVal, oldVal) {
      // // console.log('product watch lang', newVal, oldVal, langConfig[oldVal].storeId)
      if (newVal) {
        // this.initProduct(langConfig[oldVal].storeId)
        // this.$router.push({ name: this.$route.name, params: this.$route.params, query: this.$route.query })
        // this.initProductData()
      }
    },
    'product.name': function (newVal, oldVal) {
      // console.log('product watch product.name 1 ---', newVal, '---', oldVal)
      // console.log('product watch product.name 2', this.fromStoreId, (!this.fromStoreId || this.fromStoreId === ''))
      if (!this.fromStoreId || this.fromStoreId === '') {
        this.reload()
        return false
      }
      // console.log('product watch product.name 3', this.product.breadcrumbs[0].url + '_' + this.product.url, this.$route)
      let newUrl = ''
      if (newVal && oldVal !== newVal) {
        if (this.product.breadcrumbs[0]) {
          // newUrl = this.product.breadcrumbs[0].url + '_' + this.product.url
          let breadcurmbLength = this.product.breadcrumbs.length
          this.$router.push({
            params: {
              lang: this.lang,
              p: this.product.url,
              c: this.product.breadcrumbs[breadcurmbLength - 1].url
            }
          })
        } else {
          newUrl = this.product.url
          this.$router.push({
            params: {
              lang: this.lang,
              p: newUrl
            }
          })
        }
        // this.$router.push({
        //   params: {
        //     lang: this.lang,
        //     p: newUrl
        //   }
        // })
        this.setFromStoreId()
      }
      // console.log('product watch product.name 4', newUrl)
    },
    product: function (newVal, oldVal) {
      // this.initProductData()
      this.componentKey += 1
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setNeedShowLogin',
        'setIsLoading'
      ]
    ),
    ...mapActions(
      'cart',
      [
        'saveProductIdToState',
        'buyProduct'
      ]
    ),
    ...mapActions(
      'prod',
      [
        'getProductAction'
      ]
    ),
    ...mapActions(
      'lang',
      [
        'setFromStoreId'
      ]
    ),
    ...mapMutations(
      'prod',
      [
        'saveProduct'
      ]
    ),
    initProduct () {
      let params = {
        currency: this.currency,
        url_key: this.urlKey
      }
      if (this.$route.params.c) {
        params.url_key = this.$route.params.c + '.' + this.$route.params.p
        // console.log('product page initProduct', this.$route, params)
      }
      this.getProductAction(params)
    },
    initProductData () {
      // let now = new Date()
      // console.log('state product info initProductData', this.product)
      if (!this.product.id) {
        this.initProduct()
        return false
      }
      this.netError = false
      this.tracking()
      let image = this.product.image ? [this.product.image] : []
      let imageLarge = this.product.image_large ? [this.product.image_large] : [this.product.image]
      // console.log('initProductData 1', image, this.product.image, this.product.gallery)
      this.gallery = image.concat(this.product.gallery)
      this.popGallery = imageLarge.concat(this.product.gallery_large ? this.product.gallery_large : this.product.gallery)
      // console.log('initProductData 2', this.gallery, image.concat(this.product.gallery), this.popGallery)
      this.faviProduct = this.product.id
      if (this.product.type) {
        if (this.product.type === 'simple') {
          this.saveProductId(this.product.id)
          // if (this.product.stock_status === '0') {
          //   this.qtyInfo = '0'
          // } else {
          //   this.qtyInfo = this.product.stock_threshold || ''
          //   this.stockInfo = this.product.stock_info || ''
          // }
        }
        if (this.product.type === 'grouped' || this.product.type === 'kit' || this.product.type === 'configurable') {
          if (this.product.index.length === 0) {
            this.saveProductId(this.product.id)
            // if (this.product.stock_status === '0') {
            //   this.qtyInfo = '0'
            // } else {
            //   this.qtyInfo = this.product.stock_threshold || ''
            //   this.stockInfo = this.product.stock_info || ''
            // }
          } else {
            this.setSelected(this.product.index, this.product.options)
          }
          this.initOptions()
        }
        if (this.product.stock_status === '0') {
          this.qtyInfo = '0'
        } else {
          this.qtyInfo = this.product.stock_threshold || ''
          this.stockInfo = this.product.stock_info || ''
          if (typeof this.product.stock_statues === 'object' && Object.keys(this.product.stock_statues).length > 0) {
            let instockItem = 0
            for (let key of Object.keys(this.product.stock_statues)) {
              if (this.product.stock_statues[key]) {
                instockItem = instockItem + 1
              }
            }
            if (instockItem === 0) {
              this.qtyInfo = '0'
            }
          }
        }
        // if (!this.product.show_add_cart){
        this.isShowAddCart = this.product.show_add_cart || true
        // }
        this.initRelationCheckBoxGroup()
      }
      this.initProductImageSize()
    },
    initProductImageSize () {
      try {
        // let dom = this.$refs.carousel
        if (this.$refs.carousel) {
          let div = document.querySelector('.product-pic')
          let divComputedStyle = getComputedStyle(div, null)
          let widthVal = divComputedStyle.width.split('px')[0]
          let newHeight = Number(widthVal) * 933 / 1200
          this.galleryHeight = newHeight + '' + 'px'
          // console.log('initProductImageSize 1:' + this.$refs.carousel.offsetHeight, divComputedStyle.width, widthVal, newHeight)
        }
      } catch { }
    },
    saveProductId (id) {
      this.saveProductIdToState(id)
    },
    setSelected (index, options) {
      let keys = Object.keys(index)
      if (keys.length === 1) {
        let selectedId = index[keys[0]]
        this.faviProduct = selectedId
        this.saveProductId(selectedId)
      } else {
        this.saveProductId('')
      }
    },
    currentSKU () {
      if (this.selectProduct) {
        let currentSKU = ''
        // console.log('product currentSKU 1', this.product.index, this.selectProduct, this)
        if (this.product.index && this.product.index instanceof Object && this.selectProduct) {
          // console.log('product currentSKU sku', this.product.index[this.selectProduct])
          currentSKU = this.product.index[this.selectProduct]
        }
        let currentSwatchImage = this.product.swatch_images[this.selectProduct]
        // console.log('swatchImages', this.product.swatch_images, this.product.swatch_images.length, this.product.index.length)
        if (currentSwatchImage && this.optionsSKUId.length > 1) {
          console.log('product currentSKU 1-0', this.product.swatch_images[this.selectProduct].carousel, currentSwatchImage)
          let carouselImage = currentSwatchImage.hasOwnProperty('carousel') ? currentSwatchImage.carousel : currentSwatchImage
          let carouselImageLarge = currentSwatchImage.hasOwnProperty('large') ? currentSwatchImage.large : currentSwatchImage
          console.log('carouselImage', carouselImage, carouselImageLarge)
          if (carouselImage.length > 0) {
            this.currentImg = carouselImage || []
            this.currentPopImg = carouselImageLarge || []
            this.isShowOptionImg = true
          } else {
            this.currentImg = []
            this.currentPopImg = []
            this.isShowOptionImg = false
          }
        } else {
          this.currentImg = []
          this.currentPopImg = []
          this.isShowOptionImg = false
        }
        if ((this.product.stock_infos && this.product.stock_infos instanceof Object && this.selectProduct) || (this.product.stock_thresholds && this.product.stock_thresholds instanceof Object && this.selectProduct)) {
          let stockInfos = this.product.stock_infos[this.selectProduct] || ''
          // let stockThresholds = this.product.stock_thresholds[this.selectProduct] || ''
          // this.qtyInfo = `${stockThresholds}`
          this.stockInfo = `${stockInfos}`
        } else {
          this.qtyInfo = ''
          this.stockInfo = ''
        }
        this.initRelationCheckBoxGroup()
        this.saveProductId(currentSKU)
        // console.log('product currentSKU 2', this.product.index, this.selectProduct, currentSKU)
      }
    },
    selectOption (simpleId) {
      // console.log('product selectOption', simpleId, 'simpleId', this.selectOptions)
      let index = this.selectOptions.indexOf(simpleId)
      if (index === -1) {
        this.selectOptions.push(simpleId)
        this.removeOption(simpleId)
      } else {
        this.selectOptions.splice(index, 1)
      }
      this.selectQty = 1
    },
    updateSelectValId (simpleId, index, push) {
      this.selectVal[index] = simpleId
    },
    pushToSelectVal (value) {
      this.selectVal.push(value)
    },
    removeOption (simpleId) {
      let options = this.product.options
      Object.keys(options).forEach(key => {
        let optionsId = Object.keys(options[key])
        if (optionsId.indexOf(simpleId) !== -1) {
          optionsId.forEach(id => {
            let index = this.selectOptions.indexOf(id)
            if (id !== simpleId && index !== -1) {
              this.selectOptions.splice(index, 1)
            }
          })
        }
      })
    },
    updateQty (qty) {
      this.selectQty = qty
    },
    showSizeChart (status) {
      this.isShowSizeChart = status
    },
    showBedBaseColors (status) {
      this.isShowBedBaseColors = status
    },
    showBedLegColors (status) {
      this.isShowBedLegColors = status
    },
    addtoCartPost () {
      if (this.productId) {
        let formdata = {
          product: [
            {
              product_id: this.productId,
              qty: this.selectQty
            }
          ]
        }
        if (this.selectProduct.length > 0) {
          formdata.super_attribute = Object.assign({}, this.product.wishlist[this.productId])
        }
        if (this.relationProduct.length > 0) {
          let relations = this.relationProduct.map(a => {
            return {
              product_id: a,
              // qty: '1'
              qty: this.selectQty
            }
          })
          // console.log(relations)
          formdata.product = formdata.product.concat(relations)
        }
        // console.log('post add to cart', formdata)
        this.buyProduct(formdata).then(data => {
          this.isShowOptionsPanel = false
        }).catch(error => {
          let message = ''
          if (error.indexOf('have as many') !== -1) {
            message = this.itemWarn(error)
          } else {
            message = this.$i18n.t('$common.$labels.outStock')
          }
          this.$q.notify({
            message: message,
            position: 'center',
            timeout: '3000',
            classes: 'notify'
          })
        })
      } else {
        /*
        this.$q.notify({
          message: this.selectOptionTips,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        */
      }
    },
    itemWarn (text) {
      const reg = /"(.*?)"/g
      if (text) {
        let productName = reg.exec(text)
        if (productName instanceof Array && productName.length > 1) {
          // console.log(productName[1])
          return this.$i18n.t('$common.$validation.cartItemWarn', { name: productName[1] })
        } else {
          return this.$i18n.t('$common.$labels.outStock')
        }
      } else {
        return ''
      }
    },
    showSizeChartBtn (key) {
      if (key.toLowerCase().indexOf('size') !== -1 && this.product.size_chart) {
        return true
      } else {
        return false
      }
    },
    i18n: function (key) {
      return this.$i18n.t(key)
    },
    scrollHandler () {
      if (this.pageReady) {
        let top = this.getBtnPosition()
        // let screenWidth = this.getScreenWidth()
        if (top < 0) {
          this.isShowFooter = true
          try {
            document.querySelector('body').classList.add('footer-bar-active')
          } catch {}
        } else {
          this.isShowFooter = false
          try {
            document.querySelector('body').classList.remove('footer-bar-active')
          } catch {}
        }
      }
    },
    getScreenWidth () {
      let tag = this.$refs.product
      if (tag) {
        this.screenWidth = width(tag)
        return this.screenWidth
      } else {
        return 1024
      }
    },
    getBtnPosition () {
      let tag = this.$refs.description
      if (tag) {
        let descriptionPosition = tag.getBoundingClientRect()
        return descriptionPosition.top
      } else {
        return 0
      }
    },
    showOptionsPanel () {
      this.isShowOptionsPanel = true
    },
    callServices () {
      if (typeof window !== 'undefined' && typeof window.qimoChatClick === 'function') {
        window.qimoChatClick()
      }
    },
    initRelationCheckBoxGroup () {
      // console.log(this.selectProduct, 'relation init')
      let relatedProductsForOptions = this.product.related_products_for_options
      let list = relatedProductsForOptions[this.selectProduct]
      let isUseRelatedProductsForOptions = list ? list.length > 0 : false
      if (this.selectProduct && isUseRelatedProductsForOptions) {
        this.relationProduct = []
        this.relationCheckBoxGroup = list
        this.relationDisable = false
        this.relationStork = false
      } else {
        if (this.product.related_products && this.product.related_products.length !== 0) {
          this.relationCheckBoxGroup = [].concat(this.product.related_products)
          this.relationProduct = []
          // if is a simple product or only has one option
          if (this.product.type === 'simple' || this.optionsSKUId.length === 1) {
            this.relationDisable = false
          } else {
            this.relationDisable = true
          }
        }
      }
    },
    changeRelation (val) {
      this.relationProduct = [].concat(val)
    },
    resetProduct () {
      for (let key in this.product) {
        if (key !== 'id') {
          delete this.product[key]
        }
      }
      this.selectProduct = ''
      this.gallery = []
      this.popGallery = []
      this.selectOptions = []
      this.selectVal = []
      this.relationCheckBoxGroup = []
      this.relationProduct = []
      this.currentImg = []
      this.isShowOptionImg = false
      this.qtyInfo = ''
      this.selectQty = 1
      this.slide = 0
      this.tab = 'description'
      this.netError = false
      // console.log('resetProduct', this.product, this.currentGallery)
    },
    submitSwitchFavi () {
      if (this.isFavi) {
        this.submitRemoveFavi()
      } else {
        this.submitAddtoFavi()
      }
    },
    submitAddtoFavi () {
      let formdata = {
        parent_id: this.faviProduct,
        sku: '',
        super_attribute: {}
      }
      if (this.isLogin) {
        if (this.productId && this.selectProduct) {
          formdata.sku = this.productId
          formdata.super_attribute = Object.assign({}, formdata.super_attribute, this.product.wishlist[this.productId])
        }
        if (formdata.parent_id) {
          addToFavi(formdata).then(data => {
            // console.log(data)
            this.$q.notify({
              message: this.$i18n.t('$common.$validation.addedToWishlist'),
              position: 'center',
              timeout: '3000',
              classes: 'notify'
            })
            this.initCurrentProductFavi()
          }).catch(e => {
            // console.log(e)
          })
        }
      } else {
        this.$q.notify({
          message: this.loginText,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        this.setNeedShowLogin(true)
        /* let screenWidth = this.getScreenWidth()
        if (screenWidth < 1024) {
          this.$router.push({ name: 'login' })
        } */
      }
    },
    submitRemoveFavi (id) {
      let formdata = {
        item_id: this.faviItemId
      }
      faviRemove(formdata).then(data => {
        // console.log(data)
        this.$q.notify({
          message: this.$i18n.t('$common.$validation.removedFromWishlist'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        this.initCurrentProductFavi()
      }).catch(error => {
        console.log(error)
      })
    },
    initCurrentProductFavi () {
      if (!this.isLogin) {
        return false
      }
      let formdata = {
        product_id: this.productId || this.faviProduct
      }
      initFaviStatus(formdata).then(data => {
        // console.log(data)
        if (data.added === '1') {
          this.isFavi = true
          this.faviItemId = data.item_id
        } else {
          this.isFavi = false
          this.faviItemId = ''
        }
      }).catch(e => {
        // console.log(e)
      })
    },
    initOptions () {
      if (this.query.options) {
        let urlOptions = JSON.parse(this.query.options)
        let ids = []
        Object.keys(urlOptions).forEach(key => {
          ids.push(urlOptions[key])
        })
        this.selectOptions = ids
      }
    },
    infoTabs (val) {
      this.tab = val
    },
    showFullImg (item) {
      if (item && item.image) {
        this.isShowRelationImg = true
        this.relationImg = item.image
        this.relationName = item.name
      } else {
        this.isShowRelationImg = false
      }
      if (this.screenWidth > 599) {
        this.popSlide = this.slide
        this.fullscreen = true
      }
      // console.log('showFullImg', this)
    },
    relationImage (src) {
      if (src.includes('placeholder')) {
        return noImage
      } else {
        return src
      }
    },
    closePopSlide () {
      this.fullscreen = false
      this.slideMaskLoaded = false
    },
    slidePrev () {
      let slide = this.$refs.carouselPop
      slide.previous()
    },
    slideNext () {
      let slide = this.$refs.carouselPop
      slide.next()
    },
    carouselPrev () {
      let slide = this.$refs.carousel
      slide.previous()
    },
    carouselNext () {
      let slide = this.$refs.carousel
      slide.next()
    },
    tracking () {
      let options = {
        lang: this.lang,
        title: this.title,
        url: this.$route.fullPath
      }
      this.$trackPageView(options)
    },
    onResize (size) {
      this.screenWidth = size.width
      this.initProductImageSize()
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    onSlideMaskLoad () {
      setTimeout(() => {
        this.slideMaskLoaded = true
      }, 400)
    }
  },
  mounted () {
    this.setIsLoading(false)
    try {
      this.$nextTick(() => {
        document.querySelector('body').classList.add('pgproduct')
        this.pageReady = true
        if (!this.product.id) {
          this.netError = true
        }
        var AOS = require('aos')
        AOS.init()
      })
      this.getScreenWidth()
      document.querySelector('body').classList.add('pgproduct')
    } catch { }
  },
  beforeDestroy () {
    try {
      document.querySelector('body').classList.remove('pgproduct')
    } catch { }
  },
  created () {
    // this.query = Object.assign(this.query, this.$route.query)
    this.urlKey = this.$route.params.p
    if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
    this.initProductData()
  },
  updated () {
    // // console.log('updated - aos refresh')
    var AOS = require('aos')
    AOS.init()
  },
  beforeRouteUpdate (to, from, next) {
    // console.log('product beforeRouteUpdate', to)
    // this.query = Object.assign(this.query, to.query)
    this.urlKey = to.params.p
    this.resetProduct()
    // this.initProduct()
    next()
  },
  beforeRouteLeave (to, from, next) {
    // console.log('product beforeRouteLeave', to.name, 'leave')
    if (to.name !== 'product') {
      this.urlKey = ''
      this.saveProduct({})
    }
    next()
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pgproduct')
    } catch { }
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    let params = {
      currency: store.state.lang.currency,
      url_key: currentRoute.params.p
    }
    // console.log('product preFetch 1:', store.state.lang.fromStoreId)
    if (store.state.lang.fromStoreId) {
      params.from_store_id = store.state.lang.fromStoreId
    }
    if (currentRoute.params.c) {
      params.url_key = currentRoute.params.c + '.' + currentRoute.params.p
      // console.log('product page prefetch 0 - 1', currentRoute, params)
    } else if (currentRoute.params.p.indexOf('.') > 0) {
      let newUrlKey = currentRoute.params.p.replace(/\./, '/')
      let url = `/${store.state.lang.lang}/p/${newUrlKey}`
      // console.log('product page prefetch 0 - 0', currentRoute, url)
      redirect(url)
      return false
    }
    // console.log('product preFetch 2:', params)
    return new Promise((resolve, reject) => {
      store.dispatch('prod/getProductAction', params).then(() => {
        // console.log('product preFetch 3:', store.state)
        this.setFromStoreId()
        resolve()
      }).catch(error => {
        reject(error)
      })
    }).then(() => {
      // console.log('store save end')
    }).catch(error => {
      if (error === 'Invalide product.') {
        let url = `/${store.state.lang.lang}/404`
        redirect(url)
        return false
      }
    })
  }
}
</script>

<style lang="scss" scoped>
//$
.spinner {
  position: absolute;
  // z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.q-carousel {
  .q-carousel__slide {
    cursor: pointer;
  }
  &.popup {
    height: 100%;
    background: transparent;
    .q-carousel__slide {
      padding: 32px 16px 64px;
    }
  }
}
.slide-item {
  height: 100%;
  position: relative;
}
.slide-img {
  display: block;
  height: 100%;
  width: auto;
  margin: 0 auto;
  padding: 2px;
  // background: $brandgrey1;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
}
.product-popup-name {
  position: absolute;
  right: 50%;
  bottom: 10px;
  text-align: center;
  span {
    display: inline-block;
    margin-right: -100%;
    padding: 5px 20px;
    line-height: 24px;
    white-space: nowrap;
    color: $black;
    text-transform: uppercase;
    background: $white;
  }
}
.customer-carousel-arrow {
  width: 56px;
  height: 56px;
  padding: 12px;
  margin-top: -30px;
  position: absolute;
  top: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 42px;
  background: $primary;
  z-index: 10;
  img {
    border: 0;
    height: 38px;
  }
  @media screen and (#{$bp-960}) {
    width: 35px;
    height: 35px;
    font-size: 24px;
    img {
      height: 25px;
    }
  }
}
.customer-carousel-arrow {
  &.prev {
    .icon-left {
      &:before {
        padding-left: 18px;
      }
    }
  }
  &.next {
    right: 0px;
  }
}
.pop-slide-mask,
.pop-slide-mask-closearea {
  text-align: center;
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0;
}
.pop-slide-nav {
  display: inline-block;
  padding: 32px 16px 64px;
  height: 100%;
  margin: 0 auto;
  position: relative;
  img {
    display: block;
    height: 100%;
    width: auto;
    margin: 0 auto;
  }
}
.pop-slide-mask-close {
  width: 30px;
  height: 30px;
  background: $primary;
  position: absolute;
  right: 6px;
  top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .q-icon {
    font-size: 24px;
  }
}
.customer-carousel-pop-arrow {
  width: 55px;
  height: 55px;
  padding: 12px;
  margin-top: -20px;
  background: $primary;
  position: absolute;
  top: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &.prev {
    left: 19px;
  }
  &.next {
    right: 19px;
  }
  i {
    font-size: 30px;
  }
}
.pic-buypanel {
  display: flex;
  justify-content: flex-start;
  min-height: 300px;
  .img-block {
    position: relative;
    padding: 0;
  }
}
.product-pic {
  // border: 1px solid $brandgrey1;
  position: relative;
  // z-index: 2;
  width: 100%;
}
.is-new {
  width: 120px;
  height: 120px;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
  .is-new-bg {
    width: 0;
    height: 0;
    border-right: 120px solid transparent;
    border-bottom: 120px solid transparent;
    border-top: 120px solid $accent;
    position: absolute;
    right: 0;
    top: 0;
  }
  label {
    position: absolute;
    left: 20px;
    top: 25px;
    text-transform: uppercase;
    font-weight: 900;
    color: #fff;
    transform: rotate(-45deg);
  }
}
.similar-items clearfix {
  width: 100%;
  position: relative;
  padding: 0 4.8611111111111%;
  margin-bottom: 50px;
  h4 {
    text-align: center;
    padding-top: 15px;
  }
}
.p-footer {
  z-index: 999;
}
.to-service {
  cursor: pointer;
}
.has-close {
  justify-content: space-between;
}
.cart-price-qty {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.popup-success-action {
  display: flex;
  justify-content: flex-end;
}
.customer-carousel-bg {
  background: rgba(255,255,255,0.4);
}
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
    padding: 20px 0;
  }
}
.favi {
  position: absolute;
  top: 10px;
  right: 20px;
  height: 24px;
  z-index: 2;
  background: $white;
  height: 42px;
  @media screen and (max-width: 660px) {
    top: 2%;
    right: 2%;
  }
}
@media screen and (#{$bp-660-min}) {
  .pic-buypanel {
    flex-direction: row;
    .img-block {
      width: 65%;
      margin-left: 0;
    }
  }
}
@media screen and (#{$bp-660}) {
  .pic-buypanel {
    flex-direction: column;
  }
}
@media screen and (max-width: 599px) {
  .q-carousel {
    height: 300px;
    .q-carousel__slide {
      cursor: default;
    }
  }
  .popup-success-action {
    display: flex;
    justify-content: center;
    flex-direction: column;
    a {
      margin-bottom: 5px;
      margin-left: 0;
    }
  }
  .q-card__actions--horiz {
    & > .q-btn-item {
      & + .q-btn-item {
        margin-left: 0;
      }
    }
  }
  .net-error {
    text-align: center;
    .link-btn {
      padding-left: 10px;
    }
  }
  .pic-buypanel {
    .img-block {
      padding: 0;
    }
  }
}
@media screen and (max-aspect-ratio: 900/700) {
  .q-carousel {
    &.popup {
      .q-carousel__slide {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .slide-item {
    width: calc(100% - 50px);
    height: auto;
  }
  .slide-img {
    width: 100%;
    height: auto;
  }
  .pop-slide-mask,
  .pop-slide-mask-closearea {
    text-align: center;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    bottom: 0;
    right: 0;
    top: 0;
  }
  .pop-slide-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pop-slide-mask-close {
    top: -15px;
  }
  .pop-slide-nav {
    width: calc(100% - 50px);
    height: auto;
    padding: 0;
    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>

<style lang="scss">

// Q Carousel
.q-carousel__prev-arrow,
.q-carousel__next-arrow {
  width: 60px;
  height: 60px;
  background: $primary;
  color: $accent;
  border-radius: unset;
}
.q-carousel__prev-arrow:hover,
.q-carousel__next-arrow:hover {
  background: $primary;
}
.q-carousel__prev-arrow .q-focus-helper,
.q-carousel__next-arrow .q-focus-helper {
  display: none;
}
.q-carousel__prev-arrow {
  left: 0;
}
.q-carousel__next-arrow {
  right: 0;
}
.q-carousel {
  .q-ripple {
    display: none;
  }
}
.q-dialog {
  &.fullscreen {
    user-select: none;
  }
}
@media screen and (max-width: 599px) {
  .q-carousel__prev-arrow,
  .q-carousel__next-arrow {
    width: 2.4em;
    height: 2.4em;
    transform: scale(0.8) translateY(-10px);
  }
  .q-carousel__prev-arrow .q-icon,
  .q-carousel__next-arrow .q-icon {
    font-size: 32px;
  }
}

// Favi
body {
  .favi {
    &.q-hoverable {
      &:hover {
        & > .q-focus-helper {
          background: none;
          opacity: 0;
        }
        .q-icon {
          opacity: 0.7;
        }
      }
    }
  }
}
.cart-handler {
  .favi {
    .q-btn__wrapper {
      min-height: 0;
      min-width: 0;
    }
  }
  h2 {
    @media screen and (max-width: 880px) {
      margin-right: 10px;
    }
    @media screen and ($bp-660) {
      margin-right: 22px;
    }
  }
}

// Misc
.left-arrow {
  -webkit-transform: rotate(-180deg);
  transform: rotate(-180deg);
}
.result-list {
  .favi {
    .q-btn__content {
      height: 42px;
      width: 42px;
      @media screen and (#{$bp-660}) {
        height: 28px;
        width: 28px;
      }
    }
  }
}
.pgproduct {
  @media screen and ($bp-768-min) and ($bp-1200) {
    .options-select .q-field__native > span {
      font-size: 14px;
    }
  }
  @media screen and ($bp-960-min) and ($bp-1200) {
    .grid-6 {
      width: 40%;
    }
    .grid-3 {
      width: 60%;
    }
  }
}
.mobile-options-card-dialog {
  p.price {
    margin-bottom: 0;
  }
  .qty-block,
  .options {
    margin-top: .5em;
  }

  @media screen and ($bp-660-min) {
    .options-panel-mobile,
    .btn-main {
      max-width: 410px;
      margin: 0 auto;
    }
    .options-panel-mobile {
      padding: 16px 0;
    }
    .btn-main {
      display: block;
      width: 100%;
    }
  }
}
</style>
