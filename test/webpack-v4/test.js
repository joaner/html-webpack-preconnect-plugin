const assert = require('assert')
const path = require('path')
const MemoryFileSystem = require('memory-fs');

const webpack = require('./node_modules/webpack')
const HtmlWebpackPlugin = require('../../node_modules/html-webpack-plugin')

const HtmlWebpackPreconnectPlugin = require('../../index')

describe('preconnect - webpack 4', function() {
  it('add preconnect tags', function(done) {
    const compiler = webpack({
      entry: path.join(__dirname, '../../example/index.js'),
      output: {
        path: path.join(__dirname, 'dist')
      },
      plugins: [
        new HtmlWebpackPlugin({
          preconnect: [
            'http://api1.example.com',
            'https://fonts.gstatic.com',
          ],
        }),
        new HtmlWebpackPreconnectPlugin(),
      ]
    }, function(err, result) {
      if (err) {
        done(err)
        return
      }
      if (result.compilation.errors && result.compilation.errors.length) {
        done(result.compilation.errors)
        return
      }

      const html = result.compilation.assets['index.html'].source();
      assert.equal(typeof html, 'string')
      assert.ok(html.includes('<link rel="preconnect" href="http://api1.example.com"'))
      assert.ok(html.includes('<link rel="preconnect" href="https://fonts.gstatic.com"'))

      done()
    })
    compiler.outputFileSystem = new MemoryFileSystem()
  })

  it('throws error when preconnect option is not an array', function(done) {
    const compiler = webpack({
      entry: path.join(__dirname, "../../example/index.js"),
      output: {
        path: path.join(__dirname, "dist"),
      },
      plugins: [
        new HtmlWebpackPlugin({
          preconnect: 'foo',
        }),
        new HtmlWebpackPreconnectPlugin(),
      ],
    }, function (err, result) {
      assert.equal(result.compilation.errors.some(error => error.includes('preconnect option needs an array')), true);
      done();
    })

    compiler.outputFileSystem = new MemoryFileSystem();
  })

  it('ignores templates that does not have the "preconnect" option', function (done) {
    const compiler = webpack({
      entry: path.join(__dirname, "../../example/index.js"),
      output: {
        path: path.join(__dirname, "dist"),
      },
      plugins: [
        new HtmlWebpackPlugin({
          filename: "index.html",
          preconnect: ["https://fonts.gstatic.com"],
        }),
        new HtmlWebpackPlugin({
          filename: "no-preconnect.html"
        }),
        new HtmlWebpackPreconnectPlugin(),
      ],
    }, function (err, result) {
      if (err) {
        done(err);
        return;
      }
      if (result.compilation.errors && result.compilation.errors.length) {
        done(result.compilation.errors);
        return;
      }

      const indexHtml = result.compilation.assets["index.html"].source();
      const noPreconnectHtml = result.compilation.assets["no-preconnect.html"].source();
      assert.equal(typeof indexHtml, "string");
      assert.equal(typeof noPreconnectHtml, "string");
      assert.ok(indexHtml.includes('<link rel="preconnect" href="https://fonts.gstatic.com"'))
      assert.ok(!noPreconnectHtml.includes('<link rel="preconnect" href="https://fonts.gstatic.com"'))

      done();
    });

    compiler.outputFileSystem = new MemoryFileSystem();
  });
})
