import {Modal, Spin} from "antd";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {
    ProForm,
    ProFormDatePicker,
    ProFormInstance, ProFormList,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from "@ant-design/pro-components";
import {weekPlanDetail} from "../../services";
import styles from "./plan-edit.module.less";

export default React.forwardRef(function WeekPlanDetailModal(props: any, ref: any) {

    const [visible, setVisible] = useState(false);

    const formRef = useRef<ProFormInstance>();
    const [loading, setLoading] = useState(false);

    function onOk() {
        setVisible(false)
    }

    function onCancel() {
        setVisible(false)
    }


    async function loadData(id: any) {
        setLoading(true);
        const res = await weekPlanDetail(id);
        formRef.current?.setFieldsValue({
            ...res.data.weekPlan,
            commentList: res.data.commentList || []
        })
        setLoading(false);
    }

    useImperativeHandle(ref, () => ({
        show: (id: any) => {
            setVisible(true);
            loadData(id);
        },
        hide: () => {
            onCancel();
        },
    }));

    return (
        <Modal
            open={visible}
            title='周计划详情'
            width={600}
            onCancel={() => setVisible(false)}
            onOk={onOk}
        >
            <Spin spinning={loading}>
                <ProForm
                    formRef={formRef}
                    className={styles.planEditForm}
                    submitter={false}
                    readonly={true}
                    layout='inline'
                >
                    <div>
                        <ProFormTextArea
                            name="content"
                            label="工作内容"
                            placeholder="请输入"
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="achievement"
                            label="工作成果"
                            placeholder="请输入"
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="problem"
                            label="遗留问题"
                            placeholder="请输入"
                            disabled={true}
                        />
                        <ProFormTextArea
                            name="leaderComment"
                            label="部门经理意见"
                            placeholder="请输入"
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
                            actionRender={() => []}
                        >
                            <div className={styles.formListRow}>
                                <ProFormText name="comment" label="第三方意见" />
                                <ProFormText name="commentator" label="评论人" />
                            </div>
                        </ProFormList>
                        <ProFormDatePicker
                            name="startTime"
                            label="开始时间"
                            disabled={true}
                        />
                        <ProFormDatePicker
                            fieldProps={{
                                style: {width: '100%'}
                            }}
                            name="endTime"
                            label="截止时间"
                            disabled={true}
                        />
                        <ProFormDatePicker
                            fieldProps={{
                                style: {width: '100%'}
                            }}
                            name="endTime"
                            label="完成时间"
                            disabled={true}
                        />

                        <ProFormSelect
                            name='todo'
                            label="完成状态"
                            disabled={true}
                        />
                        <ProFormSelect
                            name='todo'
                            label="责任人"
                            disabled={true}
                        />
                        <ProFormSelect
                            name='todo'
                            label="参与人"
                            fieldProps={{
                                mode:'multiple'
                            }}
                            disabled={true}

                        />
                    </div>

                </ProForm>
            </Spin>
        </Modal>
    )
})