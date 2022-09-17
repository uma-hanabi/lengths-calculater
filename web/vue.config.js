const { defineConfig } = require('@vue/cli-service')
module.exports = {
  transpileDependencies: true,
  chainWebpack: config => {
    config.module
      .rule('language')
      .test(/\.(js|vue)$/)
      .use('language-tw-loader')
      .loader('language-tw-loader')
      .options({
        language: 'zh-TW'
      })
      .end()
      },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/lengths-calculater/'
    : '/'
}