import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {ProForm, ProFormInstance, ProFormSelect, ProFormTextArea} from "@ant-design/pro-components";
import {Modal} from "antd";
import {planMonths, weekPlanAdd, weekPlanEdit} from "../../services";
import {useParams} from "react-router";

export default React.forwardRef(function (props: any, ref) {

    const {onSuccess} = props

    const [visible, setVisible] = useState(false);

    const formRef = useRef<ProFormInstance>();

    const [loading, setLoading] = useState(false);

    const useparams = useParams();

    const [weekPlanId, setWeekPlanId] = useState<any>(null);

    const recordRef = useRef<any>();

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
            setWeekPlanId(id);
            recordRef.current = records;
            formRef.current?.resetFields();
        },
        hide: () => {
            onCancel();
        },
    }));

    useEffect(() => {
        if (visible && recordRef.current) {
            formRef.current?.setFieldsValue(recordRef.current);
        }
    }, [visible])

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
                    disabled={recordRef.current?.content ? false : true}
                    // required={true}
                    // rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="problem"
                    label="问题和风险"
                    placeholder="请输入"
                    disabled={recordRef.current?.content ? false : true}
                    // required={true}
                    // rules={[{ required: true, message: '这是必填项' }]}
                />
            </ProForm>


        </Modal>
    )
});