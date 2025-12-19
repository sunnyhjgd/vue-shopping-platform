const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? './' // 使用相对路径，确保部署后资源能正确加载
    : '/',
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: false,

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
