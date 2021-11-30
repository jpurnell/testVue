<template>
  <div class="contactus-page">
    <div class="contactus-block">
      <contact-us @afterSubmit="afterSubmit" />
    </div>
  </div>
</template>

<script>
import { SessionStorage } from 'quasar'
import contactUs from './../components/help/ContactUs'
export default {
  components: {
    'contact-us': contactUs
  },
  data () {
    return {
      metaDescription: '',
      metaKeywords: ''
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
    title: function () {
      return this.$i18n.t('$common.$headings.contactus')
    }
  },
  methods: {
    afterSubmit () {
      if (this.$q.sessionStorage.has('afterContactToPage')) {
        let toPage = this.$q.sessionStorage.getItem('afterContactToPage')
        let toPageRouter = JSON.parse(toPage)
        if (toPageRouter.name) {
          this.$router.push(toPageRouter)
        } else {
          this.$router.push({ name: 'home' })
        }
      } else {
        this.$router.push({ name: 'home' })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    let toPage = {
      name: from.name,
      params: from.params,
      query: from.query
    }
    if (from.name !== 'contact' && from.name !== 'checkout') {
      SessionStorage.set('afterContactToPage', JSON.stringify(toPage))
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.contactus-page {
  padding-top: 3%;
  padding-bottom: 72px;
}
.contactus-block {
  min-height: 300px;
  padding: 0 5%;
}
@media screen and (max-width: 660px) {
  .contactus-page {
    padding-top: 5%;
    padding-bottom: 122px;
  }
  .contactus-block {
    padding: 3% 5% 0;
  }
}
</style>
