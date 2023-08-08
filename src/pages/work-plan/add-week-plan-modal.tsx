import React, {useImperativeHandle, useRef, useState} from "react";
import {ProForm, ProFormInstance, ProFormSelect, ProFormTextArea} from "@ant-design/pro-components";
import {Modal} from "antd";

export default React.forwardRef(function (props, ref) {

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

    return(

        <Modal
            open={visible}
            title='新增工作计划'
            width='80%'
            onCancel={() => setVisible(false)}
            onOk={onOk}
            confirmLoading={loading}
        >
            <ProForm
                formRef={formRef}
                submitter={false}
            >
                <ProFormSelect
                    name='todo'
                    label="计划周数"
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="content"
                    label="工作内容"
                    placeholder="请输入"
                    required={true}
                    rules={[{ required: true, message: '这是必填项' }]}
                />

            </ProForm>


        </Modal>
    )
});