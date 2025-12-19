//引入mockjs
import Mock from 'mockjs'
//引入banner数据、floor数据和searchList数据[json数据格式没有对外暴露却可以直接引用]
//webpack默认对外暴露：json数据格式和图片
import banner from './banner.json'
import floor from './floor.json'
import searchList from './searchList.json'
// 引入三级分类数据
import categoryList from './categoryList.json'
// 在文件顶部导入userAddress数据
import userAddress from './userAddress.json'

// 购物车数据存储，使用uuid作为键
// 从localStorage初始化购物车数据
let cartData = {};
const storedCartData = localStorage.getItem('cartList');
if (storedCartData) {
  try {
    // 假设cartList是针对特定用户的数据
    // 这里简化处理，直接使用默认用户ID
    const defaultUserId = localStorage.getItem('UUIDTOKEN') || 'default_user';
    cartData[defaultUserId] = JSON.parse(storedCartData);
    console.log('从localStorage加载购物车数据成功');
  } catch (e) {
    console.error('解析localStorage购物车数据失败:', e);
    cartData = {};
  }
}

//mock数据：第一个参数为请求地址，第二个参数为响应数据
Mock.mock('/mock/banner', {
  code: 200,
  data: banner
})
Mock.mock('/mock/floor', {
  code: 200,
  data: floor
})
Mock.mock('/mock/categoryList', {
  code: 200,
  data: categoryList
})



// 添加搜索过滤、排序和分页逻辑
Mock.mock('/mock/list', 'post', function (options) {
  // 解析请求参数
  const params = JSON.parse(options.body);
  const { keyword, category1Id, category2Id, category3Id, trademark, order, pageNum = 1, pageSize = 2 } = params;

  // 添加调试日志
  console.log('接收到的参数:', params);
  console.log('category1Id类型:', typeof category1Id, '值:', category1Id);
  console.log('排序参数:', order);

  // 注释掉全局数字转换，改为在过滤时按需转换

  // 过滤商品列表
  let filteredList = [...searchList.data.goodsList];
  console.log('初始商品数量:', filteredList.length);

  // 按关键词过滤
  if (keyword) {
    filteredList = filteredList.filter(item => item.name.includes(keyword));
  }

  // 按分类ID过滤 - 先判断参数是否为空，然后再转成数字
  // 一级分类过滤
  if (category1Id && category1Id !== '') {
    const cat1Id = Number(category1Id);
    if (!isNaN(cat1Id)) {
      filteredList = filteredList.filter(item => item.category1Id === cat1Id);
      console.log('一级分类过滤后数量:', filteredList.length);
    }
  }

  // 二级分类过滤
  if (category2Id && category2Id !== '') {
    const cat2Id = Number(category2Id);
    if (!isNaN(cat2Id)) {
      filteredList = filteredList.filter(item => item.category2Id === cat2Id);
      console.log('二级分类过滤后数量:', filteredList.length);
    }
  }

  // 三级分类过滤
  if (category3Id && category3Id !== '') {
    const cat3Id = Number(category3Id);
    if (!isNaN(cat3Id)) {
      filteredList = filteredList.filter(item => item.category3Id === cat3Id);
      console.log('三级分类过滤后数量:', filteredList.length);
    }
  }

  // 按品牌过滤
  if (trademark) {
    // 转换品牌ID为数字
    const trademarkId = Number(trademark.trademarkId);
    if (!isNaN(trademarkId)) {
      filteredList = filteredList.filter(item => item.trademarkId === trademarkId);
    }
    console.log('品牌过滤后数量:', filteredList.length);
  }

  // 添加排序逻辑
  if (order) {
    const [sortType, sortDirection] = order.split(':');
    const isAsc = sortDirection === 'asc';

    console.log('排序类型:', sortType, '排序方向:', sortDirection);

    filteredList.sort((a, b) => {
      if (sortType === '1') {
        // 综合排序 - 假设按销量（count）排序
        if (isAsc) {
          return a.count - b.count;
        } else {
          return b.count - a.count;
        }
      } else if (sortType === '2') {
        // 价格排序
        if (isAsc) {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      }
      return 0;
    });

    console.log('排序后商品列表:', filteredList);
  }

  // 计算分页数据
  const total = filteredList.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  // 返回处理后的数据
  return {
    code: 200,
    data: {
      ...searchList.data,
      goodsList: paginatedList,
      total,
      pageNum,
      pageSize,
      totalPages
    }
  };
})

// 添加商品详情接口
Mock.mock(/^\/mock\/detail\/\d+$/, 'get', function (options) {
  // 解析请求参数
  console.log('收到商品详情请求，URL:', options.url);

  // 使用更简单的方式获取id
  const urlParts = options.url.split('/');
  const id = Number(urlParts[urlParts.length - 1]);

  console.log('提取到的商品ID:', id);

  // 在商品列表中查找对应id的商品
  const goodsList = searchList.data.goodsList;
  const goodsInfo = goodsList.find(item => item.id === id);
  console.log('查找商品结果:', goodsInfo ? `找到商品，ID: ${goodsInfo.id}` : '未找到商品');

  // 如果找到商品，返回商品详情
  if (goodsInfo) {
    return {
      code: 200,
      message: 'success',
      data: {
        categoryView: {
          category1Name: '手机',
          category2Name: '智能手机',
          category3Name: '5G手机',
        },
        skuInfo: {
          id: goodsInfo.id,
          skuName: goodsInfo.name,
          price: goodsInfo.price,
          suport: goodsInfo.suport,
          commentCount: goodsInfo.count,
          skuDefaultImg: goodsInfo.imgUrl,
          imgList: goodsInfo.imgList
        },
        spuSaleAttrList: [
          {
            saleAttrName: '选择颜色',
            spuSaleAttrValueList: [
              { saleAttrValueName: '黑色', isChecked: 1 },
              { saleAttrValueName: '白色', isChecked: 0 }
            ]
          },
          {
            saleAttrName: '选择内存',
            spuSaleAttrValueList: [
              { saleAttrValueName: '8GB+128GB', isChecked: 1 },
              { saleAttrValueName: '8GB+256GB', isChecked: 0 }
            ]
          }
        ]
      }
    };
  } else {
    // 如果找不到商品，返回404错误
    console.log('商品不存在，ID:', id);
    return { code: 404, message: '商品不存在' };
  }
});

//加入购物车接口
Mock.mock(/^\/mock\/cart\/add(\?.*)?$/, 'post', function (options) {
  // 解析请求参数
  console.log('收到加入购物车请求，URL:', options.url);

  // 从URL查询参数中获取商品ID和数量
  const url = new URL(options.url, 'http://localhost');
  console.log('URL对象:', url);
  const skuId = url.searchParams.get('skuId');
  const num = parseInt(url.searchParams.get('num'));

  console.log('提取到的商品ID:', skuId);
  console.log('提取到的数量:', num);


  // 直接从localStorage获取UUID，确保能获取到正确的用户标识
  let userTempId = localStorage.getItem('UUIDTOKEN');
  console.log('从localStorage获取到的UUID:', userTempId);

  // 如果localStorage没有UUID，生成一个新的并存储
  if (!userTempId) {
    const { v4: uuidv4 } = require('uuid');
    userTempId = uuidv4();
    localStorage.setItem('UUIDTOKEN', userTempId);
    console.log('生成新的UUID并存储:', userTempId);
  }

  // 确保有有效的用户标识
  const finalUserId = userTempId || 'default_user';
  console.log('最终使用的用户标识:', finalUserId);

  // 初始化该用户的购物车数据
  if (!cartData[finalUserId]) {
    cartData[finalUserId] = [];
  }

  // 查找购物车中是否已存在该商品
  const existingItemIndex = cartData[finalUserId].findIndex(item => item.skuId === skuId);
  // 尝试从商品列表中获取该商品的价格和图片信息
  let price = '399.00'; // 默认价格
  let imgUrl = './images/goods1.png'; // 默认图片

  // 在searchList中查找对应商品
  const goodsList = searchList.data.goodsList;
  const goodsInfo = goodsList.find(item => String(item.id) === skuId);

  if (goodsInfo) {
    price = goodsInfo.price;
    imgUrl = goodsInfo.imgUrl;
    name = goodsInfo.name;
  }
  if (existingItemIndex !== -1) {
    // 如果存在，更新数量
    cartData[finalUserId][existingItemIndex].num += num;
  } else {
    // 如果不存在，添加新商品
    cartData[finalUserId].push({
      skuId,
      num,
      price,
      imgUrl,
      name,
      isChecked: 1 // 默认选中
    });
  }

  // 打印更新后的购物车数据
  console.log('更新后的购物车数据:', cartData[finalUserId]);

  // 将更新后的购物车数据保存到localStorage，使用与前端一致的键名
  // 这里需要从cartData[finalUserId]提取用户的购物车数据
  localStorage.setItem('cartList', JSON.stringify(cartData[finalUserId]));
  console.log('购物车数据已保存到localStorage');

  // 返回成功响应，包含价格和图片信息
  return {
    code: 200,
    message: 'success',
    data: {
      skuId,
      num,
      price,
      imgUrl,
      name,
      message: '加入购物车成功'
    }
  };
})

//获取购物车列表接口
Mock.mock(/^\/mock\/cart\/cartList$/, 'get', function (options) {
  // 解析请求参数
  console.log('===== Mock.js 拦截购物车列表请求 =====');
  console.log('收到获取购物车列表请求，URL:', options.url);
  console.log('请求头:', options.headers);

  // 直接从localStorage获取UUID，确保能获取到正确的用户标识
  let userTempId = localStorage.getItem('UUIDTOKEN');
  console.log('从localStorage获取到的UUID:', userTempId);

  // 如果localStorage没有UUID，生成一个新的并存储
  if (!userTempId) {
    const { v4: uuidv4 } = require('uuid');
    userTempId = uuidv4();
    localStorage.setItem('UUIDTOKEN', userTempId);
    console.log('生成新的UUID并存储:', userTempId);
  }

  // 确保有有效的用户标识
  const finalUserId = userTempId || 'default_user';
  console.log('最终使用的用户标识:', finalUserId);

  // 获取该用户的购物车数据
  const userCartData = cartData[finalUserId] || [];
  console.log('用户购物车数据:', userCartData);

  // 确保cartData中存在该用户的数据数组
  if (!cartData[finalUserId]) {
    cartData[finalUserId] = [];
  }

  // 返回购物车列表数据
  return {
    code: 200,
    message: 'success',
    data: userCartData
  };
})

//删除购物车商品接口
Mock.mock(/^\/mock\/cart\/delete\/(\d+)$/, 'delete', function (options) {
  // 解析请求参数
  console.log('===== Mock.js 拦截删除购物车商品请求 =====');
  console.log('收到删除购物车商品请求，URL:', options.url);

  // 从URL路径中提取skuId
  const skuId = options.url.match(/\/mock\/cart\/delete\/(\d+)$/)[1];
  console.log('要删除的商品skuId:', skuId);

  // 直接从localStorage获取UUID，确保能获取到正确的用户标识
  let userTempId = localStorage.getItem('UUIDTOKEN');
  console.log('从localStorage获取到的UUID:', userTempId);

  // 如果localStorage没有UUID，生成一个新的并存储
  if (!userTempId) {
    const { v4: uuidv4 } = require('uuid');
    userTempId = uuidv4();
    localStorage.setItem('UUIDTOKEN', userTempId);
    console.log('生成新的UUID并存储:', userTempId);
  }

  // 确保有有效的用户标识
  const finalUserId = userTempId || 'default_user';
  console.log('最终使用的用户标识:', finalUserId);

  // 确保cartData中存在该用户的数据数组
  if (!cartData[finalUserId]) {
    cartData[finalUserId] = [];
  }

  // 查找并删除指定商品
  const initialLength = cartData[finalUserId].length;
  cartData[finalUserId] = cartData[finalUserId].filter(item => item.skuId !== skuId);
  const deleted = cartData[finalUserId].length !== initialLength;

  console.log('删除前购物车商品数量:', initialLength);
  console.log('删除后购物车商品数量:', cartData[finalUserId].length);
  console.log('删除状态:', deleted ? '成功' : '失败，未找到该商品');

  // 将更新后的购物车数据保存到localStorage
  localStorage.setItem('cartList', JSON.stringify(cartData[finalUserId]));
  console.log('更新后的购物车数据已保存到localStorage');

  // 返回响应
  return {
    code: 200,
    message: deleted ? 'success' : '未找到该商品',
    data: {
      deleted,
      skuId,
      message: deleted ? '商品删除成功' : '商品不存在或已删除'
    }
  };
})


//获取验证码接口
Mock.mock(/^\/mock\/sendCode\/(\d+)$/, 'get', function (options) {
  // 从URL路径中提取手机号
  const phone = options.url.match(/\/mock\/sendCode\/(\d+)$/)[1];

  // 生成6位随机验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // 模拟存储验证码（实际项目中可能会使用redis等）
  console.log(`向手机号 ${phone} 发送验证码: ${code}`);

  // 返回响应
  return {
    code: 200,
    message: '验证码发送成功',
    data: {
      phone,
      code, // 在实际项目中，不应该在响应中返回验证码
      expireTime: Date.now() + 5 * 60 * 1000 // 5分钟后过期
    }
  };
})

//注册接口
Mock.mock('/mock/register', 'post', function (options) {
  // 解析请求体参数
  const { phone, code, password } = JSON.parse(options.body);

  // 模拟验证验证码（实际项目中应该验证之前发送的验证码）
  // 这里简化处理，假设验证码正确
  const isValidCode = code && code.length === 6;

  if (!isValidCode) {
    return {
      code: 400,
      message: '验证码错误',
      data: null
    };
  }

  // 模拟保存用户信息到localStorage
  let users = JSON.parse(localStorage.getItem('users') || '[]');

  // 检查手机号是否已注册
  const existingUser = users.find(user => user.phone === phone);
  if (existingUser) {
    return {
      code: 400,
      message: '该手机号已注册',
      data: null
    };
  }

  // 创建新用户
  const newUser = {
    id: Date.now(), // 简单生成用户ID
    phone,
    password, // 实际项目中应该加密存储
    token: `token_${Date.now()}`, // 生成登录令牌
    nickname: `用户${phone.slice(-4)}`,
    avatar: ''
  };

  // 保存用户信息
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  // 返回注册成功响应
  return {
    code: 200,
    message: '注册成功',
    data: {
      userId: newUser.id,
      token: newUser.token,
      nickname: newUser.nickname
    }
  };
})

//登录接口
Mock.mock('/mock/login', 'post', function (options) {
  // 解析请求体参数
  const { phone, password } = JSON.parse(options.body);

  // 从localStorage获取用户列表
  let users = JSON.parse(localStorage.getItem('users') || '[]');

  // 查找用户
  const user = users.find(u => u.phone === phone);

  // 验证用户是否存在
  if (!user) {
    return {
      code: 400,
      message: '手机号或密码错误',
      data: null
    };
  }

  // 验证密码（实际项目中应该验证加密后的密码）
  if (user.password !== password) {
    return {
      code: 400,
      message: '手机号或密码错误',
      data: null
    };
  }

  // 生成新的token（实际项目中可能需要设置过期时间）
  const newToken = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  user.token = newToken;

  // 更新用户信息
  const userIndex = users.findIndex(u => u.phone === phone);
  if (userIndex !== -1) {
    users[userIndex] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }

  // 返回登录成功响应
  return {
    code: 200,
    message: '登录成功',
    data: {
      token: newToken,
      userInfo: {
        userId: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar || ''
      }
    }
  };
})

// 获取用户地址信息
Mock.mock('/mock/userAddress', 'get', function () {
  // 获取当前登录用户信息（如果有）
  const token = localStorage.getItem('UUIDTOKEN');
  let userPhone = '';

  // 如果有token，尝试获取用户信息
  if (token) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.token === token);
    if (currentUser) {
      userPhone = currentUser.phone;
      console.log('获取地址信息：当前登录用户手机号', userPhone);
    }
  }

  // 根据用户信息返回相应的地址
  const addresses = userPhone ? userAddress.slice(0, 2) : userAddress;

  return {
    code: 200,
    message: '获取地址成功',
    data: addresses
  };
})

//提交订单的接口
Mock.mock('/mock/submitOrder', 'post', function (options) {
  try {
    // 解析请求体数据
    const orderInfo = JSON.parse(options.body);

    // 生成订单ID（简单实现，使用时间戳和随机数）
    const orderId = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    // 从localStorage中获取购物车数据
    let cartList = [];
    const storedCart = localStorage.getItem('cartList');
    if (storedCart) {
      try {
        cartList = JSON.parse(storedCart);
      } catch (e) {
        console.error('解析购物车数据失败:', e);
        cartList = [];
      }
    }

    // 移除购物车中已选中的商品
    const updatedCartList = cartList.filter(item => !item.isChecked);
    localStorage.setItem('cartList', JSON.stringify(updatedCartList));

    // 返回成功响应
    return {
      code: 200,
      message: '提交订单成功',
      data: {
        orderId: orderId,
        orderTime: new Date().toISOString(),
        payAmount: orderInfo.orderItems.reduce((total, item) => total + (item.price * item.num), 0).toFixed(2),
        orderInfo: orderInfo
      }
    };
  } catch (error) {
    console.error('处理订单提交失败:', error);
    return {
      code: 500,
      message: '提交订单失败',
      data: null
    };
  }
})

//获取已支付订单接口 - 支持分页、排序和过滤
Mock.mock(/\/mock\/getPaidOrders/, 'get', function (options) {
  try {
    // 解析URL参数
    const url = new URL(options.url, window.location.origin);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const sortBy = url.searchParams.get('sortBy') || 'orderTime'; // 排序字段：orderTime或payAmount
    const sortOrder = url.searchParams.get('sortOrder') || 'desc'; // 排序方向：asc或desc
    const startDate = url.searchParams.get('startDate'); // 开始日期
    const endDate = url.searchParams.get('endDate'); // 结束日期
    const minAmount = parseFloat(url.searchParams.get('minAmount') || '0'); // 最小金额
    const maxAmount = parseFloat(url.searchParams.get('maxAmount') || 'Infinity'); // 最大金额

    // 从localStorage中获取已支付订单数据
    let paidOrders = [];
    const storedOrders = localStorage.getItem('paidOrders');
    if (storedOrders) {
      try {
        paidOrders = JSON.parse(storedOrders);
      } catch (e) {
        console.error('解析已支付订单数据失败:', e);
        paidOrders = [];
      }
    }

    // 如果没有订单，生成更丰富的模拟数据
    if (paidOrders.length === 0) {
      const productList = [
        { name: '包邮 正品智能手表Pro 新款', price: 199.99, image: '../images/itemlike01.png' },
        { name: '无线耳机', price: 199.99, image: '../images/itemlike02.png' },
        { name: '包邮超薄笔记本新款', price: 5999.00, image: '../images/itemlike03.png' },
        { name: '平板电脑', price: 2499.00, image: '../images/itemlike04.png' },
        { name: '智能音箱', price: 299.00, image: '../images/goods.png' },
        { name: '智能摄像头', price: 399.00, image: '../images/itemlike01.png' },
        { name: '移动电源', price: 129.00, image: '../images/itemlike02.png' },
        { name: '蓝牙音箱', price: 799.00, image: '../images/itemlike03.png' }
      ];

      // 生成过去30天内的15个随机订单
      for (let i = 1; i <= 15; i++) {
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const orderTime = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const itemCount = Math.floor(Math.random() * 3) + 1; // 每个订单1-3个商品
        const orderItems = [];

        for (let j = 0; j < itemCount; j++) {
          const productIndex = Math.floor(Math.random() * productList.length);
          const product = productList[productIndex];
          const quantity = Math.floor(Math.random() * 3) + 1; // 每个商品1-3个

          orderItems.push({
            id: `item_${i}_${j}`,
            name: product.name,
            price: product.price,
            num: quantity,
            image: product.image
          });
        }

        // 计算订单总金额
        const totalAmount = orderItems.reduce((total, item) => total + (item.price * item.num), 0).toFixed(2);

        paidOrders.push({
          orderId: `ORD${Date.now() - daysAgo * 24 * 60 * 60 * 1000}`,
          orderTime: orderTime.toISOString(),
          payAmount: totalAmount,
          orderItems: orderItems,
          status: '已支付',
          paymentMethod: ['支付宝', '微信支付', '银行卡'][Math.floor(Math.random() * 3)],
          shippingAddress: {
            name: '张三',
            phone: '13800138000',
            address: '北京市朝阳区某某街道123号'
          },
          trackingNumber: `SF${Math.floor(Math.random() * 10000000)}`,
          createTime: orderTime.toISOString()
        });
      }

      // 将模拟数据存储到localStorage中
      localStorage.setItem('paidOrders', JSON.stringify(paidOrders));
    }

    // 过滤订单
    let filteredOrders = paidOrders.filter(order => {
      // 金额过滤
      const orderAmount = parseFloat(order.payAmount);
      if (orderAmount < minAmount || orderAmount > maxAmount) {
        return false;
      }

      // 日期过滤
      const orderDate = new Date(order.orderTime);
      if (startDate && orderDate < new Date(startDate)) {
        return false;
      }
      if (endDate && orderDate > new Date(endDate)) {
        return false;
      }

      return true;
    });

    // 排序订单
    filteredOrders.sort((a, b) => {
      if (sortBy === 'orderTime') {
        return sortOrder === 'asc'
          ? new Date(a.orderTime) - new Date(b.orderTime)
          : new Date(b.orderTime) - new Date(a.orderTime);
      } else if (sortBy === 'payAmount') {
        return sortOrder === 'asc'
          ? parseFloat(a.payAmount) - parseFloat(b.payAmount)
          : parseFloat(b.payAmount) - parseFloat(a.payAmount);
      }
      return 0;
    });

    // 分页处理
    const total = filteredOrders.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

    // 返回成功响应，包含分页信息
    return {
      code: 200,
      message: '获取已支付订单成功',
      data: {
        list: paginatedOrders,
        pagination: {
          page: page,
          pageSize: pageSize,
          total: total,
          totalPages: Math.ceil(total / pageSize)
        },
        filters: {
          sortBy: sortBy,
          sortOrder: sortOrder,
          startDate: startDate || null,
          endDate: endDate || null,
          minAmount: minAmount || null,
          maxAmount: maxAmount === Infinity ? null : maxAmount
        }
      }
    };
  } catch (error) {
    console.error('处理获取已支付订单失败:', error);
    return {
      code: 500,
      message: `获取已支付订单失败: ${error.message}`,
      data: null
    };
  }
})