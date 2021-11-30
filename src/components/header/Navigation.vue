<template>
  <ul class="nav top-nav clearfix">
    <li v-for="(fc, findex) in currentNav" :key="findex" class="nav-c" :class="[showMenuId === fc.id ? 'open' : null]" @mouseenter="menuShow(fc.id)" @mouseleave="menuHide" @click="closeMenu">
      <router-link :to="{name: 'category', params: {c: fc.url}}" v-if="fc.type === 'category'" :class="['level-1', currentLang]"><span>{{ fc.name }}</span></router-link>
      <router-link :to="{name: 'product', params: {p: fc.url}}" v-if="fc.type === 'product'" :class="['level-1', currentLang]" ><span>{{ fc.name }}</span></router-link>
      <div v-if="fc.children" class="level-2" :class="[fc.id === showMenuId ? 'actived' : '', 'sub-' + findex]">
        <ul>
          <li v-for="(subnav, subindex) in fc.children" :key="subindex" class="sub-block">
            <router-link :to="{name: 'category', params: {c: subnav.url}}" v-if="subnav.type === 'category'" :class="['sub-link', currentLang]">{{ subnav.name }}</router-link>
            <router-link :to="{name: 'product', params: {c: subnav.url.split('.')[0], p: subnav.url.split('.')[1]}}" v-if="subnav.type === 'product' && subnav.url.indexOf('.') > 0" :class="['sub-link', currentLang]">{{ subnav.name }}</router-link>
            <router-link :to="{name: 'product', params: {p: subnav.url}}" v-if="subnav.type === 'product' && subnav.url.indexOf('.') < 0" :class="['sub-link', currentLang]">{{ subnav.name }}</router-link>
            <!-- <div v-if="checkShowLevel2(subnav.children, fc.id)">
              <div v-for="(thirdnav, thirdindex) in subnav.children" :key="thirdindex">
                <router-link :to="{name: 'category', params: {c: thirdnav.url}}" v-if="thirdnav.type === 'category'" :class="['third-link', currentLang]">{{ thirdnav.name }}</router-link>
                <router-link :to="{name: 'product', params: {p: thirdnav.url}}" v-if="thirdnav.type === 'product'" :class="['third-link', currentLang]">{{ thirdnav.name }}</router-link>
              </div>
            </div> -->
          </li>
        </ul>
      </div>
    </li>
    <li class="nav-c" v-show="currentNav.length > 0">
      <a href="https://www.mandarinoriental.com/gift-cards" target="_blank" id="TN_l1_GiftCards" :class="['level-1', currentLang]"><span>{{giftCards}}</span></a>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'navigation',
  data () {
    return {
      showMenuId: '',
      setEmptyMenuId: null,
      nav: [],
      onlyShowLevel1: [],
      bedding: []
    }
  },
  computed: {
    ...mapState({
      cartQty: state => state.cart.cartQty,
      currentLang: state => state.lang.lang,
      stateStoreId: state => state.lang.storeId,
      stateNav: state => state.site.siteNav
    }),
    unit: function () {
      return this.$i18n.t('$common.$labels.item')
    },
    units: function () {
      return this.$i18n.t('$common.$labels.items')
    },
    giftCards: function () {
      return this.$i18n.t('$local.$buttons.giftCards')
    },
    unitLable: function () {
      return this.cartQty > 1 ? this.units : this.unit
    },
    currentNav: function () {
      let nav = this.stateNav || this.nav
      let navCopy = this.deepCopy(nav)
      // navCopy = [].concat(navCopy.slice(0, 1), navCopy.slice(1, 2), navCopy.slice(2, 3), navCopy.slice(3))
      navCopy.forEach((a, index) => {
        // MAN Fragrance 427
        if (a.id === '427') {
          let children = [...a.children]
          // // update Diffuser Sets position
          let diffuserSetsIndex = 2
          if (a.children[diffuserSetsIndex]) {
            let diffuserSets = a.children[diffuserSetsIndex]
            children.splice(diffuserSetsIndex, 1)
            children.splice(1, 0, diffuserSets)
          }
          // // update Warmer Sets position
          // let warmerSetsIndex = 4
          // if (a.children[warmerSetsIndex]) {
          //   let warmerSets = a.children[warmerSetsIndex]
          //   children.splice(warmerSetsIndex, 1)
          //   children.splice(3, 0, warmerSets)
          // }
          // // update Atomiser Sets position
          // let atomiserSetsIndex = 4
          // if (a.children[atomiserSetsIndex]) {
          //   let atomiserSets = a.children[atomiserSetsIndex]
          //   children.splice(atomiserSetsIndex, 1)
          //   children.splice(4, 0, atomiserSets)
          // }

          navCopy[index].children = children
        }
        // MAN Signature Gifts 433 - Note: it's 432 on stage
        if (a.id === '433') {
          // console.log('updateItem category 433', a.children)
          let children = [...a.children]
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
          navCopy[index].children = children
        }
        // MAN Hotel Exclusives 431
        if (a.id === '431') {
          let children = [...a.children]
          // update Scarf position
          let scarfIndex = 1
          if (a.children[scarfIndex]) {
            let scarf = a.children[scarfIndex]
            children.splice(scarfIndex, 1)
            children.splice(0, 0, scarf)
          }
          // update Ice Bucket position
          let bucketIndex = 2
          if (a.children[bucketIndex]) {
            let bucket = a.children[bucketIndex]
            children.splice(bucketIndex, 1)
            children.splice(1, 0, bucket)
          }

          navCopy[index].children = children
        }
      })
      return navCopy
    },
    showCartQty: function () {
      return parseInt(this.cartQty, 10) > 0
    }
  },
  watch: {
    stateStoreId: function (newValue, oldValue) {
      this.initNavigation()
    },
    stateNav: function (newValue, oldValue) {
      console.log('new value', newValue)
    },
    $route: function (newValue, oldValue) {
      console.log('router', newValue)
      if (newValue.name === 'product') {
        let urlKey = newValue.params.p
        this.setSiteNav(urlKey)
      }
      this.menuHide()
    }
  },
  methods: {
    ...mapActions(
      'site',
      [
        'setSiteNav'
      ]
    ),
    initNavigation () {
      // this.setSiteNav()
      if (this.$route.name === 'product') {
        let urlKey = this.$route.params.p
        this.setSiteNav(urlKey)
      } else {
        this.setSiteNav()
      }
    },
    menuShow (id) {
      clearTimeout(this.setEmptyMenuId)
      this.showMenuId = id
    },
    menuHide () {
      let _this = this
      this.setEmptyMenuId = setTimeout(function () {
        _this.showMenuId = ''
      }, 300)
    },
    closeMenu () {
      this.$emit('closeMenu')
    },
    checkShowLevel2 (children, categoryId) {
      return children && children.length > 0 && this.onlyShowLevel1.indexOf(categoryId) === -1
    },
    deepCopy (obj) {
      let result = Array.isArray(obj) ? [] : {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            result[key] = this.deepCopy(obj[key])
          } else {
            result[key] = obj[key]
          }
        }
      }
      return result
    },
    reSort (sortArray, a) {
      let children = []
      sortArray.forEach(bedid => {
        let filterItem = a.filter(item => {
          return item.id === bedid
        })
        children = children.concat(filterItem)
      })
      return children
    }
  },
  created () {
    this.initNavigation()
  }
}
</script>
