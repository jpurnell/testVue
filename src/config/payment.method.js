// EU Payment Methods
export const paymentMethodConfigEU = [
  {
    value: 'banktransfer',
    en: '$common.$labels.bankTransfer',
    pc: true,
    mobile: true,
    lang: 'all',
    currency: ['EUR']
  },
  {
    value: 'ingenico_cc',
    en: '$common.$labels.creditCard',
    pc: true,
    mobile: true,
    lang: 'all',
    currency: ['EUR']
  },
  {
    value: 'checkmo',
    en: '$common.$labels.checkmo',
    pc: true,
    mobile: true,
    lang: 'all',
    currency: ['EUR']
  }
]

// CN Payment Methods
export const paymentMethodConfigCN = [
  {
    value: 'alipaypayment',
    cn: '支付宝',
    en: 'Alipay',
    pc: true,
    mobile: false,
    lang: 'all',
    currency: ['CNY', 'HKD', 'SGD', 'JPY', 'KRW', 'AUD', 'USD']
  },
  {
    value: 'alipaymobile',
    cn: '支付宝',
    en: 'Alipay',
    pc: false,
    mobile: true,
    lang: 'all',
    currency: ['CNY', 'HKD', 'SGD', 'JPY', 'KRW', 'AUD', 'USD']
  },
  {
    value: 'wechatpay',
    cn: '微信支付',
    en: 'WeChat Pay',
    pc: false,
    mobile: true,
    lang: 'all',
    currency: ['CNY']
  },
  {
    value: 'wechatpaynative',
    cn: '微信支付',
    en: 'WeChat Pay',
    pc: true,
    mobile: false,
    lang: 'all',
    currency: ['CNY']
  },
  {
    value: 'wechatpayh5',
    cn: '微信支付',
    en: 'WeChat Pay',
    pc: false,
    mobile: true,
    lang: 'all',
    currency: ['CNY']
  },
  {
    // value: 'payeasy',
    value: 'useepay',
    cn: '国际信用卡',
    en: 'Credit Card',
    pc: true,
    mobile: true,
    lang: 'en',
    currency: ['CNY', 'HKD', 'SGD', 'JPY', 'KRW', 'AUD', 'USD']
  },
  {
    value: 'banktransfer',
    cn: '线下转账',
    en: 'Bank Transfer',
    pc: true,
    mobile: true,
    lang: 'all',
    currency: ['CNY', 'HKD', 'USD']
  }
]
