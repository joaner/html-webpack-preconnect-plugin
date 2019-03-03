'use strict'
var assert = require('assert')
var HtmlWebpackPlugin = require('html-webpack-plugin')

/**
 * html webpack preconnect plugin
 * @class
 */
function HtmlWebpackPreconnectPlugin(options) {
  assert.equal(options, undefined, 'The ResourceHintWebpackPlugin does not accept any options')
}

/**
 * Append preconnect tag to head
 * @param {Object} htmlPluginData
 * @param {Function} callback
 * @return void
 */
HtmlWebpackPreconnectPlugin.prototype.append = function (htmlPluginData, callback) {
  var origins = htmlPluginData.plugin.options.preconnect

  assert.equal(origins instanceof Array, true, new TypeError('origins need array'))

  origins.forEach(function(origin) {
    // webpack config may contain quotos, remove that
    var href = origin.replace(/['"]+/g, '')

    var tag = {
      tagName: 'link',
      selfClosingTag: false,
      attributes: {
        rel: 'preconnect',
        href: href,
        crossorigin: ''
      }
    }
    htmlPluginData.head.push(tag)
  })

  callback(null, htmlPluginData)
}

/**
 * Hook into the html-webpack-plugin processing
 * @param {Object} compiler
 * @return void
 */
HtmlWebpackPreconnectPlugin.prototype.apply = function (compiler) {
  var self = this

  // if webpack 4
  if (compiler.hooks) {
    // if html-webpack-plugin 4
    compiler.hooks.compilation.tap('HtmlWebpackPreconnectPlugin', compilation => {
      if (HtmlWebpackPlugin && HtmlWebpackPlugin.getHooks) {
        HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync(
          'HtmlWebpackPreconnectPlugin',
          self.append
        )
      } else {
        // html-webpack-plugin 3
        compilation.hooks.htmlWebpackPluginAlterAssetTags.tapAsync(
          'HtmlWebpackPreconnectPlugin',
          self.append
        )
      }
    })
  } else {
    // webpack 3.x
    compiler.plugin('compilation', function (compilation) {
      compilation.plugin('html-webpack-plugin-alter-asset-tags', self.append)
    })
  }
}

module.exports = HtmlWebpackPreconnectPlugin
