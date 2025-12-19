const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? './' // 使用相对路径，确保部署后资源能正确加载
    : '/',
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: false,
  // 配置externals选项，将第三方库通过CDN引入，减少bundle大小，提高加载速度
  configureWebpack: {
    externals: {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios'
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        timeout: 30000,
        // 由于API路径中已经包含/api，这里不需要重写
      }
    }
  }
})
