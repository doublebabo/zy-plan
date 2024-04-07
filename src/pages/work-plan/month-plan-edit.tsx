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
import {Button, Modal, Row, Spin} from "antd";
import {ArrowLeftOutlined, PlusOutlined} from "@ant-design/icons";
import {
  arrayToMap, getBlameList, importantEnum,
  monthPlanDetail, monthPlanEdit, monthPlanUserList, planStatus,
  weekPlanListById,
  weekStatus,
  workIsImportantEnum,
  workStatus, workStatus2,
  weekPlanDel
} from "../../services";
import myLocalstorage from "../../utils/localstorage.ts";
import ConfirmModal from "./week-plan/confirm-modal.tsx";
import AddWeekPlanModal from "./week-plan-modal.tsx";
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
    width: 100,
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
    {
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 90,
        render: (text, record, _, action) => {

            return [

                <a
                    target="_blank" rel="noopener noreferrer" key="view"   onClick={() => {
                    onWeekPlan('edit',record);
                }}
                >
                    编辑
                </a>,
              <a key="delete"   onClick={() => {
                  onWeekPlan('delete',record);
                }}
              >
                删除
              </a>,
            ]
        },
    },
];


export default function MonthPlanEdit(prosp: any) {
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
                ...res.data,
            });
        }
    }

    function onWeekPlan(type: string,record?: any) {

        if (type === 'add') {
            addWeekPlanRef.current.show();
        } else if (type === 'edit') {
            addWeekPlanRef.current.show(record.id, record);
        } else if (type === 'delete') {
          // 删除周计划
          Modal.confirm({
            title: '是否确认删除？',
            onOk: async () => {
              // todo
              await weekPlanDel(record.id);
              initData();
            }
          });
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
                <div style={{fontSize: 16,fontWeight: 'bold'}}>
                    <Button icon={<ArrowLeftOutlined /> } style={{marginRight: 14}} shape="round"  onClick={() => {
                        window.history.go(-1);
                    }}></Button>月计划编辑
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

                        <ProFormText
                            name="title"
                            width='lg'
                            label="工作名称"
                            rules={[{ required: true, message: '这是必填项' }]}

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
                            label="达成目标或量化指标"
                            width='lg'
                            placeholder="请输入"
                            required={true}
                            rules={[{ required: true, message: '这是必填项' }]}
                        />
                        <ProFormTextArea
                            name="milestone"
                            label="完成措施或关键节点"
                            width='lg'
                            placeholder=""
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
                            disabled={true}
                            // rules={[{ required: true, message: '这是必填项' }]}
                            request={() => {
                                return Promise.resolve(planStatus)
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