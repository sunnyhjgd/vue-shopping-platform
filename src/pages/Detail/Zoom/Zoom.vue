<template>
  <div class="spec-preview">
    <img :src="imgList[currentIndex]" alt="">
    <div class="event" @mousemove="move" ref="event"></div>
    <div class="big">
      <img :src="imgList[currentIndex]" alt="" ref="big">
    </div>
    <!-- 遮罩层 -->
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: "Zoom",
  props: ['imgList'],
  data() {
    return {
      currentIndex: 0,
    }
  },
  mounted() {
    // 监听兄弟组件切换图片事件
    this.$bus.$on('change', (index) => {
      this.currentIndex = index;
    })
  },
  methods: {
    move(e) {
      // 计算遮罩层位置
      const maskX = e.offsetX - this.$refs.mask.offsetWidth / 2;
      const maskY = e.offsetY - this.$refs.mask.offsetHeight / 2;
      // 限制遮罩层位置
      const maxX = this.$refs.event.offsetWidth - this.$refs.mask.offsetWidth;
      const maxY = this.$refs.event.offsetHeight - this.$refs.mask.offsetHeight;
      // 限制遮罩层位置
      const X = Math.max(0, Math.min(maxX, maskX));
      const Y = Math.max(0, Math.min(maxY, maskY));
      // 设置遮罩层位置
      this.$refs.mask.style.left = X + 'px';
      this.$refs.mask.style.top = Y + 'px';
      // 计算大图片位置
      const bigX = -X * 2;
      const bigY = -Y * 2;
      // 设置大图片位置
      this.$refs.big.style.left = bigX + 'px';
      this.$refs.big.style.top = bigY + 'px';
    }
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover~.mask,
  .event:hover~.big {
    display: block;
  }
}
</style>