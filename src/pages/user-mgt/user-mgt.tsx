import styles from './user-mgt.module.less';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {ActionType, ProTable} from '@ant-design/pro-components';
import request from "umi-request";
import {Button, Modal} from "antd";
import {waitTime} from "../work-plan/work-plan.tsx";
import ModifyModal from "./modify-modal.tsx";
import {delUser} from "../../services";
import {useRequest} from "ahooks";
import {PlusOutlined} from "@ant-design/icons";

const {confirm} = Modal;

const getColumns = (navigate: any, {onDelete, onShowModal}: any) => [
    {
        title: '序号',
        dataIndex: 'index',
        width: 48,
        valueType: 'index'
    },

    {
        title: '姓名',
        dataIndex: 'title',
        ellipsis: true,
    },

    {
        title: '一级部门',
        dataIndex: 'title',
        ellipsis: true,
    },

    {
        title: '二级部门',
        dataIndex: 'title',
        ellipsis: true,
    },

    {
        title: '权限',
        dataIndex: 'title',
        ellipsis: true,
    },

    {
        title: '账号',
        dataIndex: 'title',
        ellipsis: true,
    },

    {
        title: '创建时间',
        dataIndex: 'title',
        ellipsis: true,
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
    const navigate = useNavigate();
    const actionRef = useRef<ActionType>();
    const [cols, setCols] = useState<any>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<string>('');

    const delReq = useRequest(delUser, {
        manual: true,
    });

    function onShowModal(type: string, record?: any) {
        setModalType(type);
        setModalVisible(true);
    }

    function onDelete(record: any) {
        confirm({
            icon: null,
            title: <span className={styles.modalTitle}>确认要删除吗？</span>  ,
            closable: true,
            wrapClassName: styles.logoutModal,
            okText: '确定',
            cancelText: '取消',
            okButtonProps: {loading: delReq.loading},
            onOk() {
                // todo
                delReq.run(record);
            },
        });
    }

    useEffect(() => {
        setCols(getColumns(navigate, {onDelete, onShowModal}));
    }, []);

    return (
        <div className={styles.container}>
            <ProTable
                columns={cols}
                actionRef={actionRef}
                cardBordered
                request={async (params = {}, sort, filter) => {
                    console.log(sort, filter);
                    await waitTime(2000);
                    return request<{
                        data: any[];
                    }>('https://proapi.azurewebsites.net/github/issues', {
                        params,
                    });
                }}
                rowKey="id"
                search={false}
                options={{
                    setting: false,
                    density: false
                }}
                form={{
                    // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                    syncToUrl: (values, type) => {
                        if (type === 'get') {
                            return {
                                ...values,
                                created_at: [values.startTime, values.endTime],
                            };
                        }
                        return values;
                    },
                }}
                pagination={{
                    pageSize: 10,
                    pageSizeOptions: [10, 20, 50],
                    onChange: (page) => console.log(page),
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
            <ModifyModal visible={modalVisible} setVisible={setModalVisible} type={modalType} />
        </div>
    )
}

export default UserMgt;