import styles from "./layout.module.less";
import {Button, Menu, MenuProps, Modal, notification, Popconfirm} from "antd";
import {Outlet, useLocation} from "react-router-dom";
import {clearUserTokenInfo, userLogout} from "../../services";
import {useNavigate} from "react-router";
import React, {useEffect, useState} from "react";
import myLocalstorage from "../../utils/localstorage.ts";

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
    getItem('工作计划管理', '/work-plan', null,),
    getItem('用户管理', '/user-mgt', null,),
    getItem('部门协同', '/dept-issue', null,),
];


const Layout = () => {
    const navigate = useNavigate();
    const myLocation = useLocation();
    const [current, setCurrent] = useState('');

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

    function onMenuClick(e: any) {
        setCurrent(e.key);
        navigate(e.key);
    }

    useEffect(() => {
        setCurrent(myLocation.pathname);
    }, [myLocation])

    const isPublisher = myLocalstorage.get('role') === 'publisher';

    return (
        <>
            <div className={styles.context}>
                <div className={styles.head}>
                    <div className={styles.headLeft}>泽宇智能工作计划管理</div>
                    <div className={styles.headMid}>
                        <Menu className={styles.menus} onClick={onMenuClick} selectedKeys={[current]} mode="horizontal"
                              items={isPublisher ? items : items.filter(o => o.key !== '/user-mgt')}/>
                    </div>
                    <div className={styles.headRight}>
                        <span style={{marginRight: 16, cursor: 'pointer'}}>
                            欢迎您！{(localStorage.getItem('name') || '').replace(/"/g, '')}
                          </span>
                        <Button type='primary' danger onClick={onExit}>
                            退出登录
                        </Button>
                    </div>
                </div>
                <div className={styles.innerContent}>
                    <Outlet/>
                </div>
            </div>
        </>

    )
}

export default Layout;