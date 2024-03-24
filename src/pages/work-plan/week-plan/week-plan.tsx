import styles from './week-plan.module.less';
import {useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {ActionType, ProColumns, ProDescriptions, ProTable} from '@ant-design/pro-components';
import {Button} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import WorkDetailModal from "./work-detail-modal.tsx";
import ConfirmModal from "./confirm-modal.tsx";
import {arrayToMap, planStatus, weekStatus, weekPlanListById} from "../../../services";
import myLocalstorage from "../../../utils/localstorage.ts";

const getColumns = (navigate: any, {onWeekPlan, onConfirm, isManager}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index'
    },
    {
        dataIndex: 'id',
        hideInTable: true,

    },
    {
        title: '工作内容',
        dataIndex: 'content',
        // ellipsis: true
    },
    {
        title: '创建时间',
        dataIndex: 'startTime',
        // ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
        // ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
        // ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '计划完成状态',
        dataIndex: 'status',
        // ellipsis: true,
        hideInSearch: true,
        valueEnum: arrayToMap(weekStatus),
        width: 100
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
                        onConfirm(record);
                    }}
                >
                    结果确认
                </a>,
                <a
                    target="_blank" rel="noopener noreferrer" key="view"   onClick={() => {
                        onWeekPlan('edit',record);
                    }}
                >
                    编辑
                </a>
            ]
        },
    },
];

const descCols = [
    {
        title: '一级部门',
        dataIndex: 'deptFirst',
    },
    {
        title: '二级部门',
        dataIndex: 'deptSecond',
    },
    {
        title: '工作名称',
        dataIndex: 'title',
        span:2
    },
    {
        title: '工作内容',
        dataIndex: 'content',
        span: 2
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
    },
    {
        title: '完成状态',
        dataIndex: 'monthStatus',
        valueEnum: arrayToMap(planStatus),
    },
    {
        title: '责任人',
        dataIndex: 'executorName',
    },
    {
        title: '参与人',
        dataIndex: 'participant',
    },
]

const WeekPlan = () => {
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);

    const [addModalVisible, setAddModalVisible] = useState(false);

    const [workDetailType, setWorkDetailType] = useState<string>('');

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);

    // const [confirmType, setConfirmType] = useState<string>('staff');
    const [weekPlanId, setWeekPlanId] = useState<string>(null);

    const [record, setRecord] = useState<any>();

    const isManager = myLocalstorage.get('manager') === 1;
    let location = useLocation();

    function onWeekPlan(type: string,record?: any) {
        setAddModalVisible(true);
        setWorkDetailType(type);
        if (record) {
            setRecord({...record});
        }
    }

    function onConfirm(record?: any) {
        setConfirmModalVisible(true);
        // const isManager = myLocalstorage.get('manager') === 1;
        // if (!isManager) {
        //     setConfirmType('staff');
        // } else if (record.employeeStatus === 0) {
        //     setConfirmType('staff');
        // } else if (record.leaderStatus === 0) {
        //     setConfirmType('manager');
        // } else {
        //     setConfirmType('manager');
        // }
        setWeekPlanId(record?.id);
    }

    useEffect(() => {
        const isManager = myLocalstorage.get('manager') === 1;
        setCols(getColumns(navigate, {onWeekPlan, onConfirm, isManager}));
    }, []);
    return (
        <div className={styles.container}>

            <ProDescriptions
                column={2}
                columns={descCols}
                title={
                    <div>
                        <Button icon={<ArrowLeftOutlined /> } style={{marginRight: 14}} shape="round"  onClick={() => {
                            // navigate('/work-plan')
                            window.history.go(-1);
                        }}></Button>月计划详情
                    </div>
                }
                className={styles.desc}
                request={() => {
                    return Promise.resolve({success: true, data: location.state})
                }}
            />
            <ProTable
                columns={cols}
                actionRef={actionRef}
                cardBordered
                request={async (params = {}, sort, filter) => {
                    return weekPlanListById(location.state.id);
                }}
                rowKey="id"
                search={false}
                options={{
                    setting: false,
                    density: false,
                    // reload: false
                }}
                dateFormatter="string"
                headerTitle="每月周计划列表"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => onWeekPlan('add')}
                        type="primary"
                        // disabled={!isManager}
                    >
                        新增
                    </Button>,
                ]}
            />
            <WorkDetailModal
              visible={addModalVisible}
              type={workDetailType}
              setVisible={setAddModalVisible}
              onSuccess={() => {
                  actionRef?.current?.reload();
              }}
              record={record}
              monthId={location.state.id}/>
            <ConfirmModal
              visible={confirmModalVisible}
              // type={confirmType}
              setVisible={setConfirmModalVisible}
              onSuccess={() => {
                  actionRef?.current?.reload();
              }}
              weekPlanId={weekPlanId} />
        </div>
    )
}

export default WeekPlan;