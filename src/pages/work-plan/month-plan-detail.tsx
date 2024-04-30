import {useLocation, useNavigate, useParams} from "react-router";
import React, {useEffect, useRef, useState} from "react";
import {
    ActionType,
    ProColumns,
    ProForm,
    ProFormDatePicker,
    ProFormGroup, ProFormInstance, ProFormList,
    ProFormSelect,
    ProFormText,
    ProFormTextArea, ProTable
} from "@ant-design/pro-components";

import styles from './plan-edit.module.less';
import {Button, Row, Spin} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {
  arrayToMap,
  importantEnum,
  monthPlanDetail, planStatus, monthPlanStatus,
  weekPlanListById,
  weekStatus,
  workIsImportantEnum,
  workStatus2
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import WeekPlanDetailModal from "./week-plan-detail-modal.tsx";


const getColumns = (navigate: any, {onWeekPlan, onConfirm, isManager}: any): ProColumns<any>[] => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 60,
        valueType: 'index'
    },
    {
        title: '工作内容',
        dataIndex: 'content',
        // ellipsis: true
    },
    {
        title: '工作结果',
        dataIndex: 'outcome',
        // ellipsis: true
    },
    {
        title: '问题和风险',
        dataIndex: 'problem',
        // ellipsis: true
    },
    {
        title: '开始时间',
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
        dataIndex: 'id',
        hideInTable: true,
    },
];


export default function MonthPlanDetail(prosp: any) {
    // 月计划详情

    const navigate = useNavigate();
    const location = useLocation();
    const useparams = useParams();
    const formRef = useRef<ProFormInstance>();
    const [cols, setCols] = useState<any>([]);
    const actionRef = useRef<ActionType>();
    const [weekPlanId, setWeekPlanId] = useState<string>(null);

    const addWeekPlanRef: any = useRef();
    const weekPlanDetailModalRef: any = useRef();
    const isManager = myLocalstorage.get('manager') === 1;

    const [weekData, setWeekData] = useState([]);

    const [loading, setLoading] = useState(false);

    async function initData() {
        setLoading(true);
        const res = await monthPlanDetail(useparams.id);
        setLoading(false);
        if (res.success) {
            setWeekData(res.data.weekPlanList);
            formRef.current?.setFieldsValue({
                ...res.data,
                commentList:res.data?.commentList
            });
        }
    }

    function onWeekPlan(type: string, record?: any) {

        if (type === 'add') {
            addWeekPlanRef.current.show();
        }
    }

    function showWeekPlanDetail(record: any) {
        weekPlanDetailModalRef?.current.show(record.id);
    }


    useEffect(() => {
        initData();
        setCols(getColumns(navigate, {onWeekPlan}));
    }, [useparams.id]);


    return (
        <div className={styles.planEdit}>
            <Spin spinning={loading}>
                <div style={{fontSize: 16, fontWeight: 'bold'}}>
                    <Button icon={<ArrowLeftOutlined/>} style={{marginRight: 14}} shape="round" onClick={() => {
                        window.history.go(-1);
                    }}></Button>月计划详情
                </div>
                <ProForm
                    className={styles.planEditForm}
                    formRef={formRef}
                    submitter={false}
                    layout='inline'
                    // grid={true}
                    readonly={true}
                >
                    <div>
                        <div className={styles.formRow}>
                            <ProFormSelect
                                width='lg'
                                name='firstDeptName'
                                label="一级部门"
                                disabled={true}
                            />
                            <ProFormSelect
                                name='secondDeptName'
                                label="二级部门"
                                width='lg'
                                disabled={true}
                            />

                        </div>
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
                            placeholder=""
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="objective"
                            label="达成目标或量化指标"
                            width='lg'
                            placeholder=""
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="milestone"
                            label="完成措施或关键节点"
                            width='lg'
                            placeholder=""
                            disabled={true}
                        />
                        <div className={styles.formRow}>
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

                                name="finishTime"
                                width='lg'
                                label="完成时间"
                                disabled={true}
                            />
                        </div>
                        <div className={styles.formRow}>
                            {/* <ProFormText
                                name='monthStatus'
                                width='lg'
                                label="完成状态"
                                disabled={true}
                            /> */}
                            <ProFormSelect
                                name='status'
                                width='lg'
                                label="完成状态"
                                disabled={true}
                                options={monthPlanStatus}
                            />
                            {/*<ProFormText*/}
                            {/*    name='executorName'*/}
                            {/*    width='lg'*/}
                            {/*    label="责任人"*/}
                            {/*    disabled={true}*/}
                            {/*/>*/}
                            {/*<ProFormText*/}
                            {/*    name='participant'*/}
                            {/*    width='lg'*/}
                            {/*    label="参与人"*/}
                            {/*    disabled={true}*/}
                            {/*/>*/}
                        </div>

                    </div>



                </ProForm>

                <ProTable
                    style={{marginTop: 24}}
                    columns={cols}
                    actionRef={actionRef}
                    cardBordered
                    onRow={(record) => {
                        return {
                            // onDoubleClick: () => showWeekPlanDetail(record)
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
                    headerTitle="周计划"
                />
            </Spin>

            <WeekPlanDetailModal ref={weekPlanDetailModalRef}/>

        </div>
    );
};