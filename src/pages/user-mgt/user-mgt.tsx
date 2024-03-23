import styles from './user-mgt.module.less';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProTable} from '@ant-design/pro-components';
import {Button, Modal} from "antd";
import ModifyModal from "./modify-modal.tsx";
import {delUser, userList, yesOrNoEnumValue} from "../../services";
import {PlusOutlined} from "@ant-design/icons";
import myLocalstorage from "../../utils/localstorage.ts";

const {confirm} = Modal;

const getColumns = (navigate: any, {onDelete, onShowModal}: any) => [
    {
        dataIndex: 'id',
        hideInTable: true,
        hideInSearch: true,
    },
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index',
        hideInSearch: true,

    },
    {
        title: '姓名',
        dataIndex: 'name',
        ellipsis: true,
    },
    {
        title: '部门',
        dataIndex: 'deptName',
        ellipsis: true,
        hideInSearch: true,

    },
    {
        title: '账号',
        dataIndex: 'account',
        ellipsis: true,
        hideInSearch: true,

    },
    {
        title: '是否管理者',
        dataIndex: 'manager',
        ellipsis: true,
        valueEnum: yesOrNoEnumValue,
        hideInSearch: true,

    },
    {
        title: '是否管理员',
        dataIndex: 'admin',
        ellipsis: true,
        valueEnum: yesOrNoEnumValue,
        hideInSearch: true,

    },
    {
        title: '操作',
        dataIndex: 'title',
        valueType: 'option',
        fixed: 'right',
        width: 100,
        render: (text, record, _, action) => [
            <a
                key="editable"
                onClick={() => {
                    onShowModal('edit', record)
                }}
            >
                <span>编辑</span>
            </a>,
            <a onClick={() => onDelete(record)} target="_blank" rel="noopener noreferrer" key="view">
                删除
            </a>,
        ],
    },
]

const UserMgt = () => {

  const isManager = myLocalstorage.get('manager') === 1;
  const isAdmin = myLocalstorage.get('admin') === 1;

  if (!isManager && !isAdmin) {
    throw Error('没有权限')
  }

    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState<any>(null);

    function onShowModal(type: string, record?: any) {
        setModalType(type);
        setModalVisible(true);
        setRecord(record);
    }

    function onDelete(record: any) {
        confirm({
            icon: null,
            title: <span className={styles.modalTitle}>确认要删除吗？</span>,
            closable: true,
            wrapClassName: styles.logoutModal,
            okText: '确定',
            cancelText: '取消',
            okButtonProps: {loading: loading},
            async onOk() {
                if (loading) return;
                setLoading(true)
                const res = await delUser(record.id);
                setLoading(false)
                if (res.success) {
                    actionRef?.current?.reload();
                    setModalVisible(false);
                }
            },
        });
    }

    useEffect(() => {
        setCols([...getColumns(navigate, {onDelete, onShowModal})]);
    }, []);

  return (
      <div className={styles.container}>
        <ProTable
            columns={cols}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}, sort, filter) => {
              return userList({...params, name: params?.name?.trim()})
            }}
            rowKey="id"
            search={{
              defaultColsNumber: 4,
            }}
            form={{
              syncToUrl: (values, type) => {
                return values;
              },
              // initialValues: {name: null}
            }}
            options={{
              setting: false,
              density: false
            }}
            pagination={{
              // pageSize: 10,
              defaultPageSize: 10,
              pageSizeOptions: [10, 20, 50],
            }}
            dateFormatter="string"
            headerTitle="用户列表"
            toolBarRender={() => [
              <Button
                  key="button"
                  icon={<PlusOutlined/>}
                  type="primary"
                  onClick={() => onShowModal('add')}
              >
                创建用户
              </Button>,
            ]}
        />
        <ModifyModal visible={modalVisible} onSuccess={() => {
          actionRef?.current?.reload();
        }} setVisible={setModalVisible} type={modalType} record={record}/>
      </div>
  );
}

export default UserMgt;