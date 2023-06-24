import styles from './work-plan.module.less';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import MonthPlanModal from "./month-plan-modal.tsx";
import {arrayToMap, deptList2, download, exportMonth, monthPlanList, planStatus, yOrN} from "../../services";

const getColumns = (navigate: any, {onAdd}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index'
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
        ellipsis: true,request: async () => {
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
    },
    {
        title: '二级部门',
        dataIndex: 'deptSecond',
        ellipsis: true,
        hideInSearch: true,
    },
    {
        title: '工作名称',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '工作内容',
        dataIndex: 'content',
        ellipsis: true,
        hideInSearch: true,
        width: 400
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
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
        dataIndex: 'finishTime',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '责任人',
        dataIndex: 'executorName',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '参与人',
        dataIndex: 'participant',
        ellipsis: true,
        hideInSearch: true
    },
    {
        title: '计划完成状态',
        dataIndex: 'planStatus',
        ellipsis: true,
        request: () => {
            return planStatus;
        },

        hideInTable: true
    },
    {
        title: '计划完成状态',
        dataIndex: 'monthStatus',
        ellipsis: true,
        valueEnum: arrayToMap(planStatus),
        hideInSearch: true
    },
    {
        title: '姓名',
        dataIndex: 'executorName',
        ellipsis: true,
        hideInTable: true
    },
    {
        title: '周计划员工是否确认',
        dataIndex: 'title',
        ellipsis: true,
        width: 170,
        hideInSearch: true,
        valueEnum: arrayToMap(yOrN)

    },
    {
        title: '周计划领导是否确认',
        dataIndex: 'title',
        ellipsis: true,
        width: 170,
        hideInSearch: true,
        valueEnum: arrayToMap(yOrN)

    },
    {
        title: '周计划是否发布',
        dataIndex: 'weekStatus',
        ellipsis: true,
        width: 150,
        hideInSearch: true,
        valueEnum: arrayToMap(yOrN)
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
                    navigate('/work-plan/week-plan/' + record.id,
                       {
                            state: record
                        }
                    )
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

    const [modalType, setModalType] = useState<string>('');

    const [params, setParams] = useState({});

    const [downloading, setDownloading] = useState(false);

    const [record, setRecord] = useState<any>();

    function onAdd(type: string, record?: any) {
        setModalVisible(true);
        setModalType(type);
        if (record) setRecord(record);
    }

    async function exportData() {
        if (downloading) return;
        setDownloading(true);
        const res = await exportMonth(params);
        setDownloading(false);
        download(res);
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
                    setParams(params);
                    return monthPlanList(params);
                }}
                scroll={{x: 2600}}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                    defaultColsNumber: 12,
                }}
                options={{
                    setting: false,
                    density: false
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
                    >
                        新增
                    </Button>,
                ]}
            />
            <MonthPlanModal
              onSuccess={() => {
                  actionRef?.current?.reload();
              }}
              type={modalType} visible={modalVisible} setVisible={setModalVisible} record={record}/>
        </div>
    )
}

export default WorkPlan;