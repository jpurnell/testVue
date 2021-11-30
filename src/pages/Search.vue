<template>
  <q-page>
    <div v-if="ready" class="search-ctg category clearfix">
      <promoBanner
        :promoIsActive="promotion.promoIsActive"
        :promoDaysLeft="promotion.promoDaysLeft"
        :promoEnds="promotion.promoEnd"
      />
      <template v-if="lists.length > 0" class="block">
        <div class="results clearfix">
          <h2 class="clear left" v-html="searchResult" />
        </div>
        <div class="item" v-for="item in lists" :key="item.id">
          <router-link :to="{name: 'product', params: {p: item.url}}">
            <p class="ctg-image">
              <img :src="item.small_image" :alt="item.name" />
            </p>
            <h3><span>{{item.name}}</span></h3>
          </router-link>
          <!-- <q-btn
            flat
            round
            color="accent"
            icon="icon-heart"
            v-on:click.stop="addFavi(item.id)"
            class="btn-fav"
            v-if="!item.isFavi"
          /> -->
          <!-- <q-btn
            flat
            round
            color="accent"
            icon="icon-heart-filled"
            v-on:click.stop="submitRemoveFavi(item)"
            class="btn-fav"
            v-if="item.isFavi"
          /> -->
        </div>
      </template>
      <template v-else>
        <div class="results search-empty-content">
          <!-- <div class="content"> -->
            <h2 class="clear left" v-if="queryKey && queryKey !==''">{{ searchResultEmpty }}</h2>
            <!-- <h3 v-else>{{title}}</h3> -->
            <p class="clear"></p>
            <div class="sort">
              <search-form />
            </div>
            <p class="clear"></p>
            <h2 class="search-tips">{{ searchTipsHeading }}</h2>
            <ul>
              <li>{{ searchTips1 }}</li>
              <li>{{ searchTips2 }}</li>
            </ul>
          <!-- </div> -->
        </div>
      </template>
    </div>
    <spinner v-else type="page" />
  </q-page>
</template>

<script>
import { addToFavi, searchProduct, faviList, faviRemove } from './../api/api'
import { mapActions, mapState } from 'vuex'
import searchForm from './../components/search/SearchForm'
import promoBanner from './../components/promotion/Banner'

export default {
  components: {
    'search-form': searchForm,
    promoBanner
  },
  data () {
    return {
      queryKey: '',
      lists: [],
      metaDescription: '',
      metaKeywords: '',
      ready: false,
      showFavi: true,
      isLogin: false
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
        equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' }
      }
    }
  },
  computed: {
    ...mapState({
      hasLoginSuccess: state => state.site.hasLoginSuccess,
      currency: state => state.lang.currency,
      promotion: state => state.site.promotion
    }),
    title: function () {
      return this.$i18n.t('$common.$labels.search')
    },
    searchResultEmpty: function () {
      return this.$i18n.t('$common.$validation.searchResultEmpty', { q: this.queryKey })
    },
    searchTipsHeading: function () {
      return this.$i18n.t('$common.$headings.searchTipsHeading')
    },
    searchTips1: function () {
      return this.$i18n.t('$common.$validation.searchTips1')
    },
    searchTips2: function () {
      return this.$i18n.t('$common.$validation.searchTips2')
    },
    searchResult: function () {
      if (this.lists.length === 1) {
        return this.$i18n.t('$common.$validation.searchResultSolo', { q: this.uppercase(this.queryKey), total: this.lists.length })
      } else {
        return this.$i18n.t('$common.$validation.searchResult', { q: this.uppercase(this.queryKey), total: this.lists.length })
      }
    },
    toViewText: function () {
      return this.$i18n.t('$common.$buttons.shopNow')
    },
    loginText: function () {
      return this.$i18n.t('$common.$validation.wishlistGuest')
    },
    iconFavi: function (productId) {
      let isFavi = false
      if (this.lists && this.lists.length > 0) {
        for (let i = 0; i < this.lists.length; i++) {
          const item = this.lists[i]
          if (item.isFavi && item.id === productId) {
            isFavi = true
          }
        }
      }
      return isFavi ? 'icon-heart' : 'icon-heart-filled'
    }
  },
  watch: {
    hasLoginSuccess: function (newVal, oldVal) {
      console.log('search watch hasLoginSuccess', newVal, this.isLogin)
      this.isLogin = newVal
      if (newVal) {
        this.getReuslt()
      }
    },
    currency: function (val, oldVal) {
      this.getReuslt()
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setNeedShowLogin'
      ]
    ),
    getReuslt () {
      let formdata = {
        search_term: this.queryKey
      }
      searchProduct(formdata).then(data => {
        this.lists = data.product || []
        this.queryKey = data.search_term || this.$route.query.q
        if (this.isLogin) {
          this.getFaviList()
        }
        this.ready = true
      }).catch(e => {
        this.lists = []
        this.ready = true
      })
    },
    resetResult () {
      this.ready = false
      this.lists = []
    },
    addFavi (productId) {
      this.submitAddtoFavi(productId)
    },
    getFaviList () {
      let formdata = {}
      faviList(formdata).then(data => {
        console.log(data)
        // this.lists = data
        let hash = {}
        if (data && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            hash[data[i].id] = data[i].item_id
          }
        }
        if (this.lists && this.lists.length > 0) {
          for (let i = 0; i < this.lists.length; i++) {
            const item = this.lists[i]
            if (hash[item.id]) {
              this.lists[i].isFavi = true
              this.lists[i].item_id = hash[item.id]
            }
          }
        }
        this.$forceUpdate()
      }).catch(e => {
        console.log(e)
      })
    },
    submitAddtoFavi (productId) {
      let formdata = {
        parent_id: productId,
        sku: '',
        super_attribute: {}
      }
      if (this.isLogin) {
        console.log('submitAddtoFavi 1', this, productId, formdata)
        if (formdata.parent_id) {
          addToFavi(formdata).then(data => {
            console.log('submitAddtoFavidata 2', this.lists)
            for (let i = 0; i < this.lists.length; i++) {
              if (this.lists[i].id === productId) {
                this.lists[i].isFavi = true
                console.log('submitAddtoFavidata 3', data, this.lists[i])
              }
            }
            this.$q.notify({
              message: this.$i18n.t('$common.$validation.addedToWishlist'),
              position: 'center',
              timeout: '3000',
              classes: 'notify'
            })
            this.$forceUpdate()
          }).catch(e => {
            console.log(e)
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
    submitRemoveFavi (item) {
      let formdata = {
        item_id: item.item_id
      }
      console.log('submitRemoveFavi 2', item)
      faviRemove(formdata).then(data => {
        console.log(data)
        for (let i = 0; i < this.lists.length; i++) {
          if (this.lists[i].id === item.id) {
            this.lists[i].isFavi = false
            console.log('submitRemoveFavi 3', data, this.lists[i])
          }
        }
        this.$q.notify({
          message: this.$i18n.t('$common.$validation.removedFromWishlist'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        this.$forceUpdate()
      }).catch(error => {
        console.log(error)
      })
    },
    uppercase (value) {
      return value.toUpperCase()
    }
  },
  mounted () {
    try {
      document.querySelector('body').classList.add('pgsearch')
    } catch { }
  },
  created () {
    this.queryKey = this.$route.query.q
    this.getReuslt()
    if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.queryKey = to.query.q
    this.resetResult()
    this.getReuslt()
    next()
  },
  beforeDestroy () {
    try {
      document.querySelector('body').classList.remove('pgsearch')
    } catch { }
  }
}
</script>

<style lang="scss">
.search-form-field {
  .q-field--square .q-field__control, .q-field--outlined .q-field__control:before {
    border-color:$borderColor;
  }
}
.pgsearch #q-app,
.pgsearch .q-layout,
.pgsearch .q-page {
  min-height: 600px !important;
}
</style>
