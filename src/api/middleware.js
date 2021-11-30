import axios from 'axios'
import md5 from 'crypto-js/md5'

export function httpsMiddlewarePost (url, formdata) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      baseURL: 'http://39.100.75.169/',
      url,
      data: formdata,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      resolve(response.data)
    }).catch(error => {
      reject(error)
    })
  })
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

export function getInovicePDF (formdata, tid) {
  const url = '/invoice/invoice/getFapiaoResult'
  let today = nowDate()
  let token = tid || ''
  formdata.tid = md5(`${today}${token}`).toString()
  return httpsMiddlewarePost(url, formdata)
}
