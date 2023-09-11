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
  localStorage.setItem('name', '');
}

export function userLogin(data) {
  return executeAndTryCatch(() => http.post('/user/login', data).then(res => {
    if (res.success) {
      myLocalstorage.set('token', res.data?.token);
      myLocalstorage.set('role', res.data?.role);
      myLocalstorage.set('name', res.data?.name);
      myLocalstorage.set('id', res.data?.id);
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
export function deptList(id) {
  return executeAndTryCatch(() => http.get('/dept/list?userId=' + id));
}

export function addUser(data) {
  const vals = {...data, authority: data?.authority?.join(',') || null}
  return executeAndTryCatch(() => http.post('/user/add', vals));
}


export function editUser(data) {
  const vals = {...data, authority: data?.authority?.join(',') || null}
  return executeAndTryCatch(() => http.post('/user/modify', vals));
}

//查询一级部门列表
export function getDeptFirstList() {
  return executeAndTryCatch(() => http.get('/monthPlan/dept/first'));
}

//查询二级部门列表
export function getDeptSecondList(deptFirstList: string[]) {
  return executeAndTryCatch(() => http.post('/monthPlan/dept/second', {
    deptFirstList
  }));
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
  // {label: '周计划未发布', value: 5},
  // {label: '周计划已发布', value: 6},
  // {label: '周计划员工未确认', value: 7},
  // {label: '周计划员工已确认', value: 8},
  // {label: '周计划领导未确认', value: 9},
  // {label: '周计划领导已确认', value: 10}
];

export const weekStatus = [
  {label: '未完成', value: 1},
  {label: '已完成', value: 2}
];

export const yOrN = [
  {label: '否', value: 0},
  {label: '是', value: 1},
]

export const completeStatus = [
  {label: '未确认', value: 0},
  {label: '未完成', value: 1},
  {label: '完成', value: 2},
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


export function exportMonth(data) {
  const postData = {
    ...data,
    "currPage": data.current,
    "pageSize": data.pageSize
  }
  delete postData.current;
  return executeAndTryCatch(() => http.post('/monthPlan/export', postData, {
    responseType: 'blob'
  }));
}


export function monthPlanUserList() {
  return executeAndTryCatch(() => http.get('/monthPlan/userList'));
}

export function monthPlanAdd(data) {
  data.startTime = dayjs(data.startTime).format('YYYY-MM-DD');
  data.endTime = dayjs(data.endTime).format('YYYY-MM-DD');
  const vals = {...data, participant: data?.participant?.join(',') || null, executor: data?.executor?.split?.('#')?.[0] || ''}
  return executeAndTryCatch(() => http.post('/monthPlan/add', vals));
}


export const download = (res, name) => {
  const blob = new Blob([res]);
  const elink = document.createElement('a');
  elink.download = `${name || '月度计划文件.xls'}`;
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
        finishTime: (o?.finishTimeOld || '') + '/' + (o?.finishTimeNew || ''),
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
  const vals = {...data, participant: data?.participant?.join(',') || null}
  return executeAndTryCatch(() => http.post('/monthPlan/modify', vals));
}
// 查询周计划修改历史
export function weekHistory(id) {
  return executeAndTryCatch(() => http.get('/weekPlan/history?weekPlanId=' + id).then(res => {
    res.data = res.data.map(o => {
      return {
        ...o,
        content: o.contentOld + '/' + o.contentNew,
      }
    })
    return res;
  }));
}

// 修改周计划
export function weekPlanEdit(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/modify', {
    content: data.content,
    weekPlanId: data.weekPlanId
  }));
}

// 完成月计划
export function completeMonthPlan(id) {
  return executeAndTryCatch(() => http.get('/monthPlan/finish?monthPlanId=' + id, ));
}

// 周详情
export function weekPlanDetail(id) {
  return executeAndTryCatch(() => http.get('/weekPlan/detail?weekPlanId=' + id, ));
}


export const leaderOrEmployeeStatus = [
  {label: '未完成', value: 1},
  {label: '已完成', value: 2},
];

export function issueEndList(data: any) {
  const postData = {
    ...data,
    "currPage": data.current,
    "pageSize": data.pageSize,
  }
  delete postData.current
  return executeAndTryCatch(() => http.post('/issue/endList', postData).then((res: any) => {
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


export function issueStartList(data: any) {
  const postData = {
    ...data,
    "currPage": data.current,
    "pageSize": data.pageSize,
  }
  delete postData.current
  return executeAndTryCatch(() => http.post('/issue/startList', postData).then((res: any) => {
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

// 查询一级部门列表
export function getDeptFirst() {
  return executeAndTryCatch(() => http.get('/issue/dept/first'));
}

// 查询二级部门列表
export function getDeptSecond(deptFirstList: string[]) {
  return executeAndTryCatch(() => http.post('/issue/dept/second', {
    deptFirstList
  }));
}

// 责任人列表
export function getBlameList() {
  return executeAndTryCatch(() => http.get('/issue/userList'));
}

// 工作完成状态
// 0、全部
// 1、已完成
// 2、未完成
// 3、超时已完成
// 4、超时未完成
// 5、跨部门问题直接结束
// 6、非跨部门问题直接结束
export const workStatus = [
  {label: '全部', value: 0},
  {label: '已完成', value: 1},
  {label: '未完成', value: 2},
  {label: '超时已完成', value: 3},
  {label: '超时未完成', value: 4},
]

// 本部门经理直接关闭
export function startClose(data: any) {
  return executeAndTryCatch(() => http.post('/issue/start/close', {
    issueId: data.issueId,
    closeComment: data.closeComment
  }));
}

//本部门经理问题确认
export function startConfirm(data: any) {
  return executeAndTryCatch(() => http.post('/issue/start/confirm', {
    issueId: data.issueId,
    endDept: data.endDept,
    expectTime: data.expectTime
  }));
}

export function issueAdd(data: any) {
  return executeAndTryCatch(() => http.post('/issue/add', data));
}

// 对方部门经理直接关闭
export function issueEndClose(data: any) {
  return executeAndTryCatch(() => http.post('/issue/end/close', data));
}

// 对方部门经理确认问题
export function issueEndConfirm(data: any) {
  return executeAndTryCatch(() => http.post('/issue/end/confirm', data));
}

// 对方部门员工确认完成
export function issueEndEmployeeFinish(id: any) {
  return executeAndTryCatch(() => http.get('/issue/end/employee/finish?issueId=' + id));
}

// 对方部门经理确认完成
export function issueEndLeaderFinish(id: any) {
  return executeAndTryCatch(() => http.get('/issue/end/leader/finish?issueId=' + id));
}


// 责任部门导出问题报表
export function exportDataOne(params ={}) {
  return executeAndTryCatch(() => http.post('/issue/start/export', params, {
    responseType: 'blob'
  }));
}

// 发起部门导出问题报表
export function exportDataTwo(params = {}) {
  return executeAndTryCatch(() => http.post('/issue/end/export', params, {
    responseType: 'blob'
  }));
}

export const workIsImportantEnum = [
  {label: '日常工作', value: '日常工作'},
  {label: '培训工作', value: '培训工作'},
  {label: '一般工作', value: '一般工作'},
  {label: '重点工作', value: '重点工作'},
]


// 月计划详情
export function monthPlanDetail(id: any) {
  return executeAndTryCatch(() => http.get('/monthPlan/detail', {params: {monthPlanId: id}} ));
}

export const workStatus2 = [
  {label: '未完成', value: 1},
  {label: '超时未完成', value: 2},
  {label: '已完成', value: 3},
  {label: '超时已完成', value: 4},
]

// 计划周数
export const planWeeks = Array.from({length: 12}).map((o, oIndex) => ({
  label: (oIndex + 1) + '月',
  value: oIndex + 1
}))



//4、月计划员工确认的接口是：/monthPlan/employee
export function monthPlanemployee(params = {}) {
  return executeAndTryCatch(() => http.post('/monthPlan/employee', params));
}


// 5、月计划领导确认的接口是：/monthPlan/leader
export function monthPlanleader(params = {}) {
  return executeAndTryCatch(() => http.post('/monthPlan/leader', params));
}
// 6、月计划第三方意见的接口是：/monthPlan/comment
export function monthPlancomment(params = {}) {
  return executeAndTryCatch(() => http.post('/monthPlan/comment', params));
}
// 7、周计划员工确认的接口是：/weekPlan/employee
export function weekPlanemployee(params = {}) {
  return executeAndTryCatch(() => http.post('/weekPlan/employee', params));
}
// 8、周计划领导确认的接口是：/weekPlan/leader
export function weekPlanleader(params = {}) {
  return executeAndTryCatch(() => http.post('/weekPlan/leader', params));
}
// 9、周计划第三方意见的接口是：/weekPlan/comment
export function weekPlancomment(params = {}) {
  return executeAndTryCatch(() => http.post('/weekPlan/comment', params));
}


// 月计划导入
export function monthPlanImport(formdata) {
  return executeAndTryCatch(() => http.post('/monthPlan/import', formdata));
}
