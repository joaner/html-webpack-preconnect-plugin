'use strict'
var assert = require('assert')

/**
 * html webpack preconnect plugin
 * @class
 */
function HtmlWebpackPreconnectPlugin(options) {
  assert.equal(options, undefined, 'The ResourceHintWebpackPlugin does not accept any options')
}

const addPreconnectLinks = function (htmlPluginData, callback) {
  var origins = htmlPluginData.plugin.options.preconnect;
  assert.equal(origins instanceof Array, true, new TypeError('origins need array'));
  origins.forEach(function (origin) {
    // webpack config may contain quotos, remove that
    var href = origin.replace(/['"]+/g, '');
    var tag = {
      tagName: 'link',
      selfClosingTag: false,
      attributes: {
        rel: 'preconnect',
        href: href,
        crossorigin: ''
      }
    };
    htmlPluginData.headTags.push(tag);
  });
  callback(null, htmlPluginData);
}

HtmlWebpackPreconnectPlugin.prototype.apply = function (compiler) {
  // Webpack 4
  if (compiler.hooks) {
    compiler.hooks.compilation.tap('htmlWebpackPreconnectPlugin', function(compilation) {
      // Hook into the html-webpack-plugin processing
      require("html-webpack-plugin").getHooks(compilation).alterAssetTagGroups.tapAsync('htmlWebpackPreconnectPlugin', addPreconnectLinks)
    })

  // Webpack 3
  } else {
    compiler.plugin('compilation', function (compilation) {
      // Hook into the html-webpack-plugin processing
      compilation.plugin('html-webpack-plugin-alter-asset-tags', addPreconnectLinks)
    })
  }
}

module.exports = HtmlWebpackPreconnectPlugin
