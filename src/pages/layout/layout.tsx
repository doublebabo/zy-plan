import styles from "./layout.module.less";
import {Button, Menu, MenuProps, message, Modal, notification, Popconfirm} from "antd";
import {Outlet, useLocation} from "react-router-dom";
import {clearUserTokenInfo, userLogout, userUpdatePassword} from "../../services";
import {useNavigate} from "react-router";
import React, {useEffect, useRef, useState} from "react";
import myLocalstorage from "../../utils/localstorage.ts";
import {ProForm, ProFormInstance, ProFormText} from "@ant-design/pro-components";

const {confirm} = Modal;
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    getItem('工作计划编辑', '/work-plan', null,),
    getItem('部门问题管理', '/dept-issue', null,),
    getItem('用户管理', '/user-mgt', null,),
];


const Layout = () => {
    const navigate = useNavigate();
    const myLocation = useLocation();
    const [current, setCurrent] = useState('');

    const [pwdChangeVisible, setPwdChangeVisible] = useState(false);

    const [confirmLoading, setConfirmLoading] = useState(false);

    const formRef = useRef<ProFormInstance>();

    function onExit() {
        confirm({
            icon: null,
            title: <span className={styles.modalTitle}>确认要退出登录吗？</span>,
            closable: true,
            wrapClassName: styles.logoutModal,
            okText: '确定',
            cancelText: '取消',
            async onOk() {
                await userLogout();
                navigate('/');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    function onChangePwd() {
        formRef.current?.validateFields?.().then(async (values: any) => {
            if (values.p1 !== values.p2) {
                message.warning('两次密码输入不一致');
                return;
            }
            setConfirmLoading(true);
            await userUpdatePassword({
                userId: myLocalstorage.get('id'),
                password: values.p1,
            });
            setConfirmLoading(false);
            setPwdChangeVisible(false);
            await userLogout();
            navigate('/');
        })
    }

    function onMenuClick(e: any) {
        setCurrent(e.key);
        navigate(e.key);
    }

    useEffect(() => {
        setCurrent(myLocation.pathname);
    }, [myLocation])

    const isManager = myLocalstorage.get('manager') === 1;
    const isAdmin = myLocalstorage.get('admin') === 1;

    return (
        <>
            <div className={styles.context}>
                <div className={styles.head}>
                    <div className={styles.headLeft}>泽宇智能工作管理</div>
                    <div className={styles.headMid}>
                        <Menu className={styles.menus} onClick={onMenuClick} selectedKeys={[current]} mode="horizontal"
                              items={isManager || isAdmin ? items : items.filter(o => o.key !== '/user-mgt')}/>
                    </div>
                    <div className={styles.headRight}>
                        <span style={{marginRight: 16, cursor: 'pointer'}}>
                            欢迎您！{(localStorage.getItem('name') || '').replace(/"/g, '')}
                          </span>
                        <Button type='primary' style={{backgroundColor: '#7cb305'}} onClick={() => {
                            setPwdChangeVisible(true)
                            formRef.current.resetFields();
                        }}>
                            修改密码
                        </Button>
                        <Button type='primary' danger onClick={onExit}>
                            退出登录
                        </Button>
                    </div>
                </div>
                <div className={styles.innerContent}>
                    <Outlet/>
                </div>
            </div>
            <Modal
                open={pwdChangeVisible}
                onOk={onChangePwd}
                onCancel={() => setPwdChangeVisible(false)}
                confirmLoading={confirmLoading}
            >
                <ProForm
                    formRef={formRef}
                    submitter={false}
                >
                    <ProFormText.Password
                        name="p1"
                        required
                        label="新密码"
                        placeholder="请输入"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormText.Password
                        name="p2"
                        required
                        label="确认密码"
                        placeholder="请输入"
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                </ProForm>
            </Modal>

        </>

    )
}

export default Layout;