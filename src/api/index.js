//当前这个模块，api统一管理
import requests from './request.js'
import mockRequests from './mockAjax.js'

//三级联动接口
// /api/product/getBaseCategoryList get请求 无参数
// 发请求：axios发请求返回结果是Promise对象
//mock数据：第一个参数为请求地址，第二个参数为响应数据
export const reqBannerList = () => mockRequests({ url: '/banner', method: 'get' })
export const reqFloorList = () => mockRequests({ url: '/floor', method: 'get' })
export const reqCategoryList = () => mockRequests({ url: '/categoryList', method: 'get' })

//获取搜索模块数据 地址：/mock/list  请求方式：post  参数：需要带参数
export const reqSearchList = (params) => mockRequests({ url: '/list', method: 'post', data: params })
//获取商品详情接口 地址：/mock/detail/:id  请求方式：get  参数：需要带参数
export const reqDetailList = (id) => mockRequests({ url: `/detail/${id}`, method: 'get' })
//加入购物车接口 地址：/mock/cart/add  请求方式：post  参数：需要带参数
export const reqAddOrUpdateCart = (skuId, num) => mockRequests({ url: `/cart/add?skuId=${skuId}&num=${num}`, method: 'post' })
//获取购物车列表接口 地址：/mock/cart/cartList  请求方式：get  参数：不需要带参数
export const reqCartList = () => mockRequests({ url: '/cart/cartList', method: 'get' })
//删除购物车商品接口 地址：/mock/cart/delete/:skuId  请求方式：delete  参数：需要带参数
export const reqDeleteCart = (skuId) => mockRequests({ url: `/cart/delete/${skuId}`, method: 'delete' })
//获取验证码接口 地址：/mock/sendCode  请求方式：get  参数：需要带参数
export const reqSendCode = (phone) => mockRequests({ url: `/sendCode/${phone}`, method: 'get' })
//注册接口 地址：/mock/register  请求方式：post  参数：需要带参数
export const reqRegister = (params) => mockRequests({ url: '/register', method: 'post', data: params })
//登录接口 地址：/mock/login  请求方式：post  参数：需要带参数
export const reqLogin = (params) => mockRequests({ url: '/login', method: 'post', data: params })
//获取用户地址信息接口 地址：/mock/userAddress  请求方式：get  参数：不需要带参数
export const reqUserAddress = () => mockRequests({ url: '/userAddress', method: 'get' })
//提交订单接口 地址：/mock/submitOrder  请求方式：post  参数：需要带参数
export const reqSubmitOrder = (orderInfo) => mockRequests({ url: '/submitOrder', method: 'post', data: orderInfo })
//获取订单支付信息接口 地址：/getPaidOrders  请求方式：get  参数：支持查询参数如page、pageSize等
export const reqPayment = (params = {}) => mockRequests({ url: '/getPaidOrders', method: 'get', params })
