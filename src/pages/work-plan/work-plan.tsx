import styles from './work-plan.module.less';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import request from 'umi-request';
import MonthPlanModal from "./month-plan-modal.tsx";

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

const getColumns = (navigate: any, {onAdd}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index'
    },
    {
        title: '一级部门',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '二级部门',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '工作名称',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '工作内容',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '开始时间',
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
        title: '超时时间',
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
        title: '责任人',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '参与人',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '计划完成状态',
        dataIndex: 'title',
        ellipsis: true,
    },
    {
        title: '姓名',
        dataIndex: 'title2',
        ellipsis: true,
        hideInTable: true
    },
    {
        title: '周计划员工是否确认',
        dataIndex: 'title',
        ellipsis: true,
        width: 170,

        hideInSearch: true
    },
    {
        title: '周计划领导是否确认',
        dataIndex: 'title',
        ellipsis: true,
        width: 170,

        hideInSearch: true
    },
    {
        title: '周计划是否发布',
        dataIndex: 'title',
        ellipsis: true,
        width: 150,

        hideInSearch: true
    },
    {
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 140,
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    // todo
                    navigate('/work-plan/week-plan/123')
                }}
            >
                周计划
            </a>,
            <a href={record.url}
               onClick={() => {
                   onAdd('edit', record)
               }}
               key="view">
                编辑
            </a>,
        ],
    },
];

const WorkPlan = () => {
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);

    const [modalVisible, setModalVisible] = useState(false);

    const [modalType, setModalType] = useState<string>('')

    function onAdd(type: string, record?: any) {
        setModalVisible(true);
        setModalType(type)
    }

    useEffect(() => {
        setCols(getColumns(navigate, {onAdd}));
    }, []);
    return (
        <div className={styles.container}>
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
                scroll={{x: 2000}}
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
                headerTitle="每月计划列表"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => onAdd('add')}
                        type="primary"
                    >
                        新增
                    </Button>,
                ]}
            />
            <MonthPlanModal type={modalType} visible={modalVisible} setVisible={setModalVisible}/>
        </div>
    )
}

export default WorkPlan;