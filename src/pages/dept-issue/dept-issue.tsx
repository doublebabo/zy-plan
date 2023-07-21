import styles from './dept-issue.module.less';
import React, {useEffect, useRef} from "react";
import {ActionType, ProTable} from "@ant-design/pro-components";
import {Button, Tabs} from "antd";
import {
    getDeptFirst,
    getDeptSecond,
    issueEndList,
    issueStartList,
    workStatus
} from "../../services";

const getIssuesToSolveCols = () => [
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
    },
    {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
        hideInSearch: true,
    },
    {
        title: '问题反馈人员一级部门',
        dataIndex: 'startDeptFirst',
        hideInSearch: true,
    },
    {
        title: '问题反馈人员二级部门',
        dataIndex: 'startDeptSecond',
        hideInSearch: true,
    },
    {
        title: '问题反馈人员',
        dataIndex: 'startPerson',
        hideInSearch: true,
    },
    {
        title: '跨部门问题描述',
        dataIndex: 'description',
        hideInSearch: true,
    },
    {
        title: '协商时间',
        dataIndex: 'expectTime',
        hideInSearch: true,
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
        hideInSearch: true,
    },
    {
        title: '超时时间',
        dataIndex: 'overTime',
        hideInSearch: true,
    },
    {
        title: '责任部门',
        dataIndex: 'endDept',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        hideInSearch: true,
    },
    {
        title: '责任人',
        dataIndex: 'endPerson',
        hideInSearch: true,
    },
    {
        hideInSearch: true,
        title: '问题解决状态',
        dataIndex: 'status',
    },
    {
        title: '问题确认',
        valueType: 'option',
        fixed: 'right',
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    // onShowModal('edit', record)
                }}
            >
                <span>编辑</span>
            </a>,
            <a target="_blank" rel="noopener noreferrer" key="view">
                删除
            </a>,
        ],
    },
];


export default function DeptIssue() {

    const actionRef = useRef<ActionType>();

    const cols1: any = getIssuesToSolveCols();
    const cols2: any = getIssuesToSolveCols();


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
                    showQuickJumper: true,
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
                    <Button key="out" type='primary'>
                        新增
                    </Button>,
                ]}
            />
        )
    }

    function tableTwo() {
        return (
            <ProTable
                cardBordered
                columns={cols1}
                actionRef={actionRef}
                request={(params, sorter, filter) => {
                    // 表单搜索项会从 params 传入，传递给后端接口。
                    return issueStartList(params);
                }}
                rowKey="id"
                pagination={{
                    showQuickJumper: true,
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

            />
        )
    }

    const tabItems = [
        {key: '1', label: '需解决跨部门问题事项', children: tableOne()},
        {key: '2', label: '提出跨部门问题事项', children: tableTwo()}
    ]

    return (
        <div className={styles.container}>
            <Tabs items={tabItems} type="card"></Tabs>
        </div>
    )
};