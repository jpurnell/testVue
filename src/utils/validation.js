export function checkEmail (value) {
  let mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
  let val = value
  if (val.match(mailformat)) {
    return true
  } else {
    return false
  }
}

export function checkLength (value, minLength, maxLength) {
  let val = removeSpace(value)
  let min = parseInt(minLength, 10)
  let max = parseInt(maxLength, 10)
  if (val.length < min) {
    return false
  }
  if (max > 0) {
    if (val.length > max) {
      return false
    }
  }
  return true
}

export function checkUSCC (value) {
  let val = value
  const regex = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/g
  return regex.test(val)
}

export function checkTaxId (value) {
  let val = value
  const regexList = [/^[\da-z]{10,15}$/i, /^\d{6}[\da-z]{10,12}$/i, /^[a-z]\d{6}[\da-z]{9,11}$/i, /^[a-z]{2}\d{6}[\da-z]{8,10}$/i, /^\d{14}[\dx][\da-z]{4,5}$/i, /^\d{17}[\dx][\da-z]{1,2}$/i, /^[a-z]\d{14}[\dx][\da-z]{3,4}$/i, /^[a-z]\d{17}[\dx][\da-z]{0,1}$/i, /^[\d]{6}[\da-z]{13,14}$/i]
  let checkList = regexList.map(i => {
    return i.test(val)
  })
  return checkList.indexOf(true) !== -1
}

export function checkInvoiceCode (value) {
  let val = value
  const regexList = [/^[a-zA-Z0-9]{15}$/i, /^[a-zA-Z0-9]{18}$/i, /^[a-zA-Z0-9]{20}$/i]
  let checkList = regexList.map(i => {
    return i.test(val)
  })
  return checkList.indexOf(true) !== -1
}

export function checkChina (value) {
  let val = value
  const regex = /^[\u4E00-\u9FA5]+$/g
  return regex.test(val)
}

export function checkNumber (value) {
  let val = value
  const regex = /^[\d]+$/g
  return regex.test(val)
}

export function checkPostcode (value) {
  if (value === null) {
    return true
  }
  let val = value
  if (!val) { // 可为空
    return true
  }
  // const regex = /^[a-zA-Z0-9]{4,8}$/g
  const regex = /^[^\u4E00-\u9FA5]{1,8}$/g
  return regex.test(val)
}

export function checkPhone (value) {
  let val = value
  const regex = /^[0-9\-+\s]{5,}$/g
  return regex.test(val)
}

export function removeSpace (value) {
  if (value) {
    return value.replace(/\s/g, '')
  } else {
    return ''
  }
}
