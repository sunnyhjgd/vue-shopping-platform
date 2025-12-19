<template>
  <!-- 分页器 -->
  <div class="fr page">
    <div class="sui-pagination clearfix">
      <ul>
        <!-- 上一页 -->
        <li class="prev" :class="{ disabled: pageNum <= 1 }">
          <a href="#" @click.prevent="prevPage">«上一页</a>
        </li>

        <!-- 动态生成页码 -->
        <li v-for="(page, index) in pages" :key="index" :class="{ active: page === pageNum, dotted: page === '...' }">
          <a v-if="page !== '...'" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
          <span v-else>{{ page }}</span>
        </li>

        <!-- 下一页 -->
        <li class="next" :class="{ disabled: pageNum >= totalPages }">
          <a href="#" @click.prevent="nextPage">下一页»</a>
        </li>
      </ul>
      <div><span>共{{ totalPages }}页&nbsp;</span></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: ['total', 'pageSize', 'totalPages', 'pageNum'],
  methods: {
    // 上一页点击事件
    prevPage() {
      if (this.pageNum > 1) {
        this.$emit('changePage', this.pageNum - 1);
      }
    },
    // 下一页点击事件
    nextPage() {
      if (this.pageNum < this.totalPages) {
        this.$emit('changePage', this.pageNum + 1);
      }
    },
    // 页码点击事件
    goToPage(page) {
      if (page !== this.pageNum) {
        this.$emit('changePage', page);
      }
    }
  },
  computed: {
    // 生成页码数组
    pages() {
      const pages = [];
      if (this.totalPages <= 5) {
        // 总页数小于等于5，显示所有页码
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 总页数大于5，显示当前页附近的页码
        if (this.pageNum <= 3) {
          // 当前页在前3页，显示1-5页
          for (let i = 1; i <= 5; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(this.totalPages);
        } else if (this.pageNum >= this.totalPages - 2) {
          // 当前页在后3页，显示最后5页
          pages.push(1);
          pages.push('...');
          for (let i = this.totalPages - 4; i <= this.totalPages; i++) {
            pages.push(i);
          }
        } else {
          // 当前页在中间，显示当前页前后各2页
          pages.push(1);
          pages.push('...');
          for (let i = this.pageNum - 2; i <= this.pageNum + 2; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(this.totalPages);
        }
      }
      return pages;
    }
  }
}
</script>
<style scoped>
.page {
  /* 移除固定宽度限制，使用最小宽度 */
  min-width: 300px;
  /* 移除固定高度，让内容决定高度 */
  overflow: hidden;
  float: right;

  .sui-pagination {
    margin: 18px 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;
      margin-right: 10px;

      li {
        line-height: 18px;
        display: flex;
        align-items: center;

        a, span {
          text-decoration: none;
          background-color: #fff;
          border: 1px solid #e0e9ee;
          margin-left: -1px;
          font-size: 14px;
          padding: 9px 18px;
          color: #333;
          display: inline-block;
          box-sizing: border-box;
        }

        &:first-child a {
          border-radius: 4px 0 0 4px;
        }

        &:last-child a {
          border-radius: 0 4px 4px 0;
        }

        &.active {
          a {
            background-color: #fff;
            color: #e1251b;
            border-color: #e1251b;
            cursor: default;
            font-weight: bold;
          }
        }

        &.prev, &.next {
          a {
            background-color: #fafafa;
          }
        }

        &.disabled {
          a {
            color: #999;
            cursor: default;
          }
        }

        &.dotted {
          span {
            border: 1px solid transparent;
            background-color: transparent;
            cursor: default;
          }
        }
      }
    }

    div {
      color: #333;
      font-size: 14px;
      white-space: nowrap;
    }
  }
}
</style>