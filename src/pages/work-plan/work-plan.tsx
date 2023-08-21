import styles from './work-plan.module.less';
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {Button, message, Modal, Select, Upload, UploadProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import MonthPlanModal from "./month-plan-modal.tsx";
import {
    arrayToMap, completeMonthPlan,
    getDeptFirstList,
    getDeptSecondList,
    download,
    exportMonth, monthPlanImport,
    monthPlanList,
    planStatus, planWeeks, workIsImportantEnum,
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import AddPlanModal from "./add-plan-modal.tsx";
import PlanConfirmForm from "./plan-confirm-form.tsx";
import {baseURL} from "../../utils/http";

const {confirm} = Modal;

const getColumns = (navigate: any, {onAdd, onFinish, isPublisher}: any): ({ hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string } | { request: () => Promise<any>; hideInTable: boolean; dataIndex: string; valueType: string; fieldProps: { mode: string }; title: string; ellipsis: boolean } | { request: () => Promise<any>; hideInTable: boolean; dataIndex: string; valueType: string; fieldProps: { mode: string }; title: string; ellipsis: boolean } | { request: () => Promise<any>; hideInTable: boolean; dataIndex: string; valueType: string; fieldProps: {}; title: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; hideInTable: boolean; dataIndex: string; width: number; title: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { request: () => any; hideInTable: boolean; dataIndex: string; title: string } | { hideInSearch: boolean; dataIndex: string; valueEnum: any; width: number; title: string; align: string; ellipsis: boolean } | { hideInTable: boolean; dataIndex: string; title: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { hideInSearch: boolean; dataIndex: string; width: number; title: string; align: string; ellipsis: boolean } | { dataIndex: string; valueType: string; width: number; fixed: string; title: string; render: (text, record, _, action) => JSX.Element[] })[] => [
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
            const {data = []} = await getDeptFirstList();
            return data.map(o => ({label: o.name, value: o.name}));
        },
        fieldProps: {
            mode: 'multiple'
        },
        hideInTable: true,
    },
    {
        hideInTable: true,
        title: '二级部门',
        dataIndex: 'deptSecondList',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple'
        },
        ellipsis: true,
        dependencies: ['deptFirstList'],
        request: async ({deptFirstList = []}) => {
            const {data = []} = await getDeptSecondList(deptFirstList);
            return data.map(o => ({label: o.name, value: o.name}));
        },
    },
    {
        title: '工作分类',
        dataIndex: 'important',
        valueType: 'select',
        fieldProps: {
            // mode: 'multiple'
        },
        ellipsis: true,
        request: async () => {
            return workIsImportantEnum;
        },
        hideInTable: true,
    },
    {
        title: '一级部门',
        dataIndex: 'deptFirst',
        ellipsis: true,
        hideInSearch: true,
        width: 30,
        align: "center"
    },
    {
        title: '二级部门',
        dataIndex: 'deptSecond',
        ellipsis: true,
        hideInSearch: true,
        width: 30,
        align: "center"
    },
    {
        title: '工作名称',
        dataIndex: 'title',
        ellipsis: true,
        hideInSearch: true,
        width: 100,
        align: "center"
    },
    {
        title: '工作内容',
        dataIndex: 'content',
        ellipsis: true,
        hideInSearch: true,
        width: 30,
        hideInTable: true
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
        width: 29,
        align: "center"
    },
    {
        title: '重要',
        dataIndex: 'important',
        ellipsis: true,
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
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 40,
        render: (text, record, _, action) => [
            // <a
            //     key="editable"
            //     onClick={() => {
            //         navigate('/work-plan/week-plan/' + record.id,
            //             {
            //                 state: record
            //             }
            //         )
            //     }}
            // >
            //     周计划
            // </a>,
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
                确认
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

    const addModalRef: any = useRef();

    const isPublisher = myLocalstorage.get('role') === 'publisher';

    const [uploading, setUploading] = useState(false);

    const [monthVisible, setMonthVisible] = useState(false);

    const [month, setMonth] = useState<any>(1);

    function onAdd(type: string, record?: any) {
        // setModalVisible(true);
        // setModalType(type);
        // if (record) setRecord({...record});

        if (type === 'add') {
            addModalRef.current.show();
        }
        else if (type === 'edit') {
            navigate('/work-plan/edit/' + record.id);
        }
    }

    function showPlanDetail(record: any) {
        navigate('/work-plan/detail/' + record.id);
    }

    // 确认
    function onFinish(record: any) {
        navigate('/work-plan/confirm/' + record.id, {state: 'month'});
    }

    async function exportData() {
        if (downloading) return;
        setDownloading(true);
        const res = await exportMonth({...params, month});
        setMonthVisible(false);
        setDownloading(false);
        download(res);
    }

    const uploadProps: UploadProps = {
        name: 'file',
        action: baseURL+'/monthPlan/import',
        headers: {
            token: myLocalstorage.get('token') || '', // localstorage的封装，可以设置过期时间
        },
        showUploadList: false,
        onChange(info) {
            if (info.file.status === 'uploading') {
                setUploading(true);
            }
            if (info.file.status === 'done') {
                setUploading(false);
                actionRef?.current?.reload();
                message.success(`${info.file.response.msg}`);
            } else if (info.file.status === 'error') {
                setUploading(false);
                actionRef?.current?.reload();
                message.error(`${info.file.response.msg}`);
            }
        },
    };

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
                onRow={(record) => {
                    return {
                        onDoubleClick: () => showPlanDetail(record)
                    }
                }}
                // scroll={{x: 2600}}
                rowKey="id"
                search={{
                    // span: 6,
                    // labelWidth: 'auto',
                    defaultColsNumber: 4,
                    // searchGutter: 24
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
                      onClick={() => setMonthVisible(true)}
                      loading={downloading}
                    >
                        导出月度计划
                    </Button>,
                    <Upload {...uploadProps}>
                        <Button loading={uploading}>导入月度计划</Button>
                    </Upload>,
                    // <Button
                    //     key="button"
                    //     onClick={() => monthPlanImport()}
                    //     loading={downloading}
                    // >
                    //     导入月度计划
                    // </Button>,
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
            <AddPlanModal ref={addModalRef} onSuccess={() => {
                actionRef?.current?.reload();
            }}/>
            <MonthPlanModal
              onSuccess={() => {
                  actionRef?.current?.reload();
              }}
              type={modalType} visible={modalVisible} setVisible={setModalVisible} isPublisher={isPublisher} record={record}/>

            <Modal
              title="选择月份"
              open={monthVisible}
              onOk={() => exportData()}
              onCancel={() => setMonthVisible(false)}
              okText="确认"
              cancelText="取消"
              okButtonProps={{loading: downloading}}
              cancelButtonProps={{loading: downloading}}
            >
                <Select
                  value={month}
                  style={{ width: 120 }}
                  onChange={(e) => setMonth(e)}
                  options={planWeeks}
                />
            </Modal>
        </div>
    )
}

export default WorkPlan;