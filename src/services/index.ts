import http from "../utils/http.ts";
import myLocalstorage from "../utils/localstorage.ts";
import dayjs from 'dayjs';

async function executeAndTryCatch(func) {
  try {
    return await func();
  } catch (error) {
    return error;
  }
}


function handlePagePostData(data) {
  const postData = {...data};
  postData.currPage = data.current;
  delete postData.current;
  return postData
}

export function clearUserTokenInfo() {
  localStorage.setItem('token', '');
  localStorage.setItem('name', '');
  localStorage.setItem('admin', '');
  localStorage.setItem('manager', '');
}

export function userLogin(data) {
  return executeAndTryCatch(() => http.post('/user/login', data).then((res: any) => {
    if (res.success) {
      myLocalstorage.set('token', res.data?.token);
      // myLocalstorage.set('role', res.data?.role);
      myLocalstorage.set('name', res.data?.name);
      myLocalstorage.set('id', res.data?.id);
      myLocalstorage.set('admin', res.data?.admin);
      myLocalstorage.set('manager', res.data?.manager);
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
    ...data,
    "currPage": data.current,
    "pageSize": data.pageSize,
  }
  delete postData.current;
  return executeAndTryCatch(() => http.post('/user/page', postData).then((res: any) => {
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
  const vals = {...data, admin: +data.admin, manager: +data.manager}
  return executeAndTryCatch(() => http.post('/user/add', vals));
}


export function editUser(data) {
  const vals = {...data, admin: +data.admin, manager: +data.manager}
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
    "pageSize": data.pageSize,
  }
  delete postData.current;
  return executeAndTryCatch(() => http.post('/monthPlan/myList', postData).then((res: any) => {
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

export const planStatus = [
  {label: '未完成', value: 0, status: 'default'},
  {label: '已完成', value: 1, status: 'success'},
  {label: '超时', value: 2, status: 'error'},
];

export const weekStatus = [
  // {label: '未完成', value: 1},
  // {label: '已完成', value: 2}
  {label: '未完成', value: 0},
  {label: '已完成', value: 1},
  {label: '超时', value: 2},
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
      status: o.status || null
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
  const vals = {
    ...data,
    participant: data?.participant?.join(',') || null,
    executor: data?.executor?.split?.('#')?.[0] || '',
    startTime: dayjs(data.startTime).format('YYYY-MM-DD'),
    endTime: dayjs(data.endTime).format('YYYY-MM-DD'),
  }
  return executeAndTryCatch(() => http.post('/monthPlan/add', vals));
}


export const download = (res, name?) => {
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
  return executeAndTryCatch(() => http.get('/weekPlan/list?monthPlanId=' + id));
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
    return {
      ...res,
      data: res.data.map(o => {
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
    };
  }));
}

// 修改月度计划
export function monthPlanEdit(data) {
  const vals = {
    ...data,
    participant: data?.participant?.join(',') || null,
    endTime: dayjs(data.endTime).format('YYYY-MM-DD'),
    finishTime: dayjs(data.finishTime).format('YYYY-MM-DD'),
    startTime: dayjs(data.startTime).format('YYYY-MM-DD'),
  }
  return executeAndTryCatch(() => http.post('/monthPlan/modify', vals));
}

// 查询周计划修改历史
export function weekHistory(id) {
  return executeAndTryCatch(() => http.get('/weekPlan/history?weekPlanId=' + id).then(res => {
    return {
      ...res,
      data: res.data.map(o => {
        return {
          ...o,
          content: o.contentOld + '/' + o.contentNew,
        }
      })
    };
  }));
}

// 修改周计划
export function weekPlanEdit(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/modify', data));
}

// 完成月计划
export function completeMonthPlan(id) {
  return executeAndTryCatch(() => http.get('/monthPlan/finish?monthPlanId=' + id,));
}

// 周详情
export function weekPlanDetail(id) {
  return executeAndTryCatch(() => http.get('/weekPlan/detail?weekPlanId=' + id,));
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
export function exportDataOne(params = {}) {
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
  return executeAndTryCatch(() => http.get('/monthPlan/detail', {params: {monthPlanId: id}}));
}

export const workStatus2 = [
  {label: '未完成', value: 1},
  {label: '超时未完成', value: 2},
  {label: '已完成', value: 3},
  {label: '超时已完成', value: 4},
]


export const planMonths = Array.from({length: 12}).map((o, oIndex) => ({
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


// 修改密码
export function userUpdatePassword(formdata) {
  return executeAndTryCatch(() => http.post('/user/updatePassword', formdata));
}

// 删除月度计划
export function monthPlanDel(id) {
  return executeAndTryCatch(() => http.get('/monthPlan/delete?monthPlanId=' + id));

}

export const yesOrNoEnumValue = {
  1: {
    text: '是',
    status: 'Success',
  },
  0: {
    text: '否',
    status: 'Error',
  },
}

// 新建用户时，选择上级领导
export function getManagersOfStaff() {
  return executeAndTryCatch(() => http.get('/user/all'));

}

// 查询所管理的所有用户
export function getAllUsersWhoAreUnderManaged() {
  return executeAndTryCatch(() => http.get('/user/list'));
}

//important字段含义是是否重要事项，只需要传（是/否）
export const importantEnum = [
  {label: '是', value: '是'},
  {label: '否', value: '否'},
]

///api/monthPlan/checkList 工作计划检查页面--经理查询所管辖人员的月计划列表
export function apiWorkPlanCheckList(data) {
  return executeAndTryCatch(() => http.post('/monthPlan/checkList', {
        ...handlePagePostData({...data, userId: data.userId !== void 0 ? data.userId : null }),
      }
  ).then((res: any) => {
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

// 经理确认月度计划完成
//122.192.6.227:8010/api/monthPlan/finish?monthPlanId=2f12c46a0e664a89b7f19a02a562fb0b
export function apiFinishMonthPlan(monthPlanId) {
  return executeAndTryCatch(() => http.get('/monthPlan/finish?monthPlanId=' + monthPlanId));
}

//工作计划检查页面--经理检查月度计划编写情况
//122.192.6.227:8010/api/monthPlan/qualityCheck
// {
//     "monthPlanId": "2f12c46a0e664a89b7f19a02a562fb0b",
//     "quality": 1,
//     "comment": "计划完善，加分"
// }
export function apiQualityCheckMonthly(data) {
  return executeAndTryCatch(() => http.post('/monthPlan/qualityCheck', data));
}

// 122.192.6.227:8010/api/weekPlan/qualityCheck
export function apiQualityCheckWeekly(data) {
  return executeAndTryCatch(() => http.post('/weekPlan/qualityCheck', data));
}

// 122.192.6.227:8010/api/statistics/deptFirst
// 办公室统计页面--一级部门列表
export function apiDeptFirstList() {
  return executeAndTryCatch(() => http.get('/statistics/deptFirst'));
}

// 办公室统计页面--二级部门列表
// 122.192.6.227:8010/api/statistics/deptSecond?deptId=2
export function apiDeptSecondList(deptId) {
  return executeAndTryCatch(() => http.get('/statistics/deptSecond?deptId='+deptId));
}

//办公室统计页面--员工列表
//122.192.6.227:8010/api/statistics/employeeList
// {
//     "deptFirstId": 2,
//     "deptSecondId": null
// }
export function apiEmployeeList(data) {
  return executeAndTryCatch(() => http.post('/statistics/employeeList', data));
}

//122.192.6.227:8010/api/statistics/monthPlanList
// 办公室统计页面--查询月计划列表
// {
//     "deptFirstId": 1,
//     "deptSecondId": null,
//     "userId": 2,
//     "month": "",
//     "status": 0,
//     "currPage": 1,
//     "pageSize": 10
// }
export function apiStatisticsMonthPlanList(data) {
  return executeAndTryCatch(() => http.post('/statistics/monthPlanList', {
    ...handlePagePostData(data),
  }).then((res: any) => {
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

//122.192.6.227:8010/api/statistics/export
// 办公室统计页面--导出月计划
// {
//     "deptFirstId": 1,
//     "deptSecondId": null,
//     "userId": 2,
//     "month": "",
//     "status": 0,
//     "currPage": 1,
//     "pageSize": 10
// }
export function apiStatisticsExport(data) {
  return executeAndTryCatch(() => http.post('/statistics/export', data, {
    responseType: 'blob'
  }));
}


export const qualityEnum = [
  {label: '合格', value: 1, status: 'success'},
  {label: '不合格', value: 0, status: 'error'},
]