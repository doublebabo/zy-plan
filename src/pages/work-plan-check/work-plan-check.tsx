import styles from './work-plan-check.module.less';
import React, {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {ActionType, ProTable} from '@ant-design/pro-components';
import {Button, Input, message, Modal, Radio, Space, Tooltip, UploadProps} from "antd";
 import {
  apiFinishMonthPlan,
  apiWorkPlanCheckList, arrayToMap, getAllUsersWhoAreUnderManaged,


  planStatus,
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
 import PlanCorrectionCol from "./plan-correction-col.tsx";

const {confirm} = Modal;

const getColumns = ( {onAction, isManager, navigate, values}: any): any => [
  {
    title: '序号',
    dataIndex: 'rowNumber',
    width: 60,
    hideInSearch: true,
    align: "center"
  },
  {
    title: '一级部门',
    dataIndex: 'firstDeptName',
    hideInSearch: true,
    // width: 100,
    align: "center",
  },
  {
    title: '二级部门',
    dataIndex: 'secondDeptName',
    hideInSearch: true,
    // width: 100,
    align: "center",
  },
  {
    title: '姓名',
    dataIndex: 'userName',
    hideInSearch: true,
    // width: 100,
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
    valueEnum: arrayToMap(planStatus),
    request: () => {
      return planStatus;
    },
  },
  ...[
    // 搜索表单项
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      hideInSearch: false,
      hideInTable: true,
      request: () => {
        return planStatus;
      },
      initialValue: 0
    },
    {
      title: '姓名',
      dataIndex: 'userId',
      hideInSearch: false,
      hideInTable: true,
      request: async () => {
        const res = await getAllUsersWhoAreUnderManaged()
        return (res?.data || []).map(o => ({label: o.name, value: o.id}));
      },
    },
  ],
  {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    width: 60,
    render: (_, record,) => [

      <Button
          size='small'
          type='primary'
          disabled={record.status === 1}
          onClick={() => {
            onAction('complete', record)
          }}
          key="view">
        完成
      </Button>,
    ],
  },
  {
    title: '计划批改情况',
    valueType: 'option',
    fixed: 'right',
    // width: 200,
    render: (_, record,) => {
      return <PlanCorrectionCol record={record} reload={() => onAction('reload')}/>
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


  // const [users, setUsers] = useState<any>(null);
  const usersRef = useRef<any>();

  const [initialValues, setInitialValues] = useState({
    status: 0,
    userId: null
  });

  function onAction(type: string, record?: any) {

    if (type === 'complete') {
      Modal.confirm({
        title: '是否确定完成？',
        onOk: async () => {
           const res = await apiFinishMonthPlan(record.id);
          actionRef.current.reload();
         }
      })
    }
    else if (type === 'reload') {
      actionRef.current.reload();
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
            title: '计划批改情况',
            dataIndex: 'operation',
            key: 'operation',
            width: 200,
            valueType: 'option',
            render: (_, record) => <PlanCorrectionCol type='weekPlanId' record={record} reload={() => onAction('reload')}/>,
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
    if (res.data.length) {
      formRef.current.setFieldsValue({userId: res.data?.[0].id, status: 0})
      setInitialValues({userId: res.data?.[0].id, status: 0})
    }
    usersRef.current = (res?.data || []).map(o => ({label: o.name, value: o.id}));
    // actionRef.current.reload();
  }



  useEffect(() => {
    allUsersWhoAreUnderManaged();
    setCols(getColumns({navigate, onAction, isManager}));
  }, []);



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
            actionRef={actionRef}
            formRef={formRef}
            cardBordered
            request={async (params = {}, sort, filter) => {
              const postData = {...params, userId: ![null, void 0, ''].includes(params.userId) ? params.userId: usersRef.current?.[0]?.value || null}
              // setParams(postData)
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
                  if (!['', void 0, null].includes(results.status)) {
                    results.status = +results.status
                  } else {
                    results.status = 0
                  }
                  if (!['', void 0, null].includes(results.userId)) {
                    results.userId = +results.userId
                  }
                  return results;
                }
                return results;
              },
              initialValues: initialValues,
            }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50],
            }}
            dateFormatter="string"
            toolbar={{
              title: '每月计划列表'
            }}
            // toolBarRender={() => [
            //   <Button
            //       key="button"
            //       onClick={() => onAction('export')}
            //   >
            //     导出工作计划表
            //   </Button>,
            // ]}
            expandable={{ expandedRowRender, expandRowByClick: true }}
        />
      </div>
  )
}

export default WorkPlanCheck;