<template>
  <div class="trade-container">
    <h3 class="title">填写并核对订单信息</h3>
    <div class="content">
      <!-- 收件人信息 -->
      <h5 class="receive">收件人信息</h5>
      <div class="address clearFix" v-for="item in userAddressList" :key="item.id">
        <span class="username" :class="{ 'selected': item.isDefault }" @click="selectAddress(item, userAddressList)">{{
          item.name }}</span>
        <p @click="selectAddress(item, userAddressList)">
          <span class="s1">{{ item.address }}</span>
          <span class="s2">{{ item.phone }}</span>
          <span class="s3" v-if="item.isDefault">默认地址</span>
        </p>
      </div>
      <div class="line"></div>
      <!-- 支付方式 -->
      <h5 class="pay">支付方式</h5>
      <div class="address clearFix">
        <span class="username selected">在线支付</span>
        <span class="username" style="margin-left:5px;">货到付款</span>

      </div>
      <div class="line"></div>
      <!-- 送货清单 -->
      <h5 class="pay">送货清单</h5>
      <div class="way">
        <h5>配送方式</h5>
        <div class="info clearFix">
          <span class="s1">天天快递</span>
          <p>配送时间：预计8月10日（周三）09:00-15:00送达</p>
        </div>
      </div>
      <!-- 商品清单 -->
      <div class="detail">
        <h5>商品清单</h5>
        <ul class="list clearFix" v-for="item in orderInfo.orderItems" :key="item.skuId">
          <li>
            <img :src="item.imgUrl" alt="" style="width: 80px; height: 80px;">
          </li>
          <li>
            <p>
              {{ item.name }}
            </p>
            <h4>7天无理由退货</h4>
          </li>
          <li>
            <h3>￥{{ item.price }}</h3>
          </li>
          <li>X{{ item.num }}</li>
          <li>有货</li>
        </ul>
      </div>
      <!-- 买家留言 -->
      <div class="bbs">
        <h5>买家留言：</h5>
        <textarea placeholder="建议留言前先与商家沟通确认" class="remarks-cont" v-model="remarks"></textarea>

      </div>
      <div class="line"></div>
      <!-- 发票信息 -->
      <div class="bill">
        <h5>发票信息：</h5>
        <div>普通发票（电子） 个人 明细</div>
        <h5>使用优惠/抵用</h5>
      </div>
    </div>
    <!-- 订单金额 -->
    <div class="money clearFix">
      <ul>
        <li>
          <b><i>{{ orderInfo.orderItems.length }}</i>件商品，总商品金额</b>
          <span>¥{{ totalPrice }}</span>
        </li>
        <li>
          <b>返现：</b>
          <span>0.00</span>
        </li>
        <li>
          <b>运费：</b>
          <span>0.00</span>
        </li>
      </ul>
    </div>
    <!-- 订单金额 -->
    <div class="trade">
      <div class="price">应付金额:　<span>¥{{ totalPrice }}</span></div>
      <div class="receiveInfo">
        寄送至:
        <span>{{ orderInfo.receiverAddress }}</span>
        收货人：<span>{{ orderInfo.receiverName }}</span>
        <span>{{ orderInfo.receiverPhone }}</span>
      </div>
    </div>
    <div class="sub clearFix">
      <button class="subBtn" @click="submitOrder">提交订单</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Trade',
  async mounted() {
    // 组件挂载完成后调用获取用户地址的action
    await this.$store.dispatch('trade/reqUserAddress')
  },
  data() {
    //收集买家留言信息
    return {
      remarks: ''
    }
  },
  computed: {
    // 从store中获取用户地址列表
    userAddressList() {
      return this.$store.getters['trade/userAddressList']
    },
    // 从store中获取购物车列表
    cartList() {
      return this.$store.state.shopcart.cartList || []
    },
    //将来提交订单的数据
    orderInfo() {
      return {
        // 收件人信息
        receiverName: this.userAddressList.find(item => item.isDefault)?.name || '',
        receiverPhone: this.userAddressList.find(item => item.isDefault)?.phone || '',
        receiverAddress: this.userAddressList.find(item => item.isDefault)?.address || '',
        // 支付方式
        payType: 1,
        // 商品清单
        orderItems: this.cartList.filter(item => item.isChecked).map(item => item)
      }
    },
    totalPrice() {
      return this.orderInfo.orderItems.reduce((total, item) => total + item.price * item.num, 0).toFixed(2)
    }
  },
  methods: {
    // 选择地址
    selectAddress(item, userAddressList) {
      // 遍历地址列表，将所有地址的 isDefault 设置为 false
      userAddressList.forEach(address => {
        address.isDefault = false;
      });
      // 将当前点击的地址的 isDefault 设置为 true
      item.isDefault = true;
    },
    // 提交订单
    async submitOrder() {
      try {
        // 确保有选中的商品
        if (this.orderInfo.orderItems.length === 0) {
          alert('请选择要结算的商品');
          return;
        }

        // 确保有收件人信息
        if (!this.orderInfo.receiverName) {
          alert('请选择收货地址');
          return;
        }

        // 添加买家留言到订单信息
        const orderData = {
          ...this.orderInfo,
          remarks: this.remarks
        };

        // 调用API提交订单
        const res = await this.$store.dispatch('trade/reqSubmitOrder', orderData);

        if (res.code === 200) {
          // 保存订单ID到会话存储，供支付页面使用
          sessionStorage.setItem('orderId', res.data.orderId);
          // 跳转到支付页面
          this.$router.push(`/pay?orderId=${res.data.orderId}&payAmount=${res.data.payAmount}`);
        } else {
          alert('提交订单失败：' + res.message);
        }
      } catch (error) {
        console.error('提交订单错误:', error);
        alert('提交订单时发生错误，请重试');
      }
    }
  }
}
</script>

<style lang="less" scoped>
.trade-container {
  .title {
    width: 1200px;
    margin: 0 auto;
    font-size: 14px;
    line-height: 21px;
  }

  .content {
    width: 1200px;
    margin: 10px auto 0;
    border: 1px solid rgb(221, 221, 221);
    padding: 25px;
    box-sizing: border-box;

    .receive,
    .pay {
      line-height: 36px;
      margin: 18px 0;
    }

    .address {
      padding-left: 20px;
      margin-bottom: 15px;

      .username {
        float: left;
        width: 100px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #ddd;
        position: relative;
      }

      .username::after {
        content: "";
        display: none;
        width: 13px;
        height: 13px;
        position: absolute;
        right: 0;
        bottom: 0;
        background: url(./images/choosed.png) no-repeat;
      }

      .username.selected {
        border-color: #e1251b;
      }

      .username.selected::after {
        display: block;
      }

      p {
        width: 610px;
        float: left;
        line-height: 30px;
        margin-left: 10px;
        padding-left: 5px;
        cursor: pointer;

        .s1 {
          float: left;

        }

        .s2 {
          float: left;
          margin: 0 5px;
        }

        .s3 {
          float: left;
          width: 56px;
          height: 24px;
          line-height: 24px;
          margin-left: 10px;
          background-color: #878787;
          color: #fff;
          margin-top: 3px;
          text-align: center;
        }
      }

      p:hover {
        background-color: #ddd;
      }
    }

    .line {
      height: 1px;
      background-color: #ddd;
    }

    .way {
      width: 1080px;
      height: 110px;
      background: #f4f4f4;
      padding: 15px;
      margin: 0 auto;

      h5 {
        line-height: 50px;
      }

      .info {
        margin-top: 20px;

        .s1 {
          float: left;
          border: 1px solid #ddd;
          width: 120px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          margin-right: 10px;
        }

        p {
          line-height: 30px;
        }
      }
    }

    .detail {
      width: 1080px;

      background: #feedef;
      padding: 15px;
      margin: 2px auto 0;

      h5 {
        line-height: 50px;
      }

      .list {
        display: flex;
        justify-content: space-between;

        li {
          line-height: 30px;

          p {

            margin-bottom: 20px;
          }

          h4 {
            color: #c81623;
            font-weight: 400;
          }

          h3 {

            color: #e12228;
          }
        }
      }
    }

    .bbs {
      margin-bottom: 15px;

      h5 {
        line-height: 50px;
      }

      textarea {
        width: 100%;
        border-color: #e4e2e2;
        line-height: 1.8;
        outline: none;
        resize: none;
      }
    }

    .bill {
      h5 {
        line-height: 50px;
      }

      div {
        padding-left: 15px;
      }
    }
  }

  .money {
    width: 1200px;
    margin: 20px auto;

    ul {
      width: 220px;
      float: right;

      li {
        line-height: 30px;
        display: flex;
        justify-content: space-between;

        i {
          color: red;
        }
      }
    }
  }

  .trade {
    box-sizing: border-box;
    width: 1200px;
    padding: 10px;
    margin: 10px auto;
    text-align: right;
    background-color: #f4f4f4;
    border: 1px solid #ddd;

    div {
      line-height: 30px;
    }

    .price span {
      color: #e12228;
      font-weight: 700;
      font-size: 14px;
    }

    .receiveInfo {
      color: #999;
    }
  }

  .sub {
    width: 1200px;
    margin: 0 auto 10px;

    .subBtn {
      float: right;
      width: 164px;
      height: 56px;
      font: 700 18px "微软雅黑";
      line-height: 56px;
      text-align: center;
      color: #fff;
      background-color: #e1251b;

    }
  }

}
</style>