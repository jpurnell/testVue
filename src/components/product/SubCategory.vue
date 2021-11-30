<template>
    <div :class="['content', lang]" v-if="category && category.id">
      <!-- <div v-html="category.landing_page" class="big-banner"></div> -->
      <!-- <breadcrumb :breadcrumbs="category.breadcrumbs" :current="category.name" /> -->
      <div class="category-title">
        <div>
            <!-- <h2 data-aos="fade-down" data-aos-delay="400" :class="[lang]">{{ category.breadcrumbs[0].name }}</h2> -->
            <h2 data-aos="fade-down" data-aos-delay="400" :class="[lang]">{{ category.name }}</h2>
            <p data-aos="fade-up" data-aos-delay="400">{{category.short_description2}}
            </p>
        </div>
      </div>
      <div :class="['sub-category', category.children.length < 5 ? 'children-few' : '']">
        <template v-for="(item, index) in children">
          <category-item
            :category-item="item"
            :parentCategory="category"
            :index="index"
            :urlKey="urlKey"
            :is-hotels="false"
            :key="item.id"
            :sub-category="true"
          >
          </category-item>
        </template>
      </div>
      <div class="hero-banner ctg-hero" :style="[getExtraImage7() !== '' ? { backgroundImage: 'url(' + getExtraImage7() + ')' } : {}]">
        <h3 v-html="category.additional_information_one" />
      </div>
      <div class="ctg-seo seo-block">
          <p>
              <img class="travel-mob" :src="category.extra_image_6" alt="Travel">
              <!-- <big-banner :url="category.image"></big-banner> -->
          </p>
          <div>
            <h3>{{category.seo_copy_1}}</h3>
            <p>{{category.seo_copy_2}}</p>
          </div>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
// import Breadcrumb from './Breadcrumb.vue'
import CategoryItem from './CategoryItem.vue'
import noLrgImage from './../../assets/images/products/MAN-no-lrg.jpg'
export default {
  components: {
    // 'breadcrumb': Breadcrumb,
    // 'big-banner': BigBanner,
    'category-item': CategoryItem
  },
  data () {
    return {
      children: []
    }
  },
  props: {
    category: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // lang: {
    //   type: String,
    //   default:  ''
    // },
    urlKey: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang
    })
  },
  watch: {
    category: {
      immediate: true,
      deep: true,
      handler (newValue, oldValue) {
        console.log('categorynormal watch handler', newValue, oldValue)
        this.updateItem()
      }
    }
  },
  methods: {
    updateItem () {
      if (this.category.id && this.category.id === '381') {
        // console.log('categorynormal created 1', this.children)
        let children = [...this.category.children]
        // update bed & bedding position
        let bedBeddingSets = this.category.children[0]
        children.splice(0, 1)
        children.splice(3, 0, bedBeddingSets)
        // update luxe bed & bedding position
        let luxeBedBeddingSets = this.category.children[1]
        children.splice(0, 1)
        children.splice(5, 0, luxeBedBeddingSets)

        // console.log('categorynormal created 2', children, bedBeddingSets)
        this.children = children
      } else {
        this.children = this.category.children
      }
    },
    getExtraImage (num) {
      if (this.category.extra_image_ + num) {
        return this.category.extra_image_ + num
      } else {
        return noLrgImage
      }
    },
    getExtraImage7 (num) {
      if (this.category.extra_image_7) {
        return this.category.extra_image_7
      } else {
        return ''
      }
    }
  },
  created () {
    // console.log('categorynormal created 0')
    this.updateItem()
  },
  mounted () {
    var AOS = require('aos')
    AOS.init()
  },
  updated () {
    var AOS = require('aos')
    AOS.init()
  }
}
</script>
