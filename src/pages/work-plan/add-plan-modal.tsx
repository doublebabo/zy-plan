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
import {getBlameList, monthPlanAdd, monthPlanUserList, workIsImportantEnum} from "../../services";

export default React.forwardRef(function AddPlan(props: any, ref: any) {

    const {onSuccess} = props;

    const [visible, setVisible] = useState(false);

    const formRef = useRef<ProFormInstance>();
    const [loading, setLoading] = useState(false);

    function onOk() {
        if (loading) return;
        formRef.current?.validateFields?.().then(async values => {
            setLoading(true);
            const res = await monthPlanAdd(values);
            if (res?.success) {
                onCancel();
                onSuccess?.();
            }
            setLoading(false);
        })
    }

    function onCancel() {
        setVisible(false)
    }

    useImperativeHandle(ref, () => ({
        show: () => {
            formRef.current?.resetFields();
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
                <ProFormText
                    name="title"
                    label="工作名称"
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="content"
                    label="工作内容"
                    placeholder="请输入"
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="objective"
                    label="工作目标"
                    placeholder="请输入"
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormDatePicker
                    fieldProps={{
                        style: {width: '100%'}
                    }}
                    name="startTime"
                    label="开始时间"
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormDatePicker
                    fieldProps={{
                        style: {width: '100%'}
                    }}
                    name="endTime"
                    label="截止时间"
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormSelect
                    name='important'
                    label="工作分类"
                    request={() => Promise.resolve(workIsImportantEnum)}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormSelect
                    name='executor'
                    label="责任人"
                    request={async () => {
                        const {data = []} = await getBlameList();
                        return data.map(o => ({label: o.nickName, value: o.id + '#' + o.nickName}));
                    }}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormSelect
                    name='participant'
                    label="协助人"
                    fieldProps={{
                        mode:'multiple'
                    }}
                    request={async () => {
                        const {data} = await monthPlanUserList();
                        return (data || []).map(o => ({label: o.nickName, value: o.nickName}))
                    }}
                />
            </ProForm>


        </Modal>
    )
})