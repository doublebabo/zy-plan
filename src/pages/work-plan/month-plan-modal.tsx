import {
    BetaSchemaForm,
    ProForm,
    ProFormColumnsType, ProFormDatePicker,
    ProFormInstance,
    ProFormText, ProFormTextArea,
    ProTable
} from "@ant-design/pro-components";
import {useEffect, useRef} from "react";
import {Modal} from "antd";

const cols: ProFormColumnsType<any>[] = [
    {
        title: '工作名称',
        dataIndex: 'title',
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
    {
        title: '开始时间',
        dataIndex: 'title',
        valueType: 'date',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        width: '100%'
    },
    {
        title: '截止时间',
        dataIndex: 'title',
        valueType: 'date',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        width: '100%'

    },
    {
        title: '责任人',
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
        title: '协助人',
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
];


const tableCols = [
    {
        title: '一级部门',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '二级部门',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '原/修改工作名称',
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
        title: '原/修改开始时间',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '原/修改截止时间',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '原/修改完成时间',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '原/修改责任人',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
    {
        title: '原/修改参与人',
        dataIndex: 'title3',
        fieldProps: {
            disabled: true,
        }
    },
]

export default function MonthPlanModal(props: any) {

    const {type, visible, setVisible} = props;

    const [formRef, formRefEdit] = [useRef<ProFormInstance>(), useRef<ProFormInstance>()];


    const title = type === 'add' ? '新增月工作计划' : '月计划编辑';

    function onOk() {
        formRefEdit?.current?.validateFields()?.then(values => {
            console.log(values)
        })
    }

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
    }, [visible, type]);


    return (
        <>
            {
                type === 'add' && (
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
                )
            }
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
                                    name="company"
                                    label="一级部门"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="name"
                                    label="二级部门"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="工作名称"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormTextArea
                                    width="md"
                                    name="company1"
                                    label="工作内容"
                                    placeholder="请输入"
                                    required={true}
                                    rules={[{required: true, message: '这是必填项'}]}
                                />
                                <ProFormDatePicker
                                    width="md"
                                    name="company"
                                    label="开始时间"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormDatePicker
                                    width="md"
                                    name="company"
                                    label="截止时间"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormDatePicker
                                    width="md"
                                    name="company"
                                    label="完成时间"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="完成状态"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="责任人"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="参与人"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                            </ProForm.Group>
                            <ProForm.Item
                                label="历史月计划编辑记录"
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