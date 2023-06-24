import {BetaSchemaForm, ProColumns, ProFormInstance} from "@ant-design/pro-components";
import {useEffect, useRef, useState} from "react";

const getColumns = (type: string): ProColumns<any>[]  => {
    return [
        {
            title: '权限',
            dataIndex: 'title',
            
        },
        {
            title: '部门',
            dataIndex: 'title2',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            fieldProps: {
                disabled: type === 'edit'
            },
            
        },
        {
            title: '角色',
            dataIndex: 'title3',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            
        },
        {
            title: '姓名',
            dataIndex: 'title4',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            
        },
        {
            title: '登录账号',
            dataIndex: 'title5',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            fieldProps: {
                disabled: type === 'edit'
            },
        },
        {
            title: '登录密码',
            dataIndex: 'title6',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            
        },
        {
            title: '确认密码',
            dataIndex: 'title7',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            
        },
    ];
}

export default function ModifyModal(props: any) {

    const {type, visible, setVisible} = props;

    const formRef = useRef<ProFormInstance>();

    const title = type === 'edit' ? '编辑用户' : '创建用户';

    const [cols, setCols] = useState<any>([]);

    useEffect(() => {
        setCols(getColumns(type));
    }, [type]);

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
    }, [visible])


    return (
        <BetaSchemaForm
            open={visible}
            layoutType='ModalForm'
            title={title}
            onFinish={async (values) => {
                console.log(values);
            }}
            formRef={formRef}
            modalProps={{
                maskClosable: false,
                onCancel: () => setVisible(false),
            }}
            columns={cols}
        />

    );
};