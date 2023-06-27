import {
    BetaSchemaForm,
    ProForm,
    ProFormColumnsType,
    ProFormInstance,
    ProFormText,
    ProTable
} from "@ant-design/pro-components";
import {useEffect, useRef, useState} from "react";
import {waitTime} from "./week-plan.tsx";
import {message, Modal} from "antd";
import {arrayToMap, leaderOrEmployeeStatus, weekPlanDetail, weekPlanEmployee, weekPlanLeader} from "../../../services";
import myLocalstorage from "../../../utils/localstorage.ts";

const getColumns = (disabled): ProFormColumnsType<any>[] => {

    return [
        {
            title: '员工工作计划确认',
            valueType: 'group',
            colProps: {
                span: 24
            },
            columns: [
                {
                    dataIndex: 'employeeStatus',
                    valueType: 'radio',
                    formItemProps: {
                        rules: [
                            {
                                required: true,
                                message: '此项为必填项',
                            },
                        ],
                    },
                    fieldProps: {
                        disabled: disabled
                    },
                    valueEnum : arrayToMap(leaderOrEmployeeStatus),
                    width: '100%',
                },
                {
                    title: '工作描述',
                    dataIndex: 'comment',
                    valueType: 'textarea',
                    formItemProps: {
                        rules: [
                            {
                                required: true,
                                message: '此项为必填项',
                            },
                        ],
                    },
                    fieldProps: {
                        disabled: disabled
                    },
                    width: '100%',

                },
            ]
        },
    ]
}

const getColumns2 = (disabled): ProFormColumnsType<any>[] => {
    return [
        {
            title: '部门经理工作计划确认',
            valueType: 'group',
            colProps: {
                span: 24
            },

            columns: [
                {
                    dataIndex: 'leaderStatus',
                    valueType: 'radio',
                    formItemProps: {
                        rules: [
                            {
                                required: true,
                                message: '此项为必填项',
                            },
                        ],
                    },
                    fieldProps: {
                        disabled: disabled
                    },
                    valueEnum : arrayToMap(leaderOrEmployeeStatus),
                    width: '100%',
                },
                {
                    title: '意见',
                    dataIndex: 'comment',
                    valueType: 'textarea',
                    fieldProps: {
                        disabled: disabled
                    },
                    formItemProps: {
                        rules: [
                            {
                                required: true,
                                message: '此项为必填项',
                            },
                        ],
                    },
                    width: '100%',

                },
            ]
        }
    ]
}

export default function ConfirmModal(props: any) {

    const {type, visible, setVisible, weekPlanId, onSuccess} = props;

    const [formRef, formRef2] = [useRef<ProFormInstance>(), useRef<ProFormInstance>()];

    const [cols, setCols] = useState<any>([]);
    const [cols2, setCols2] = useState<any>([]);

    const [canEmployeeEdit, setCanEmployeeEdit] = useState(false);
    const [canLeaderEdit, setCanLeaderEdit] = useState(false);


    async function onEmployeeOk(values) {
        const result = await weekPlanEmployee({
            weekPlanId,
            employeeStatus: +values.employeeStatus,
            comment: values.comment
        });
        if (result.success) {
            onSuccess?.();
            setVisible(false);
        }
        return true
    }

    async function onLeaderOk(values) {
        const result = await weekPlanLeader({
            weekPlanId,
            leaderStatus: +values.leaderStatus,
            comment: values.comment
        });
        if (result.success) {
            onSuccess?.();
            setVisible(false);
        }
        return true
    }


    useEffect(() => {
        // 是否是领导
        if (visible) {
            // 员工角度：
            // 在员工确认之前，员工部分可以输入，
            // 领导部分不可以输入；确认之后，都不可以输入，但是可以展示刚刚确认的结果
            // 领导角度：
            // 在员工确认之前，员工部分和领导部分都可以输入；
            // 员工确认之后，员工部分不可以修改，领导确认之后，领导部分也不可以修改，但可以展示员工和领导确认的结果
            // 其中employeeStatus和leaderStatus
            // 0表示未确认，1表示确认为未完成，2表示确认为已完成
            formRef?.current?.resetFields();
            formRef2?.current?.resetFields();
            weekPlanDetail(weekPlanId).then(res => {
                const {employeeStatus, leaderStatus} = res?.data;
                const isPublisher = myLocalstorage.get('role') === 'publisher';
                let canEmployeeEdit = false;
                // 员工打开这个页面时，领导的部分是灰色的，员工的部分只有当 employeeStatus 是 0 的时候可以进行输入和选择完成未完成
                if (!isPublisher) {
                    if (employeeStatus === 0) {
                        canEmployeeEdit = true
                    }
                } else {
                    if (employeeStatus === 0) {
                        canEmployeeEdit = true
                    }
                }
                // 领导打开这个页面时候，分别看 employeeStatus 和 leaderStatus，哪个是 0，哪个就可以输入，否则是灰色
                let canLeaderEdit = false;
                if (isPublisher && leaderStatus === 0) {
                    canLeaderEdit = true
                }
                formRef?.current?.setFieldsValue({
                    employeeStatus: "" + res.data.employeeStatus,
                    comment: res.data.employeeComment,
                });
                formRef2?.current?.setFieldsValue({
                    leaderStatus: "" + res.data.leaderStatus,
                    comment: res.data.leaderComment,
                });
                setCanLeaderEdit(canLeaderEdit);
                setCanEmployeeEdit(canEmployeeEdit);
                setCols(getColumns(!canEmployeeEdit));
                setCols2(getColumns2(!canLeaderEdit));
            });
        }
    }, [visible, type, weekPlanId]);


    return (
        <>
            <Modal width={'65%'} open={visible} cancelText='关闭' okButtonProps={{style: {display: 'none'}}} onCancel={() => setVisible(false)}>
                <BetaSchemaForm
                    onFinish={onEmployeeOk}
                    formRef={formRef}
                    grid={true}
                    columns={cols}
                    submitter={{
                        searchConfig: {
                            submitText: '结果确认',
                        },
                        submitButtonProps: {
                            disabled: !canEmployeeEdit
                        },
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },
                    }}
                />
                <div style={{height: 40}}></div>
                <BetaSchemaForm
                    onFinish={onLeaderOk}
                    formRef={formRef2}
                    grid={true}
                    columns={cols2}
                    submitter={{
                        searchConfig: {
                            submitText: '结果确认',
                        },
                        submitButtonProps: {
                            disabled: !canLeaderEdit
                        },
                        // 配置按钮的属性
                        resetButtonProps: {
                            style: {
                                // 隐藏重置按钮
                                display: 'none',
                            },
                        },

                    }}
                />
            </Modal>

        </>
    );
};