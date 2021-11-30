<template>
  <div class="notfound">
    <div class="notfound-content">
      <div class="content">
        <div class="tagline-wrap">
          <h1>{{pageNotFound}}</h1>
          <section>
            <h3>{{tips404}}</h3>
            <h3>{{notfoundHeading}}</h3>
            <p>- {{notfoundReason1}}</p>
            <p>- {{notfoundReason2}}</p>
          </section>
          <div class="links">
            <router-link :to="{name: 'home'}">
              <link-btn-2 :text="link404Homepage" />
            </router-link>
          </div>
        </div>
      </div>
      <!-- <div class="contactus">
        <h4>{{contactus}}</h4>
        <p>{{emailUs}}: <a :href="toEmail" class="external">{{email}}</a></p>
        <p>{{tollFree}}: <a :href="tel" class="external">{{tel400}}</a></p>
        <p>{{workTime}}</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import config from './../config/index'
import { defaultLang } from './../config/browser.lang'
import linkBtn2 from './../components/ui/Button2'
export default {
  name: 'Error404',
  components: {
    'link-btn-2': linkBtn2
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
      title: this.sorry,
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
      lang: state => state.lang.lang
    }),
    pageNotFound: function () {
      return this.$i18n.t('$common.$validation.pageNotFound')
    },
    tips404: function () {
      return this.$i18n.t('$common.tips404_1')
    },
    notfoundHeading: function () {
      return this.$i18n.t('$common.tips404_2')
    },
    notfoundReason1: function () {
      return this.$i18n.t('$common.tips404_3')
    },
    notfoundReason2: function () {
      return this.$i18n.t('$common.tips404_4')
    },
    link404Homepage: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    },
    contactus: function () {
      return this.$i18n.t('$common.$headings.contactus')
    },
    tel400: function () {
      return this.$i18n.t('$local.tel400')
    },
    email: function () {
      return config[this.lang].email
    },
    toEmail: function () {
      return `mailto:${this.email}`
    },
    tel: function () {
      let tel = config[this.lang].tel || config[defaultLang].tel
      return `tel:${tel}`
    }
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  beforeMount () {
    try {
      document.querySelector('body').classList.add('pg404')
    } catch { }
  },
  beforeRouteLeave (to, from, next) {
    try {
      document.querySelector('body').classList.remove('pg404')
      document.body.id = ''
    } catch { }
    next()
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove('pg404')
    } catch { }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background: none;
}
.notfound {
  max-width: 1440px;
  margin: 0 auto;
  padding: 4% 5% 72px;
}
.notfound-content {
  min-height: 300px;
}
.links {
  a {
    display: inline-block;
  }
}
.contactus {
  float: right;
  padding: 2%;
  a {
    color: $black;
  }
}
@media screen and (#{$bp-768-min}) {
  .tagline {
    width: 50%;
    border-right: 1px solid #eee;
  }
}
</style>
