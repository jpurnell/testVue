<template>
  <div class="breadcrumb-element">
    <!-- Background image set in src\css\layouts\_categoryPage.scss -->
    <ul class="breadcrumb" id="DIVbreadcrumb">
      <li class="level">
        <a :href="'/'+lang+'/'">{{ homepage }}</a>
      </li>
      <template v-if="breadcrumbs.length > 0">
        <li v-for="(link, index) in breadcrumbs" :key="index" class="level" v-show="link.name !== current">
          <router-link :to="{name: 'category', params: { c: link.url}}">
            {{link.name}}
          </router-link>
        </li>
      </template>
      <li class="current">{{ current }}</li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    breadcrumbs: {
      type: Array,
      default: function () {
        return []
      }
    },
    current: {
      type: String,
      default: ''
    },
    sku: {
      type: String,
      default: ''
    }
  },
  watch: {
    categoryId (newVal, oldVal) {
      console.log('categoryId', newVal, oldVal)
      try {
        if (this.$route.name === 'category' && newVal !== undefined) {
          document.querySelector('body').setAttribute('id', this.categoryId)
        } else {
          document.querySelector('body').setAttribute('id', '')
        }
      } catch { }
    },
    categoryClass (newVal, oldVal) {
      console.log('categoryClass', newVal, oldVal)
      try {
        document.querySelector('body').classList.remove(oldVal)
        if (this.$route.name === 'category' && newVal !== undefined) {
          document.querySelector('body').classList.add(newVal)
        }
      } catch { }
    },
    subCategoryClass (newVal, oldVal) {
      console.log('subCategoryClass', newVal, oldVal)
      try {
        if (oldVal !== '') {
          document.querySelector('body').classList.remove(oldVal)
        }
        if (this.$route.name === 'category' && newVal !== undefined) {
          console.log('subCategoryClass 2', newVal)
          document.querySelector('body').classList.add(newVal)
        }
      } catch { }
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    }),
    homepage: function () {
      return this.$i18n.t('$common.$labels.homepage')
    },
    categoryName: function () {
      let catName = ''
      if (this.breadcrumbs.length > 0 && this.breadcrumbs[0].name !== undefined) {
        catName = this.breadcrumbs[0].name
        try {
          catName = catName.replace(' & ', ' ').replace('\'', '').replace('™', '').replaceAll('.', '')
        } catch {}
      } else if (this.breadcrumbs.length === 0 && this.current !== undefined) {
        catName = this.current
        try {
          catName = catName.replace(' & ', ' ').replace('\'', '').replace('™', '').replaceAll('.', '')
        } catch {}
      }
      return catName
    },
    categoryId: function () {
      let catId = ''
      if (this.categoryName !== '') {
        catId = this.categoryName
        // Set for Category Pages
        if (this.$route.name === 'category') {
          catId = catId.replace(' ', '-')
          catId = 'CAT-' + catId
        }
        // Set for Product Pages
        if (this.$route.name === 'product') {
          try {
            catId = catId.replaceAll(' ', '')
          } catch {}
          catId = catId + '-' + this.sku
        }
      }
      return catId
    },
    categoryClass: function () {
      let catClass = ''
      if (this.categoryName !== '') {
        catClass = this.categoryName
        try {
          catClass = catClass.replaceAll(' ', '')
        } catch {}
        catClass = 'pg' + catClass
      }
      return catClass
    },
    subCategoryClass: function () {
      let subCatClass = ''
      if (this.current !== undefined && this.breadcrumbs.length > 0) {
        if (this.$route.name === 'category') {
          subCatClass = this.current
        } else if (this.$route.name === 'product') {
          subCatClass = this.breadcrumbs[this.breadcrumbs.length - 1].name
        }
        try {
          subCatClass = subCatClass.replace(' & ', '').replaceAll(' ', '').replace('\'', '').replace('™', '').replaceAll('.', '')
        } catch {}
        subCatClass = 'subpg' + subCatClass
      }
      return subCatClass
    }
  },
  mounted () {
    try {
      console.log('categoryName', this.categoryName, 'categoryClass', this.categoryClass)
      if (this.categoryClass !== '') {
        document.querySelector('body').classList.add(this.categoryClass)
      }
      if (this.categoryId !== '') {
        document.querySelector('body').setAttribute('id', this.categoryId)
      }
      if (this.subCategoryClass !== '') {
        document.querySelector('body').classList.add(this.subCategoryClass)
      }
    } catch { }
  },
  destroyed () {
    try {
      document.querySelector('body').classList.remove(this.categoryClass)
      document.querySelector('body').classList.remove(this.categoryId)
      document.querySelector('body').classList.remove(this.subCategoryClass)
    } catch { }
  }
}
</script>
