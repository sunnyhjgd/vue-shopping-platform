//对于axios进行二次封装
import axios from 'axios'
//引入进度条
import nProgress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
import store from '@/store'

const requests = axios.create({
  baseURL: '/mock',
  timeout: 15000
})

//请求拦截器
requests.interceptors.request.use((config) => {
  // 确保config.headers存在
  if (!config.headers) {
    config.headers = {};
  }

  // 为POST请求设置正确的Content-Type
  if (config.method === 'post' && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  
  // 直接从localStorage获取UUIDTOKEN并添加到请求头
  const uuid_token = localStorage.getItem('UUIDTOKEN');
  if (uuid_token) {
    config.headers.userTempId = uuid_token;
  }

  nProgress.start()
  console.log('发起请求:', config.url);
  // 输出请求体内容以帮助调试
  console.log('请求方法:', config.method);
  console.log('请求数据:', config.data);
  return config
})

//响应拦截器
requests.interceptors.response.use((res) => {
  nProgress.done()
  console.log('请求成功:', res.data) // 添加日志
  return res.data
}, (error) => {
  nProgress.done()

  // 详细的错误信息
  let errorMessage = '请求失败'

  if (error.response) {
    // 服务器响应了错误状态码
    console.error('响应错误:', error.response.status, error.response.data)
    errorMessage = `请求失败: ${error.response.status} - ${error.response.data?.message || '服务器错误'}`
  } else if (error.request) {
    // 请求发出但没有收到响应
    console.error('网络错误:', error.request)
    errorMessage = '网络错误：请检查代理配置或网络连接'
  } else {
    // 其他错误
    console.error('请求配置错误:', error.message)
    errorMessage = error.message
  }

  return Promise.reject(new Error(errorMessage))
})

export default requests