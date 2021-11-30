// Configuration for your app
// const fs = require('fs')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      { path: 'ssr', client: false },
      'i18n',
      'axios',
      'main',
      'tracking',
      'aos',
      'global-components',
      { path: 'directives', server: false },
      { path: 'google-analytics', server: false }
    ],

    framework: {
      config: {
        /*
        brand: {
          primary: '#ffffff',
          secondary: '#26A69A',
          accent: '#9a7b33',
          positive: '#21BA45',
          negative: '#C10015',
          info: '#31CCEC',
          warning: '#F2C037'
        }
        loadingBar: {
          color: 'primary',
          size: '2px',
          position: 'top'
        }
        */
      },
      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QFooter',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QPageSticky',
        'QCarousel',
        'QCarouselControl',
        'QCarouselSlide',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnGroup',
        'QBadge',
        'QIcon',
        'QImg',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QMenu',
        'QSeparator',
        'QSpinner',
        'QSpinnerBars',
        'QFab',
        'QFabAction',
        'QDialog',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QForm',
        'QInput',
        'QCheckbox',
        'QTabs',
        'QTab',
        'QSelect',
        'QRadio',
        'QOptionGroup',
        'QResizeObserver',
        'QRouteTab',
        'QTabPanels',
        'QTabPanel',
        'QSpace',
        'QTable',
        'QTh',
        'QTr',
        'QTd',
        'QScrollObserver',
        'QSplitter',
        'QTooltip',
        'QExpansionItem',
        'QAjaxBar',
        'QNoSsr',
        'QVideo',
        'QParallax',
        'QToggle'
      ],

      directives: [
        'Ripple',
        'ClosePopup',
        'GoBack'
      ],

      // Quasar plugins
      plugins: [
        'Cookies',
        'LocalStorage',
        'SessionStorage',
        'Loading',
        // 'LoadingBar',
        'Meta',
        'Dialog',
        'Notify'
      ],

      // iconSet: 'ionicons-v4'
      lang: 'en-gb' // Quasar language
    },

    supportIE: true,

    htmlVariables: {
      matomoSiteId: ''
    },

    build: {
      scopeHoisting: true,
      vueRouterMode: 'history',
      // vueCompiler: true,
      gzip: true,
      env: {
        port: '3012'
      },
      // analyze: true,
      extractCSS: true,
      sourceMap: false,
      uglifyOptions: {
        compress: { drop_console: true }
      },
      extendWebpack (cfg, { isServer, isClient }) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/
        })
      }
    },

    devServer: {
      // https: true,
      /* https: ctx.dev ? {
        key: fs.readFileSync('/Users/leihuang/Configs/localhost+2-key.pem'),
        cert: fs.readFileSync('/Users/leihuang/Configs/localhost+2.pem'),
        ca: fs.readFileSync('/Users/leihuang/Configs/localhost+2.pem')
      } : true, */
      port: 8091,
      open: true, // opens browser window automatically
      proxy: {
        '/hah_api': {
          target: 'https://stage.shopmo.com/',
          changeOrigin: true,
          pathRewrite: {
            '^/hah_api': '/hah_api'
          }
        }
        /*
        '/hah_api': {
          target: 'http://dev2.server.cn',
          changeOrigin: true,
          pathRewrite: {
            '^/hah_api': '/hah_api'
          }
        }
        */
        /*
        '/hah_api': {
          target: 'http://52.80.229.86:3001',
          changeOrigin: true,
          pathRewrite: {
            '^/hah_api': '/mock/11'
          }
        }
        */
      }
    },

    // animations: 'all', // --- includes all animations
    // animations: [
    //   'bounceInUp',
    //   'bounceOutDown',
    //   'fadeIn',
    //   'fadeOut',
    //   'fadeInDown',
    //   'fadeInUp',
    //   'fadeInRight',
    //   'fadeOutRight',
    //   'slideInUp',
    //   'slideInLeft',
    //   'slideOutLeft',
    //   'slideOutDown',
    //   'slideInRight',
    //   'slideOutRight',
    //   'zoomOutRight'
    // ],

    ssr: {
      pwa: false
    },

    preFetch: true,

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        // name: 'Quasar App',
        // short_name: 'Quasar-PWA',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          // {
          //   'src': 'statics/icons/icon-128x128.png',
          //   'sizes': '128x128',
          //   'type': 'image/png'
          // }
          // {
          //   'src': 'statics/icons/icon-192x192.png',
          //   'sizes': '192x192',
          //   'type': 'image/png'
          // },
          // {
          //   'src': 'statics/icons/icon-256x256.png',
          //   'sizes': '256x256',
          //   'type': 'image/png'
          // },
          // {
          //   'src': 'statics/icons/icon-384x384.png',
          //   'sizes': '384x384',
          //   'type': 'image/png'
          // },
          // {
          //   'src': 'statics/icons/icon-512x512.png',
          //   'sizes': '512x512',
          //   'type': 'image/png'
          // }
        ]
      }
    },

    cordova: {
      // id: 'org.cordova.quasar.app'
      // noIosLegacyBuildFlag: true // uncomment only if you know what you are doing
    },

    electron: {
      // bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        // appId: 'quasar-app'
      }
    }
  }
}
