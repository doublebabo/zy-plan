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

const getColumns = (type: string): ProFormColumnsType<any>[] => {
    if (type === 'staff') {
        return [
            {
                // title: '计划周数',
                dataIndex: 'title',
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
                    1: {
                        text: '已完成',
                    },
                    0: {
                        text: '未完成',
                    }
                }
            },
            {
                title: '工作描述',
                dataIndex: 'title',
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
                dataIndex: 'title',
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
                    1: {
                        text: '已完成',
                    },
                    0: {
                        text: '未完成',
                    }
                }
            },
            {
                title: '意见',
                dataIndex: 'title',
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

    const {type, visible, setVisible} = props;

    const [formRef] = [useRef<ProFormInstance>()];

    const [cols, setCols] = useState<any>([]);

    const title = type === 'staff' ? '员工工作计划完成描述' : '部门经理工作计划确认';

    useEffect(() => {
        setCols(getColumns(type));
    }, [type]);

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
    }, [visible])


    return (
        <>
            <BetaSchemaForm
                open={visible}
                layoutType='ModalForm'
                title={title}
                onFinish={async (values) => {
                    console.log(values);
                }}
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