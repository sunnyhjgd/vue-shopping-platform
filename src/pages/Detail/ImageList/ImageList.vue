<template>
  <div class="swiper-container" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(item, index) in imgList" :key="index" @click="change(index)">
        <img :src="item" alt="" :class="{ 'active': index === currentIndex }">
      </div>
    </div>
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
  </div>
</template>

<script>
export default {
  name: "ImageList",
  props: ['imgList'],
  watch: {
    list: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          // 使用全局挂载的Swiper
          new this.$swiper(this.$refs.cur, {
            direction: 'horizontal', // 水平切换选项
            slidesPerView: 4, // 显示4张图片
            slidesPerGroup: 1, // 每次切换1张图片
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }
          })
        })
      }
    }
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  methods: {
    change(index) {
      this.currentIndex = index;
      //通知兄弟组件切换图片
      this.$bus.$emit('change', index);
    }
  }
}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

      &:hover {
        border: 2px solid #f60;
        padding: 1px;
      }
    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;

    &::after {
      font-size: 12px;
    }
  }
}
</style>