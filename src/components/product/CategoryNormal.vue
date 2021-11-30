<template>
    <div :class="['content', lang]" v-if="category && category.id">
      <slot />
      <!-- <div v-html="category.landing_page" class="big-banner"></div> -->
      <breadcrumb :breadcrumbs="category.breadcrumbs" :current="category.name" />
      <div class="ctg-seo">
        <h1><span>{{ category.name }}</span></h1>
        <p>{{ category.description }}</p>
      </div>
      <div :class="['category category-normal q', category.children.length < 5 ? 'children-few' : '']">
        <template v-for="(item, index) in children">
          <category-item
            :category-item="item"
            :index="index"
            :urlKey="urlKey"
            :is-hotels="false"
            :key="item.id"
            :sub-category="false"
          >
          </category-item>
        </template>
      </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Breadcrumb from './Breadcrumb.vue'
import CategoryItem from './CategoryItem.vue'
export default {
  components: {
    'breadcrumb': Breadcrumb,
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
      if (this.category.id) {
        console.log('updateItem category', this.category.id)
        // MAN Bath & Body Category 418 - note: it's 417 on stage
        if (this.category.id === '418') {
          // console.log('updateItem category 418', this.children)
          let children = [...this.category.children]
          // update Spa Bath & Shower Oils position
          let spaBathShowerOilsIndex = 0
          if (this.category.children[spaBathShowerOilsIndex]) {
            let spaBathShowerOils = this.category.children[spaBathShowerOilsIndex]
            children.splice(spaBathShowerOilsIndex, 1)
            children.splice(9, 0, spaBathShowerOils)
          }
          // update Spa Massage & Body Oils position
          let spaMassageBodyOilsIndex = 1
          if (this.category.children[spaMassageBodyOilsIndex]) {
            let spaMassageBodyOils = this.category.children[spaMassageBodyOilsIndex]
            children.splice(0, 1)
            children.splice(10, 0, spaMassageBodyOils)
          }

          this.children = children
        // MAN Fragrance 427
        } else if (this.category.id === '427') {
          let children = [...this.category.children]
          // // update Diffuser Sets position
          let diffuserSetsIndex = 2
          if (this.category.children[diffuserSetsIndex]) {
            let diffuserSets = this.category.children[diffuserSetsIndex]
            children.splice(diffuserSetsIndex, 1)
            children.splice(1, 0, diffuserSets)
          }
          // // update Warmer Sets position
          let warmerSetsIndex = 3
          if (this.category.children[warmerSetsIndex]) {
            let warmerSets = this.category.children[warmerSetsIndex]
            children.splice(warmerSetsIndex, 1)
            children.splice(3, 0, warmerSets)
          }
          // // update Atomiser Sets position
          // let atomiserSetsIndex = 4
          // if (this.category.children[atomiserSetsIndex]) {
          //   let atomiserSets = this.category.children[atomiserSetsIndex]
          //   children.splice(atomiserSetsIndex, 1)
          //   children.splice(4, 0, atomiserSets)
          // }

          this.children = children
        // MAN Hotel Exclusives 431
        } else if (this.category.id === '431') {
          // console.log('updateItem category 417', this.children)
          let children = [...this.category.children]
          // update Scarf position
          let scarfIndex = 1
          if (this.category.children[scarfIndex]) {
            let scarf = this.category.children[scarfIndex]
            children.splice(scarfIndex, 1)
            children.splice(0, 0, scarf)
          }
          // update Ice Bucket position
          let bucketIndex = 2
          if (this.category.children[bucketIndex]) {
            let bucket = this.category.children[bucketIndex]
            children.splice(bucketIndex, 1)
            children.splice(1, 0, bucket)
          }

          this.children = children
        // MAN Signature Gifts 433 - Note: it's 432 on stage
        } else if (this.category.id === '433') {
          let children = [...this.category.children]
          let arrLength = children.length
          let categoryArray = []
          let productArray = []
          // Create Categories array
          for (let i = 0; i < arrLength; i++) {
            if (children[i].type === 'category') {
              let child = children[i]
              categoryArray.push(child)
            }
          }
          // Create Products array
          for (let i = 0; i < arrLength; i++) {
            if (children[i].type === 'product') {
              let child = children[i]
              productArray.push(child)
            }
          }
          // Move Category Items to end of Array
          children = productArray.concat(categoryArray)
          this.children = children
        } else {
          let children = []
          for (let index = 0; index < this.category.children.length; index++) {
            // if (this.category.children[index].type === 'category') {
            children.push(this.category.children[index])
            // }
          }
          this.children = children
        }
      } else {
        this.children = this.category.children
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
