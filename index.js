'use strict'
var assert = require('assert')

function HtmlWebpackPreconnectPlugin(options) {

  // load origins
  if (options.origins instanceof Array) {
    this.origins = options.origins
  } else if (options.origins instanceof Object) {
    this.origins = Object.values(options.origins)
  } else {
    assert.fail(new TypeError('origins need array'))
  }
}

HtmlWebpackPreconnectPlugin.prototype.apply = function (compiler) {
  var self = this

  // Hook into the html-webpack-plugin processing
  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-alter-asset-tags', function (htmlPluginData, callback) {
      self.origins.forEach(function(origin) {
        var attributes

        if (origin instanceof Object) {
          attributes = origin
        } else {
          attributes = {
            rel: 'preconnect',
            href: origin
          }
        }

        attributes.href = attributes.href.replace(/['"]+/g, '')

        var tag = {
          tagName: 'link',
          selfClosingTag: false,
          attributes: attributes
        }
        htmlPluginData.head.push(tag)
      })

      callback(null, htmlPluginData)
    })
  })
}

module.exports = HtmlWebpackPreconnectPlugin
