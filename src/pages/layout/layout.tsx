import styles from "./layout.module.less";
import {Button, Menu, MenuProps, Modal, notification, Popconfirm} from "antd";
import {Outlet, useLocation} from "react-router-dom";
import {clearUserTokenInfo} from "../../services";
import {useNavigate} from "react-router";
import React, {useEffect, useState} from "react";

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
    getItem('用户管理', '/user-mgt', null,),
    getItem('工作计划管理', '/work-plan', null,),
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
            onOk() {
                notification.success({message: '退出成功', duration: 3, description: null});
                clearUserTokenInfo();
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

    return (
        <>
            <div className={styles.context}>
                <div className={styles.head}>
                    <div className={styles.headLeft}>泽宇研究院工作计划管理系统</div>
                    <div className={styles.headMid}>
                        <Menu className={styles.menus} onClick={onMenuClick} selectedKeys={[current]} mode="horizontal"
                              items={items}/>
                    </div>
                    <div className={styles.headRight}>
                        <Popconfirm
                            title={null}
                            description={
                                <div className={styles.popup} style={{width: 200}}>
                                    <div>一级部门：xxx</div>
                                    <div>二级部门：xxx</div>
                                    <div>权限：xxx</div>
                                    <div>账号：xxx</div>
                                    <div>创建时间：xxx</div>
                                </div>
                            }
                            showCancel={false}
                            defaultOpen={true}
                            icon={null}
                            okText="确认"
                        >
                           <span style={{marginRight: 16, cursor: 'pointer'}}>
                            欢迎您！xxxx
                          </span>
                        </Popconfirm>

                        <Button type="default">
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
        </>

    )
}

export default Layout;