<script>
import luckyDrawForm from './LuckyDrawForm'
import cmsHtml from './Html'
export default {
  components: {
    luckyDrawForm,
    cmsHtml
  },
  data () {
    return {
      noTextTag: [
        'img',
        'input'
      ]
    }
  },
  props: {
    tag: {
      type: Object
    }
  },
  render: function (createElement) {
    console.log('tag', this.tag)
    if (this.tag && this.tag.tag && this.tag.node && this.tag.node === 'element') {
      if (this.tag.attr && this.tag.attr.class === 'promotion-form') {
        console.log('template form')
        return createElement(luckyDrawForm, { props: { position: this.tag.attr['data-position'] } })
      } else {
        if (this.tag.child && this.tag.child.length > 0) {
          return createElement(
            this.tag.tag,
            {
              attrs: this.tag.attr
            },
            this.tag.child.map(child => {
              console.log('child', child)
              return createElement(cmsHtml, { props: { tag: child } })
            })
          )
        } else {
          if (this.noTextTag.indexOf(this.tag.tag) === -1) {
            return createElement(
              this.tag.tag,
              {
                attrs: this.tag.attr
              },
              this.tag.text
            )
          } else {
            return createElement(this.tag.tag, {
              attrs: this.tag.attr
            })
          }
        }
      }
    } else {
      return createElement('div', '')
    }
  }
}
</script>
