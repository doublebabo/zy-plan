import styles from './week-plan.module.less';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProColumns, ProDescriptions, ProTable} from '@ant-design/pro-components';
import {Button, Dropdown} from "antd";
import {EllipsisOutlined, PlusOutlined} from "@ant-design/icons";
import request from 'umi-request';
import WorkDetailModal from "./work-detail-modal.tsx";
import ConfirmModal from "./confirm-modal.tsx";

export const waitTimePromise = async (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const waitTime = async (time: number = 100) => {
    await waitTimePromise(time);
};

const getColumns = (navigate: any, {onWeekPlan, onConfirm}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index'
    },
    {
        title: '工作名称',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '工作内容',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '截止时间',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '完成时间',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '计划完成状态',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 140,
        render: (text, record, _, action) => {

            return [
                <a
                    key="editable"
                    onClick={() => {
                        onConfirm('staff',record);
                    }}
                >
                    结果确认
                </a>,
                <a href={record.url} target="_blank" rel="noopener noreferrer" key="view"   onClick={() => {
                    onWeekPlan('edit',record);
                }}>
                    编辑
                </a>,
            ]
        },
    },
];

const descCols = [
    {
        title: '一级部门',
        dataIndex: 'id',
    },
    {
        title: '二级部门',
        dataIndex: 'id',
    },
    {
        title: '工作名称',
        dataIndex: 'id',
        span:2
    },
    {
        title: '工作内容',
        dataIndex: 'id',
        span: 2
    },
    {
        title: '开始时间',
        dataIndex: 'id',
    },
    {
        title: '截止时间',
        dataIndex: 'id',
    },
    {
        title: '完成状态',
        dataIndex: 'id',
    },
    {
        title: '责任人',
        dataIndex: 'id',
    },
    {
        title: '参与人',
        dataIndex: 'id',
    },
]

const WeekPlan = () => {
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);

    const [addModalVisible, setAddModalVisible] = useState(false);

    const [workDetailType, setWorkDetailType] = useState<string>('');

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    const [confirmType, setConfirmType] = useState<string>('');

    function onWeekPlan(type: string,record?: any) {
        setAddModalVisible(true);
        setWorkDetailType(type);
    }

    function onConfirm(type: string, record?: any) {
        setConfirmModalVisible(true);
        setConfirmType(type);
    }

    useEffect(() => {
        setCols(getColumns(navigate, {onWeekPlan, onConfirm}));
    }, []);
    return (
        <div className={styles.container}>
            <ProDescriptions
                column={2}
                columns={descCols}
                title="月计划详情"
                className={styles.desc}
            />
            <ProTable
                columns={cols}
                actionRef={actionRef}
                cardBordered
                request={async (params = {}, sort, filter) => {
                    console.log(sort, filter);
                    await waitTime(2000);
                    return request<{
                        data: any[];
                    }>('https://proapi.azurewebsites.net/github/issues', {
                        params,
                    });
                }}
                rowKey="id"
                search={false}
                options={{
                    setting: false,
                    density: false,
                    reload: false
                }}
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                    onChange: (page) => console.log(page),
                }}
                dateFormatter="string"
                headerTitle="每月周计划列表"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => onWeekPlan('add')}
                        type="primary"
                    >
                        新增
                    </Button>,
                ]}
            />
            <WorkDetailModal visible={addModalVisible} type={workDetailType} setVisible={setAddModalVisible}/>
            <ConfirmModal visible={confirmModalVisible} type={confirmType} setVisible={setConfirmModalVisible} />
        </div>
    )
}

export default WeekPlan;