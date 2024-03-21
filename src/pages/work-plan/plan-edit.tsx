import {useLocation, useNavigate, useParams} from "react-router";
import React, {useEffect, useRef, useState} from "react";
import {
    ActionType,
    ProColumns,
    ProForm,
    ProFormDatePicker,
    ProFormGroup, ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, ProTable
} from "@ant-design/pro-components";

import styles from './plan-edit.module.less';
import {Button, Row, Spin} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {
    arrayToMap, getBlameList,
    monthPlanDetail, monthPlanEdit, monthPlanUserList,
    weekPlanListById,
    weekStatus,
    workIsImportantEnum,
    workStatus, workStatus2
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import ConfirmModal from "./week-plan/confirm-modal.tsx";
import AddWeekPlanModal from "./add-week-plan-modal.tsx";
import WeekPlanDetailModal from "./week-plan-detail-modal.tsx";


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
        ellipsis: true
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
        ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '确认时间',
        dataIndex: 'finishTime',
        ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '完成状态',
        dataIndex: 'statusString',
        ellipsis: true,
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


export default function PlanEdit(prosp: any) {
    const navigate = useNavigate();
    const location = useLocation();
    const useparams = useParams();
    const formRef = useRef<ProFormInstance>();
    const [cols, setCols] = useState<any>([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const actionRef = useRef<ActionType>();
    const [weekPlanId, setWeekPlanId] = useState<string>(null);
    const [loading, setLoading] = useState(false);
    const [weekData, setWeekData] = useState([]);
    const addWeekPlanRef: any = useRef();
    const weekPlanDetailModalRef: any = useRef();
    async function initData() {
        setLoading(true);
        const res = await monthPlanDetail(useparams.id);
        setLoading(false);
        if (res.success) {
            setWeekData(res.data.weekPlanList);
            formRef.current?.setFieldsValue({
                ...res.data?.monthPlan,
                participant: res.data?.monthPlan?.participant?.split(','),
                status: res.data?.monthPlan?.monthStatus
            });
        }
    }

    function onWeekPlan(type: string,record?: any) {

        if (type === 'add') {
            addWeekPlanRef.current.show();
        } else if (type === 'edit') {
            addWeekPlanRef.current.show(record.id, record);
        }
    }

    async function onOK(formData: any) {
       await monthPlanEdit({...formData, monthPlanId: useparams.id});
        return await initData();
    }




    function showWeekPlanDetail(record: any) {
        weekPlanDetailModalRef?.current.show(record.id);
    }

    function onConfirm(record?: any) {
        navigate('/work-plan/confirm/' + record.id, {state: 'week'});
    }


    useEffect(() => {
        initData();
        const isManager = myLocalstorage.get('manager') === 1;
        setCols(getColumns(navigate, {onWeekPlan, onConfirm, isManager}));
    }, [useparams.id]);


    return (
        <div className={styles.planEdit}>
            <Spin spinning={loading}>
                <div style={{fontSize: 16}}>
                    <Button icon={<ArrowLeftOutlined /> } style={{marginRight: 14}} shape="round"  onClick={() => {
                        window.history.go(-1);
                    }}></Button>总计划编辑
                </div>
                <ProForm
                    className={styles.planEditForm}
                    formRef={formRef}
                    submitter={{
                        searchConfig: {
                            submitText: '确认',
                        },
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },
                    }}
                    onFinish={onOK}
                >
                    <ProFormGroup>
                        <ProFormSelect
                            width='lg'
                            name='deptFirst'
                            label="一级部门"
                            disabled={true}
                        />
                        <ProFormSelect
                            name='deptSecond'
                            label="二级部门"
                            width='lg'
                            disabled={true}
                        />
                        <ProFormSelect
                            name='important'
                            width='lg'
                            label="工作分类"
                            options={workIsImportantEnum}
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                        <ProFormText
                            name="title"
                            width='lg'
                            label="工作名称"

                        />
                        <ProFormTextArea
                            name="content"
                            label="工作内容"
                            width='lg'
                            placeholder="请输入"
                            required={true}
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                        <ProFormTextArea
                            name="objective"
                            label="工作目标"
                            width='lg'
                            placeholder="请输入"
                            required={true}
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                        <ProFormDatePicker

                            name="startTime"
                            width='lg'
                            label="开始时间"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                        <ProFormDatePicker

                            width='lg'
                            name="endTime"
                            label="截止时间"
                            rules={[{ required: true, message: '这是必填项' }]}
                        />

                        <ProFormSelect
                            width='lg'
                            name='status'
                            label="完成状态"
                            rules={[{ required: true, message: '这是必填项' }]}
                            request={() => {
                                return Promise.resolve(workStatus2)
                            }}
                        />
                        <ProFormSelect
                            name='executor'
                            width='lg'
                            label="责任人"
                            request={async () => {
                                const {data = []} = await getBlameList();
                                return data.map(o => ({label: o.nickName, value: o.id}));
                            }}
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                        <ProFormSelect
                            name='participant'
                            width='lg'
                            label="参与人"
                            fieldProps={{
                                mode:'multiple'
                            }}
                            request={async () => {
                                const {data} = await monthPlanUserList();
                                return (data || []).map(o => ({label: o.nickName, value: o.nickName}))
                            }}
                        />
                    </ProFormGroup>
                </ProForm>

                <ProTable
                    style={{marginTop: 24}}
                    columns={cols}
                    actionRef={actionRef}
                    cardBordered
                    onRow={(record) => {
                        return {
                            onDoubleClick: () => showWeekPlanDetail(record)
                        }
                    }}
                    dataSource={weekData}
                    rowKey="id"
                    search={false}
                    options={{
                        setting: false,
                        density: false,
                        reload: false
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
            </Spin>

            <ConfirmModal
                visible={confirmModalVisible}
                // type={confirmType}
                setVisible={setConfirmModalVisible}
                onSuccess={() => {
                    initData()
                }}
                weekPlanId={weekPlanId} />
            <AddWeekPlanModal ref={addWeekPlanRef}
                              onSuccess={() => {
                                  initData()
                              }}/>
            <WeekPlanDetailModal ref={weekPlanDetailModalRef}/>
        </div>
    );
};