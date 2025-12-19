<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="item in cartList" :key="item.skuId">
          <li class="cart-list-con1">
            <input type="checkbox" name="chk_list" v-model="item.isChecked" @change="updateCart">
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl" alt="">
            <div class="item-msg">{{ item.name }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ item.price }}</span>
          </li>
          <li class="cart-list-con5">
            <a href="javascript:void(0)" class="mins" @click="decrement(item)">-</a>
            <input autocomplete="off" type="text" value="1" minnum="1" class="itxt" v-model="item.num"
              @change="updateCart">
            <a href=" javascript:void(0)" class="plus" @click="increment(item)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ item.price * item.num }}</span>
          </li>
          <li class="cart-list-con7">
            <a href="#none" class="sindelet" @click="deleteCart(item.skuId)">删除</a>
            <br>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input class="chooseAll" type="checkbox" v-model="isAllChecked" @change="updateCart">
        <span>全选</span>
      </div>
      <div class="option">
        <a href="#none" @click="deleteSelected">删除选中的商品</a>
        <a href="#none">移到我的关注</a>
        <a href="#none">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择
          <span>{{ selectedCount }}</span>件商品
        </div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ShopCart',
  mounted() {
    // 先检查localStorage中是否有购物车数据
    const localCartData = localStorage.getItem('cartList');
    if (localCartData && JSON.parse(localCartData).length > 0) {
      // 如果有本地数据，直接使用本地数据，不发起API请求
      console.log('使用本地存储的购物车数据');
      this.$store.commit('shopcart/CARTLIST', JSON.parse(localCartData));
    } else {
      // 否则发起API请求获取数据
      console.log('本地没有购物车数据，发起API请求');
      this.getData();
    }
  },

  methods: {
    getData() {
      this.$store.dispatch('shopcart/reqCartList')
    },
    // 增加商品数量
    increment(item) {
      item.num++;
      // 调用统一的更新方法
      this.updateCart();
    },
    // 减少商品数量
    decrement(item) {
      if (item.num > 1) {
        item.num--;
        // 调用统一的更新方法
        this.updateCart();
      }
    },
    // 更新购物车数据
    updateCart() {
      // 遍历所有商品，确保数量有效
      this.cartList.forEach(item => {
        // 处理非数字值或空值
        if (isNaN(item.num) || item.num === null || item.num === '') {
          item.num = 1;
        } else {
          // 确保数量为正整数
          item.num = Math.max(1, Math.floor(Number(item.num)));
        }
      });
      // 触发购物车数据更新
      this.$store.commit('shopcart/CARTLIST', this.cartList);
    },
    //删除购物车商品
    deleteCart(skuId) {
      this.$store.dispatch('shopcart/reqDeleteCart', skuId);
    },
    //删除选中的商品
    deleteSelected() {
      // 过滤出选中的商品
      const selectedItems = this.cartList.filter(item => item.isChecked);
      // 对每个选中的商品发起删除请求
      selectedItems.forEach(item => {
        this.$store.dispatch('shopcart/reqDeleteCart', item.skuId);
      });
    }
  },
  computed: {
    ...mapState({
      cartList: state => state.shopcart.cartList
    }),
    //计算总价,并保留两位小数
    totalPrice() {
      let total = 0;
      this.cartList.forEach(item => {
        if (item.isChecked) {
          total += item.price * item.num;
        }
      });
      return total.toFixed(2);
    },
    //计算选中商品的数量
    selectedCount() {
      let count = 0;
      this.cartList.forEach(item => {
        if (item.isChecked) {
          count++;
        }
      });
      return count;
    },
    //判断是否全选
    isAllChecked: {
      get() {
        return this.selectedCount === this.cartList.length;
      },
      set(value) {
        // 当点击全选/取消全选时，更新所有商品的选中状态
        this.cartList.forEach(item => {
          item.isChecked = value;
        });
      }
    }

  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      &>div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;

      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        &>li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }


        .item-txt {
          text-align: center;
        }
      }

      .cart-list-con4 {
        width: 10%;

      }

      .cart-list-con5 {
        width: 17%;

        .mins {
          border: 1px solid #ddd;
          border-right: 0;
          float: left;
          color: #666;
          width: 6px;
          text-align: center;
          padding: 8px;
        }

        input {
          border: 1px solid #ddd;
          width: 40px;
          height: 33px;
          float: left;
          text-align: center;
          font-size: 14px;
        }

        .plus {
          border: 1px solid #ddd;
          border-left: 0;
          float: left;
          color: #666;
          width: 6px;
          text-align: center;
          padding: 8px;
        }
      }

      .cart-list-con6 {
        width: 10%;

        .sum {
          font-size: 16px;
        }
      }

      .cart-list-con7 {
        width: 13%;

        a {
          color: #666;
        }
      }
    }
  }
}

.cart-tool {
  overflow: hidden;
  border: 1px solid #ddd;

  .select-all {
    padding: 10px;
    overflow: hidden;
    float: left;

    span {
      vertical-align: middle;
    }

    input {
      vertical-align: middle;
    }
  }

  .option {
    padding: 10px;
    overflow: hidden;
    float: left;

    a {
      float: left;
      padding: 0 10px;
      color: #666;
    }
  }

  .money-box {
    float: right;

    .chosed {
      line-height: 26px;
      float: left;
      padding: 0 10px;
    }

    .sumprice {
      width: 200px;
      line-height: 22px;
      float: left;
      padding: 0 10px;

      .summoney {
        color: #c81623;
        font-size: 16px;
      }
    }

    .sumbtn {
      float: right;

      a {
        display: block;
        position: relative;
        width: 96px;
        height: 52px;
        line-height: 52px;
        color: #fff;
        text-align: center;
        font-size: 18px;
        font-family: "Microsoft YaHei";
        background: #e1251b;
        overflow: hidden;
      }
    }
  }
}
</style>