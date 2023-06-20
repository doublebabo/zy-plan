import axios from 'axios';
import {notification} from "antd";
import {clearUserTokenInfo} from "../services/index.ts";
import myLocalstorage from "./localstorage.ts";

const http = axios.create({
  baseURL: 'http://bug-dev.xiaoxiaobite.com',
  timeout: 15000,
  // headers: {'Content-Type': 'text/plain'}
});

// request拦截器
http.interceptors.request.use((config) => {
  // if (config.url !== '/api/v1/user/login') {
    config.data = {
      // ...config.data,
      // token: myLocalstorage.get('token'), // localstorage的封装，可以设置过期时间
      // nonce: Math.random().toString(),
      // time_stamp: parseInt(new Date().getTime() / 1000, 10),
      // time_zone: 28800,
      // "debug": process.env.NODE_ENV === 'development',
      // 'package': 'web'
    }
  // }
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
});

// response拦截器
http.interceptors.response.use((res) => {
  if (res.data?.code !== 200) {
    notification.error({message: res.data?.msg || '服务器开小差~', duration: 3, description: null})
    if (res.data?.code === 100) {
      clearUserTokenInfo();
      setTimeout(() => {
        location.href = '/';
      }, 500)
    }
    throw new Error(res.data?.msg);
  }
  return res.data
}, (error) => {
  return Promise.reject(error)
});

export default http;