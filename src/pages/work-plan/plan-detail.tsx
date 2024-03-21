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
import {arrayToMap, monthPlanDetail, weekPlanListById, weekStatus, workIsImportantEnum, workStatus2} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import WeekPlanDetailModal from "./week-plan-detail-modal.tsx";


const getColumns = (navigate: any, {onWeekPlan, onConfirm, isManager}: any): ProColumns<any>[] => [
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
    const formRef = useRef<ProFormInstance>();
    const [cols, setCols] = useState<any>([]);
    const actionRef = useRef<ActionType>();
    const [weekPlanId, setWeekPlanId] = useState<string>(null);

    const addWeekPlanRef: any = useRef();
    const weekPlanDetailModalRef: any = useRef();

    const [weekData, setWeekData] = useState([]);

    const [loading, setLoading] = useState(false);

    async function initData() {
        setLoading(true);
        const res = await monthPlanDetail(useparams.id);
        setLoading(false);
        if (res.success) {
            setWeekData(res.data.weekPlanList);
            formRef.current?.setFieldsValue({...res.data?.monthPlan,
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
        const isManager = myLocalstorage.get('manager') === 1;
        setCols(getColumns(navigate, {onWeekPlan}));
    }, [useparams.id]);


    return (
        <div className={styles.planEdit}>
            <Spin spinning={loading}>
                <div style={{fontSize: 16}}>
                    <Button icon={<ArrowLeftOutlined/>} style={{marginRight: 14}} shape="round" onClick={() => {
                        window.history.go(-1);
                    }}></Button>总计划详情
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
                                disabled={true}
                                options={workIsImportantEnum}
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
                            label="工作目标"
                            width='lg'
                            placeholder=""
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="achievement"
                            label="工作结果"
                            width='lg'
                            placeholder=""
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="problem"
                            label="遗留问题"
                            width='lg'
                            placeholder=""
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="leaderComment"
                            label="部门经理意见"
                            width='lg'
                            placeholder=""
                            disabled={true}
                        />
                        <ProFormList
                            name="commentList"
                            className={styles.formList}
                            creatorButtonProps={{
                                style: {
                                    display: 'none'
                                }
                            }}
                            colProps={{
                                style: {display: 'none'}
                            }}
                            actionRender={() => []}
                        >
                            <div className={styles.formListRow}>
                                <ProFormText name="comment" label="第三方意见" />
                                <ProFormText name="commentator" label="评论人" />
                            </div>
                        </ProFormList>
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

                                name="endTime"
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
                                name='monthStatus'
                                width='lg'
                                label="完成状态"
                                disabled={true}
                                options={workStatus2}
                            />
                            <ProFormText
                                name='executorName'
                                width='lg'
                                label="责任人"
                                disabled={true}
                            />
                            <ProFormText
                                name='participant'
                                width='lg'
                                label="参与人"
                                disabled={true}
                            />
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
                    headerTitle="周计划"
                />
            </Spin>

            <WeekPlanDetailModal ref={weekPlanDetailModalRef}/>

        </div>
    );
};