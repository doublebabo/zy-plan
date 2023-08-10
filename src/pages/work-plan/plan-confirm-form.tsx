import {useLocation, useNavigate, useParams} from "react-router";
import React, {useEffect, useRef} from "react";
import myLocalstorage from "../../utils/localstorage.ts";
import {ProForm, ProFormRadio, ProFormTextArea} from "@ant-design/pro-components";
import styles from './plan-confirm-form.module.less';
import {ArrowLeftOutlined} from "@ant-design/icons";
import {Button} from "antd";
import {
    leaderOrEmployeeStatus,
    monthPlancomment,
    monthPlanemployee,
    monthPlanleader,
    weekPlancomment,
    weekPlanemployee,
    weekPlanleader
} from "../../services";
import addWeekPlanModal from "./add-week-plan-modal.tsx";

export default React.forwardRef(function PlanConfirmForm(props: any, ref: any) {
    const {} = props;

    const navigate = useNavigate();
    const location = useLocation();
    const useparams = useParams();
    const dom = useRef();

    const type = location.state; // month / week
    console.log(location)

    const isPublisher = myLocalstorage.get('role') === 'publisher'; // 领导

    const [formRefStaff, formRefLeader, formRefThird] = [useRef(), useRef(), useRef()];


    async function onStaffConfirm(formData: any) {
        const api = type === 'month' ? monthPlanemployee : weekPlanemployee;
        const idType = type === 'month' ? 'monthId' : 'weekPlanId'
        const res = await api({...formData, [idType]: useparams.id})
        if (res.success) {
            history.go(-1);
        }
    }

    async function onLeaderConfirm(formData: any) {
        const api = type === 'month' ? monthPlanleader : weekPlanleader;
        const idType = type === 'month' ? 'monthId' : 'weekPlanId'
        const res = await api({...formData, [idType]: useparams.id})
        if (res.success) {
            history.go(-1);
        }
    }


    async function onThirdConfirm(formData: any) {
        const api = type === 'month' ? monthPlancomment : weekPlancomment;
        const idType = type === 'month' ? 'monthId' : 'weekPlanId'
        const res = await api({...formData, [idType]: useparams.id})
        if (res.success) {
            history.go(-1);
        }
    }


    useEffect(() => {
        window.scroll(0, 0);
    }, [useparams.id]);

    return (
        <div className={styles.planConfirmForm} ref={dom}>
            <div className={styles.planConfirmFormHead}>
                <Button icon={<ArrowLeftOutlined /> } style={{marginRight: 14}} shape="round"  onClick={() => {
                    window.history.go(-1);
                }}></Button>工作确认
            </div>

            <div className={styles.planConfirmFormContentItem}>

                <div className={styles.planConfirmFormTitle}>员工工作计划完成描述</div>
                <ProForm
                    formRef={formRefStaff}
                    autoFocus={false}
                    disabled={isPublisher}
                    onFinish={onStaffConfirm}

                    submitter={{
                        searchConfig: {
                            submitText: '确认',
                        },
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },
                    }}
                >
                    <ProFormRadio.Group
                        name="employeeStatus"
                        rules={[{ required: true, message: '这是必填项' }]}
                        options={leaderOrEmployeeStatus}
                    />
                    <ProFormTextArea
                        name="content"
                        label="工作内容"

                        placeholder="请输入"
                        required={true}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormTextArea
                        name="achievement"
                        label="工作成果"

                        placeholder="请输入"
                        required={true}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                    <ProFormTextArea
                        name="problem"
                        label="遗留问题"
                        placeholder="请输入"
                        required={true}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />

                </ProForm>

            </div>

            <div className={styles.planConfirmFormContentItem}>
                <div className={styles.planConfirmFormTitle}>部门经理工作计划确认</div>
                <ProForm
                    formRef={formRefLeader}
                    autoFocus={false}
                    disabled={!isPublisher}
                    submitter={{
                        searchConfig: {
                            submitText: '确认',
                        },
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },
                    }}
                    onFinish={onLeaderConfirm}
                >
                    <ProFormRadio.Group
                        name="leaderStatus"
                        rules={[{ required: true, message: '这是必填项' }]}
                        options={leaderOrEmployeeStatus}
                    />
                    <ProFormTextArea
                        name="comment"
                        label="意见"
                        placeholder="请输入"
                        required={true}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                </ProForm>
            </div>


            <div className={styles.planConfirmFormContentItem}>
                <div className={styles.planConfirmFormTitle}>第三方意见</div>
                <ProForm
                    formRef={formRefThird}
                    autoFocus={false}
                    title='第三方意见'
                    onFinish={onThirdConfirm}
                    submitter={{
                        searchConfig: {
                            submitText: '确认',
                        },
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },
                    }}
                >
                    <ProFormTextArea
                        name="comment"
                        label="意见"
                        placeholder="请输入"
                        required={true}
                        rules={[{ required: true, message: '这是必填项' }]}
                    />
                </ProForm>
            </div>
        </div>
    )
});