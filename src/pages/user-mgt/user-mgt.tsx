import styles from './user-mgt.module.less';
import {Button, notification} from 'antd';
import {useRef, useState} from "react";
import {userLogin} from "../../services";
import {useNavigate} from "react-router";
import {BetaSchemaForm, ProFormColumnsType, ProFormInstance} from '@ant-design/pro-components';

const columns: ProFormColumnsType<any>[] = [
  {
    title: '用户名',
    dataIndex: 'username',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
    fieldProps: {
      size: 'large'
    },
    width: 'm',
  },
  {
    title: '密码',
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
    fieldProps: {
      size: 'large',
    },
    width: 'm',
  },
]

const UserMgt = () => {
  const formRef = useRef<ProFormInstance>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  async function onConfirm() {
    if (loading) return;
    formRef.current?.validateFields?.().then(async values => {
      setLoading(true);
      const res = await userLogin(values.code);
      if (res?.code === 200) {
        notification.success({message: '登录成功', duration: 3, description: null});
        navigate('/word');
      }
      setLoading(false);
    })
  }

  return (
    <div className={styles.login}>
      <h1>泽宇研究院工作计划管理系统</h1>
      <div className={styles.loginBox}>
        <BetaSchemaForm
            submitter={{
              render: () => {
                return [
                  <Button style={{width: '100%'}} type='primary' size='large' onClick={onConfirm} key="login">
                    立即登录
                  </Button>,
                ]
              }
            }}
            columns={columns} formRef={formRef} />
      </div>
    </div>
  )
}

export default UserMgt;