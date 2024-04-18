import styles from './work-plan-check.module.less';
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {ActionType, ProTable} from '@ant-design/pro-components';
import {Button, Input, message, Modal, Radio, Space, Tooltip, UploadProps} from "antd";
 import {
  apiWorkPlanCheckList, arrayToMap, auditEnum, getAllUsersWhoAreUnderManaged,


  planStatus,
  monthPlanStatus,
  apiCheckExport,
  download,
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
 import PlanCorrectionCol from "./plan-correction-col.tsx";
import useTableHeight from "../../hooks/useTableHeight.ts";

const {confirm} = Modal;

const getColumns = ( {onAction, isManager, navigate, values}: any): any => [
  {
    title: '序号',
    dataIndex: 'rowNumber',
    width: 50,
    hideInSearch: true,
    align: "center"
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    hideInSearch: true,
      width: 50,
    align: "center",
  },
  {
    title: '任务名称',
    dataIndex: 'title',
    hideInSearch: true,
    // width: 100,
    align: "center"
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    //
    hideInSearch: true,
    // width: 100,
    align: "center"
  },
  {
    title: '截止时间',
    dataIndex: 'endTime',
    //
    hideInSearch: true,
    // width: 100,
    align: "center"
  },
  {
    title: '完成时间',
    dataIndex: 'finishTime',
    //
    hideInSearch: true,
    // width: 100,
    align: "center"
  },
  {
    title: '超时',
    dataIndex: 'overTime',
    // ellipsis: true,
    hideInSearch: true,
    width: 50,
    align: "center"
  },
  {
    title: '工作描述',
    dataIndex: 'content',
    //
    hideInSearch: true,
    align: "center"
  },
  {
    title: '达成目标或量化指标',
    dataIndex: 'objective',
    //
    hideInSearch: true,
    align: "center"
  },
  {
    title: '完成措施或关键节点',
    dataIndex: 'milestone',
    //
    hideInSearch: true,
    align: "center"
  },
  {
    title: '完成情况',
    dataIndex: 'status',
    valueType: 'select',
    hideInSearch: true,
    valueEnum: arrayToMap(monthPlanStatus),
    request: () => {
      return monthPlanStatus;
    },
  },
  ...[
    // 搜索表单项
    {
      title: '姓名',
      dataIndex: 'userIdList',
      hideInSearch: false,
      hideInTable: true,
      valueType: 'select',
      fieldProps: {
        mode: 'multiple'
      },
      request: async () => {
        const res = await getAllUsersWhoAreUnderManaged()
        return (res?.data || []).map(o => ({label: o.name, value: o.id}));
      },
    },
    {
      title: '月计划状态',
      dataIndex: 'monthPlanStatus',
      valueType: 'select',
      hideInSearch: false,
      hideInTable: true,
      request: () => {
        return planStatus;
      },
      initialValue: 0
    },
    {
      title: '审核状态',
      dataIndex: 'checkStatus',
      valueType: 'select',
      hideInSearch: false,
      hideInTable: true,
      request: () => {
        return auditEnum;
      },
      initialValue: 0
    },
  ],
  {
    title: '合理性',
    valueType: 'option',
    fixed: 'right',
    width: 200,
    align: "center",
    render: (_, record,) => {
      return(
          <PlanCorrectionCol key='check' type='monthQuality' record={record} reload={() => onAction('reload')}/>

      )
    },
  },
  {
    title: '结果',
    valueType: 'option',
    fixed: 'right',
    width: 200,
    align: "center",
    render: (_, record,) => {
      return(
          <PlanCorrectionCol key='check2' type='monthResult' record={record} reload={() => onAction('reload')}/>
      )
    },
  },
];


const WorkPlanCheck = () => {


  const isManager = myLocalstorage.get('manager') === 1;
  const isAdmin = myLocalstorage.get('admin') === 1;

  if (!isManager) {
    throw Error('没有权限')
  }

  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [cols, setCols] = useState<any>([]);

  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);


  // const [users, setUsers] = useState<any>(null);
  const usersRef = useRef<any>();

  const [initialValues, setInitialValues] = useState({
    monthPlanStatus: 1,
    userIdList: [],
    checkStatus: 0
  });

  const paramsRef = useRef<any>();

  const {height, resize} = useTableHeight();

  useEffect(() => {
      resize();
  }, [cols]);

  async function onAction(type: string, record?: any) {
    if (type === 'reload') {
      actionRef.current.reload();
    }
    if (type === 'export') {
      // setLoading(true);
      const res = await apiCheckExport(paramsRef.current);
      // setLoading(false);
      download(res, `月计划表-${Date.now()}.xlsx`);
    }
  }


  function expandedRowRender(record) {
    return <ProTable
        columns={[
          { title: '周序号', dataIndex: 'weekIndex',
            align: "center"
          },
          {
            title: '开始时间',
            dataIndex: 'startTime',
            align: "center"
          },
          {
            title: '截止时间',
            dataIndex: 'endTime',
            align: "center"
          },
          {
            title: '完成时间',
            dataIndex: 'finishTime',
            align: "center",
          },
          {
            title: '工作内容',
            align: "center",
            dataIndex: 'content',
           },
          {
            title: '工作结果',
            align: "center",
            dataIndex: 'outcome',
           },
          {
            title: '问题和风险',
            align: "center",
            dataIndex: 'problem',
           },
          {
            title: '合理性',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            valueType: 'option',
            align: "center",
            render: (_, record) => (
                <PlanCorrectionCol key='checkk' type='weekQuality' record={record} reload={() => onAction('reload')}/>

            ),
          },
          {
            title: '结果',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            valueType: 'option',
            align: "center",
            render: (_, record) => (
                <PlanCorrectionCol key='checkk2' type='weekResult' record={record} reload={() => onAction('reload')}/>

            ),
          },
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={record?.weekPlanList || []}
        pagination={false}
        rowKey='id'
    />
  }

  async function allUsersWhoAreUnderManaged() {
     const res = await getAllUsersWhoAreUnderManaged();
    // if (res.data.length) {
    //   formRef.current.setFieldsValue({userIdList: [res.data?.[0].id] || []})
    //   setInitialValues(pre => ({...pre, userIdList: [res.data?.[0].id] || []}))
    // } else {
    //   // setInitialValues({userId: null, status: 0})
    // }
    usersRef.current = (res?.data || []).map(o => ({label: o.name, value: o.id}));
    // actionRef.current.reload();
  }

    function onExpand(bool, record) {
      if (bool) {
          setExpandedRowKeys([record.id]);
      } else {
          setExpandedRowKeys([]);
      }
    }



  useEffect(() => {
    allUsersWhoAreUnderManaged();
    setCols(getColumns({navigate, onAction, isManager}));
  }, []);

  useEffect(() => {
    actionRef.current.reload();
  }, [initialValues])



  return (
      <div className={styles.container}>
        <ProTable
            columns={cols.map(col => ({
              ...col,
              title: (
                  <Tooltip title={col.title} placement='topLeft'>
                    {col.title}
                  </Tooltip>
              )
            }))}
            scroll={{y: height}}
            actionRef={actionRef}
            formRef={formRef}
            cardBordered
            request={async (params = {}, sort, filter) => {
              const postData = {
                ...params,
                userIdList: params?.userIdList?.length ? params.userIdList : initialValues.userIdList
              };
              paramsRef.current = postData;
              // setParams(postData)
              // console.log('postData===>', postData);
               return apiWorkPlanCheckList(postData);
               // return apiWorkPlanCheckList(params);
            }}
            // params={params}
            // manualRequest={true}
            rowKey="id"
            search={{
              // span: 6,
              // labelWidth: 'auto',
              defaultColsNumber: 4,
              // searchGutter: 24

            }}
            options={{
              setting: false,
              density: false,
            }}
            form={{
              // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
              syncToUrl: async (values, type) => {
                const results: any = values
                if (type === 'get') {
                  if (!['', void 0, null].includes(results.monthPlanStatus)) {
                    results.monthPlanStatus = +results.monthPlanStatus
                  } else {
                    results.monthPlanStatus = 1
                  }
                  if (!['', void 0, null].includes(results.checkStatus)) {
                    results.checkStatus = +results.checkStatus
                  } else {
                    results.checkStatus = 0
                  }
                  if (results.userIdList) {
                    try {
                      results.userIdList = JSON.parse(results.userIdList)
                    } catch (e) {
                      delete results.userIdList
                    }
                  }
                } else {
                  results.userIdList = JSON.stringify(results.userIdList || []);
                }
                return results;
              },
              initialValues: initialValues,
              syncToInitialValues: true,
            }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50],
            }}
            dateFormatter="string"
            toolbar={{
              title: '每月计划列表'
            }}
            toolBarRender={() => [
              <Button
                  key="button"
                  onClick={() => onAction('export')}
              >
                导出工作计划表
              </Button>,
            ]}
            expandable={{
                expandedRowRender,
                expandRowByClick: true,
                onExpand,
                expandedRowKeys
            }}
        />
      </div>
  )
}

export default WorkPlanCheck;