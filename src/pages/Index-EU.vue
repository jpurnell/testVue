<template>
  <div ref="home" class="v-index-wrapper">
    <q-resize-observer @resize="onResize" />
    <template v-show="pageReady">
      <spinner v-show="!componentsReady" type="page" height="30vh" />
      <div class="container" >
        <!-- <promotion :banner="banner" :banner-mobile="bannerMobile" class="home-promotion" /> -->
        <promotion class="home-promotion" />
        <div class="content-wrap">
          <!-- Homepage Content -->
          <homepc v-show="componentsReady" class="home-pc" :components-ready="componentsReady" @topImageLoaded="topImageLoaded" />
        </div>
        <!--Gift Cards-->
        <gift-card />
        <div class="seo-copy">
          <h2 data-aos="fade-up" data-aos-delay="600" v-html="this.i18n('$local.$hpCopy.seoHeader')"></h2>
          <p data-aos="fade-up" data-aos-delay="650">{{ this.i18n('$local.$hpCopy.seoCopy') }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const promotion = () => import('./../components/PromotionEU')
// import { dom } from 'quasar'
import { mapState, mapActions } from 'vuex'
import homepc from './HomePC-EU'
import giftCard from './../components/home/GiftCard'

// const { width } = dom

export default {
  components: {
    homepc,
    promotion,
    'gift-card': giftCard
  },
  data () {
    return {
      isMobileScreen: false,
      switchLanguage: false,
      pageReady: false,
      componentsReady: false
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    })
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setIsLoading'
      ]
    ),
    onResize () {
      if (window.innerWidth < 769) {
        this.isMobileScreen = true
      } else {
        this.isMobileScreen = false
      }
    },
    i18n (value) {
      return this.$i18n.t(value)
    },
    prodUrl (value) {
      return this.lang + '/p/' + this.$i18n.t('$local.$urls.$product.' + value)
    },
    catUrl (value) {
      return this.lang + '/c/' + this.$i18n.t('$local.$urls.$category.' + value)
    },
    topImageLoaded () {
      // this.componentsReady = true
      console.log('topImageLoaded')
      this.$nextTick(() => {
        console.log('topImageLoaded > nextTick - init AOS')
        var AOS = require('aos')
        AOS.init({
          easing: 'ease-in-out',
          once: true
        })
      })
    },
    goToTravel () {
      try {
        console.log('goToTravel')
        const el = document.querySelector('#sectionTwo')

        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      } catch { }
    }
  },
  mounted () {
    this.setIsLoading(false)
    this.componentsReady = true
    this.pageReady = true
    console.log('hp - componentsReady')
    this.$nextTick(() => {
      this.onResize()
      try {
        document.querySelector('body').classList.add('pghome')
      } catch { }
    })
  },
  updated () {
    // console.log('aos refresh index')
    var AOS = require('aos')
    AOS.refresh()
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return new Promise((resolve, reject) => {
      store.dispatch('site/setHomePc', {}).then(() => {
        console.log(store.state)
        resolve()
      }).catch(() => {
        reject()
      })
    }).then(() => {
      console.log('store save end')
    }).catch(() => {
      console.log('store save error')
    })
  },
  beforeMount () {
    this.onResize()
    try {
      document.querySelector('body').classList.add('pghome')
    } catch { }
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pghome')
    } catch { }
  }
}
</script>
<style lang="scss">
.main-hp {
  cursor: pointer;
}
.v-index-wrapper .component-loading svg {
  margin: 150px auto;
}
</style>
