import {PoweroffOutlined} from "@ant-design/icons";
import styles from "./layout.module.less";
import {Dropdown, Menu, MenuProps, Modal, notification} from "antd";
import { Outlet } from "react-router-dom";
import {clearUserTokenInfo} from "../../services";
import {useNavigate} from "react-router";
import React from "react";

const { confirm } = Modal;
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
  getItem('Navigation One', 'sub1', null, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),

  getItem('Navigation Two', 'sub2', null, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),

  {type: 'divider'},

  getItem('Navigation Three', 'sub4', null, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),

  getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
];


const Layout = () => {
  const navigate = useNavigate();

  const nickName = localStorage.getItem('nick_name') || '';

  const img = localStorage.getItem('head_image_url') || '';

  const user_code = localStorage.getItem('user_code') || '';

  function onExit() {
    confirm({
      icon: null,
      content: <span className={styles.modalTitle}>确认要退出登录吗？</span>  ,
      closable: true,
      wrapClassName: styles.logoutModal,
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

  return (
    <>
      <div className={styles.context}>
        <div className={styles.head}>


          <Dropdown menu={{
            items: [
              {
                label: (
                    <a onClick={onExit} style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      退出<PoweroffOutlined/>
                    </a>
                ),
              },
            ]
          }}>
            <div className={styles.avatar}>
              <div className={styles.pic}><img src={img} alt=""/></div>
              <div className={styles.profile}>
                <div className={styles.phone}>{nickName}</div>
                <div className={styles.useId}>{nickName}id: {user_code}</div>
              </div>
            </div>
          </Dropdown>
        </div>
        <div className={styles.innerContent}>
          <Menu
              style={{ width: 256 }}
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              mode="inline"
              items={items}
              className={styles.left}
          />
          <div
              className={styles.right}
          >
            <Outlet/>
          </div>
        </div>
      </div>
    </>

  )
}

export default Layout;