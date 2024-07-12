import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {ProForm, ProFormInstance, ProFormSelect, ProFormTextArea} from "@ant-design/pro-components";
import {Modal} from "antd";
import {planMonths, weekPlanAdd, weekPlanEdit} from "../../services";
import {useParams} from "react-router";
import type { DraggableData, DraggableEvent } from 'react-draggable';
import Draggable from 'react-draggable';

export default React.forwardRef(function (props: any, ref) {

    const {onSuccess, exceptional} = props

    const [visible, setVisible] = useState(false);

    const formRef = useRef<ProFormInstance>();

    const [loading, setLoading] = useState(false);

    const useparams = useParams();

    const [weekPlanId, setWeekPlanId] = useState<any>(null);

    const recordRef = useRef<any>();

    const [disabled, setDisabled] = useState(false);
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
    const draggleRef = useRef<HTMLDivElement>(null);

    const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.current?.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
    };


    function onOk() {
        if (loading) return;

        if (weekPlanId && recordRef.current?.quality !== 0 && recordRef.current?.result !== 0) {
            setVisible(false);
            return;
        }
        formRef.current?.validateFields?.().then(async values => {
            setLoading(true);
            const res = await (weekPlanId ?  weekPlanEdit({...values, weekPlanId}) : weekPlanAdd({...values, monthId: useparams.id}));
            onSuccess?.();
            if (res?.success) {
                setVisible(false)
            }
            setLoading(false);
        })
    }

    function onCancel() {
      if (weekPlanId) {
          Modal.confirm({
              title: '是否确定取消？',
              onOk: () => {
                  setVisible(false)
              }
          })
      } else {
          setVisible(false)
      }
    }

    useImperativeHandle(ref, () => ({
        show: (id = null, records?) => {
            setVisible(true);
            setWeekPlanId(id);
            recordRef.current = records;
            formRef.current?.resetFields();
        },
        hide: () => {
            onCancel();
        },
    }));

    useEffect(() => {
        if (visible && recordRef.current) {
            formRef.current?.setFieldsValue(recordRef.current);
        }
    }, [visible])

    return(

        <Modal
            open={visible}
            title={
              <div
                  className="mover"
                  style={{
                    width: '100%',
                    cursor: 'move',
                  }}
                  onMouseOver={() => {
                    if (disabled) {
                      setDisabled(false);
                    }
                  }}
                  onMouseOut={() => {
                    setDisabled(true);
                  }}
                  // fix eslintjsx-a11y/mouse-events-have-key-events
                  // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                  onFocus={() => {}}
                  onBlur={() => {}}
                  // end
              >
                {`${weekPlanId ? '修改' : '新增'}周工作计划`}
              </div>
            }
            width={500}
            onCancel={onCancel}
            onOk={onOk}
            confirmLoading={loading}
            maskClosable={false}
            keyboard={false}
            modalRender={modal => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    handle=".mover"
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                  <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
        >
            <ProForm
                formRef={formRef}
                submitter={false}
            >
                <ProFormTextArea
                    name="content"
                    label="工作内容"
                    placeholder="请输入"
                    required={true}
                    disabled={!exceptional && weekPlanId && recordRef.current?.quality !== 0 ? true : false}
                    rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="outcome"
                    label="工作结果"
                    placeholder="请输入"
                    disabled={exceptional || (recordRef.current?.content && recordRef.current?.result === 0) ? false : true}
                    // required={true}
                    // rules={[{ required: true, message: '这是必填项' }]}
                />
                <ProFormTextArea
                    name="problem"
                    label="问题和风险"
                    placeholder="请输入"
                    disabled={exceptional || (recordRef.current?.content && recordRef.current?.result === 0) ? false : true}
                    // required={true}
                    // rules={[{ required: true, message: '这是必填项' }]}
                />
            </ProForm>


        </Modal>
    )
});