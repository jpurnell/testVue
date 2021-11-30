<template>
  <div :class="['price-options', bottom ? 'panelfixed' : '']">
    <!-- Load Favi in Slot -->
    <slot></slot>
    <p class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
        <link itemprop="url" :href="'https://shopmo.com/' + this.lang + '/p/' + this.product.url" />
        <link itemprop="availability" :href="[this.outOfStock ? 'https://schema.org/OutOfStock' : 'http://schema.org/InStock']" />
        <span id="currentPrice0">
            <meta itemprop="itemCondition" itemtype="http://schema.org/OfferItemCondition" content="http://schema.org/NewCondition" />
            <del v-show="showPrice !== marketShowPrice">
              <meta itemprop="priceCurrency" :content="currency" />
              <meta :content="minPrice" itemprop="price" />
              <span>{{marketShowPrice}}</span>
            </del>
            <span class="salePrice" itemtype="http://schema.org/UnitPriceSpecification" itemscope itemprop="priceSpecification">
                <meta itemprop="priceCurrency" :content="currency" />
                <meta :content="minPrice" itemprop="minPrice" />
                <meta :content="maxPrice" itemprop="maxPrice" />
                <meta :content="minPrice" itemprop="price" /> <!--The lowest price again-->
                <!-- <time itemprop="validThrough" :datetime="promoEndsDateTime"></time> -->
                <span>{{showPrice}}</span>
            </span>
        </span>
    </p>
    <div>
      <div v-if="qtyInfo !== '0'">
        <div v-show="!optionsOnly">
          <div v-for="(option, key, index) in product.options" :key="key" class="options" v-show="key!=='Set'">
            <!-- If is China Site or is EU site & option_styles is true  -->
            <div v-if="!isEu || (product.hasOwnProperty('option_styles') && product.option_styles[key])" class="styles-true">
              <div class="option-key">
                <span>{{ key }} </span>
                <q-btn
                  flat
                  round
                  icon="icon-faq"
                  class="btn-dropdown-chart"
                  size="25"
                  @click="showSizeChart"
                  v-if="showSizeChartBtn(key) && index === 0"
                ><span class="hidden">Size Options</span></q-btn>
                <span class="options-tips" v-show="!checkCurrentOpts(option) && needCheck && Object.keys(option).length > 1">{{selectOptionTips}}</span>
              </div>
              <div class="option-list">
                <div
                  v-for="(value, label) in option"
                  :key="label"
                  @click="selectOption(label, index)"
                  class="option"
                  :class="[
                    selectOptions.indexOf(label) !== -1 ? 'actived' : '',
                    selectOptions.length > 0 && hasStock.indexOf(label) !== -1 || selectOptions.length > 0 && realHasStock.indexOf(label) !== -1 || Object.keys(product.options).length === 1 && realHasStock.indexOf(label) !== -1 ? 'outstock' : ''
                  ]"
                >
                  <div v-if="optionType(value) === 'text'" class="text-label">{{ i18n(value) }}</div>
                  <q-tooltip v-if="selectOptions.length > 0 && realHasStock.indexOf(label) !== -1 || Object.keys(product.options).length === 1 && realHasStock.indexOf(label) !== -1" :offset="[2, 2]">
                    {{i18n('outStock')}}
                  </q-tooltip>
                  <div
                    v-if="optionType(value) === 'img'"
                    class="special-option"
                  >
                    <div class="img-value">
                      <img
                        :src="specialOptionLabel(value)"
                        :alt="value"
                        :title="value"
                      />
                    </div>
                    <div class="special-label">{{ value }}</div>
                  </div>
                  <div
                    v-if="optionType(value) === 'color'"
                    class="special-option color-option"
                  >
                    <div class="color-box">
                      <div
                        :class="['color-value', selectOptions.indexOf(label) !== -1 ? 'actived' : '', checkOutStock(label, index)? 'outstock' : '']"
                        :style="{backgroundColor: specialOptionLabel(value)}"></div>
                    </div>
                    <div :class="['special-label', checkOutStock(label, index)? 'outstock' : '']">{{ specialOptionLabelName(value) }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="styles-false">
              <q-btn
                flat
                round
                icon="icon-faq"
                class="btn-dropdown-chart"
                size="25"
                @click="showSizeChart"
                v-if="showSizeChartBtn(key) && index === 0"
              ><span class="hidden">Size Options</span></q-btn>
              <q-btn
                flat
                round
                icon="icon-faq"
                class="btn-dropdown-chart"
                size="25"
                @click="showBedBaseColors"
                v-if="showBedBaseColorsBtn(key) && index === 1"
              ><span class="hidden">Colour Options</span></q-btn>
              <q-btn
                flat
                round
                icon="icon-faq"
                class="btn-dropdown-chart"
                size="25"
                @click="showBedLegColors"
                v-if="showBedLegColorsBtn(key) && index === 2"
              ><span class="hidden">Colour Options</span></q-btn>
              <span class="options-tips" v-show="!checkCurrentOpts(option) && needCheck && Object.keys(option).length > 1">{{selectOptionTips}}</span>
              <q-select
                outlined
                square
                dense
                use-input
                display-value-html
                :label="key"
                v-model="selectVal[index].value"
                :options="optionDropdown[key]"
                option-disable="inactive"
                :style="[fitSizeChartBtn ? {'width': 'calc(100% - 40px)'} : {'width': '100%'}]"
                @input="onValueChange(selectVal[index].value, index)"
                class="options-select"
                popup-content-class="product-selector"
                behavior="menu"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="qty-block">
        <div v-if="qtyInfoTips" class="qty-tips">{{qtyInfoTips}}</div>
        <div v-if="qtyInfo !== '0'">
          <set-qty ref="setQty" :item-id="selectedId" :default-qty="qty" :max-qty="maxQty" :min-qty="1" @updateQty="updateQty"></set-qty>
        </div>
      </div>
      <div class="shipment-tips" v-if="product.tag_info">{{ product.tag_info }}</div>
    </div>
    <template v-if="qtyInfo !== '0'">
      <p class="button">
        <button v-if="!cartPosted" class="btn-main" @click="addtoCartPost"><span>{{addtoCartText}}</span></button>
        <button v-if="cartPosted" class="btn-main" >
          <q-spinner
            color="white"
            size="22px"
            :thickness="8"
          />
        </button>
      </p>
    </template>
    <div v-if="relationCheckBoxGroup.length > 0  && qtyInfoTips === ''">
      <div v-for="item in relationCheckBoxGroup" :key="item.product_id" class="field addon-items" :class="item.stock_status === '0' ? 'outstock' : ''">
        <q-item class="add-on-item">
          <q-item-section side middle>
            <q-checkbox
              v-model="currentRelationProduct"
              :val="item.sku"
              color="primary"
              dense
              :disable="relationDisable || item.stock_status !== '1'"
              @input="changeRelation"
            />
          </q-item-section>
          <q-item-section thumbnail>
            <!-- <q-img :src="item.image" :ratio="24/17" class="thumbnail cursor-pointer" @click="showFullImg(item)"/> -->
            <q-img :src="item.image" :ratio="24/17" class="thumbnail" />
          </q-item-section>
          <q-item-section class="item-details">
            <q-item-label overline class="relation-name">{{ item.name.replace(/\|/g, '-') }}</q-item-label>
            <q-item-label caption class="relation-price">
              {{ item.price.price }} <del v-show="item.price.price !== item.price.market_price">{{ item.price.market_price }}</del>
            </q-item-label>
            <q-item-label caption class="relation-quantity">{{ quantityText }}: {{ qty }}</q-item-label>
          </q-item-section>
          <q-tooltip v-if="relationDisable" anchor="bottom middle" self="top middle" class="tip-warning" content-style="font-size: 16px" :offset="[0, 10]">
            {{ selectOptionFirst }}
          </q-tooltip>
        </q-item>
        <div class="outstock-info" v-if="item.stock_status === '0'">{{ outstockText(item) }}</div>
      </div>
    </div>
    <!-- <div v-if="qtyInfo === '0'">
      <div class="qty-block">
        <div v-if="qtyInfoTips" class="qty-tips">{{qtyInfoTips}}</div>
      </div>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { removeCurrencySymbol } from './../../utils/format'
import SetQty from './../SetQty.vue'
export default {
  components: {
    'set-qty': SetQty
  },
  data () {
    return {
      currentRelationProduct: [],
      hasStock: [],
      cartPosted: false,
      needCheck: false,
      optionDropdown: {}
    }
  },
  props: {
    product: {
      type: Object
    },
    selectOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectVal: {
      type: Array,
      default: function () {
        return []
      }
    },
    optionsSkuId: {
      type: Array
    },
    marketShowPrice: {
      type: String,
      default: ''
    },
    showPrice: {
      type: String,
      default: ''
    },
    selectedId: {
      type: String,
      default: ''
    },
    qty: {
      type: Number,
      default: 1
    },
    qtyInfo: {
      type: String,
      default: ''
    },
    stockInfo: {
      type: String,
      default: ''
    },
    relationDisable: {
      type: Boolean,
      default: true
    },
    relationCheckBoxGroup: {
      type: Array,
      default: function () {
        return []
      }
    },
    relationProduct: {
      type: Array,
      default: function () {
        return []
      }
    },
    lang: {
      type: String,
      default: 'en'
    },
    currency: {
      type: String,
      default: 'EUR'
    },
    bottom: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      isEu: state => state.site.isEU
    }),
    addtoCartText: function () {
      return this.$i18n.t('$common.$buttons.addtoCart')
    },
    quantityText: function () {
      return this.$i18n.t('$common.$labels.quantity')
    },
    selectOptionTips: function () {
      return this.$i18n.t('$common.$validation.selectOption')
    },
    selectOptionFirst: function () {
      return this.$i18n.t('$common.$validation.selectProductOption')
    },
    qtyInfoTips: function () {
      if (this.qtyInfo) {
        if (this.qtyInfo === '0') {
          return this.product.back_in_stock || this.$i18n.t('$common.$labels.outStock')
        } else {
          return this.$i18n.t('$common.$validation.onlyOne', { number: this.qtyInfo })
        }
      } else if (this.stockInfo) {
        return this.product.back_in_stock || this.$i18n.t('$common.$validation.outStockTips', { tips: this.stockInfo })
      } else {
        return ''
      }
    },
    outOfStock: function () {
      if (this.qtyInfo) {
        if (this.qtyInfo === '0') {
          return true
        } else {
          return false
        }
      } else if (this.stockInfo) {
        return true
      } else {
        return false
      }
    },
    maxQty: function () {
      if (this.qtyInfo !== '') {
        return parseInt(this.qtyInfo, 10)
      } else {
        return 10
      }
    },
    optionsOnly: function () {
      if (this.product.index && this.product.options) {
        let indexLength = Object.keys(this.product.index).length
        let options = Object.keys(this.product.options)
        // // console.log(indexLength, options)
        if (indexLength === 1 && options.length === 1) {
          if (Object.keys(this.product.options[options[0]]).length === 1) {
            return false
          } else {
            return false
          }
        } else {
          return false
        }
      } else {
        return false
      }
    },
    fitSizeChartBtn: function () {
      return this.product.size_chart !== ''
    },
    minPrice: function () {
      let showPrice = this.showPrice
      if (showPrice.includes('-')) {
        showPrice = showPrice.split(' - ')[0]
        showPrice = showPrice.replace(/[,]+/g, '').trim()
      }
      return removeCurrencySymbol(showPrice)
    },
    maxPrice: function () {
      let showPrice = this.showPrice
      if (showPrice.includes('-')) {
        showPrice = showPrice.split(' - ')[1]
        showPrice = showPrice.replace(/[,]+/g, '').trim()
      }
      return removeCurrencySymbol(showPrice)
    },
    promoEndsDateTime: function () {
      let date = this.product.promoEndsDateTime
      // Need to convert this into a valid JS dateTime
      // date = new Date(date)
      // date = date.toISOString()
      return date
    }
  },
  watch: {
    qty: function (newVal, oldVal) {
      // console.log(newVal, 'panel qty')
      if (newVal !== oldVal) {
        this.$refs.setQty.syncQty(newVal)
      }
    },
    relationProduct: function (newVal, oldVal) {
      this.currentRelationProduct = newVal
    },
    selectOptions: function (newVal, oldVal) {
      if (this.product.unavailable && this.product.unavailable.length > 0 && newVal.length > 0) {
        let outStock = []
        newVal.forEach(a => {
          this.product.unavailable.forEach(b => {
            if (b.indexOf(a) !== -1) {
              let tempArray = b.split('|')
              tempArray.forEach(c => {
                if (c !== a) {
                  outStock.push(c)
                }
              })
            }
          })
        })
        this.hasStock = outStock
      } else {
        this.hasStock = []
      }
      this.checkSelectOption()
    }
  },
  methods: {
    checkRealOutStock (newVal) {
      // console.log('optionspanel checkRealOutStock', this.hasStock, this.realHasStock, this.outStockArr)
      if (this.outStockArr && this.outStockArr.length > 0 && newVal && newVal.length > 0) {
        let realOutStock = []
        newVal.forEach(a => {
          this.outStockArr.forEach(b => {
            if (b.indexOf(a) !== -1) {
              let tempArray = b.split('|')
              tempArray.forEach(c => {
                if (c !== a) {
                  realOutStock.push(c)
                }
              })
            }
          })
        })
        this.realHasStock = realOutStock
      } else {
        this.realHasStock = []
      }
      if (!newVal || Object.keys(this.product.options).length === 1) {
        let realOutStock = []
        this.outStockArr.forEach(b => {
          let tempArray = b.split('|')
          tempArray.forEach(c => {
            realOutStock.push(c)
          })
        })
        // console.log('checkRealOutStock', newVal, realOutStock, this.outStockArr)
        this.realHasStock = realOutStock
      }
    },
    onValueChange (value, index) {
      // console.log('onValueChange', value, index, this.selectVal[index])
      // for (let i = 0; i < this.selectVal.length; i++) {
      //   if (index < i) {
      //     this.selectVal[i].value = {}
      //   }
      // }
      this.$emit('changeOption', value.value)
    },
    showSizeChartBtn (key) {
      let sizeLang = ['size', 'taille', 'tamaño', 'größe']
      let sizeLangStatus = false
      for (let i = 0; i < sizeLang.length; i++) {
        // console.log('showSizeChartBtn', key.toLowerCase(), sizeLang[i], key.toLowerCase().indexOf(sizeLang[i]) !== -1)
        if (key.toLowerCase().indexOf(sizeLang[i]) !== -1) {
          sizeLangStatus = true
        }
      }
      if (sizeLangStatus && this.product.size_chart) {
        return true
      } else {
        return false
      }
    },
    showBedBaseColorsBtn (key) {
      console.log('showBedBaseColorsBtn', key)
      let colourLang = ['base style', 'couleur du sommier', 'color de la base', 'bettgestell-farbe']
      let colourLangStatus = false
      for (let i = 0; i < colourLang.length; i++) {
        if (key.toLowerCase().indexOf(colourLang[i]) !== -1) {
          colourLangStatus = true
        }
      }
      if (colourLangStatus) {
        return true
      } else {
        return false
      }
    },
    showBedLegColorsBtn (key) {
      // console.log('showBedLegColorsBtn', key)
      let colourLang = ['leg style', 'pieds', 'patas', 'bettfüße']
      let colourLangStatus = false
      for (let i = 0; i < colourLang.length; i++) {
        console.log('showBedLegColorsBtn', key.toLowerCase(), colourLang[i], key.toLowerCase().indexOf(colourLang[i]) !== -1)
        if (key.toLowerCase().indexOf(colourLang[i]) !== -1) {
          colourLangStatus = true
        }
      }
      if (colourLangStatus) {
        return true
      } else {
        return false
      }
    },
    showSizeChart () {
      this.$emit('showSizeChart', true)
    },
    showBedBaseColors () {
      this.$emit('showBedBaseColors', true)
    },
    showBedLegColors () {
      this.$emit('showBedLegColors', true)
    },
    selectOption (simpleId, index) {
      // console.log('selectOption: simpleId', simpleId, 'index', index, 'checkOutStock', this.checkOutStock(simpleId, index), 'this.selectVal', this.selectVal)
      if (!this.checkOutStock(simpleId, index)) {
        this.$emit('updateSelectValId', simpleId, index)
        this.checkSelectOption()
        this.$emit('changeOption', simpleId)
        console.log('selectOption: this.selectVal', this.selectVal)
      } else {
        return false
      }
    },
    stockTipShow (label) {
      // console.log('stockTipShow 1', label, this.hasStock.indexOf(label), this.hasStock)
      if (this.hasStock.indexOf(label) !== -1) {
        this.outStockArr.forEach(b => {
          if (b.indexOf(label) !== -1) {
            let tempArray = b.split('|')
            tempArray.forEach(c => {
              if (c === label) {
                // console.log('stockTipShow 2 need show tip', c)
              }
            })
          }
        })
      }
    },
    stockTipHide () {
      // console.log('stockTipHide')
    },
    showFullImg (item) {
      // console.log(item, 'showFullImg')
      if (!item.outStock) {
        this.$emit('showPopImg', item)
      }
    },
    i18n: function (key) {
      let option = key
      if (option.indexOf('|') === -1) {
        return this.$i18n.t(option)
      } else {
        let labelArray = option.split('|')
        return this.$i18n.t(labelArray[0])
      }
    },
    updateQty (itemId, qty) {
      this.$emit('updateQty', qty)
    },
    addtoCartPost () {
      this.cartPosted = true
      if (Object.keys(this.product.options).length > 0) {
        this.needCheck = true
        this.$emit('addtoCartPost')
      } else {
        this.$emit('addtoCartPost')
      }
      let _this = this
      setTimeout(() => {
        _this.cartPosted = false
      }, 2000)
    },
    optionType (value) {
      // console.log('optionType', value)
      if (value.indexOf('https://') !== -1) {
        return 'img'
      } else if (value.indexOf('#') !== -1) {
        return 'color'
      } else {
        return 'text'
      }
    },
    specialOptionLabel (value) {
      let option = value
      if (option.indexOf('|') === -1) {
        return option
      } else {
        let labelArray = option.split('|')
        return labelArray[1]
      }
    },
    specialOptionLabelName (value) {
      let option = value
      if (option.indexOf('|') === -1) {
        return option
      } else {
        let labelArray = option.split('|')
        return labelArray[0]
      }
    },
    translation (value) {
      return this.$i18n.t(value)
    },
    changeRelation (val) {
      this.$emit('changeRelation', this.currentRelationProduct)
    },
    checkCurrentOpts (options) {
      // // console.log('checkCurrentOpts 1', options, Object.keys(options))
      let ids = Object.keys(options)
      let hasSelected = false
      ids.forEach(key => {
        if (this.selectOptions.indexOf(key) !== -1) {
          hasSelected = true
        }
      })
      return hasSelected
    },
    outstockText: function (item) {
      if (item && item.back_in_stock && item.back_in_stock !== '') {
        return item.back_in_stock
      } else {
        return this.product.back_in_stock || this.$i18n.t('$common.$labels.outStock')
      }
    },
    checkSelectOption: function () {
      let selectVal = this.selectVal
      let selectedArr = []
      // let selectedIndex = 0
      let i = 0
      Object.keys(selectVal).forEach(function (key) {
        if (selectVal[key].value && typeof selectVal[key].value === 'object') {
          // eslint-disable-next-line no-useless-escape
          selectedArr[i] = selectVal[key].value ? selectVal[key].value.value.replace(/\"/g, '') : ''
        } else if (typeof selectVal[key] === 'string') {
          // eslint-disable-next-line no-useless-escape
          selectedArr[i] = selectVal[key].replace(/\"/g, '')
        }
        i = i + 1
      })
      let optionDropdown = {}
      let outStockArr = this.outStockArr
      let stockInfo = '(' + (this.product.stock_info || this.$i18n.t('$common.$labels.outStock')) + ')'
      // let optionsLength = Object.keys(this.product.options).length
      let optionsIndex = 0
      let outStockMap = {}
      Object.keys(outStockArr).forEach(function (outKey) {
        outStockMap[outStockArr[outKey]] = true
      })
      let unavailable = this.product.unavailable
      for (let k in this.product.options) {
        let optionObject = this.product.options[k]
        // let selectVal = { value: '' }
        if (this.product.hasOwnProperty('option_styles') && !this.product.option_styles[k]) {
          let options = []
          let tempObj = {}
          Object.keys(optionObject).forEach(function (key) {
            tempObj = {
              label: optionObject[key],
              value: key
            }
            // eslint-disable-next-line no-useless-escape
            let fixKey = key.replace(/\"/g, '')
            let tempSelectArr = [...selectedArr]
            tempSelectArr[optionsIndex] = fixKey
            tempSelectArr.sort(function (a, b) {
              if (isNaN(a) || isNaN(b)) {
                return a > b ? 1 : -1
              }
              return a - b
            })
            if (outStockMap[tempSelectArr.join('|')]) {
              tempObj.inactive = true
              tempObj.label = tempObj.label + ' ' + stockInfo
            } else {
              tempObj.inactive = false
              tempObj.label = optionObject[key]
            }
            // eslint-disable-next-line no-useless-escape
            if (unavailable && unavailable.indexOf(tempSelectArr.join('|').replace(/\"/g, '')) !== -1) {
              tempObj.inactive = true
            } else {
              options.push(tempObj)
            }
          })
          optionDropdown[k] = options
        }
        // this.selectVal.push(selectVal)
        optionsIndex = optionsIndex + 1
      }
      this.optionDropdown = optionDropdown
    },
    checkOutStock: function (label, index) {
      console.log('checkOutStock', label, index)
      let status = false
      let selectVal = this.selectVal
      let selectedArr = []
      // let selectedIndex = 0
      let outStockArr = this.outStockArr
      let optionsIndex = index
      let outStockMap = {}
      Object.keys(outStockArr).forEach(function (outKey) {
        outStockMap[outStockArr[outKey]] = true
      })
      let i = 0
      Object.keys(selectVal).forEach(function (key) {
        if (selectVal[key].value && typeof selectVal[key].value === 'object') {
          // eslint-disable-next-line no-useless-escape
          selectedArr[i] = selectVal[key].value ? selectVal[key].value.value.replace(/\"/g, '') : ''
        } else if (typeof selectVal[key] === 'string') {
          // eslint-disable-next-line no-useless-escape
          selectedArr[i] = selectVal[key].replace(/\"/g, '')
        } else {
          if (selectVal[key].value && selectVal[key].value === '' && i === 0) {
            // eslint-disable-next-line no-useless-escape
            selectedArr[i] = selectVal[key].replace(/\"/g, '')
          }
        }
        i = i + 1
      })
      for (let k in this.product.options) {
        let optionObject = this.product.options[k]
        if (this.product.hasOwnProperty('option_styles') && !this.product.option_styles[k]) {
          Object.keys(optionObject).forEach(function (key) {
            // eslint-disable-next-line no-useless-escape
            let fixKey = label.replace(/\"/g, '')
            let tempSelectArr = [...selectedArr]
            tempSelectArr[optionsIndex] = fixKey
            tempSelectArr.sort(function (a, b) {
              if (isNaN(a) || isNaN(b)) {
                return a > b ? 1 : -1
              }
              return a - b
            })
            if (outStockMap[tempSelectArr.join('|')] && !status) {
              status = true
            }
          })
        } else {
          // eslint-disable-next-line no-useless-escape
          let key = label.replace(/\"/g, '')
          if (outStockMap[key] && !status) {
            status = true
          }
        }
      }
      return status
    }
  },
  created () {
    let optionDropdown = {}
    let outStockArr = []
    for (let key of Object.keys(this.product.stock_statues)) {
      if (!this.product.stock_statues[key]) {
        outStockArr.push(key)
      }
    }
    this.outStockArr = outStockArr
    this.checkRealOutStock()
    let unavailable = this.product.unavailable
    let stockInfo = '(' + (this.product.stock_info || this.$i18n.t('$common.$labels.outStock')) + ')'
    let optionsLength = Object.keys(this.product.options).length
    for (let k in this.product.options) {
      let optionObject = this.product.options[k]
      let selectVal = { value: '' }
      if (this.product.hasOwnProperty('option_styles') && !this.product.option_styles[k]) {
        let options = []
        let tempObj = {}
        Object.keys(optionObject).forEach(function (key) {
          tempObj = {
            label: optionObject[key],
            value: key
          }
          // eslint-disable-next-line no-useless-escape
          if (optionsLength === 1 && outStockArr.indexOf(key.replace(/\"/g, '')) !== -1) {
            tempObj.inactive = true
            tempObj.label = tempObj.label + ' ' + stockInfo
          }
          // eslint-disable-next-line no-useless-escape
          if (unavailable && unavailable.indexOf(key.replace(/\"/g, '')) !== -1) {
            tempObj.inactive = true
          } else {
            options.push(tempObj)
          }
        })
        optionDropdown[k] = options
        if (Object.keys(optionObject).length === 1) {
          selectVal = {
            value: tempObj
          }
          this.onValueChange(tempObj, 0)
        }
      }
      this.$emit('pushToSelectVal', selectVal)
    }
    this.optionDropdown = optionDropdown
    this.currentRelationProduct = this.relationProduct
  }
}
</script>

<style lang="scss" scoped>
.price,
.market-price {
  @media screen and (max-width: 1020px) {
    width: calc(100% - 34px);
  }
}
.cart-handler {
  .options {
    margin-bottom: 10px;
    width: 100%;
  }
  .btn-main {
    min-width: 150px;
  }
}
.option-key {
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  > .q-btn {
    position: relative;
    margin-left: 10px;
  }
}
.options-tips {
  color: #f00;
  padding-left: 10px;
}
.option-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.option {
  display: inline-block;
  margin: 0 10px 10px 0;
  cursor: pointer;
}
.qty-block {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}
.text-label {
  padding: 10px 12px;
  color: $black;
  border: 2px solid $white;
  text-transform: uppercase;
  font-size: 0.7125em;
  line-height: 1.2em;
  background: $brandgrey2;
}
.actived {
  .text-label {
    color: $primary;
    border: 2px solid $primary;
  }
}
.special-option {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.img-value {
  border: 4px solid #fff;
  img {
    display: block;
    width: 40px;
    height: 40px;
  }
}
.actived {
  .img-value {
    border: 4px solid $primary;
  }
  .color-value {
    border: 4px solid $primary;
  }
}
.outstock {
  opacity: 0.5;
  cursor: default;
}
.color-box {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.color-value {
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid rgba(0,0,0,0.12);
}
.special-label {
  font-size: 12px;
  text-transform: uppercase;
}
.action {
  margin: 20px 0 0;
}
.panelfixed {
  padding-bottom: 80px;
  width: 100%;
  .action {
    width: 100%;
    padding: 10px 15px;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
  }
}
.qty-tips,
.shipment-tips {
  line-height: 1.2em;
  padding-bottom: 20px;
}
.thumbnail {
  width: 80px;
}
.relation-quantity {
  text-transform: capitalize;
}
.outstock-info {
  padding-left: 15%;
}
.btn-dropdown-chart {
  position: absolute;
  right: 0;
}
</style>

<style lang="scss">
.options {
  .q-field--focused {
    &:before {
      border-width: 1px;
    }
    .q-field__label {
      color: $black;
    }
  }
  .options-select {
    .q-field__control {
      min-height: 50px;
    }
    .q-field__label {
      padding-top: 4px;
    }
    .q-field__append {
      padding-top: 11px;
    }
  }
  .q-select__dropdown-icon {
    font-size: 32px;
    color: $black;
  }
  .q-field__control-container input[type="text"], .q-field__control-container input[type="textarea"], .q-field__control-container input[type="search"], .q-field__control-container input[type="tel"], .q-field__control-container input[type="email"] {
    display: none;
  }
  .q-field--auto-height.q-field--dense.q-field--labeled .q-field__control-container {
    cursor: pointer;
  }
}
.product {
  .qty-block {
    button {
      padding-top: 4px;
      padding-bottom: 4px;
      font-weight: 400;
    }
  }
  .btn-dropdown-chart {
    height: 44px;
    .q-btn__wrapper {
      min-width: 0;
    }
    &.q-hoverable {
      &:hover {
        & > .q-focus-helper {
          background: inherit;
          opacity: 0;
        }
        .q-icon {
          color: $accent;
        }
      }
    }
  }
}
.add-to-cart-action {
  [class^='btn-'] {
    width: 100%;
  }
  .q-btn__wrapper {
    min-height: 44px;
  }
}
.add-on-item {
  padding: 15px 0 15px 0;
}
.item-details {
  font-size: 0.9em;
}
.product-selector {
  margin-top: 1px !important;
}
</style>
