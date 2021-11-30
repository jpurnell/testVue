<template>
  <div class="item">
    <router-link
      :to="toUrl"
      :id="anchorName"
      :class="['item category-item', isHotels ? 'hotels' : '', index % 2 === 0 ? 'even' : 'odd']"
      :event="disableLink ? '' : 'click'"
    >
    <div class="stack">
      <p class="ctg-image">
        <picture>
          <!-- <source :srcset="categoryItem.small_image" media="(max-width: 768px)" > -->
          <img :src="categoryItem.small_image" :alt="categoryItem.name" @error="setErrorImage">
        </picture>
      </p>
      <h3><span data-aos="fade" data-aos-delay="200" data-aos-offset="-1">{{categoryItem.name}}</span></h3>
      <span class="btn-plain">
        {{ toViewText }}
      </span>
    </div>
    </router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { addToFavi, faviRemove } from './../../api/api'
import noLrgImage from './../../assets/images/products/MAN-no-lrg.jpg'
export default {
  data () {
    return {
      isFavi: false,
      faviItemId: '',
      tab: 'ctab' + this.categoryItem.id,
      disableLink: false
    }
  },
  props: {
    categoryItem: {
      type: Object
    },
    index: {
      type: Number
    },
    fcUrl: {
      type: String
    },
    scUrl: {
      type: String
    },
    cid: {
      type: String
    },
    isHotels: {
      type: Boolean,
      default: false
    },
    parentCategory: {
      type: Object
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang.lang,
      faviHash: state => state.site.faviHash
    }),
    toViewText: function () {
      return this.$i18n.t('$common.$buttons.shopNow')
    },
    addtoCartText: function () {
      return this.$i18n.t('$common.$buttons.addtoCart')
    },
    loginText: function () {
      return this.$i18n.t('$common.$validation.wishlistGuest')
    },
    toUrl: function () {
      if (this.categoryItem.type === 'product') {
        if (this.categoryItem.url.indexOf('.') !== -1) {
          let toUrl = this.categoryItem.url.split('.')
          return {
            name: 'product',
            params: { c: toUrl[0], p: toUrl[1] }
            // query: { pid: this.categoryItem.id }
            // query: { cid: this.cid, pid: this.categoryItem.id }
          }
        } else {
          return {
            name: 'product',
            params: { p: this.categoryItem.url }
            // query: { pid: this.categoryItem.id }
            // query: { cid: this.cid, pid: this.categoryItem.id }
          }
        }
      } else if (this.categoryItem.type === 'category') {
        return {
          name: 'category',
          params: { c: this.categoryItem.url }
          // query: { cid: this.categoryItem.id }
        }
      } else {
        return {
          name: 'category',
          params: { c: this.categoryItem.url }
          // query: { cid: this.cid }
        }
      }
    },
    isPropsFavi: function () {
      console.log('categoryitem isPropsFavi', this.categoryItem, this.faviHash[this.categoryItem.id] && this.faviHash[this.categoryItem.id] !== 0)
      return this.categoryItem.isFavi && this.faviHash[this.categoryItem.id] && this.faviHash[this.categoryItem.id] !== 0
    },
    anchorName: function () {
      let name = this.categoryItem.name.replace(/(^\s*)|(\s*$)|«|»/g, '').replace(/ /g, '_').replace(/&/g, '').replace(/:/g, '').replace(/__/g, '_')
      // return 'cd_' + this.categoryItem.promoCategoryId + '-EU'
      return name
    },
    ctgNumber: function () {
      let index = this.index + 1
      return index.toString().padStart(2, '0')
    }
  },
  watch: {
    faviHash: function (newVal, oldVal) {
      console.log('category item watch faviHash', newVal, this.isLogin)
      console.log('categoryitem isPropsFavi', this.categoryItem, this.faviHash[this.categoryItem.id] && this.faviHash[this.categoryItem.id] !== 0)
      this.isFavi = this.categoryItem.isFavi && this.faviHash[this.categoryItem.id] && this.faviHash[this.categoryItem.id] !== 0
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'buyProduct'
      ]
    ),
    ...mapActions(
      'site',
      [
        'setNeedShowLogin'
      ]
    ),
    easybuy () {
      console.log('categoryitem easybuy', this)
      let formdata = {
        product: [
          {
            product_id: this.categoryItem.id,
            qty: '1'
          }
        ]
      }
      this.buyProduct(formdata).then(data => {
        window.scrollTo(0, 0)
      }).catch(error => {
        console.log(error)
        this.$q.notify({
          message: this.$i18n.t('$common.$labels.outStock'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      })
    },
    addFavi (productId, event) {
      event.preventDefault()
      this.submitAddtoFavi(productId)
    },
    submitAddtoFavi (productId, event) {
      let formdata = {
        parent_id: productId,
        sku: '',
        super_attribute: {}
      }
      this.checkLogin()
      if (this.isLogin) {
        console.log('submitAddtoFavi 1', this, productId, formdata)
        if (formdata.parent_id) {
          addToFavi(formdata).then(data => {
            this.isFavi = true
            this.$q.notify({
              message: this.$i18n.t('$common.$validation.addedToWishlist'),
              position: 'center',
              timeout: '3000',
              classes: 'notify'
            })
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
    submitRemoveFavi (item, event) {
      let formdata = {
        item_id: this.faviHash[this.categoryItem.id]
      }
      console.log('submitRemoveFavi 2', item)
      faviRemove(formdata).then(data => {
        console.log(data)
        this.isFavi = false
        this.$q.notify({
          message: this.$i18n.t('$common.$validation.removedFromWishlist'),
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
      }).catch(error => {
        console.log(error)
      })
      event.preventDefault()
    },
    checkEmpty (val) {
      if (val.swatch_data) {
        return val.toString()
      } else {
        return false
      }
    },
    checkLogin () {
      if (this.$q.cookies.get('isLogin') && parseInt(this.$q.cookies.get('isLogin'), 10) === 1) {
        this.isLogin = true
      } else {
        this.isLogin = false
      }
    },
    setErrorImage () {
      event.target.src = noLrgImage
    }
  },
  created () {
    this.checkLogin()
    this.isFavi = this.isPropsFavi
  }
}
</script>

<style lang="scss" scoped>
// End Temp Styles
.price {
  display: block;
  .category-normal & {
    font-weight: 600;
  }
}
.market_price {
  text-decoration: line-through;
}
.hotels {
  .link {
    margin: 0.75em 0 20px;
  }
}
.category-normal {
  .btn-fav {
      @media screen and (min-width: 661px) and (max-width: 868px) {
        top: unset;
        bottom: 2%;
      }
  }
  .even {
  .btn-fav {
      right: 2%;
    }
  }
  .odd {
    .btn-fav {
      left: 2%;
      @media screen and (max-width: 660px) {
        left: unset;
        right: 2%;
      }
    }
  }
}
.color-menu {
  position: absolute;
  bottom: 4%;
  left: 50%;
  z-index: 3;
  transform: translateX(-50%);
}
.color-option,
.color-option-return {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  opacity: 0.8;
  border: 2px solid #ddd;
  @media screen and (#{$bp-480}) {
    width: 25px;
    height: 25px;
  }
}
.thumbnail-block {
  display: flex;
  position: relative;
  overflow: hidden;
  a {
    display: flex;
    width: 100%;
    height: 100%;
  }
}
.thumbnail {
  position: relative;
}
.category-tab-panel {
  padding: 0;
}
</style>
