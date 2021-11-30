/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 *
 * All content of this folder will be copied as is to the output folder. So only import:
 *  1. node_modules (and yarn/npm install dependencies -- NOT to devDependecies though)
 *  2. create files in this folder and import only those with the relative path
 *
 * Note: This file is used for both PRODUCTION & DEVELOPMENT.
 * Note: Changes to this file (but not any file it imports!) are picked up by the
 * development server, but such updates are costly since the dev-server needs a reboot.
 */

module.exports.extendApp = function ({ app }) {
  /*
     Extend the parts of the express app that you
     want to use with development server too.

     Example: app.use(), app.get() etc
  */
  if (process.env.NODE_ENV === 'development') {
    const process = require('process')
    const proxy = require('http-proxy-middleware')
    let target = 'https://stage.shopmo.com/'
    let options = {
      target: target,
      changeOrigin: true,
      pathRewrite: (path, req) => {
        console.log(path, 'path')
        return path
      }
    }
    let apiProxy = proxy(options)
    app.use('/hah_api', apiProxy)

    process.on('unhandledRejection', (reason, p) => {
      console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
      // application specific logging, throwing an error, or other logic here
    })
  }
}
