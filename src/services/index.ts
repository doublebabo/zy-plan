import http from "../utils/http.ts";
import myLocalstorage from "../utils/localstorage.ts";


async function executeAndTryCatch(func) {
  try {
    return await func();
  }
  catch (error) {
    return error;
  }
}

export function clearUserTokenInfo() {
  localStorage.setItem('token', '');
}

export function userLogin(userName,password) {
  return executeAndTryCatch(() => http.post('/user/login', {userName, password}).then(res => {
    if (res.data.success) {
      myLocalstorage.set('token', res.data?.token_info?.token, res.data?.token_info?.token_expired);
    }
    return res
  }));
}


export function useInfo() {
  return executeAndTryCatch(() => http.post('/api/v1/user/info').then(res => {
    if (res.data?.user_info) {
      localStorage.setItem('nick_name', res.data?.user_info?.nick_name);
      localStorage.setItem('head_image_url', res.data?.user_info?.head_image_url);
      localStorage.setItem('user_code', res.data?.user_info?.user_code);
    }
    return res
  }));
}

//台词-创建/更新
export function wordUpdate(data) {
  return executeAndTryCatch(() => http.post('/api/v1/word/update', data));
}


export function delUser(data) {
  return executeAndTryCatch(() => http.post('/api/v1/word/update', data));
}