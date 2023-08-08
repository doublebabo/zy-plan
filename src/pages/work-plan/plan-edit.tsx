import {useLocation, useNavigate, useParams} from "react-router";
import React, {useEffect, useRef, useState} from "react";
import {
    ActionType,
    ProColumns,
    ProForm,
    ProFormDatePicker,
    ProFormGroup,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, ProTable
} from "@ant-design/pro-components";

import styles from './plan-edit.module.less';
import {Button, Row} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {arrayToMap, weekPlanListById, weekStatus} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import ConfirmModal from "./week-plan/confirm-modal.tsx";
import AddWeekPlanModal from "./add-week-plan-modal.tsx";
import WeekPlanDetailModal from "./week-plan-detail-modal.tsx";


const getColumns = (navigate: any, {onWeekPlan, onConfirm, isPublisher}: any): ProColumns<any>[] => [
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
        title: '完成时间',
        dataIndex: 'finishTime',
        ellipsis: true,
        hideInSearch: true,
        width: 100
    },
    {
        title: '完成状态',
        dataIndex: 'status',
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
    const formRef = useRef();
    const [cols, setCols] = useState<any>([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const actionRef = useRef<ActionType>();
    const [weekPlanId, setWeekPlanId] = useState<string>(null);

    const addWeekPlanRef: any = useRef();
    const weekPlanDetailModalRef: any = useRef();
    function initData() {

    }

    function onWeekPlan(type: string,record?: any) {

        if (type === 'add') {
            addWeekPlanRef.current.show();
        }
    }




    function showWeekPlanDetail(record: any) {
        weekPlanDetailModalRef?.current.show();
    }

    function onConfirm(record?: any) {
        setConfirmModalVisible(true);
        setWeekPlanId(record?.id);
    }


    useEffect(() => {
        initData();
        const isPublisher = myLocalstorage.get('role') === 'publisher';
        setCols(getColumns(navigate, {onWeekPlan, onConfirm, isPublisher}));
    }, [useparams.id]);


    return (
        <div className={styles.planEdit}>
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
            >
                <ProFormGroup title={
                    <div style={{fontSize: 16}}>
                        <Button icon={<ArrowLeftOutlined /> } style={{marginRight: 14}} shape="round"  onClick={() => {
                            window.history.go(-1);
                        }}></Button>总计划编辑
                    </div>
                }>
                    <ProFormSelect
                        width='lg'
                        name='todo'
                        label="一级部门"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormSelect
                        name='todo'
                        label="二级部门"
                        width='lg'

                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormSelect
                        name='todo'
                        width='lg'
                        label="工作分类"
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
                        name="content"
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
                    <ProFormDatePicker
                        
                        name="endTime"
                        width='lg'
                        label="完成时间"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormSelect
                        width='lg'
                        name='todo'
                        label="工作分类"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormSelect
                        name='todo'
                        width='lg'
                        label="责任人"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormSelect
                        name='todo'
                        width='lg'
                        label="参与人"
                        fieldProps={{
                            mode:'multiple'
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
                        // disabled={!isPublisher}
                    >
                        新增
                    </Button>,
                ]}
            />
            <ConfirmModal
                visible={confirmModalVisible}
                // type={confirmType}
                setVisible={setConfirmModalVisible}
                onSuccess={() => {
                    actionRef?.current?.reload();
                }}
                weekPlanId={weekPlanId} />
            <AddWeekPlanModal ref={addWeekPlanRef}/>
            <WeekPlanDetailModal ref={weekPlanDetailModalRef}/>
        </div>
    );
};