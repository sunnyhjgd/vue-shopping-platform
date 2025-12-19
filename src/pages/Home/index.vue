<template>
  <div>
    <!-- HOME -->
    <!-- 三级联动组件 -->
    <TypeNav></TypeNav>
    <!-- 列表容器组件 -->
    <ListContainer></ListContainer>
    <!-- 今日推荐组件 -->
    <RecommendIndex></RecommendIndex>
    <!-- 排行榜组件 -->
    <RankIndex></RankIndex>
    <!-- 喜欢组件 -->
    <LikeIndex></LikeIndex>
    <!-- 楼层组件 -->
    <Floor v-for="item in floorList" :key="item.floorId" :data="item" :list="item"></Floor>
    <!-- 商标组件 -->
    <BrandIndex></BrandIndex>
  </div>
</template>

<script>
import ListContainer from './ListContainer/index.vue'
import RecommendIndex from './Recommend/index.vue'
import RankIndex from './Rank/index.vue'
import LikeIndex from './Like/index.vue'
import Floor from './Floor/index.vue'
import BrandIndex from './Brand/index.vue'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  components: {
    ListContainer,
    RecommendIndex,
    RankIndex,
    LikeIndex,
    Floor,
    BrandIndex,
  },

  computed: {
    ...mapState('home', ['floorList']),
  }
}
</script>

<style scoped lang="less"></style>