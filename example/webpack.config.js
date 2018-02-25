var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackPreconnectPlugin = require('../index')

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'html webpack preconnect plugin',
      template: 'template.html',
      filename: 'index.html',
      preconnect: [
        'http://api1.example.com',
        'https://fonts.gstatic.com',
      ],
    }),

    new HtmlWebpackPreconnectPlugin(),
  ]
}
