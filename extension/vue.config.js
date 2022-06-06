const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const pages = {}

const chromeName = ['background', 'content']
const directiveScript = ['directiveScript']
chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/main.js`,
    template: 'public/index.html',
    filename: `${name}.html`
  }
})
directiveScript.forEach(name => {
  pages[name] = {
    entry: `src/directives/${name}.js`,
    template: 'public/index.html',
    filename: `${name}.html`
  }
})

module.exports = {
  pages,
  filenameHashing: false,
  configureWebpack: {
    devtool: 'cheap-module-source-map',
    optimization: {
      minimize: false
    },
    plugins: [CopyWebpackPlugin([{
      from: path.resolve('manifest.json'),
      to: `${path.resolve('dist')}/manifest.json`
    }])]
  }
}
