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
import WeekPlanDetailModal from "./week-plan-detail-modal.tsx";


const getColumns = (navigate: any, {onWeekPlan, onConfirm, isPublisher}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index'
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
        dataIndex: 'id',
        hideInTable: true,
    },
    {
        title: '工作内容',
        dataIndex: 'content',
        ellipsis: true
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

];


export default function PlanDetail(prosp: any) {
    const navigate = useNavigate();
    const location = useLocation();
    const useparams = useParams();
    const formRef = useRef();
    const [cols, setCols] = useState<any>([]);
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



    useEffect(() => {
        initData();
        const isPublisher = myLocalstorage.get('role') === 'publisher';
        setCols(getColumns(navigate, {onWeekPlan}));
    }, [useparams.id]);


    return (
        <div className={styles.planEdit}>
            <ProForm
                className={styles.planEditForm}
                formRef={formRef}
                submitter={false}
            >
                <ProFormGroup title={
                    <div style={{fontSize: 16}}>
                        <Button icon={<ArrowLeftOutlined /> } style={{marginRight: 14}} shape="round"  onClick={() => {
                            window.history.go(-1);
                        }}></Button>总计划详情
                    </div>
                }>
                    <ProFormSelect
                        width='lg'
                        name='todo'
                        label="一级部门"
                        disabled={true}
                    />
                    <ProFormSelect
                        name='todo'
                        label="二级部门"
                        width='lg'

                        disabled={true}
                    />
                    <ProFormSelect
                        name='todo'
                        width='lg'
                        label="工作分类"
                        disabled={true}
                    />
                    <ProFormText
                        name="title"
                        width='lg'
                        label="工作名称"
                        disabled={true}

                    />
                    <ProFormTextArea
                        name="content"
                        label="工作内容"
                        width='lg'

                        placeholder="请输入"
                        required={true}
                        disabled={true}
                    />
                    <ProFormTextArea
                        name="content"
                        label="工作目标"
                        width='lg'
                        placeholder="请输入"
                        required={true}
                        disabled={true}
                    />
                    <ProFormDatePicker

                        name="startTime"
                        width='lg'
                        label="开始时间"
                        disabled={true}
                    />
                    <ProFormDatePicker

                        width='lg'
                        name="endTime"
                        label="截止时间"
                        disabled={true}
                    />
                    <ProFormDatePicker

                        name="endTime"
                        width='lg'
                        label="完成时间"
                        disabled={true}
                    />
                    <ProFormSelect
                        width='lg'
                        name='todo'
                        label="工作分类"
                        disabled={true}
                    />
                    <ProFormSelect
                        name='todo'
                        width='lg'
                        label="责任人"
                        disabled={true}
                    />
                    <ProFormSelect
                        name='todo'
                        width='lg'
                        label="参与人"
                        fieldProps={{
                            mode:'multiple'
                        }}
                        disabled={true}

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
                headerTitle="周计划"
            />
            <WeekPlanDetailModal ref={weekPlanDetailModalRef}/>

        </div>
    );
};