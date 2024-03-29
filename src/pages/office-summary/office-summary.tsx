import styles from './office-summary.module.less';
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProTable} from '@ant-design/pro-components';
import {Button, Modal, Tooltip} from "antd";
import {
  apiDeptFirstList,
  apiDeptSecondList, apiEmployeeList, apiMonthPlanMylist,
  apiStatisticsExport,
  apiStatisticsMonthPlanList,
  arrayToMap,
  download,
  planStatus,
  qualityEnum, resultEnum,
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import localstorage from "../../utils/localstorage.ts";


const {confirm} = Modal;

const getColumns = ({isSelfCheckPage}: any): any => [
  {
    title: '序号',
    dataIndex: 'rowNumber',
    width: 60,
    hideInSearch: true,
    align: "center"
  },
  ...isSelfCheckPage ? [] : [{
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
    }]
  ,
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
    ...isSelfCheckPage ? [
      {
        title: '合理性',
        dataIndex: 'quality',
        valueEnum: arrayToMap(qualityEnum),
        hideInSearch: true,

        align: "center"
      },
      {
        title: '合理性批注',
        dataIndex: 'qualityComment',
        hideInSearch: true,
        align: "center"
      },
      {
        title: '结果',
        dataIndex: 'result',
        valueEnum: arrayToMap(resultEnum),
        hideInSearch: true,
        align: "center"
      },
      {
        title: '结果批注',
        dataIndex: 'resultComment',
        hideInSearch: true,
        align: "center"
      },
    ] : [
      {
        title: '计划批改情况',
        dataIndex: 'result',
        valueEnum: arrayToMap(resultEnum),
        hideInSearch: true,

        align: "center"
      },
      {
        title: '批注',
        valueType: 'text',
        dataIndex: 'comment',
        hideInSearch: true,
        align: "center"

      },
    ],
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
    ...(isSelfCheckPage ? [] : [
      {
        title: '一级部门',
        dataIndex: 'deptFirstId',
        hideInSearch: false,
        hideInTable: true,
        request: async () => {
          const res = await apiDeptFirstList();
          return res.data.map(o => ({label: o.name, value: o.id}))
        },
      },
      {
        title: '二级部门',
        dataIndex: 'deptSecondId',
        hideInSearch: false,
        hideInTable: true,
        dependencies: ['deptFirstId'],
        request: async ({deptFirstId}) => {
          if (deptFirstId === void 0) return [];
          const res = await apiDeptSecondList(deptFirstId);
          return res.data.map(o => ({label: o.name, value: o.id}))
        },
      },

      {
        title: '姓名',
        dataIndex: 'userIdList',
        hideInSearch: false,
        hideInTable: true,
        valueType: 'select',
        fieldProps: {
          mode: 'multiple'
        },
        dependencies: ['deptSecondId', 'deptFirstId'],
        request: async ({deptSecondId, deptFirstId}) => {
          if ([null, void 0, ''].includes(deptFirstId)) return [];
          const res = await apiEmployeeList({
            deptSecondId: [null, void 0, ''].includes(deptSecondId) ? null : deptSecondId,
            deptFirstId
          })
          return (res?.data || []).map(o => ({label: o.name, value: o.id}));
        },
      },
      {
        title: '月份选择',
        valueType: 'dateMonth',
        dataIndex: 'month',
        hideInSearch: false,
        hideInTable: true,
        initialValue: null
        // request: () => planMonths
      },
    ])

  ],

].filter(o => o);


const OfficeSummary = (props: any) => {

  const {type} = props;

  const isSelfCheckPage = type === 'self-check'; // 检查结果页面

  const isManager = myLocalstorage.get('manager') === 1;
  const isAdmin = myLocalstorage.get('admin') === 1;
  if (!isAdmin && !isSelfCheckPage) {
    throw Error('没有权限')
  }

  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<any>();
  const [cols, setCols] = useState<any>([]);

  const [downloading, setDownloading] = useState(false);

  const [loading, setLoading] = useState(false)


  const paramsRef = useRef<any>();

  async function onAction(type: string, record?: any) {

    if (type === 'export') {
      setLoading(true);
      const res = await apiStatisticsExport(paramsRef.current);
      setLoading(false);
      download(res, `办公室统计-${paramsRef.current.month || ''}月计划表-${Date.now()}.xlsx`);
    }
  }


  function expandedRowRender(record) {
    return <ProTable
        columns={[
          {
            title: '周序号', dataIndex: 'weekIndex',
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
          ...isSelfCheckPage ? [
            {
              title: '合理性',
              dataIndex: 'quality',
              valueEnum: arrayToMap(qualityEnum),
              hideInSearch: true,

              align: "center"
            },
            {
              title: '合理性批注',
              dataIndex: 'qualityComment',
              hideInSearch: true,
              align: "center"
            },
            {
              title: '结果',
              dataIndex: 'result',
              valueEnum: arrayToMap(resultEnum),
              hideInSearch: true,
              align: "center"
            },
            {
              title: '结果批注',
              dataIndex: 'resultComment',
              hideInSearch: true,
              align: "center"
            },
          ] : [
            {
              title: '计划批改情况',
              dataIndex: 'result',
              valueEnum: arrayToMap(resultEnum),
              hideInSearch: true,
              align: "center"
            },
            {
              title: '批注',
              valueType: 'text',
              dataIndex: 'comment',
              hideInSearch: true,
              align: "center"

            },
          ] as any,
        ]}
        headerTitle={false}
        search={false}
        options={false}
        dataSource={record?.weekPlanList || []}
        pagination={false}
    />
  }


  useEffect(() => {
    setCols(getColumns({onAction, isManager, isSelfCheckPage}));
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
              const postData = {...params};
              let api = apiStatisticsMonthPlanList
              if (isSelfCheckPage) {
                postData.useId = localstorage.get('id');
                api = apiMonthPlanMylist
              }
              paramsRef.current = postData;
              return api(postData);
            }}
            // scroll={{x: 2600}}
            rowKey="id"
            search={{
              // span: 6,
              // labelWidth: 'auto',
              defaultColsNumber: 4,
              // searchGutter: 24
              // filterType: 'light'
            }}
            options={{
              setting: false,
              density: false
            }}
            form={{
              // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
              syncToUrl: (values, type) => {
                const results: any = values
                if (type === 'get') {
                  if (!['', void 0, null].includes(results.status)) {
                    results.status = +results.status
                  } else {
                    results.status = 0
                  }
                  return results;
                }
                return results;
              },
              // initialValues: {status: 0},
              syncToInitialValues: true,
              onValuesChange: (changedValues, values) => {
                console.log('changedValues, values', changedValues, values);
                if ('deptFirstId' in changedValues || !('deptFirstId' in values)) {
                  formRef.current.setFieldsValue({
                    deptSecondId: null,
                    // userIdList: []
                  })
                }
                if ('deptSecondId' in changedValues || !('deptSecondId' in values)) {
                  formRef.current.setFieldsValue({
                    // userIdList: []
                  })
                }
              },
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
              !isSelfCheckPage && <Button
                  key="button"
                  onClick={() => onAction('export')}
              >
                  导出月计划表
              </Button>,
            ]}
            expandable={{expandedRowRender, expandRowByClick: true}}
        />
      </div>
  )
}

export default OfficeSummary;