import axios from 'axios';
import {notification} from "antd";
import {clearUserTokenInfo} from "../services/index.ts";
import myLocalstorage from "./localstorage.ts";

const http = axios.create({
  baseURL: 'http://122.192.6.227:8010/api',
  timeout: 15000,
  // headers: {'Content-Type': 'text/plain'}
});

// request拦截器
http.interceptors.request.use((config: any) => {
  if (config.url !== '/user/login') {
    config.headers = {
      ...config.headers,
      token: myLocalstorage.get('token') || '', // localstorage的封装，可以设置过期时间
    }
  }
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
});

// response拦截器
http.interceptors.response.use((res) => {
  if (res?.status !== 200) {
    notification.error({message: res.data?.msg || '服务器开小差~', duration: 1.5, description: null})
    throw new Error(res.data?.msg);
  } else {
    if (res.data?.msg) {
      if (res.data.success) {
        notification.success({message: res.data?.msg, duration: 1.5, description: null});
      } else {
        notification.error({message: res.data?.msg, duration: 1.5, description: null});
      }
      if (res.data?.code === 401) {
        clearUserTokenInfo();
        setTimeout(() => {
          location.href = '/';
        }, 100)
      }
    }
  }
  return res.data
}, (error) => {
  notification.error({message: error.message || '服务器开小差~', duration: 1.5, description: null})
  return Promise.reject(error)
});

export default http;