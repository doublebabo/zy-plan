import styles from './dept-issue.module.less';
import React, {useRef, useState} from "react";
import {
    ActionType,
    BetaSchemaForm,
    ModalForm, ProFormDatePicker,
    ProFormInstance, ProFormSelect,
    ProFormTextArea,
    ProTable
} from "@ant-design/pro-components";
import {Button, Modal, Tabs} from "antd";
import {
    download, exportDataOne, exportDataTwo,
    exportMonth,
    getBlameList,
    getDeptFirst,
    getDeptSecond, issueAdd, issueEndClose, issueEndConfirm, issueEndEmployeeFinish, issueEndLeaderFinish,
    issueEndList,
    issueStartList, startClose, startConfirm,
    workStatus
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";


const {confirm} = Modal;

const commonCols = [
    {
        hideInTable: true,
        title: '一级部门',
        dataIndex: 'startDeptFirstList',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        request: async () => {
            const {data = []} = await getDeptFirst();
            return data.map(o => ({label: o.name, value: o.id}));
        },
    },
    {
        hideInTable: true,
        title: '二级部门',
        dataIndex: 'startDeptSecondList',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        dependencies: ['startDeptFirstList'],
        request: async ({startDeptFirstList = []}) => {
            const {data = []} = await getDeptSecond(startDeptFirstList);
            return data.map(o => ({label: o.name, value: o.id}));
        },
    },
    {
        hideInTable: true,
        title: '责任部门',
        dataIndex: 'endDeptList',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        request: async () => {
            const {data = []} = await getDeptFirst();
            return data.map(o => ({label: o.name, value: o.id}));
        },
    },
    {
        hideInTable: true,
        title: '工作完成状态',
        dataIndex: 'issueStatus',
        // hideInSearch: true,
        valueType: 'select',
        // fieldProps: {
        //     mode: 'multiple'
        // },
        request: async () => {
            return Promise.resolve(workStatus)
        },
    },
    {
        dataIndex: 'id',
        hideInTable: true,
        hideInSearch: true,
        valueType: 'digital'
    },
    {
        title: '序号',
        dataIndex: 'rowNumber',
        // valueType: 'index',
        hideInSearch: true,
        width: 50,
        align: "center",
    },
    {
        title: '一级部门',
        dataIndex: 'startDeptFirst',
        hideInSearch: true,
        width: 100,
        align: "center",
    },
    {
        title: '二级部门',
        dataIndex: 'startDeptSecond',
        hideInSearch: true,
        width: 100,
        align: "center",
    },
    {
        title: '反馈人员',
        dataIndex: 'startPerson',
        hideInSearch: true,
        width: 80,
        align: "center",
    },
    {
        title: '跨部门问题描述',
        dataIndex: 'description',
        hideInSearch: true,
        // width: 500,
        align: "center",
    },
    {
        title: '协商时间',
        dataIndex: 'expectTime',
        hideInSearch: true,
        width: 100,
        align: "center",
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
        hideInSearch: true,
        width: 100,
        align: "center",
    },
    {
        title: '剩余时间',
        dataIndex: 'overTime',
        hideInSearch: true,
        width: 80,
        align: "center",
    },
    {
        title: '责任部门',
        dataIndex: 'endDept',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        hideInSearch: true,
        width: 100,
        align: "center",
    },
    {
        title: '责任人',
        dataIndex: 'endPerson',
        hideInSearch: true,
        width: 80,
        align: "center",
    },
    {
        hideInSearch: true,
        title: '解决状态',
        dataIndex: 'statusStr',
        width: 80,
        align: "center",
    },
]


const employeeTable1Cols = ({isPublisher, onConfirm, onFinish, onDoneOk}) => [
    ...commonCols,
    // {
    //     title: '是否确认完成时间',
    //     hideInSearch: true,
    //     align: "center",
    // },
    {
        title: '操作',
        valueType: 'option',
        // fixed: 'right',
        hideInSearch: true,
        width: 100,
        align: "center",
        render: (text, record, _, action) => [
            record.status === '4' && <a target="_blank" key="view"
                                                       onClick={() => {
                                                           onDoneOk(record);
                                                       }}
            >
                确认完成
            </a>,
        ],
    },
]

const employeeTable2Cols = ({isPublisher, onConfirm, onFinish, onDoneOk}) => [
    ...commonCols,
]

const leaderTable1Cols = ({isPublisher, onConfirm, onFinish, onDoneOk}) => [
    ...commonCols,
    {
        title: '操作',
        valueType: 'option',
        // fixed: 'right',
        hideInSearch: true,
        width: 150,
        align: "center",
        render: (text, record, _, action) => [
            isPublisher && (record.status === '2' || record.status === '0') && <a
                key="editable"
                target="_blank"
                onClick={() => {
                    onConfirm(record);
                }}
            >
                <span>问题确认</span>
            </a>,
            isPublisher && (record.status === '2' || record.status === '0') && <a target="_blank" key="view"
                                                            onClick={() => {
                                                                onFinish(record);
                                                            }}
            >
                问题结束
            </a>,
            isPublisher && record.status === '5' && <a target="_blank" key="view"
                                                       onClick={() => {
                                                           onDoneOk(record);
                                                       }}
            >
                确认完成
            </a>,
        ],
    },
];

const leaderTable2Cols = ({isPublisher, onConfirm, onFinish, onDoneOk}) => [
    ...commonCols,
    {
        title: '操作',
        valueType: 'option',
        fixed: 'right',
        hideInSearch: true,
        width: 150,
        align: 'center',
        render: (text, record, _, action) => [
            isPublisher && (record.status === '2' || record.status === '0') && <a
                key="editable"
                target="_blank"
                onClick={() => {
                    onConfirm(record);
                }}
            >
                <span>问题确认</span>
            </a>,
            isPublisher && (record.status === '2' || record.status === '0') && <a target="_blank" key="view"
                                                            onClick={() => {
                                                                onFinish(record);
                                                            }}
            >
                问题结束
            </a>,
        ],
    },
]

//


const addCols: any = [
    {
        title: '问题描述',
        dataIndex: 'description',
        valueType: 'textarea',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },

    },
    {
        title: '责任部门',
        dataIndex: 'endDept',
        valueType: 'select',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        request: async () => {
            const {data = []} = await getDeptFirst();
            return data.map(o => ({label: o.name, value: o.name}));
        },
    },
]


const finishCols = [
    {
        title: '问题直接结束说明',
        dataIndex: 'closeComment',
        valueType: 'textarea',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },
]


export default function DeptIssue() {

    const actionRef = useRef<ActionType>();

    const [addFormRef, confirmFormRef, finishFormRef] = [useRef<ProFormInstance>(),useRef<ProFormInstance>(),useRef<ProFormInstance>()];

    const [addVisible, setAddVisible] = useState(false);

    const [confirmVisible, setConfirmVisible] = useState(false);

    const [finishVisible, setFinishVisible] = useState(false);

    const [activeKey, setActiveKey] = useState<any>('1');

    const currentRowRef: any = useRef();

    const [loading, setLoading] = useState(false);


    async function onAddOk(values: any) {
        const res = await issueAdd(values);
        if (res.success) {
            setAddVisible(false);
            actionRef.current?.reload();
        }
        return true;
    }

    async function onConfirmOk(values: any) {
        //  activeKey = 1 调用对方部门接口
        //  2 调用本部接口
        let request: any = null;
        if (activeKey === '1') {
            request = issueEndConfirm;
        } else if (activeKey === '2') {
            request = startConfirm;
        }
        const [endPersonId, endPerson] = values?.endPersonId?.split?.('#') || [];
        const res = await request?.({...values, issueId: currentRowRef.current.id, endPersonId, endPerson});
        if (res.success) {
            setConfirmVisible(false);
            actionRef.current?.reload();
        }
        return true;
    }


    async function onFinishOk(values: any) {
        let request: any = null;
        if (activeKey === '1') {
            request = issueEndClose;
        } else if (activeKey === '2') {
            request = startClose;
        }
        const res = await request?.({...values, issueId: currentRowRef.current?.id});
        if (res.success) {
            setFinishVisible(false);
            actionRef.current?.reload();
        }
        return true;
    }

    async function onDoneOk(record: any) {
        confirm({
            title: '确认要完成吗？',
            closable: true,
            okText: '确定',
            cancelText: '取消',
            okButtonProps: {loading: loading},
            async onOk() {
                let request: any = null;
                if (isPublisher) {
                    request = issueEndLeaderFinish;
                } else {
                    request = issueEndEmployeeFinish;
                }
                setLoading(true);
                const res = await request?.(record.id);
                setLoading(false);
                if (res.success) {
                    actionRef.current?.reload();
                }
                return true;
            }
        });

    }




    async function onConfirm(record) {
        await setConfirmVisible(true);
        confirmFormRef.current?.resetFields();
        confirmFormRef.current?.setFieldsValue({
            ...record,
            expectTime: record.expectTime || null,
            endPersonId: record.endPersonId && record.endPerson && record.endPersonId + '#' + record.endPerson || null,
        })
        currentRowRef.current = record;
    }

    function onFinish(record) {
        setFinishVisible(true);
        finishFormRef.current?.resetFields();
        finishFormRef.current?.setFieldsValue(record)
        currentRowRef.current = record;
    }

    async function exportDataTableOne() {
        // todo
        if (loading) return;
        setLoading(true);
        const res = await exportDataOne({});
        setLoading(false);
        download(res);
    }

    async function exportDataTableTwo() {
        // todo
        if (loading) return;
        setLoading(true);
        const res = await exportDataTwo({});
        setLoading(false);
        download(res);
    }


    // 领导
    const isPublisher = myLocalstorage.get('role') === 'publisher';

    let cols1: any = [];
    let cols2: any = [];
    if (isPublisher) {
        cols1 = leaderTable1Cols({isPublisher, onConfirm, onFinish, onDoneOk})
        cols2 = leaderTable2Cols({isPublisher, onConfirm, onFinish, onDoneOk})
    } else {
        cols1 = employeeTable1Cols({isPublisher, onConfirm, onFinish, onDoneOk});
        cols2 = employeeTable2Cols({isPublisher, onConfirm, onFinish, onDoneOk});
    }

    function tableOne() {
        return (
            <ProTable
                cardBordered
                columns={cols1}
                actionRef={actionRef}
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    return issueEndList(params);
                }}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                }}
                search={{
                    labelWidth: 'auto',
                    defaultColsNumber: 12,
                }}
                options={{
                    setting: false,
                    density: false
                }}
                toolBarRender={() => [
                    <Button
                        key="button"
                        onClick={() => exportDataTableOne()}
                        loading={loading}
                    >
                        导出部门问题表
                    </Button>
                ]}
                dateFormatter="string"
            />
        )
    }

    function tableTwo() {
        return (
            <ProTable
                cardBordered
                columns={cols2}
                actionRef={actionRef}
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    return issueStartList(params);
                }}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                }}
                search={{
                    labelWidth: 'auto',
                    defaultColsNumber: 12,
                }}
                options={{
                    setting: false,
                    density: false
                }}
                dateFormatter="string"
                toolBarRender={() => [
                    <Button key="out" type='primary' onClick={() => {
                        addFormRef.current?.resetFields();
                        setAddVisible(true)
                    }}>
                        新增
                    </Button>,
                    <Button
                        key="button"
                        onClick={() => exportDataTableTwo()}
                        loading={loading}
                    >
                        导出部门问题表
                    </Button>
                ]}
            />
        )
    }

    const tabItems = [
        {key: '1', label: '责任部门问题事项', children: tableOne()},
        {key: '2', label: '发起部门问题事项', children: tableTwo()}
    ]

    return (
        <div className={styles.container}>
            <Tabs items={tabItems} type="card" destroyInactiveTabPane={true} activeKey={activeKey}
                  onChange={(k) => setActiveKey(k)}></Tabs>
            <BetaSchemaForm
                open={addVisible}
                layoutType='ModalForm'
                title='新增跨部门问题'
                onFinish={onAddOk}
                formRef={addFormRef}
                modalProps={{
                    maskClosable: false,
                    onCancel: () => setAddVisible(false),
                }}
                columns={addCols}
            />

            <ModalForm
                open={confirmVisible}
                title={activeKey === '1' ? '部门问题确认' : '部门问题确认'}
                onFinish={onConfirmOk}
                formRef={confirmFormRef}
                modalProps={{
                    maskClosable: false,
                    onCancel: () => setConfirmVisible(false)
                }}
            >
                <ProFormTextArea
                    name="description"
                    label="问题描述"
                    disabled={true}
                />
                <ProFormSelect
                    name='endDept'
                    label="责任部门"
                    disabled={activeKey === '1'}
                    request={async () => {
                        const {data = []} = await getDeptFirst();
                        return data.map(o => ({label: o.name, value: o.id}));
                    }}
                >
                </ProFormSelect>
                <ProFormSelect
                    name='endPersonId'
                    label="责任人"
                    required={true}
                    rules={[
                        {
                            required: activeKey !== '2',
                            message: '此项为必填项',
                        },
                    ]}
                    disabled={activeKey === '2'}
                    request={async () => {
                        const {data = []} = await getBlameList();
                        return data.map(o => ({label: o.nickName, value: o.id + '#' + o.nickName}));
                    }}
                >
                </ProFormSelect>
                <ProFormDatePicker
                    name='expectTime'
                    label="协商时间"
                    required={true}
                    rules={[
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ]}
                    width='100%'
                    dataFormat={'YYYY-MM-DD'}
                >
                </ProFormDatePicker>

            </ModalForm>

            {/* 问题结束*/}
            <BetaSchemaForm
                open={finishVisible}
                layoutType='ModalForm'
                title='问题结束'
                onFinish={onFinishOk}
                formRef={finishFormRef}
                modalProps={{
                    maskClosable: false,
                    onCancel: () => setFinishVisible(false),
                }}
                columns={finishCols}
            />
        </div>
    );
};