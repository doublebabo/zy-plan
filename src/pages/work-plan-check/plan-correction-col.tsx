import {Button, Input, Modal, Radio, Space} from "antd";
import React, {useEffect, useState} from "react";
import {apiQualityCheckMonthly, apiQualityCheckWeekly} from "../../services";

export default function PlanCorrectionCol(props: any) {

  const {record, reload, type = 'monthPlanId'} = props;

  const [quality, setQuality] = useState();

  const [comment, setComment] = useState('');


  function onSubmit() {
    Modal.confirm({
      title: '是否确认提交？',
      onOk: async () => {
        const api = type === 'monthPlanId' ? apiQualityCheckMonthly : apiQualityCheckWeekly;
        await api({
          [type]: record.id,
          quality,
          comment
        });
        reload?.()
      }
    })
  }

  useEffect(() => {

    setComment(record?.comment);
    setQuality(record?.quality);
  }, [record]);

  return (
      <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
      >
        <Radio.Group value={quality} onChange={e => {
          setQuality(e.target.value);
        }}>
          <Radio value={1}>合格</Radio>
          <Radio value={0}>不合格</Radio>
        </Radio.Group>
        <Space.Compact style={{width: '100%'}}>
          <Input size='small'
                 value={comment}
                 onChange={(e) => {setComment(e.target.value);}}
                 placeholder='输入批改意见'
          />
          <Button size='small' type="primary" onClick={onSubmit}>提交</Button>
        </Space.Compact>
      </div>
  )
};