import {Button, Input, message, Modal, Radio, Space} from "antd";
import React, {useEffect, useState} from "react";
import {
  apiQualityCheckMonthly,
  apiQualityCheckWeekly,
  apiResultCheckMonthly,
  apiResultCheckWeekly,
  apiQualityRevokeMonth,
  apiQualityRevokeWeek,
  apiResultRevokeMonth,
  apiResultRevokeWeek
} from "../../services";
import styles from './plan-correction-col.module.less'

export default function PlanCorrectionCol(props: any) {

  const {record, reload, type} = props;

  const [quality, setQuality] = useState();

  const [comment, setComment] = useState('');

  const [enums, setEnums] = useState<any>([]);

  const [checkDisable, setCheckDisable] = useState<boolean>();

  const [revokeDisable, setRevokeDisable] = useState<boolean>();


  function onSubmit(e) {
    e.stopPropagation();
    if (!quality) {
      message.warning('请选择批改状态')
      return;
    }

    // 在进行审批时，如果选择的是合理/合格，则可以不用输入文字直接提交，同时去掉确认窗口，提交完成后，置灰
    if (!comment && quality !== 1) {
      message.warning('输入批改意见')
      return;
    }


    if (quality !== 1) {
      Modal.confirm({
        title: '是否确认提交？',
        onOk: doSubmit
      });
    } else {
      doSubmit();
    }

    async function doSubmit() {
      let idName;
      let api;
      let singleName;
      switch (type) {
        case 'monthResult':
          idName = 'monthPlanId';
          api = apiResultCheckMonthly;
          singleName = 'result';
          break
        case 'monthQuality':
          idName = 'monthPlanId';
          api = apiQualityCheckMonthly;
          singleName = 'quality';
          break
        case 'weekResult':
          idName = 'weekPlanId';
          api = apiResultCheckWeekly;
          singleName = 'result';
          break
        case 'weekQuality':
          idName = 'weekPlanId';
          api = apiQualityCheckWeekly;
          singleName = 'quality';
          break
      }
      await api({
        [idName]: record.id,
        [singleName]: quality,
        comment
      });
      setCheckDisable(true);
      setRevokeDisable(false);
      reload?.()
    }
  }

  function onRevoke(e) {
    console.log("---------------------")
    e.stopPropagation();

    doRevoke();

    async function doRevoke() {
      let idName;
      let api;
      switch (type) {
        case 'monthResult':
          idName = 'monthPlanId';
          api = apiResultRevokeMonth;
          break
        case 'monthQuality':
          idName = 'monthPlanId';
          api = apiQualityRevokeMonth;
          break
        case 'weekResult':
          idName = 'weekPlanId';
          api = apiResultRevokeWeek;
          break
        case 'weekQuality':
          idName = 'weekPlanId';
          api = apiQualityRevokeWeek;
          break
      }
      await api(record.id);
      setCheckDisable(false);
      setRevokeDisable(true);
      reload?.()
    }
  }

  useEffect(() => {


  }, [record, type]);


  useEffect(() => {
    if (type?.indexOf('Result') > -1) {
      setEnums([
        {label: '合格', value: 1},
        {label: '不合格', value: 2},
      ])
      setComment(record?.resultComment);
      setQuality(record?.result);
      if (record.result !== 0) {
        setCheckDisable(true);
        setRevokeDisable(false);
      } else {
        setRevokeDisable(true);
      }
    } else {
      setEnums([
        {label: '合理', value: 1},
        {label: '不合理', value: 2},
      ])
      setComment(record?.qualityComment);
      setQuality(record?.quality);
      if (record.quality !== 0) {
        setCheckDisable(true);
        setRevokeDisable(false);
      } else {
        setRevokeDisable(true);
      }
    }
  }, [type]);

  return (
      <div
          className={styles.box}
          onClick={e => e.stopPropagation()}
      >
        <Radio.Group value={quality} onChange={e => {
          setQuality(e.target.value);
        }}>
          {enums.map((o, oIndex) => <Radio disabled={checkDisable} key={oIndex} value={o.value}>{o.label}</Radio>)}
          {/*<Radio value={1}>合格</Radio>*/}
          {/*<Radio value={2}>不合格</Radio>*/}
        </Radio.Group>
        <Space.Compact style={{width: '100%'}}>
          <Input size='small'
                 value={comment}
                 onChange={(e) => {
                   setComment(e.target.value);
                 }}
                 disabled={checkDisable}
                 placeholder='输入批改意见'
                 onClick={e => e.stopPropagation()}
          />
          <Button disabled={checkDisable} size='small' type="primary" onClick={onSubmit}>提交</Button>
        </Space.Compact>
        <Space.Compact style={{width: '100%'}}>
          <Button disabled={revokeDisable} size='small' type="primary" onClick={onRevoke}>撤销</Button>
        </Space.Compact>
        
      </div>
  )
};