import {
    BetaSchemaForm,
    ProForm,
    ProFormColumnsType,
    ProFormInstance,
    ProFormText, ProFormTextArea,
    ProTable
} from "@ant-design/pro-components";
import {useEffect, useRef, useState} from "react";
import {waitTime} from "./week-plan.tsx";
import {message, Modal} from "antd";

const getColumns = (): ProFormColumnsType<any>[]  => {
        return [
            {
                title: '计划周数',
                dataIndex: 'title',
                valueType: 'select',
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ],
                },
            },
            {
                title: '工作名称',
                dataIndex: 'title2',
                formItemProps: {
                    rules: [
                        {
                            required: true,
                            message: '此项为必填项',
                        },
                    ],
                },
            },
            {
                title: '工作内容',
                dataIndex: 'title3',
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
}


const tableCols = [
    {
        title: '序号',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '工作名称',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '原/修改工作内容',
        dataIndex: 'title3',
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
    {
        title: '创建时间',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '截止时间',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '完成时间',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '计划完成状态',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
]


export default function WorkDetailModal(props: any) {

    const {type,visible, setVisible} = props;

    const [formRef, formRefEdit] = [useRef<ProFormInstance>(),useRef<ProFormInstance>()];

    const [cols, setCols] = useState<any>([]);

    const title = type === 'add' ? '新增工作计划' : '周计划编辑';

    function onOk() {
        formRefEdit?.current?.validateFields()?.then(values => {
            console.log(values)
        })
    }

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
        setCols(getColumns());
    }, [visible, type]);


    return (
        <>
            {type === 'add' && (
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
            )}
            {
                type === 'edit' && (
                    <Modal
                        open={visible}
                        title={title}
                        width='80%'
                        onCancel={() => setVisible(false)}
                        onOk={onOk}
                        >
                        <ProForm
                            formRef={formRefEdit}
                            submitter={false}
                        >
                            <ProForm.Group>
                                <ProFormText
                                    width="md"
                                    name="name"
                                    label="序号"
                                    readonly={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="工作名称"
                                    readonly={true}
                                />
                                <ProFormTextArea
                                    width="md"
                                    name="company1"
                                    label="工作内容"
                                    placeholder="请输入"
                                    required={true}
                                    rules={[{ required: true, message: '这是必填项' }]}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="创建时间"
                                    readonly={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="截止时间"
                                    readonly={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="完成时间"
                                    readonly={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="计划完成状态"
                                    readonly={true}
                                />
                            </ProForm.Group>
                            <ProForm.Item
                                label="历史周计划编辑记录"
                                name="dataSource"
                                trigger="onValuesChange"
                            >
                                <ProTable
                                    dataSource={[]}
                                    rowKey="key"
                                    pagination={{
                                        showQuickJumper: true,
                                    }}
                                    columns={tableCols}
                                    search={false}
                                    dateFormatter="string"
                                    headerTitle="表格标题"
                                    toolBarRender={false}
                                />
                            </ProForm.Item>
                        </ProForm>
                    </Modal>

                )
            }
        </>
    );
};