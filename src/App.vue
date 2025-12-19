<template>
  <div id="app">
    <MyHeader />
    <div class="container">
      <router-view />
    </div>
    <!-- 底部导航栏 在home或者search显示，其他不显示 -->
    <MyFooter v-show="$route.meta.showFooter" />
  </div>
</template>

<script>
import MyHeader from './components/Header/MyHeader.vue'
import MyFooter from './components/Footer/MyFooter.vue'
export default {
  name: 'App',
  mounted() {
    //通知vuex发请求，获取数据，存储与仓库中
    //由于启用了命名空间，需要使用 '模块名/action名' 的格式
    // 优先加载首屏数据，减少LCP时间
    this.$store.dispatch('home/categoryList')
    this.$store.dispatch('home/bannerList')
    this.$store.dispatch('home/floorList')
  },
  components: {
    MyHeader,
    MyFooter,
  }
}
</script>

<style></style>