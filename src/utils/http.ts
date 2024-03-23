import axios from 'axios';
import {notification} from "antd";
import {clearUserTokenInfo} from "../services/index.ts";
import myLocalstorage from "./localstorage.ts";

export const baseURL = 'http://122.192.6.227:8010/api';

const http = axios.create({
  baseURL: baseURL,
  timeout: 15000,
  // headers: {'Content-Type': 'text/plain'}
});

// request拦截器
http.interceptors.request.use((config: any) => {
  if (config.url !== '/user/login') {
    // eslint-disable-next-line no-param-reassign
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

let tokenIsExpired = false;
// response拦截器
http.interceptors.response.use((res) => {
  if (res.data?.code === 401) {
    if (!tokenIsExpired) {
      notification.error({message: res.data?.msg, duration: 1.17, description: null, closeIcon: false});
    }
    tokenIsExpired = true;
    clearUserTokenInfo();
    if (location.pathname !== '/') {
      setTimeout(() => {
        location.href = '/';
      }, 777)
    }
  } else {
    tokenIsExpired = false;
    if (res.data.msg) {
      if (res.data.success) {
        notification.success({message: res.data?.msg, duration: 1.17, description: null});
      } else {
        notification.error({message: res.data?.msg, duration: 1.17, description: null});
      }
    }
  }
  return res.data
}, (error) => {
  notification.error({message: error.message || '服务器开小差~', duration: 1.17, description: error.config.baseURL})
  return Promise.reject(error)
});

export default http;