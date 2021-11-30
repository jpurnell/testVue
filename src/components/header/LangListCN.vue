<template>
  <ul>
    <li v-for="(region, index) in siteLang" :key="index">
      <h4>{{ regionLabel(region.region) }}</h4>
      <p v-for="(lang, key) in region.langs" :key="key" :active="currentLang === key" clickable manual-focus v-close-popup @click="changeLang(lang.storeId, lang.storeCode, key)">
        <a :class="currentLang === key ? 'active-lang' : ''"><strong>{{ lang.showLang }}</strong></a>
      </p>
      <h4>{{i18n('$common.$labels.northAmerica')}}</h4>
      <p>
        <a href="https://na.shopmo.com/index.aspx?referrer=cn" target="_blank" class="external"><strong>English</strong></a>
      </p>
      <h4>{{i18n('$common.$labels.europe')}}</h4>
      <p>
        <a href="https://shopmo.com/fr/?___store=maneu_fr" target="_blank" class="external"><strong>Français</strong></a>
      </p>
      <p>
        <a href="https://shopmo.com/en/?___store=maneu_en" target="_blank" class="external"><strong>English</strong></a>
      </p>
      <p>
        <a href="https://shopmo.com/de/?___store=maneu_de" target="_blank" class="external"><strong>Deutsch</strong></a>
      </p>
      <p>
        <a href="https://shopmo.com/es/?___store=maneu_es" target="_blank" class="external"><strong>Español</strong></a>
      </p>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import config from '../../config/index'
export default {
  data () {
    return {
      siteLang: [
        {
          region: 'Asia Pacific',
          langs: config
        }
      ]
    }
  },
  computed: {
    ...mapState({
      currentLang: state => state.lang.lang,
      currentStoreId: state => state.lang.storeId
    })
  },
  methods: {
    ...mapActions(
      'lang',
      [
        'setLang',
        'setStoreId',
        'setFromStoreId',
        'setStoreCode'
      ]
    ),
    changeLang (storeId, storeCode, lang) {
      try {
        console.log('change lang product catgroy', this.currentLang, this.currentStoreId, lang, storeId)
        if (lang !== this.currentLang) {
          this.$emit('toggleLangMenu')
          this.$q.loading.show({
            delay: 400
          })
          this.setFromStoreId(this.currentStoreId)
          document.querySelector('body').classList.remove(this.currentLang)
          this.$route.params.lang = lang
          this.setLang(lang)
          document.querySelector('html').setAttribute('lang', lang)
          document.querySelector('body').classList.add(lang)
          this.setStoreId(storeId)
          this.setStoreCode(storeCode)
          this.$router.push({ name: this.$route.name, params: this.$route.params, query: this.$route.query })
        }
      } catch { }
    },
    i18n (value) {
      return this.$i18n.t(value)
    },
    regionLabel (region) {
      if (region === 'Europe') {
        return this.i18n('$common.$labels.europe')
      } else {
        return region
      }
    }
  },
  created () {
    // console.log(this.$i18n.locale)
  },
  mounted () {
    try {
      document.querySelector('html').setAttribute('lang', this.$i18n.locale)
      document.querySelector('body').classList.add(this.$i18n.locale)
    } catch { }
  }
}
</script>
<style lang="scss">
.global-sites p[active] {
  cursor: default;
}
</style>
