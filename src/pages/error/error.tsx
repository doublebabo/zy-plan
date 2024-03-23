import {useRouteError} from "react-router";
import React from "react";
import {Button, Result} from "antd";

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
      <Result
          title={error.statusText || error.message}
          status='warning'
          extra={
            <Button type="primary" key="console" onClick={() => {
              history.back();
            }}>
              返回
            </Button>
          }
      />
  );
}