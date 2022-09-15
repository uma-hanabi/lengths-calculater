const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
    ? '/lengths-calculater/'
    : '/',
  test: /\.(js|vue)$/,
  loader: 'language-tw-loader',
})
