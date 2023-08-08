import {Modal} from "antd";
import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {
    ProForm,
    ProFormDatePicker,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea
} from "@ant-design/pro-components";

export default React.forwardRef(function WeekPlanDetailModal(props: any, ref: any) {

    const [visible, setVisible] = useState(false);

    const formRef = useRef<ProFormInstance>();
    const [loading, setLoading] = useState(false);

    function onOk() {
        if (loading) return;
        formRef.current?.validateFields?.().then(async values => {
            setLoading(true);
            // todo
            const res = await userLogin(values);
            if (res?.success) {
                onCancel();
            }
            setLoading(false);
        })
    }

    function onCancel() {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            setVisible(true);
        },
        hide: () => {
            onCancel();
        },
    }));

    return (
        <Modal
            open={visible}
            title='新增总计划'
            width='80%'
            onCancel={() => setVisible(false)}
            onOk={onOk}
            confirmLoading={loading}

        >
            <ProForm
                formRef={formRef}
                submitter={false}
            >
             
                <ProFormTextArea
                    name="content"
                    label="工作内容"
                    placeholder="请输入"
                    
                    disabled={true}
                />
                <ProFormTextArea
                    name="content"
                    label="工作成果"
                    placeholder="请输入"
                    disabled={true}
                />
                <ProFormTextArea
                    name="content"
                    label="遗留问题"
                    placeholder="请输入"
                    disabled={true}
                />
                <ProFormTextArea
                    name="content"
                    label="部门经理意见"
                    placeholder="请输入"
                    disabled={true}
                />
                <ProFormDatePicker
                    fieldProps={{
                        style: {width: '100%'}
                    }}
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
            </ProForm>


        </Modal>
    )
})