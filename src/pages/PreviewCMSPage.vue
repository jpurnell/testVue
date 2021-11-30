<template>
  <q-page>
    <q-resize-observer @resize="onResize" />
    <div ref="home">
      <template v-if="content.child">
      <div v-for="(tag, key, index) in content.child" :key="index">
        <cms-html :tag="tag" :is-mobile-screen="isMobileScreen" />
      </div>
      </template>
      <template v-else>
        {{this.message}}
      </template>
    </div>
  </q-page>
</template>

<script>
import { dom } from 'quasar'
import { mapState } from 'vuex'
import { getPreviewCMSPage } from './../api/preview'
import html2json from './../utils/html2json'
import cmsHtml from './../components/sales/Html'
const { width } = dom

export default {
  components: {
    'cms-html': cmsHtml
  },
  data () {
    return {
      content: {},
      message: '',
      isMobileScreen: false,
      title: '',
      metaDescription: '',
      metaKeywords: ''
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
  computed: {
    ...mapState({
      storeCode: state => state.lang.storeCode
    })
  },
  watch: {
    lang: function (val, oldVal) {
      this.initData()
    }
  },
  methods: {
    onResize () {
      let screenWidth = this.getScreenWidth()
      if (screenWidth < 768) {
        this.isMobileScreen = true
      } else {
        this.isMobileScreen = false
      }
    },
    getScreenWidth () {
      let tag = this.$refs.home
      if (tag) {
        return width(tag)
      } else {
        return 1024
      }
    },
    initData () {
      let formdata = {
        url: this.cmsUrl,
        code: this.storeCode,
        schedule: this.$route.query.schedule
      }
      getPreviewCMSPage(formdata).then(data => {
        this.title = data.meta_title || data.page_title || ''
        this.metaDescription = data.meta_description || ''
        this.metaKeywords = data.meta_keyword || ''
        console.log(data, 'content')
        if (data.content) {
          this.content = Object.assign({}, html2json(data.content))
        } else {
          this.message = data.message || ''
        }
      }).then(error => {
        console.log(error)
      })
    }
  },
  created () {
    this.cmsUrl = this.$route.params.note
    this.initData()
  }
}
</script>

<style lang="scss" scoped>

</style>
