import styles from './work-plan.module.less';
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import MonthPlanModal from "./month-plan-modal.tsx";
import {
    arrayToMap, completeMonthPlan,
    deptList2,
    download,
    exportMonth,
    monthPlanList,
    planStatus,
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";

const {confirm} = Modal;

const getColumns = (navigate: any, {onAdd, onFinish, isPublisher}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'rowNumber',
        width: 11,
        hideInSearch: true,
        align: "center"
    },
    {
        title: '一级部门',
        dataIndex: 'deptFirstList',
        ellipsis: true,
        valueType: 'select',
        request: async () => {
            const {data} = await deptList2();
            return (data?.first).map(o => ({label: o.name, value: o.name}));
        },
        fieldProps: {
            mode: 'multiple'
        },
        hideInTable: true,
    },
    {
        title: '二级部门',
        dataIndex: 'deptSecondList',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        ellipsis: true,
        request: async () => {
            const {data} = await deptList2();
            return (data?.second).map(o => ({label: o.name, value: o.name}));
        },
        hideInTable: true,
    },
    {
        title: '一级部门',
        dataIndex: 'deptFirst',
        ellipsis: true,
        hideInSearch: true,
        width: 25,
        align: "center"
    },
    {
        title: '二级部门',
        dataIndex: 'deptSecond',
        ellipsis: true,
        hideInSearch: true,
        width: 25,
        align: "center"
    },
    {
        title: '工作名称',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true,
        width: 50,
        align: "center"
    },
    {
        title: '工作内容',
        dataIndex: 'content',
        ellipsis: true,
        hideInSearch: true,
        width: 30,
        align: "center"
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        ellipsis: true,
        hideInSearch: true,
        width: 25,
        align: "center"
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
        ellipsis: true,
        hideInSearch: true,
        width: 25,
        align: "center"
    },
    {
        title: '剩余时间',
        dataIndex: 'overTime',
        ellipsis: true,
        hideInSearch: true,
        width: 20,
        align: "center"
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
        ellipsis: true,
        hideInSearch: true,
        width: 25,
        align: "center"
    },
    {
        title: '责任人',
        dataIndex: 'executorName',
        ellipsis: true,
        hideInSearch: true,
        width: 15,
        align: "center"
    },
    // {
    //     title: '参与人',
    //     dataIndex: 'participant',
    //     ellipsis: true,
    //     hideInSearch: true,
    //     width: 30,
    //     align: "center"
    // },
    {
        title: '状态',
        dataIndex: 'planStatus',
        // ellipsis: true,
        request: () => {
            return planStatus;
        },
        hideInTable: true
    },
    {
        title: '状态',
        dataIndex: 'monthStatus',
        ellipsis: true,
        valueEnum: arrayToMap(planStatus),
        hideInSearch: true,
        width: 15,
        align: "center"
    },
    {
        title: '姓名',
        dataIndex: 'executorName',
        ellipsis: true,
        hideInTable: true
    },
    {
        title: '周计划员工确认',
        dataIndex: 'weekPlanEmployee',
        ellipsis: true,
        width: 29,
        hideInSearch: true,
        align: "center"
    },
    {
        title: '周计划经理确认',
        dataIndex: 'weekPlanLeader',
        ellipsis: true,
        width: 29,
        hideInSearch: true,
        align: "center"
    },
    {
        title: '周计划发布',
        dataIndex: 'weekPlanPublish',
        ellipsis: true,
        width: 29,
        hideInSearch: true,
        align: "center"
        // valueEnum: arrayToMap(yOrN)
    },
    {
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 40,
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    navigate('/work-plan/week-plan/' + record.id,
                       {
                            state: record
                        }
                    )
                }}
            >
                周计划
            </a>,
            <a
                onClick={() => {
                    onAdd('edit', record)
                }}
                key="view">
                编辑
            </a>,
            <a
                onClick={() => {
                    onFinish(record)
                }}
                key="finish">
                完成
            </a>
           ,
        ],
    },
];

const WorkPlan = () => {
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);

    const [modalVisible, setModalVisible] = useState(false);

    const [modalType, setModalType] = useState<string>('');

    const [params, setParams] = useState({});

    const [downloading, setDownloading] = useState(false);

    const [record, setRecord] = useState<any>();

    const isPublisher = myLocalstorage.get('role') === 'publisher';

    function onAdd(type: string, record?: any) {
        setModalVisible(true);
        setModalType(type);
        if (record) setRecord({...record});
    }

    function onFinish(record: any) {
        confirm({
            icon: null,
            title: <span className={styles.modalTitle}>确认要完成吗？</span>,
            closable: true,
            wrapClassName: styles.logoutModal,
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                await completeMonthPlan(record.id);
                actionRef.current?.reload();
                return true;
            },
        });
    }

    async function exportData() {
        if (downloading) return;
        setDownloading(true);
        const res = await exportMonth(params);
        setDownloading(false);
        download(res);
    }

    useEffect(() => {
        const isPublisher = myLocalstorage.get('role') === 'publisher';

        setCols(getColumns(navigate, {onAdd,onFinish, isPublisher}));
    }, []);
    return (
        <div className={styles.container}>
            <ProTable
                columns={cols}
                actionRef={actionRef}
                cardBordered
                request={async (params = {}, sort, filter) => {
                    setParams(params);
                    return monthPlanList(params);
                }}
                // scroll={{x: 2600}}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                    defaultColsNumber: 12,
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
                            if (!['', void 0, null].includes(results.planStatus)) {
                                results.planStatus = +results.planStatus
                            }
                            if (results.deptFirstList && !(results.deptFirstList instanceof Array)) {
                                results.deptFirstList = [results.deptFirstList]
                            }
                            if (results.deptSecondList && !(results.deptSecondList instanceof Array)) {
                                results.deptSecondList = [results.deptSecondList]
                            }
                            return results;
                        }
                        return results;
                    },
                    syncToInitialValues: false
                }}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                }}
                dateFormatter="string"
                headerTitle="每月计划列表"
                toolBarRender={() => [
                    <Button
                      key="button"
                      onClick={() => exportData()}
                      loading={downloading}
                    >
                        导出月度计划
                    </Button>,
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => onAdd('add')}
                        type="primary"
                        // disabled={!isPublisher}
                    >
                        新增
                    </Button>,
                ]}
            />
            <MonthPlanModal
              onSuccess={() => {
                  actionRef?.current?.reload();
              }}
              type={modalType} visible={modalVisible} setVisible={setModalVisible} isPublisher={isPublisher} record={record}/>
        </div>
    )
}

export default WorkPlan;