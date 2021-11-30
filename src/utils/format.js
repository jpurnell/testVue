import md5 from 'crypto-js/md5'

export function formatMoney (number, places, symbol, thousand, decimal) {
  number = number || 0
  places = !isNaN(places = Math.abs(places)) ? places : 2
  symbol = symbol !== undefined ? symbol : '￥'
  thousand = thousand || ','
  decimal = decimal || '.'
  let negative = number < 0 ? '-' : ''
  let i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + ''
  let j = i.length
  j = j > 3 ? j % 3 : 0
  return symbol + negative + (j ? i.substr(0, j) + thousand : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '￥1' + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : '')
}

export function nowDate () {
  const today = new Date()
  var year = today.getFullYear()
  var month = today.getMonth() + 1
  var day = today.getDate()
  var yearString = year.toString()
  var monthString = month.toString().length < 2 ? '0' + month.toString() : month.toString()
  var dayString = day.toString().length < 2 ? '0' + day.toString() : day.toString()
  return [yearString, monthString, dayString].join('-')
}

export function tid (val) {
  let today = nowDate()
  let token = val || ''
  console.log(md5(`${today}${token}`).toString())
  return md5(`${today}${token}`).toString()
}

// Remove Currency Symbol for EUR (need to add GBP, CHF, etc. later)
export function removeCurrencySymbol (val) {
  return val.replace('€', '')
}

// Format Price for GA & Adobe Launch DataLayer
// -- Only tested for EUR - will need to be updated when GBP, CHF, etc. are added
export function formatPrice (val, lang) {
  let price = val
  if (val) {
    if (lang === 'en') {
      price = price.replace(/\s|,/g, '')
    } else if (lang === 'fr') {
      price = price.replace(/,/g, '.')
      price = price.replace(/\s/g, '')
    } else if (lang === 'de' || lang === 'es') {
      price = price.replace(/\s|\./g, '')
      price = price.replace(/,/g, '.')
    }
    price = removeCurrencySymbol(price)
  }

  return price
}
