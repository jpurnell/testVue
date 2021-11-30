import Vue from 'vue'

const animate = Vue.directive('animate', {
  bind (el, binding) {
    try {
      let hasRun = false
      const { top, bottom } = el.getBoundingClientRect()
      const height = document.documentElement.clientHeight
      // console.log(el, 'top:', top, ', bottom:', bottom, ', viewport-height:', height)
      if (!hasRun && top <= height && bottom >= 0) {
        hasRun = true
        el.classList.add('animate-bind')
      }
    } catch { }
  },
  inserted: function (el, binding) {
    try {
      let f = function (evt) {
        let hasRun = false
        const { top, bottom } = el.getBoundingClientRect()
        const height = document.documentElement.clientHeight
        // console.log(el, 'top:', top, ', bottom:', bottom, ', viewport-height:', height)
        if (!hasRun && top <= height && bottom >= 0) {
          hasRun = true
          el.classList.add('animate-bind')
        }
        if (hasRun) {
          window.removeEventListener('scroll', f)
        }
      }
      window.addEventListener('scroll', f)
    } catch { }
  }
})

export default animate
