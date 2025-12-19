<template>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--bread：面包屑导航-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 显示当前分类 -->
            <li class="with-x" v-if="searchParams.categoryName">{{ searchParams.categoryName }}<i class="delete-icon"
                @click="removeCategoryName">×</i></li>
            <!-- 关键字的面包屑 -->
            <li class="with-x" v-if="searchParams.keyword">{{ searchParams.keyword }}<i class="delete-icon"
                @click="removeKeyword">×</i></li>
            <!-- 显示当前品牌 -->
            <li class="with-x" v-if="searchParams.trademark">{{ searchParams.trademark.trademarkName }}<i
                class="delete-icon" @click="removeTrademark">×</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <ul class="sui-nav">
                <li :class="{ active: isOneActive }" @click="changeOrder('1')">
                  <a>综合<span v-if="isOneActive">⬆</span></a>
                </li>
                <li :class="{ active: isTwoActive }" @click="changeOrder('2')">
                  <a>价格<span v-if="isTwoActive">⬆</span></a>
                </li>
              </ul>
            </div>
          </div>
          <!--goods-list：商品列表-->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="item in goodsList" :key="item.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <router-link :to="'/detail/' + item.id"><img :src="item.imgUrl" /></router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ item.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a target="_blank" href="item.html" title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】">
                      {{ item.name }}
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>{{ item.count }}</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a href="success-cart.html" target="_blank" class="sui-btn btn-bordered btn-danger">加入购物车</a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">收藏</a>
                  </div>
                </div>
              </li>

            </ul>
          </div>
          <!-- 分页器 -->
          <Pagination :total="total" :pageSize="pageSize" :totalPages="totalPages" :pageNum="searchParams.pageNum"
            @changePage="changePage" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'
import { mapGetters } from 'vuex'
export default {
  name: 'Search',
  components: {
    SearchSelector
  },
  mounted() {
    this.getData()
    // 监听品牌id变化
    this.$bus.$on('updateBrandId', (trademarkId, trademarkName) => {
      this.searchParams.trademark = {
        trademarkId,
        trademarkName
      }
      this.getData()
    })
  },
  data() {
    return {
      searchParams: {
        //搜索关键词
        keyword: '',
        //一级分类id
        category1Id: '',
        //二级分类id
        category2Id: '',
        //三级分类id
        category3Id: '',
        //分类名称
        categoryName: '',
        //排序规则
        order: '1:desc',
        //当前页码
        pageNum: 1,
        //每页显示条数
        pageSize: 5,
        //排序字段
        prop: 'price',
        //品牌id  
        trademark: ''
      }
    }
  },
  beforeMount() {
    //合并路由参数：先params后query，确保query参数可以覆盖params中的同名参数
    Object.assign(this.searchParams, this.$route.params, this.$route.query)
    console.log(this.searchParams)
  },
  beforeDestroy() {
    // 组件销毁时，移除品牌id变化监听
    this.$bus.$off('updateBrandId')
  },
  computed: {
    ...mapGetters({
      goodsList: 'search/goodsList',
      trademarkList: 'search/trademarkList',
      attrList: 'search/attrsList',
      // 分页相关数据
      total: 'search/total',
      pageSize: 'search/pageSize',
      totalPages: 'search/totalPages',
      pageNum: 'search/pageNum'
    }),
    isOneActive() {
      return this.searchParams.order.indexOf('1') != - 1
    },
    isTwoActive() {
      return this.searchParams.order.indexOf('2') != - 1
    }
  },
  watch: {
    '$route': {
      handler(newVal, oldVal) {
        //当路由参数变化时，重置searchParams
        this.searchParams.category1Id = ''
        this.searchParams.category2Id = ''
        this.searchParams.category3Id = ''
        //合并路由参数：先params后query，确保query参数可以覆盖params中的同名参数
        Object.assign(this.searchParams, this.$route.params, this.$route.query)
        //调用getData方法，重新获取数据
        this.getData()
      },
      immediate: true //立即调用一次，避免路由参数为空时，getData方法未被调用
    }
  },
  methods: {
    getData() {
      //把请求封装成函数，方便调用
      this.$store.dispatch('search/getSearchList', this.searchParams)
    },
    //移除分类名称
    removeCategoryName() {
      // 1. 清空组件内的分类相关参数
      this.searchParams.categoryName = ''
      this.searchParams.category1Id = ''
      this.searchParams.category2Id = ''
      this.searchParams.category3Id = ''

      // 2. 同时更新路由参数，移除分类相关query参数
      // 为什么需要更新路由：因为组件监听了$route变化，会从路由重新合并参数到searchParams
      // 如果只清空组件内的参数而不更新路由，后续路由变化时参数会被重新合并

      this.$router.push({
        name: 'search',
        params: this.$route.params,
      })
    },
    //移除搜索关键词
    removeKeyword() {
      // 1. 清空组件内的关键词参数
      this.searchParams.keyword = ''

      // 2. 同时更新路由参数，移除关键词参数
      // 为什么需要更新路由：因为组件监听了$route变化，会从路由重新合并参数到searchParams
      // 如果只清空组件内的参数而不更新路由，后续路由变化时参数会被重新合并

      this.$router.push({
        name: 'search',
        query: this.$route.query,
      })
      //通知兄弟组件清除关键字
      this.$bus.$emit('clear')
    },
    //移除品牌
    removeTrademark() {
      // 1. 清空组件内的品牌参数
      this.searchParams.trademark = ''
      this.getData()
    },
    // 排序切换方法
    changeOrder(type) {
      // 如果当前点击的是已激活的排序，切换顺序（升序/降序）
      if ((type === '1' && this.isOneActive) || (type === '2' && this.isTwoActive)) {
        // 切换顺序
        this.searchParams.order = this.searchParams.order.includes('desc')
          ? `${type}:asc`
          : `${type}:desc`
      } else {
        // 如果点击的是未激活的排序，直接设置为该排序的默认降序
        this.searchParams.order = `${type}:desc`
      }
      // 重新获取数据
      this.getData()
    },
    // 分页切换方法
    changePage(pageNum) {
      // 更新当前页码
      this.searchParams.pageNum = pageNum;
      // 重新获取数据
      this.getData();
    }
  }
}
</script>
<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i.delete-icon {
            margin-left: 10px;
            cursor: pointer;
            font-size: 12px;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
            color: #999;
          }

          i.delete-icon:hover {
            color: #333;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }

      .page {
        width: 733px;
        height: 66px;
        overflow: hidden;
        float: right;

        .sui-pagination {
          margin: 18px 0;

          ul {
            margin-left: 0;
            margin-bottom: 0;
            vertical-align: middle;
            width: 490px;
            float: left;

            li {
              line-height: 18px;
              display: inline-block;

              a {
                position: relative;
                float: left;
                line-height: 18px;
                text-decoration: none;
                background-color: #fff;
                border: 1px solid #e0e9ee;
                margin-left: -1px;
                font-size: 14px;
                padding: 9px 18px;
                color: #333;
              }

              &.active {
                a {
                  background-color: #fff;
                  color: #e1251b;
                  border-color: #fff;
                  cursor: default;
                }
              }

              &.prev {
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
                  margin-left: -1px;
                  position: relative;
                  float: left;
                  line-height: 18px;
                  text-decoration: none;
                  background-color: #fff;
                  font-size: 14px;
                  border: 0;
                  padding: 9px 18px;
                  color: #333;
                }
              }

              &.next {
                a {
                  background-color: #fafafa;
                }
              }
            }
          }

          div {
            color: #333;
            font-size: 14px;
            float: right;
            width: 241px;
          }
        }
      }
    }
  }
}
</style>