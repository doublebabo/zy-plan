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
import {arrayToMap, planStatus, weekHistory, weekPlanAdd, weekPlanEdit} from "../../../services";

const getColumns = (): ProFormColumnsType<any>[]  => {
        return [
            // {
            //     title: '计划周数',
            //     dataIndex: 'title',
            //     valueType: 'select',
            //     formItemProps: {
            //         rules: [
            //             {
            //                 required: true,
            //                 message: '此项为必填项',
            //             },
            //         ],
            //     },
            // },
            // {
            //     title: '工作名称',
            //     dataIndex: 'title2',
            //     formItemProps: {
            //         rules: [
            //             {
            //                 required: true,
            //                 message: '此项为必填项',
            //             },
            //         ],
            //     },
            // },
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
        ];
}


const tableCols = [
    // {
    //     title: '工作名称',
    //     dataIndex: 'title',
    // },
    {
        title: '原/修改工作内容',
        dataIndex: 'content',
        valueType: 'textarea',
 
    },
    {
        title: '创建时间',
        dataIndex: 'startTime',
 
    },
    {
        title: '截止时间',
        dataIndex: 'endTime',
 
    },
    {
        title: '完成时间',
        dataIndex: 'finishTime',
    },
    {
        title: '计划完成状态',
        dataIndex: 'status',
        valueEnum: arrayToMap(planStatus),
    },
]


export default function WorkDetailModal(props: any) {

    const {type,visible, setVisible, onSuccess, monthId, record} = props;

    const [formRef, formRefEdit] = [useRef<ProFormInstance>(),useRef<ProFormInstance>()];

    const [cols, setCols] = useState<any>([]);



    const [loading, setLoading] = useState(false);

    const [dataSource, setDataSource] = useState<any>([]);

    const title = type === 'add' ? '新增工作计划' : '周计划编辑';

    async function onAddOk(values) {
        const result = await weekPlanAdd({...values, monthId});
        if (result.success) {
            setVisible(false);
            onSuccess?.();
        }
        return true;
    }

    function onEditOk() {
        formRefEdit?.current?.validateFields()?.then(async values => {
            let result: any;
            setLoading(true);
          // eslint-disable-next-line prefer-const
            result = await weekPlanEdit({...values, weekPlanId: record.id});
            setLoading(false);
            if (result.success) {
                onSuccess?.();
                setVisible(false);
            }
        })
    }
    async function getHistory(id) {
        const {data = []} = await weekHistory(id);
        setDataSource(data);
    }

    useEffect(() => {
        if (visible) {
            formRef?.current?.resetFields();
        }
        setCols(getColumns());
        console.log('record', record);
        if (record) {
            console.log('record', record);
            if (visible) getHistory(record.id);
            formRefEdit?.current?.setFieldsValue?.(record);
        }
    }, [visible, type, record]);


    return (
        <>
            {type === 'add' && (
                <BetaSchemaForm
                    open={visible}
                    layoutType='ModalForm'
                    title={title}
                    onFinish={onAddOk}
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
                        onOk={onEditOk}
                        maskClosable={false}
                        keyboard={false}
                        >
                        <ProForm
                            formRef={formRefEdit}
                            submitter={false}
                        >
                            <ProForm.Group>
                                {/*<ProFormText*/}
                                {/*    width="md"*/}
                                {/*    name="title"*/}
                                {/*    label="工作名称"*/}
                                {/*    disabled={true}*/}
                                {/*/>*/}
                                <ProFormTextArea
                                    width="md"
                                    name="content"
                                    label="工作内容"
                                    placeholder="请输入"
                                    required={true}
                                    rules={[{ required: true, message: '这是必填项' }]}
                                />
                                <ProFormText
                                    width="md"
                                    name="startTime"
                                    label="创建时间"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="endTime"
                                    label="截止时间"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="finishTime"
                                    label="完成时间"
                                    disabled={true}
                                />
                                <ProFormText
                                    width="md"
                                    name="company"
                                    label="计划完成状态"
                                    disabled={true}
                                />
                            </ProForm.Group>
                            <ProForm.Item
                                label="历史周计划编辑记录"
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