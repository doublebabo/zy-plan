import {BetaSchemaForm, ProColumns, ProFormInstance} from "@ant-design/pro-components";
import {useEffect, useRef, useState} from "react";
import {addUser, deptList, deptTree, editUser, roleList} from "../../services";
import {notification} from "antd";
import myLocalstorage from "../../utils/localstorage.ts";

const getColumns = (type: string): ProColumns<any>[]  => {
    return [
        {
            title: '权限',
            dataIndex: 'authority',
            valueType: 'select',
            fieldProps: {
                mode: 'multiple',
                showSearch: true
            },
            request: async () => {
                const {data} = await deptList(myLocalstorage.get('id'));
                return (data || []).map(o => ({label: o.name, value: o.id}))
            },
        },
        {
            title: '部门',
            dataIndex: 'deptId',
            valueType: 'treeSelect',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            fieldProps: {
                disabled: type === 'edit',
                fieldNames: {
                    label: 'name',
                    value: 'id'
                },
                showSearch: true
            },
            request: async () => {
                const {data} = await deptTree();
                return (data || []);
            },
        },
        {
            title: '角色',
            dataIndex: 'roleId',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
            fieldProps: {
                showSearch: true
            },
            request: async () => {
                const {data} = await roleList();
                return (data || []).map(o => ({label: o.remark, value: o.id}))
            },
        },
        {
            title: '姓名',
            dataIndex: 'nickName',
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
            dataIndex: 'userName',
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
            dataIndex: 'password',
            valueType: 'password',
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
            dataIndex: 'password2',
            valueType: 'password',
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

    const {type, visible, setVisible, onSuccess, record = null} = props;

    const formRef = useRef<ProFormInstance>();

    const title = type === 'edit' ? '编辑用户' : '创建用户';

    const [cols, setCols] = useState<any>([]);

    async function onOk(values) {
        if (values.password !== values.password2) {
            notification.error({message: '两次密码输入不一致', duration: 1.5, description: null})
            return;
        }
        let result;
        if (type === 'edit') {
            result = await editUser({...values, userId: record.id});
        } else if (type === 'add') {
            result = await addUser(values);
        }
        if (result.success) {
            setVisible(false);
            onSuccess?.();
        }
    }


    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
        setCols(getColumns(type));
        if (record) {
            const formData = {...record};
            formData.password = '';
            formData.authority = (formData?.authority?.split(',') || []).map(o => +o);
            formRef?.current?.setFieldsValue?.(formData);
        }
    }, [visible, type, record])


    return (
        <BetaSchemaForm
            open={visible}
            layoutType='ModalForm'
            title={title}
            onFinish={onOk}
            formRef={formRef}
            modalProps={{
                maskClosable: false,
                onCancel: () => setVisible(false),
            }}
            columns={cols}
        />
    );
};