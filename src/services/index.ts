import http from "../utils/http.ts";
import myLocalstorage from "../utils/localstorage.ts";
import dayjs from 'dayjs';


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
  localStorage.setItem('role', '');
}

export function userLogin(data) {
  return executeAndTryCatch(() => http.post('/user/login', data).then(res => {
    if (res.success) {
      myLocalstorage.set('token', res.data?.token);
      myLocalstorage.set('role', res.data?.role);
    }
    return res
  }));
}


export function userLogout() {
  return executeAndTryCatch(() => http.get('/user/logout').then(res => {
    clearUserTokenInfo();
    return res
  }));
}

export function userList(data) {
  const postData = {
    "currPage": data.current,
    "pageSize": data.pageSize
  }
  return executeAndTryCatch(() => http.post('/user/list', postData).then(res => {
    if (res.success) {

      return {
        data: res?.data?.obj || [],
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: res.success,
        // 不传会使用 data 的长度，如果是分页一定要传
        total: res?.data.total,
      }
    }
    return res;
  }));
}

export function delUser(id) {
  return executeAndTryCatch(() => http.get('user/delete?userId=' + id));
}

export function roleList() {
  return executeAndTryCatch(() => http.get('/role/list'));
}

export function deptTree() {
  return executeAndTryCatch(() => http.get('/dept/tree'));
}

// 一级部门
export function deptList() {
  return executeAndTryCatch(() => http.get('/dept/list'));
}

export function addUser(data) {
  const vals = {...data, authority: data.authority.join(',') || null}
  return executeAndTryCatch(() => http.post('/user/add', vals));
}


export function editUser(data) {
  const vals = {...data, authority: data.authority.join(',') || null}
  return executeAndTryCatch(() => http.post('/user/modify', vals));
}

//查询一级/二级部门列表
export function deptList2() {
  return executeAndTryCatch(() => http.get('/monthPlan/dept/list'));
}

//查询月度计划
export function monthPlanList(data) {
  const postData = {
    ...data,
    "currPage": data.current,
    "pageSize": data.pageSize
  }
  delete postData.current;
  return executeAndTryCatch(() => http.post('/monthPlan/list', postData).then(res => {
    if (res.success) {
      return {
        data: res?.data?.obj || [],
        // success 请返回 true，
        // 不然 table 会停止解析数据，即使有数据
        success: res.success,
        // 不传会使用 data 的长度，如果是分页一定要传
        total: res?.data.total,
      }
    }
    return res;
  }));
}

// // 0、 全部
// // 1、 未完成
// // 2、 超时未完成
// // 3、 已完成
// // 4、 超时已完成
// // 5、 周计划未发布
// // 6、 周计划已发布
// // 7、 周计划员工未确认
// // 8、 周计划员工已确认
// // 9、 周计划领导未确认
// // 10、周计划领导已确认
export const planStatus = [
  {label: '全部', value: 0},
  {label: '未完成', value: 1},
  {label: '超时未完成', value: 2},
  {label: '已完成', value: 3},
  {label: '超时已完成', value: 4},
  {label: '周计划未发布', value: 5},
  {label: '周计划已发布', value: 6},
  {label: '周计划员工未确认', value: 7},
  {label: '周计划员工已确认', value: 8},
  {label: '周计划领导未确认', value: 9},
  {label: '周计划领导已确认', value: 10}
];


export const yOrN = [
  {label: '否', value: 0},
  {label: '是', value: 1},
]

export function arrayToMap(array) {
  const map = {};
  array.forEach(o => {
    map[o.value] = {
      text: o.label,
    }
  })
  return map;
}


export function exportMonth(params) {
  return executeAndTryCatch(() => http.post('/monthPlan/export', params, {
    responseType: 'blob'
  }));
}


export function monthPlanUserList() {
  return executeAndTryCatch(() => http.get('/monthPlan/userList'));
}

export function monthPlanAdd(data) {
  data.startTime = dayjs(data.startTime).format('YYYY-MM-DD');
  data.endTime = dayjs(data.endTime).format('YYYY-MM-DD');
  return executeAndTryCatch(() => http.post('/monthPlan/add', data));
}


export const download = (res) => {
  const blob = new Blob([res]);
  const elink = document.createElement('a');
  elink.download = '月度计划文件.xlsx';
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL对象
  document.body.removeChild(elink);
};

// 查询周计划
export function weekPlanListById(id) {
  return executeAndTryCatch(() => http.get('/weekPlan/list?monthPlanId='+ id));
}

// 新增周计划
export function weekPlanAdd(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/add', data));
}

// 周计划员工确认
export function weekPlanEmployee(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/employee', data));
}

// 周计划领导确认
export function weekPlanLeader(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/leader', data));
}

// 查询月计划修改历史
export function monthHistory(id) {
  return executeAndTryCatch(() => http.get('monthPlan/history?monthPlanId=' + id).then(res => {

    res.data = res.data.map(o => {
      return {
        ...o,
        title: o.titleOld + '/' + o.titleNew,
        content: o.contentOld + '/' + o.contentNew,
        startTime: o.startTimeOld + '/' + o.startTimeNew,
        endTime: o.endTimeOld + '/' + o.endTimeNew,
        finishTime: o?.finishTimeOld + '/' + o?.finishTimeNew,
        executor: o.executorOld + '/' + o.executorNew,
        participant: o.participantOld + '/' + o.participantNew,
      }
    })
    return res;
  }));
}

// 修改月度计划
export function monthPlanEdit(data) {
  data.endTime = dayjs(data.endTime).format('YYYY-MM-DD');
  data.startTime = dayjs(data.startTime).format('YYYY-MM-DD');
  data.finishTime = dayjs(data.finishTime).format('YYYY-MM-DD');
  return executeAndTryCatch(() => http.post('/monthPlan/modify', data));
}
// 查询周计划修改历史
export function weekHistory(id) {
  return executeAndTryCatch(() => http.get('/weekPlan/history?weekPlanId=' + id));
}

// 修改周计划
export function weekPlanEdit(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/modify', {
    content: data.content,
    weekPlanId: data.weekPlanId
  }));
}