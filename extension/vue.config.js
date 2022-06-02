const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')

const pages = {}

const chromeName = ['popup', 'background', 'options', 'content']
const executeScript = ['getPageData', 'clickElement', 'setInputValue', 'executeScript']
chromeName.forEach(name => {
  pages[name] = {
    entry: `src/pages/${name}/main.js`,
    template: 'public/index.html',
    filename: `${name}.html`
  }
})
executeScript.forEach(name => {
  pages[name] = {
    entry: `src/pages/script/${name}.js`,
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
