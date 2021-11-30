<template>
  <div></div>
</template>

<script>
import { getWechatSign } from '../../api/middleware'
export default {
  name: 'wechatShare',
  data () {
    return {
      appId: 'wx1e734117c91da2a1',
      nonceStr: '',
      timestamp: '',
      signature: ''
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    desc: {
      type: String,
      default: ''
    },
    link: {
      type: String,
      default: ''
    },
    imgUrl: {
      type: String,
      default: ''
    }
  },
  computed: {
    shareTitle: function () {
      return this.title || document.title
    },
    shareDesc: function () {
      return this.desc || ''
    },
    shareLink: function () {
      return this.link || document.URL
    },
    shareImage: function () {
      return this.imgUrl || ''
    }
  },
  methods: {
    getSignature () {
      if (document && document.URL) {
        const params = {
          url: document.URL
        }
        console.log(params)
        if (window.wx) {
          getWechatSign(params).then(data => {
            this.signature = data.sign
            this.timestamp = data.timestamp
            this.nonceStr = data.noncestr
            if (this.signature && this.timestamp && this.nonceStr) {
              this.initShare()
            }
          })
        }
      }
    },
    initShare () {
      if (window.wx) {
        let _this = this
        window.wx.config({
          debug: false,
          appId: _this.appId,
          timestamp: _this.timestamp,
          nonceStr: _this.nonceStr,
          signature: _this.signature,
          jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'onMenuShareQQ',
            'updateAppMessageShareData',
            'updateTimelineShareData'
          ]
        })
        window.wx.ready(function () {
          window.wx.onMenuShareTimeline({
            title: _this.shareTitle,
            link: _this.shareLink,
            imgUrl: _this.shareImage,
            success: function () {
            }
          })
          window.wx.onMenuShareAppMessage({
            title: _this.shareTitle,
            desc: _this.shareDesc,
            link: _this.shareLink,
            imgUrl: _this.shareImage,
            type: '',
            dataUrl: '',
            success: function () {
            }
          })
          window.wx.onMenuShareQQ({
            title: _this.shareTitle,
            desc: _this.shareDesc,
            link: _this.shareLink,
            imgUrl: _this.shareImage,
            success: function () {
            },
            cancel: function () {
            }
          })
          window.wx.updateAppMessageShareData({
            title: _this.shareTitle,
            desc: _this.shareDesc,
            link: _this.shareLink,
            imgUrl: _this.shareImage,
            success: function () {
            }
          })
          window.wx.updateTimelineShareData({
            title: _this.shareTitle,
            link: _this.shareLink,
            imgUrl: _this.shareImage,
            success: function () {
            }
          })
        })
      }
    }
  },
  mounted () {
    console.log('share mounted')
    this.getSignature()
  }
}
</script>
