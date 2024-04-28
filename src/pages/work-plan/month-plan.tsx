import styles from './month-plan.module.less';
import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType,  ProTable} from '@ant-design/pro-components';
import {Button, message, Modal, Select, Tooltip, Upload, UploadProps} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {
    apiFinishMonthPlan,
    download,
    exportMonth,
    monthPlanList,
    planStatus, planMonths,  monthPlanDel,
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import AddPlanModal from "./month-plan-add-modal.tsx";
 import {baseURL} from "../../utils/http";
import useTableHeight from "../../hooks/useTableHeight.ts";

const {confirm} = Modal;

const getColumns = (navigate: any, {onAction, onFinish, isManager, onDel}: any): any => [
    {
        title: '序号',
        dataIndex: 'rowNumber',
        width: 60,
        hideInSearch: true,
        // ellipsis: true,
        align: "center"
    },
    {
        title: '任务名称',
        dataIndex: 'title',
        // ellipsis: true,
        hideInSearch: true,
        // width: 100,
        align: "center"
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        // ellipsis: true,
        hideInSearch: true,
        width: 100,
        align: "center"
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
        // ellipsis: true,
        hideInSearch: true,
        width: 100,
        align: "center"
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
        // ellipsis: true,
        hideInSearch: true,
        width: 100,
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
        // ellipsis: true,
        hideInSearch: true,
        align: "center"
    },
    {
        title: '达成目标或量化指标',
        dataIndex: 'objective',
        // ellipsis: true,
        hideInSearch: true,
        align: "center"
    },
    {
        title: '完成措施或关键节点',
        dataIndex: 'milestone',
        // ellipsis: true,
        hideInSearch: true,
        align: "center"
    },
    {
        title: '状态',
        dataIndex: 'status',
        valueType: 'select',
        // ellipsis: true,
        hideInSearch: false,
        hideInTable: true,
        request: () => {
            return planStatus;
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
    {
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 150,
        render: (_, record,) => [

            <a
                onClick={() => {
                    onAction('edit', record)
                }}
                key="view">
                编辑
            </a>,
            <a
                onClick={() => {
                    onDel(record)
                }}
                key="finish">
                删除
            </a>,
            record.status === 0 && <Button
                size='small'
                type='primary'
                // disabled={record.status === 1}
                onClick={() => {
                    onAction('complete', record)
                }}
                key="view">
            完成
            </Button>,
            record.status === 1 && <Button
                size='small'
                type='primary'
                onClick={() => {
                    onAction('undone', record)
                }}
                key="view">
                未完成
            </Button>
        ],
    },
];


const MonthPlan = () => {
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);

    const [modalVisible, setModalVisible] = useState(true);

    const [modalType, setModalType] = useState<string>('');

    const [params, setParams] = useState({});

    const [downloading, setDownloading] = useState(false);

    const [record, setRecord] = useState<any>();

    const addModalRef: any = useRef();

    const isManager = myLocalstorage.get('manager') === 1;

    const [uploading, setUploading] = useState(false);

    const [monthVisible, setMonthVisible] = useState(false);

    const [month, setMonth] = useState<any>(1);

    const [modalLoading, setModalLoading] = useState(false);

    const {height, resize} = useTableHeight();

    useEffect(() => {
        resize();
    }, [cols]);

    function onAction(type: string, record?: any) {

        if (type === 'add') {
            addModalRef.current.show();
        }
        else if (type === 'edit') {
            navigate('/work-plan/edit/' + record.id);
        } else if (type === 'complete') {
            Modal.confirm({
              title: '是否确定完成？',
              onOk: async () => {
                await apiFinishMonthPlan(record.id);
                actionRef.current.reload();
               }
            })
        } else if (type === 'undone') {
            Modal.confirm({
                title: '是否确定未完成？',
                onOk: async () => {
                    await apiFinishMonthPlan(record.id);
                    actionRef.current.reload();
                }
            })
        }
    }

    function onDel(record: any) {
         Modal.confirm({
            title: '提示',
            content: '请确认是否删除该计划？',
            onOk: async () => {
                return new Promise(resolve => {
                    monthPlanDel(record.id).then().finally(() => {
                        actionRef?.current?.reload();
                        resolve(true);
                    })
                })

            },
        })
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
        const isManager = myLocalstorage.get('manager') === 1;
        setCols(getColumns(navigate, {onAction,onFinish, isManager, onDel}));
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
                scroll={{y: height}}
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
                            if (!['', void 0, null].includes(results.status)) {
                                results.status = +results.status
                            } else {
                              results.status = 1
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
                  syncToInitialValues: true,

                }}
                pagination={{
                  defaultPageSize: 10,
                  pageSizeOptions: [10, 20, 50],
                }}
                dateFormatter="string"
                toolBarRender={() => [
                    <Button
                        key="button"
                        icon={<PlusOutlined/>}
                        onClick={() => onAction('add')}
                        type="primary"
                        // disabled={!isManager}
                    >
                        新增
                    </Button>,
                ]}
            />
            <AddPlanModal ref={addModalRef} onSuccess={() => {
                actionRef?.current?.reload();
            }}/>

            <Modal
              title="选择月份"
              open={monthVisible}
              onOk={() => exportData()}
              onCancel={() => setMonthVisible(false)}
              okText="确认"
              cancelText="取消"
              okButtonProps={{loading: downloading}}
              cancelButtonProps={{loading: downloading}}
              maskClosable={false}
              keyboard={false}
            >
                <Select
                  value={month}
                  style={{ width: 120 }}
                  onChange={(e) => setMonth(e)}
                  options={planMonths}
                />
            </Modal>
        </div>
    )
}

export default MonthPlan;