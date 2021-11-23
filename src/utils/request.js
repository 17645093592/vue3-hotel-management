// 请求相关
// 导入axios
import axios from 'axios'
//导入nprogress
import Nprogress from 'nprogress'
//导入nprogress样式
import 'nprogress/nprogress.css'
import global from './global'
//  初始化
const instance = axios.create({
    //设置请求地址前缀
    baseURL: global.BASE_URL,
    //请求超时时间
    timeout: 10000,  
    // 请求头
    // instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    // headers: {'token': sessionStorage.getItem('token')}
  });

  // 添加请求拦截器
instance.interceptors.request.use(function (config) {
    Nprogress.start()
    if(sessionStorage.getItem('token')){
      instance.defaults.headers.common['token'] = sessionStorage.getItem('token');
    }
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    Nprogress.done()
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    Nprogress.done()
    // 对响应数据做点什么
    return response;
  }, function (error) {
    Nprogress.done()
    // 对响应错误做点什么
    return Promise.reject(error);
  });

//定义一个get请求方法
export let $get = async (url,params) =>{
   let {data} = await instance.get(url,{params})
   return data
}
//定义一个post请求方法
  export let $post = async (url,params,otherData={}) =>{
    
    axios.defaults.baseURL = otherData.baseURL == 'mock' ? global.MOCK_URL : global.BASE_URL
    let {data} = await instance.post(url,params)
    return data
 }
