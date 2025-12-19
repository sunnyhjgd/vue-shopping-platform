<template>
  <!--banner轮播-->
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="item in list" :key="item.id">
        <img :src="item.imgUrl" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>
<script>
export default {
  name: 'Carousel',
  props: ['list'],
  watch: {
    list: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          // 使用全局挂载的Swiper
          new this.$swiper(this.$refs.cur, {
            direction: 'horizontal', // 水平切换选项
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          })
        })
      }
    }
  }
}
</script>
<style scoped>
.swiper-container {
  width: 100%;
  height: 100%;
}

.swiper-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
