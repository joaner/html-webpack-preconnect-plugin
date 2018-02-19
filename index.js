'use strict'
var assert = require('assert')

/**
 * html webpack preconnect plugin
 * @class
 */
function HtmlWebpackPreconnectPlugin(options) {
  assert.equal(options, undefined, 'The ResourceHintWebpackPlugin does not accept any options')
}

HtmlWebpackPreconnectPlugin.prototype.apply = function (compiler) {
  var self = this

  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {

      var origins = htmlPluginData.plugin.options.preconnect;

      assert.equal(origins instanceof Array, true, new TypeError('origins need array'))

      origins.forEach(function(origin) {
        // webpack config may contain quotos, remove that
        var href = origin.replace(/['"]+/g, '')

        var tag = {
          tagName: 'link',
          selfClosingTag: false,
          attributes: {
            rel: 'preconnect',
            href: href
          }
        }
        htmlPluginData.head.push(tag)
      })

      callback(null, htmlPluginData)
    })
  })
}

module.exports = HtmlWebpackPreconnectPlugin
