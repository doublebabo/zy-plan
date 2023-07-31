import {
    BetaSchemaForm,
    ProForm,
    ProFormColumnsType, ProFormDatePicker,
    ProFormInstance,
    ProFormText, ProFormTextArea,
    ProTable,
    ProFormSelect
} from "@ant-design/pro-components";
import {useEffect, useRef, useState} from "react";
import {Modal} from "antd";
import {monthHistory, monthPlanAdd, monthPlanEdit, monthPlanUserList, planStatus} from "../../services";

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
        dataIndex: 'content',
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
        dataIndex: 'startTime',
        valueType: 'date',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        fieldProps: {
            format: 'YYYY-MM-DD',
        },
        width: '100%'
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
        valueType: 'date',
        fieldProps: {
            format: 'YYYY-MM-DD',
        },
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
        dataIndex: 'executor',
        valueType: 'select',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
        request: async () => {
            const {data} = await monthPlanUserList();
            return (data || []).map(o => ({label: o.nickName, value: o.id}))
        }
    },
    {
        title: '协助人',
        dataIndex: 'participant',
        valueType: 'select',
        fieldProps: {
            mode: 'multiple',
            showSearch: true
        },
        request: async () => {
            const {data} = await monthPlanUserList();
            return (data || []).map(o => ({label: o.nickName, value: o.nickName}))
        }
    },
];


const tableCols = [
    {
        title: '一级部门',
        dataIndex: 'deptFirst',
    },
    {
        title: '二级部门',
        dataIndex: 'deptSecond',
    },
    {
        title: '原/修改工作名称',
        dataIndex: 'title',
    },
    {
        title: '原/修改工作内容',
        dataIndex: 'content',
        valueType: 'textarea',
    },
    {
        title: '原/修改开始时间',
        dataIndex: 'startTime',
    },
    {
        title: '原/修改截止时间',
        dataIndex: 'endTime',
    },
    {
        title: '原/修改完成时间',
        dataIndex: 'finishTime',
    },
    {
        title: '原/修改责任人',
        dataIndex: 'executor',
    },
    {
        title: '原/修改参与人',
        dataIndex: 'participant',
    },
]

export default function MonthPlanModal(props: any) {

    const {type, visible, setVisible, onSuccess, isPublisher, record} = props;

    const [formRef, formRefEdit] = [useRef<ProFormInstance>(), useRef<ProFormInstance>()];

    const [loading, setLoading] = useState(false);

    const [dataSource, setDataSource] = useState<any>([]);

    const title = type === 'add' ? '新增月工作计划' : '月计划编辑';

    function onEditOk() {
        formRefEdit?.current?.validateFields()?.then(async values => {
            let result;
            setLoading(true);
            result = await monthPlanEdit({...values, monthPlanId: record.id});
            setLoading(false);
            if (result.success) {
                onSuccess?.();
                setVisible(false);
            }
        })
    }

    async function onAddOk(values) {
        const result = await monthPlanAdd(values);
        if (result.success) {
            onSuccess?.();
            setVisible(false);
        }
        return true;
    }

    async function getHistory(id) {
        const {data = []} = await monthHistory(id);
        setDataSource(data);
    }

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
        if (record) {
            if (visible) getHistory(record.id);
            record.participant = record?.participant?.split?.(',');
            formRefEdit?.current?.setFieldsValue?.(record);
        }
    }, [visible, type, record]);


    return (
        <>
            {
                type === 'add' && (
                    <BetaSchemaForm
                        open={visible}
                        layoutType='ModalForm'
                        title={title}
                        onFinish={onAddOk}
                        formRef={formRef}
                        modalProps={{
                            maskClosable: false,
                            onCancel: () => setVisible(false),
                            okButtonProps: {loading: loading}
                        }}
                        columns={isPublisher ? cols : cols.filter((col) => col.title !== '责任人')}
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
                        onOk={onEditOk}
                    >
                        <ProForm
                            formRef={formRefEdit}
                            submitter={false}
                        >
                            <ProForm.Group>
                                <ProFormText
                                    width="md"
                                    name="deptFirst"
                                    label="一级部门"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="deptSecond"
                                    label="二级部门"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="title"
                                    label="工作名称"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormTextArea
                                    width="md"
                                    name="content"
                                    label="工作内容"
                                    placeholder="请输入"
                                    required={true}
                                    rules={[{required: true, message: '这是必填项'}]}
                                />
                                <ProFormDatePicker
                                    width="md"
                                    name="startTime"
                                    label="开始时间"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormDatePicker
                                    width="md"
                                    name="endTime"
                                    label="截止时间"
                                    rules={[{required: true, message: '这是必填项'}]}

                                />
                                <ProFormDatePicker
                                    width="md"
                                    name="finishTime"
                                    label="完成时间"
                                    disabled={true}
                                />
                                <ProFormSelect
                                  width="md"
                                  name="monthStatus"
                                  label="完成状态"
                                  disabled={true}
                                  request={async () => planStatus}
                                ></ProFormSelect>
                                <ProFormSelect
                                  width="md"
                                  name="executor"
                                  label="责任人"
                                  disabled={!isPublisher}
                                  rules={[{required: true, message: '这是必填项'}]}
                                  request={async () => {
                                      const {data} = await monthPlanUserList();
                                      return (data || []).map(o => ({label: o.nickName, value: o.id}))
                                  }}
                                ></ProFormSelect>
                                <ProFormSelect
                                  width="md"
                                  name="participant"
                                  label="参与人"
                                  fieldProps={{
                                        mode: 'multiple',
                                        showSearch: true
                                  }}
                                  request={async () => {
                                      const {data} = await monthPlanUserList();
                                      return (data || []).map(o => ({label: o.nickName, value: o.nickName}))
                                  }}
                                ></ProFormSelect>
                            </ProForm.Group>
                            <ProForm.Item
                                label="历史月计划编辑记录"
                                name="dataSource"
                                trigger="onValuesChange"
                            >
                                <ProTable
                                    dataSource={dataSource}
                                    rowKey="id"
                                    columns={tableCols}
                                    search={false}
                                    dateFormatter="string"
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