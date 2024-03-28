import styles from './login.module.less';
import {Button, notification} from 'antd';
import {useRef, useState} from "react";
import {useNavigate} from "react-router";
import {BetaSchemaForm, ProFormColumnsType, ProFormInstance} from '@ant-design/pro-components';
import {userLogin} from "../../services";
import bk from './../../assets/bk.svg'
import {LockOutlined, UserOutlined} from "@ant-design/icons";

const columns = ({onConfirm}) => [
    {
        title: '',
        dataIndex: 'account',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '请输入用户名',
                },
            ],
        },
        fieldProps: {
            size: 'large',
            placeholder: '用户名',
            prefix: <UserOutlined style={{color: '#00000073'}}/>

        },
        width: 'm',
    },
    {
        title: '',
        dataIndex: 'password',
        valueType: 'password',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '请输入密码',
                },
            ],
        },
        fieldProps: {
            size: 'large',
            placeholder: '密码',
            prefix: <LockOutlined style={{color: '#00000073'}}/>,
            style: {'marginTop': '5px'},
          onKeyPress: (e) => {
            if (e.charCode === 13) {
              onConfirm();
            }
          }
        },
        width: 'm',
    },
]

const Login = () => {
    const formRef = useRef<ProFormInstance>();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function onConfirm() {
        if (loading) return;
        formRef.current?.validateFields?.().then(async values => {
            setLoading(true);
            const res = await userLogin(values);
            if (res?.success) {
                if (res?.data?.admin === 1) {
                    navigate('/office-summary');
                } else {
                    navigate('/work-plan');
                }
            }
            setLoading(false);
        })
    }

    return (
        <div className={styles.login}>
            <h1>泽宇智能工作管理</h1>
            <img src={bk} alt=""/>
            <div className={styles.loginBox}>
                <div className={styles.header}>用户登录</div>
                <BetaSchemaForm
                    columns={columns({onConfirm})}
                    formRef={formRef}

                    submitter={{
                        render: () => {
                            return [
                                <Button loading={loading} style={{width: '100%', marginTop: 20}} type='primary' size='large'
                                        onClick={onConfirm} key="login">
                                    登录
                                </Button>,
                            ]
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Login;