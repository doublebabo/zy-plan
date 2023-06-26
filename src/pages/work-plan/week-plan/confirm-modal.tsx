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
import {weekPlanEmployee, weekPlanLeader} from "../../../services";

const getColumns = (type: string): ProFormColumnsType<any>[] => {
    if (type === 'staff') {
        return [
            {
                // title: '计划周数',
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
                valueEnum : {
                    2: {
                        text: '已完成',
                    },
                    1: {
                        text: '未完成',
                    }
                }
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
            },
        ];
    } else if (type === 'manager') {
        return [
            {
                // title: '计划周数',
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
                valueEnum : {
                    2: {
                        text: '已完成',
                    },
                    1: {
                        text: '未完成',
                    }
                }
            },
            {
                title: '意见',
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
            },
        ]
    }
    return [];
}

export default function ConfirmModal(props: any) {

    const {type, visible, setVisible, weekPlanId, onSuccess} = props;

    const [formRef] = [useRef<ProFormInstance>()];

    const [cols, setCols] = useState<any>([]);

    const title = type === 'staff' ? '员工工作计划完成描述' : '部门经理工作计划确认';

    async function onOk(values) {
        let result;
        if (type === 'staff') {
            result = await weekPlanEmployee({
                weekPlanId,
                employeeStatus: +values.employeeStatus,
                comment: values.comment
            });
        } else if (type === 'manager') {
            result = await weekPlanLeader({
                weekPlanId,
                leaderStatus: +values.leaderStatus,
                comment: values.comment
            });
        }
        if (result.success) {
            onSuccess?.();
            setVisible(false);
        }
    }

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
        setCols(getColumns(type));
    }, [visible, type]);


    return (
        <>
            <BetaSchemaForm
                open={visible}
                layoutType='ModalForm'
                title={title}
                onFinish={onOk}
                formRef={formRef}
                modalProps={{
                    maskClosable: false,
                    onCancel: () => setVisible(false),
                }}
                columns={cols}
            >
            </BetaSchemaForm>

        </>
    );
};