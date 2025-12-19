<template>
  <div class="type-nav">
    <div class="container" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
      <h2 class="all">全部商品分类</h2>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
      <transition name="sort">
        <div class="sort" v-show=show>
          <!-- 利用事件委派和编程式导航实现路由的跳转与传递参数 -->
          <div class="all-sort-list2" @click="goSearch">
            <!-- 一级分类 -->
            <div class="item" v-for="item in categoryList" :key="item.id">
              <h3>
                <a :data-category-name="item.name" :data-category1id="item.id" href="javascript:void(0)">{{ item.name
                }}</a>
              </h3>
              <!-- 二级分类 -->
              <div class="item-list clearfix">
                <div class="subitem" v-for="child in item.childCategory" :key="child.id">
                  <dl class="fore">
                    <dt>
                      <a :data-category-name="child.name" :data-category2id="child.id" href="javascript:void(0)">{{
                        child.name }}</a>
                    </dt>
                    <!-- 三级分类 -->
                    <dd>
                      <em v-for="subChild in child.childCategory" :key="subChild.id">
                        <a :data-category-name="subChild.name" :data-category3id="subChild.id"
                          href="javascript:void(0)">{{ subChild.name
                          }}</a>
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TypeNav',
  mounted() {
    this.show = true
    if (this.$route.path !== '/home') {
      this.show = false
    }
  },
  data() {
    return {
      show: true
    }
  },
  computed: {
    categoryList() {
      return this.$store.state.home.categoryList
    }
  },
  methods: {
    goSearch(event) {
      let element = event.target
      let { categoryName, category1id, category2id, category3id } = element.dataset
      if (categoryName) {
        let location = {
          name: 'search',
          // 合并当前路由的params
          params: { ...this.$route.params },
          // 合并当前路由的query和新的分类参数
          query: { ...this.$route.query, categoryName }
        }
        // 如果有分类ID参数，使用query传递，注意参数名要与Search组件中的一致（驼峰式）
        if (category1id) {
          location.query.category1Id = category1id
        } else if (category2id) {
          location.query.category2Id = category2id
        } else if (category3id) {
          location.query.category3Id = category3id
        }
        this.$router.push(location)
      }
    },
    mouseEnter() {
      if (this.$route.path !== '/home') {
        this.show = true
      }
    },
    mouseLeave() {
      if (this.$route.path !== '/home') {
        this.show = false
      }
    }
  },
}
</script>
<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;


      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }

        .item:hover {
          background-color: #eb4840;
        }
      }
    }

    //过渡动画开始
    .sort-enter {
      height: 0px;
    }

    //过渡动画结束
    .sort-enter-to {
      height: 461px;
    }

    .sort-leave-active {
      transition: all 0.3s linear;
    }
  }
}
</style>
