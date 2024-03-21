import {BetaSchemaForm, ProColumns, ProFormInstance} from "@ant-design/pro-components";
import {useEffect, useRef, useState} from "react";
import {addUser, deptList, deptTree, editUser, getManagersOfStaff, roleList} from "../../services";
import {notification} from "antd";
import myLocalstorage from "../../utils/localstorage.ts";

const getColumns = ({type}): ProColumns<any>[] => {
  return [
    {
      title: '登录账号',
      dataIndex: 'account',
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
        fieldNames: {
          label: 'name',
          value: 'id'
        },
        showSearch: true,
        filterTreeNode: (input, treeNode) => {
          return treeNode?.name.toLowerCase().indexOf(input.toString().toLowerCase()) > -1
        }
      },
      request: async () => {
        const {data} = await deptTree();
        return (data || []);
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
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
      title: '直接领导',
      dataIndex: 'managerAccountList',
      formItemProps: {
        rules: [],
      },
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      request: async () => {
        const {data} = await getManagersOfStaff(myLocalstorage.get('name'));
        return (data || []).map(o => ({label: `${o.name}(${o.deptName})`, value: o.id}));
      },
    },
    {
      title: '是否管理者',
      dataIndex: 'manager',
      valueType: 'switch',
      fieldProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      formItemProps: {
        rules: [],
      },
    },
    {
      title: '是否管理员',
      dataIndex: 'admin',
      valueType: 'switch',
      fieldProps: {
        checkedChildren: '是',
        unCheckedChildren: '否',
      },
      formItemProps: {
        rules: [],
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
    // if (values.password !== values.password2) {
    //     notification.error({message: '两次密码输入不一致', duration: 1.5, description: null})
    //     return;
    // }
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
    setCols([...getColumns({type})]);
    if (record) {
      const formData = {...record};
      formData.password = '';
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