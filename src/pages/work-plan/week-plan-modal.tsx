import React, {useImperativeHandle, useRef, useState} from "react";
import {ProForm, ProFormInstance, ProFormSelect, ProFormTextArea} from "@ant-design/pro-components";
import {Modal} from "antd";
import {planWeeks, weekPlanAdd, weekPlanEdit} from "../../services";
import {useParams} from "react-router";

export default React.forwardRef(function (props: any, ref) {

    const {onSuccess} = props

    const [visible, setVisible] = useState(false);

    const formRef = useRef<ProFormInstance>();

    const [loading, setLoading] = useState(false);

    const useparams = useParams();

    const [weekPlanId, setWeekPlanId] = useState<any>(null);

    function onOk() {
        if (loading) return;
        formRef.current?.validateFields?.().then(async values => {
            setLoading(true);
            const res = await (weekPlanId ?  weekPlanEdit({...values, weekPlanId}) : weekPlanAdd({...values, monthId: useparams.id}));
            onSuccess?.();
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
        show: (id = null, records?) => {
            setVisible(true);
            formRef.current?.resetFields();
            if (records) {
                formRef.current?.setFieldsValue({content: records.content});
            }
            setWeekPlanId(id);
        },
        hide: () => {
            onCancel();
        },
    }));

    return(

        <Modal
            open={visible}
            title={`${weekPlanId ? '修改' : '新增'}周工作计划`}
            width={500}
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
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="outcome"
                    label="工作结果"
                    placeholder="请输入"
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="problem"
                    label="问题和风险"
                    placeholder="请输入"
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
            </ProForm>


        </Modal>
    )
});