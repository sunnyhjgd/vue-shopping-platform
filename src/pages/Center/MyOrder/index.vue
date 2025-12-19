<template>
  <!-- 右侧内容 -->
  <div class="order-right">
    <div class="order-content">
      <div class="title">
        <h3>我的订单</h3>
      </div>
      <div class="chosetype">
        <table>
          <thead>
            <tr>
              <th width="29%">商品</th>
              <th width="31%">订单详情</th>
              <th width="13%">收货人</th>
              <th>金额</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="orders">
        <table class="order-item" v-for="(item, orderIndex) in data.list" :key="orderIndex">
          <thead>
            <tr>
              <th colspan="6">
                <span class="ordertitle">{{ item.createTime }}　订单编号：{{ item.orderId }} <span
                    class="pull-right delete"><img src="../images/delete.png"></span></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(goods, goodsIndex) in item.orderItems" :key="goodsIndex">
              <!-- 商品信息列 - 不合并 -->
              <td width="29%">
                <div class="typographic">
                  <img src="../images/goods.png" alt="商品图片">
                  <a href="#" class="block-text">{{ goods.name }}</a>
                  <span>x{{ goods.num }}</span>
                  <a href="#" class="service">售后申请</a>
                </div>
              </td>

              <!-- 订单详情列 - 只在第一行显示 -->
              <td width="31%" class="center" v-if="goodsIndex === 0" :rowspan="item.orderItems.length">
                <p>付款方式: {{ item.paymentMethod }}</p>
                <p>订单时间: {{ item.orderTime }}</p>
              </td>

              <!-- 收货人列 - 只在第一行显示 -->
              <td width="8%" class="center" v-if="goodsIndex === 0" :rowspan="item.orderItems.length">
                {{ item.shippingAddress.name }}
              </td>

              <!-- 金额列 - 只在第一行显示 -->
              <td width="8%" class="center" v-if="goodsIndex === 0" :rowspan="item.orderItems.length">
                <ul class="unstyled">
                  <li>总金额¥{{ item.payAmount }}</li>
                  <li>{{ item.paymentMethod }}</li>
                </ul>
              </td>

              <!-- 状态列 - 只在第一行显示 -->
              <td width="8%" class="center" v-if="goodsIndex === 0" :rowspan="item.orderItems.length">
                <a href="#" class="btn">{{ item.status }}</a>
              </td>

              <!-- 操作列 - 只在第一行显示 -->
              <td width="16%" class="center" v-if="goodsIndex === 0" :rowspan="item.orderItems.length">
                <ul class="unstyled">
                  <li>
                    <a href="mycomment.html" target="_blank">评价|晒单</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 分页器 - 居中显示 -->
      <div class="choose-order">
        <Pagination :total="total" :pageSize="pageSize" :totalPages="totalPages" :pageNum="page"
          @changePage="changePage" />
      </div>
    </div>
    <!--猜你喜欢-->
    <div class="like" style="margin-top: 150px;">
      <h4 class="kt">猜你喜欢</h4>
      <ul class="like-list">
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike01.png" />
          </div>
          <div class="attr">
            <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
          </div>
          <div class="price">
            <em>¥</em>
            <i>3699.00</i>
          </div>
          <div class="commit">已有6人评价
          </div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike02.png" />
          </div>
          <div class="attr">
            Apple苹果iPhone 6s/6s Plus 16G 64G 128G
          </div>
          <div class="price">
            <em>¥</em>
            <i>4388.00</i>
          </div>
          <div class="commit">已有700人评价
          </div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike03.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
          </div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价
          </div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike04.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
          </div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { reqPayment } from '@/api'

export default {
  name: 'MyOrder',
  data() {
    return {
      //初始化的数据
      //当前展示的页数
      page: 1,
      //每页展示数据的个数
      pageSize: 2,
      //存储我的订单数据
      data: {
        list: []
      },
      total: 0,
      totalPages: 0
    }
  },
  mounted() {
    this.getdata()
  },
  methods: {
    async getdata() {
      // 传递分页参数，使用当前页码，每页2条订单数据
      let result = await reqPayment({ page: this.page, pageSize: this.pageSize })
      if (result.code == 200) {
        this.data.list = result.data.list
        this.total = result.data.pagination.total
        this.totalPages = result.data.pagination.totalPages
      }
    },
    changePage(page) {
      this.page = page
      this.getdata()
    }
  }
}
</script>
