<template>
  <q-page class="">
    <div class="account-page clearfix">
      <account-block cur-tab="tab2" :title="likeList"></account-block>
      <div class="faq" v-if="ready">
        <div class="row q-col-gutter-md" v-if="lists.length > 0">
          <div class="col-12 col-sm-6 col-md-4" v-for="(item, index) in lists" :key="index">
            <div class="item">
              <router-link :to="link(item)">
                <q-img :src="checkImg(item.image)" :ratio="1200/933"/>
                <div class="info">
                  <div align="center" class="name">{{replacePipe(item.name)}}</div>
                  <div align="center" class="price">
                    <div><del align="center" v-show="item.price !== item.market_price">{{ item.market_price }}</del></div>
                    {{item.price}}
                  </div>
                  <!--<div align="center" class="spec">{{ item.sku ? '象牙白；200x200' : '&nbsp;'}}</div>-->
                  <div v-if="item.stock_status==='1'">
                    <div v-if="item.add_to_cart === '1'" @click.stop="add(item.sku, $event)">
                      <link-btn-2 :extraClass="'wishlist-link-btn'" :text="addtoCartText" />
                    </div>
                    <div v-else>
                      <router-link :to="link(item)">
                        <link-btn-2 :extraClass="'wishlist-link-btn'" :text="selectOptionsLabel" />
                      </router-link>
                      <!-- Temp Disable for TW Task #22392281
                      <router-link :to="link(item)" class="gt-xs">
                        <link-btn-2 :extraClass="'wishlist-link-btn'" :text="selectOptionsLabel" />
                      </router-link>
                      <div @click.stop="getProductOptions(item.url, $event)" class="xs">
                        <link-btn-2 :extraClass="'wishlist-link-btn'" :text="selectOptionsLabel" />
                      </div> -->
                    </div>
                  </div>
                  <div v-else>
                    <div class="out-stock">
                      <link-btn-2 disabled :extraClass="'wishlist-link-btn'" :text="outStock" />
                    </div>
                  </div>
                </div>
              </router-link>
              <q-btn
                round
                class="remove"
                icon="icon-close"
                size="xs"
                color="grey"
                text-color="black"
                @click="deleteItem(item.item_id)"
              />
            </div>
          </div>
          <div v-if="product.id">
            <q-dialog v-model="isShowOptionsPanel" full-width position="bottom">
              <q-card style="max-width: 100vw;">
                <q-card-actions align="right">
                  <q-btn flat icon="icon-close" v-close-popup />
                </q-card-actions>
                <q-card-section class="row">
                  <options-panel
                    :qty="selectQty"
                    :qty-info="qtyInfo"
                    :product="product"
                    :show-price="showPrice"
                    :market-show-price="showMktPrice"
                    :selected-id="selectedId"
                    :select-options="selectOptions"
                    :relation-disable="relationDisable"
                    :relation-check-box-group="relationCheckBoxGroup"
                    :relation-product="relationProduct"
                    :bottom="true"
                    :is-favi="isFavi"
                    :show-favi="false"
                    @showSizeChart="showSizeChart"
                    @changeOption="selectOption"
                    @updateQty="updateQty"
                    @addtoCartPost="addtoCartPost"
                    @changeRelation="changeRelation"
                  />
                </q-card-section>
              </q-card>
            </q-dialog>
            <q-dialog v-model="isShowSizeChart">
              <q-card style="max-width: 80vw;">
                <q-card-actions align="right">
                  <q-btn flat icon="icon-close" v-close-popup />
                </q-card-actions>
                <q-card-section class="row items-center">
                  <size-chart :size-chart-html="productSizeChart" />
                </q-card-section>
              </q-card>
            </q-dialog>
          </div>
        </div>
        <div v-else class="empty">
          <p>{{ wishEmpty }}</p>
          <div class="action">
            <router-link class="shopping" :to="{name: 'home'}">
              <link-btn-2 :text="toHome" />
            </router-link>
          </div>
        </div>
      </div>
      <spinner v-else type="page" />
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { faviList, faviRemove } from './../api/api'
import StoreId from './../mixins/StoreId'
import Accountblock from '../components/AccountBlock'
// import confirm from './../components/ui/Confirm'
import linkBtn2 from './../components/ui/Button2'
import optionspanel from '../components/product/OptionsPanel'
import sizechart from '../components/product/SizeChart'
import noLrgImage from './../assets/images/products/MAN-no-lrg.jpg'

export default {
  name: 'wishList',
  mixins: [StoreId],
  components: {
    'account-block': Accountblock,
    'link-btn-2': linkBtn2,
    'options-panel': optionspanel,
    'size-chart': sizechart
  },
  data () {
    return {
      lists: [],
      metaDescription: '',
      metaKeywords: '',
      isShowOptionsPanel: false,
      selectQty: 1,
      qtyInfo: '',
      product: {},
      selectedId: '',
      selectProduct: '',
      selectOptions: [],
      relationDisable: false,
      relationCheckBoxGroup: [],
      relationProduct: [],
      isFavi: false,
      isShowSizeChart: false,
      ready: false
    }
  },
  meta () {
    return {
      // sets document  title
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
    ...mapState({
      productId: state => state.cart.productId
    }),
    title: function () {
      return `${this.likeList} - ${this.$i18n.t('$common.$labels.myAccount')}`
    },
    likeList: function () {
      return this.$i18n.t('$common.$labels.wishlist')
    },
    addtoCartText: function () {
      return this.$i18n.t('$common.$buttons.addtoCart')
    },
    selectOptionsLabel: function () {
      return this.$i18n.t('$common.$buttons.selectOptions')
    },
    wishEmpty: function () {
      return this.$i18n.t('$common.$validation.wishEmpty')
    },
    toHome: function () {
      return this.$i18n.t('$common.$buttons.continueShopping')
    },
    selectOptionTips: function () {
      return this.$i18n.t('$common.$validation.selectOption')
    },
    outStock: function () {
      return this.$i18n.t('$common.$labels.outStock')
    },
    showPrice: function () {
      if (this.product.index && this.product.index instanceof Object && this.selectProduct) {
        return this.product.prices[this.selectProduct].price
      } else {
        return this.product.price
      }
    },
    showMktPrice: function () {
      if (this.product.index && this.product.index instanceof Object && this.selectProduct) {
        return this.product.prices[this.selectProduct].market_price
      } else {
        return this.product.market_price
      }
    },
    optionsSKUId: function () {
      if (this.product.index && this.product.index instanceof Object) {
        let key = Object.keys(this.product.index)
        let newKey = []
        key.forEach(id => {
          if (id.indexOf('|') !== -1) {
            let ids = id.split('|')
            ids.sort(function (a, b) {
              if (isNaN(a) || isNaN(b)) {
                return a > b ? 1 : -1
              }
              return a - b
            })
            newKey.push(ids.join('|'))
          } else {
            newKey.push(id)
          }
        })
        console.log(newKey, 'options index id')
        return newKey
      } else {
        return []
      }
    },
    productSizeChart: function () {
      if (!this.product.size_chart) {
        return ''
      }
      console.log('productSizeChart 1', this.product)
      try {
        let chart = this.product.size_chart
        let col = []
        let row = []
        let leave1 = chart.split('<th class="text-center">')
        let leave2 = chart.split('<tbody>')
        let leave3 = leave2[1].split('<tr>')
        let desc = chart.split('<p style="font-size: 14px; text-align: center;">')[1].split('</p>')[0]
        for (let index = 1; index < leave1.length; index++) {
          const element = leave1[index]
          col.push(element.split('</th>')[0])
        }
        for (let index = 0; index < leave3.length; index++) {
          const element = leave3[index]
          if (element.indexOf('</td>') > 0) {
            let leave = element.split('</td>')
            let rowData = []
            for (let i = 0; i < leave.length; i++) {
              const e = leave[i]
              if (e.indexOf('<td class="text-center">') > 0) {
                rowData.push(e.split('<td class="text-center">')[1])
              }
            }
            row.push(rowData)
          }
        }
        console.log('productSizeChart', leave1, leave2, leave3, col, row)
        return { title: col, data: row, desc: desc }
      } catch (error) {
        let chart = this.product.size_chart
        let col = []
        let row = []
        let leave1 = chart.split('<th class="text-center">')
        let leave2 = chart.split('<tbody>')
        let leave3 = leave2[1].split('<tr class="">')
        let desc = chart.split('<p class="tips">')[1].split('</p>')[0]
        for (let index = 1; index < leave1.length; index++) {
          const element = leave1[index]
          col.push(element.split('</th>')[0])
        }
        for (let index = 0; index < leave3.length; index++) {
          const element = leave3[index]
          if (element.indexOf('</td>') > 0) {
            let leave = element.split('</td>')
            let rowData = []
            for (let i = 0; i < leave.length; i++) {
              const e = leave[i]
              if (e.indexOf('<td class="text-center">') > 0) {
                rowData.push(e.split('<td class="text-center">')[1])
              }
            }
            row.push(rowData)
          }
        }
        console.log('productSizeChart', leave1, leave2, leave3, col, row)
        return { title: col, data: row, desc: desc }
      }
    }
  },
  watch: {
    lang: function (val, oldVal) {
      this.initList()
    },
    currency: function (val, oldVal) {
      this.initList()
    },
    selectOptions: function (val, oldVal) {
      let nowSelected = val.concat([])
      nowSelected.sort(function (a, b) {
        if (isNaN(a) || isNaN(b)) {
          return a > b ? 1 : -1
        }
        return a - b
      })
      let nowSelectedString = nowSelected.join('|')
      console.log(nowSelectedString, this.optionsSKUId, 'ddddd')
      if (this.optionsSKUId.indexOf(nowSelectedString) !== -1) {
        this.selectProduct = nowSelectedString
      } else {
        this.selectProduct = ''
      }
    },
    selectProduct: function (val, oldVal) {
      this.currentSKU()
    },
    isShowOptionsPanel: function (val, oldVal) {
      if (!val) {
        this.resetProduct()
      }
    }
  },
  methods: {
    ...mapActions(
      'cart',
      [
        'saveProductIdToState',
        'buyProduct'
      ]
    ),
    ...mapActions(
      'prod',
      [
        'getProductAction'
      ]
    ),
    initList () {
      let formdata = {}
      faviList(formdata).then(data => {
        console.log(data)
        this.lists = data
        this.ready = true
      }).catch(e => {
        console.log(e)
        this.ready = true
      })
    },
    add (sku, event) {
      event.preventDefault()
      let formdata = {
        product: [
          {
            product_id: sku,
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
    link (item) {
      if (item.options) {
        return { name: 'product', params: { p: item.url }, query: { options: JSON.stringify(item.options) } }
      } else {
        return { name: 'product', params: { p: item.url } }
      }
    },
    deleteItem (id) {
      /*
      this.$q.dialog({
        component: confirm,
        parent: this,
        title: this.$i18n.t('$common.$headings.confirmDelete'),
        message: this.$i18n.t('Would you like to delete ?', { item: '' }),
        cancel: this.$i18n.t('$common.$buttons.cancel'),
        ok: this.$i18n.t('$common.$buttons.submit'),
        persistent: true,
        changeBtnStyle: true
      }).onOk(() => {
        this.deleteConfirm(id)
      }).onCancel(() => {

      }).onDismiss(() => {

      })
      */
      this.deleteConfirm(id)
    },
    deleteConfirm (id) {
      let formdata = {
        item_id: id
      }
      faviRemove(formdata).then(data => {
        console.log(data)
        this.initList()
      }).catch(error => {
        console.log(error)
      })
    },
    getProductOptions (urlKey, event) {
      event.preventDefault()
      let formdata = {
        currency: this.currency,
        url_key: urlKey
      }
      this.getProductAction(formdata).then(data => {
        console.log(data)
        this.product = Object.assign({}, data)
        if (this.product.type) {
          if (this.product.type === 'simple') {
            this.saveProductId(this.product.id)
            this.qtyInfo = this.product.stock_threshold || '0'
          }
          if (this.product.type === 'grouped' || this.product.type === 'kit' || this.product.type === 'configurable') {
            if (this.product.index.length === 0) {
              this.saveProductId(this.product.id)
              this.qtyInfo = this.product.stock_threshold || '0'
            } else {
              this.setSelected(this.product.index, this.product.options)
            }
          }
          this.initRelationCheckBoxGroup()
        }
        this.isShowOptionsPanel = true
      })
    },
    selectOption (simpleId) {
      console.log(simpleId, 'simpleId')
      let index = this.selectOptions.indexOf(simpleId)
      if (index === -1) {
        this.selectOptions.push(simpleId)
        this.removeOption(simpleId)
      } else {
        this.selectOptions.splice(index, 1)
      }
      this.selectQty = 1
    },
    removeOption (simpleId) {
      let options = this.product.options
      Object.keys(options).forEach(key => {
        let optionsId = Object.keys(options[key])
        if (optionsId.indexOf(simpleId) !== -1) {
          optionsId.forEach(id => {
            let index = this.selectOptions.indexOf(id)
            if (id !== simpleId && index !== -1) {
              this.selectOptions.splice(index, 1)
            }
          })
        }
      })
    },
    updateQty (qty) {
      this.selectQty = qty
    },
    addtoCartPost () {
      if (this.productId) {
        let formdata = {
          product: [
            {
              product_id: this.productId,
              qty: this.selectQty
            }
          ]
        }
        if (this.selectProduct.length > 0) {
          formdata.super_attribute = Object.assign({}, this.product.wishlist[this.productId])
        }
        if (this.relationProduct.length > 0) {
          let relations = this.relationProduct.map(a => {
            return {
              product_id: a,
              // qty: '1'
              qty: this.selectQty
            }
          })
          console.log(relations)
          formdata.product = formdata.product.concat(relations)
        }
        console.log('post add to cart', formdata)
        this.buyProduct(formdata).then(data => {
        }).catch(error => {
          console.log(error)
          this.$q.notify({
            message: this.$i18n.t('$common.$labels.outStock'),
            position: 'center',
            timeout: '3000',
            classes: 'notify'
          })
        })
      } else {
        /*
        this.$q.notify({
          message: this.selectOptionTips,
          position: 'center',
          timeout: '3000',
          classes: 'notify'
        })
        */
      }
    },
    changeRelation (val) {
      this.relationProduct = [].concat(val)
    },
    currentSKU () {
      let currentSKU = ''
      if (this.product.index && this.product.index instanceof Object && this.selectProduct) {
        console.log('sku', this.product.index[this.selectProduct])
        currentSKU = this.product.index[this.selectProduct]
      }

      if ((this.product.stock_infos && this.product.stock_infos instanceof Object && this.selectProduct) || (this.product.stock_thresholds && this.product.stock_thresholds instanceof Object && this.selectProduct)) {
        let stockInfos = this.product.stock_infos[this.selectProduct] || ''
        let stockThresholds = this.product.stock_thresholds[this.selectProduct] || ''
        this.qtyInfo = `${stockInfos}${stockThresholds}`
      } else {
        this.qtyInfo = ''
      }
      this.initRelationCheckBoxGroup()
      this.saveProductId(currentSKU)
    },
    saveProductId (id) {
      this.saveProductIdToState(id)
    },
    setSelected (index, options) {
      let keys = Object.keys(index)
      if (keys.length === 1) {
        let selectedId = index[keys[0]]
        this.saveProductId(selectedId)
      } else {
        this.saveProductId('')
      }
    },
    initRelationCheckBoxGroup () {
      console.log(this.selectProduct, 'relation init')
      if (this.selectProduct) {
        let list = this.product.related_products_for_options[this.selectProduct]
        this.relationProduct = []
        this.relationCheckBoxGroup = list
        this.relationDisable = false
      } else {
        if (this.product.related_products) {
          this.relationCheckBoxGroup = [].concat(this.product.related_products)
          this.relationProduct = []
          if (this.product.type === 'simple') {
            this.relationDisable = false
          } else {
            this.relationDisable = true
          }
        }
      }
    },
    showSizeChart (status) {
      this.isShowSizeChart = status
    },
    resetProduct () {
      this.selectProduct = ''
      this.selectedId = ''
      this.selectOptions = []
      this.selectQty = 1
      this.qtyInfo = ''
      this.relationDisable = false
      this.relationCheckBoxGroup = []
      this.relationProduct = []
    },
    replacePipe: function (item) {
      // eslint-disable-next-line no-useless-escape
      let regex = /\|/g
      return item.replace(regex, '-')
    },
    checkImg: function (img) {
      return img || noLrgImage
    }
  },
  created () {
    this.initList()
  }
}
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.q-col-gutter-md {
  @media screen and (#{$bp-660}) {
    margin-left: 0;
  }
}

.q-col-gutter-md > div {
  @media screen and (#{$bp-660}) {
    padding: 0;
  }
}
.item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  a {
    display: block;
  }
  .remove {
    position: absolute;
    right: 5px;
    top: 5px;
  }
}
.info {
  margin: 0;
  text-align: center;
  font-family: $typography-font-family;
  font-size: 1em;
  text-transform: none;
  letter-spacing: 0;
  // background: $brandgrey1;
  border: 1px solid $borderColor;
  padding: 10px;
}
.info .name,
.info .price {
  padding-bottom: 5px;
}
.wishlist-link-btn {
  display: inline-block;
  margin: 5px 0 5px 0;
  @media screen and (min-width: 660px) {
    min-width: 180px;
  }
  @media screen and (max-width: 660px) {
    padding: 0;
    width: 100%;
  }
  @media screen and (max-width: 390px) {
    font-size: 3.7vw;
  }
}
.price {
  line-height: 1.5em;
}
.spec {
  font-size: 14px;
  color: #999;
  line-height: normal;
  padding-bottom: 10px;
}
.add-btn {
  position: absolute;
  right: 10px;
  bottom: 30px;
}
.out-stock {
  text-align: center;
}
@media screen and (#{$bp-660}) {
  .name {
    padding: 0 20px;
  }
  .price {
    font-size: 12px;
  }
  .item {
    margin-bottom: 2%;
    a {
      display: flex;
      .q-img {
        width: 40%;
      }
      .info {
        width: 60%;
        display: flex;
        justify-content: center;
        flex-direction: column;
      }
    }
  }
}
</style>

<style lang="scss">
.wishlist-link-btn {
  &.arrow {
    &:after {
      padding: 4px;
      top: -4px;
      right: -4px;
    }
  }
}
</style>
