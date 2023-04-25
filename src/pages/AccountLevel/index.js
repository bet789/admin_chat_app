import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  notification,
} from "antd";
import axios from "axios";
import React, { useState } from "react";
import { updateUserLevel } from "../../helpers/helper";

export default function AccountLevel() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    let param = "";
    if (values.level === 2)
      param = `update=1&chatCount=500&level=2&userName=${values.userName.trim()}`;
    else if (values.level === 3)
      param = `update=1&chatCount=1000&level=3&userName=${values.userName.trim()}`;
    else if (values.level === 4)
      param = `update=1&chatCount=2000&level=4&userName=${values.userName.trim()}`;
    else if (values.level === 5)
      param = `update=1&chatCount=3000&level=4&userName=${values.userName.trim()}`;

    const res = await updateUserLevel(param);
    if (res?.status === 1) {
      api["success"]({
        message: "Thông báo",
        description: "Cập nhật level thành công!",
      });
    }

    // api["error"]({
    //     message: 'Thông báo',
    //     description:
    //       'Cập nhật level thất bại!',
    //   });
    setLoading(false);
  };

  const onFinishFailed = async (values) => {};
  const onReset = () => {
    form.resetFields();
    setLoading(false);
  };
  return (
    <div>
      {contextHolder}
      <Form
        form={form}
        name="basic"
        layout="vertical"
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item
              label="Tên tài khoản"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên tài khoản",
                },
              ]}
            >
              <Input placeholder="Nhập tên tài khoản" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Level"
              name="level"
              initialValue={2}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn level",
                },
              ]}
            >
              <Select
                style={{
                  width: "100%",
                }}
                placeholder="Chọn Level"
                options={[
                  {
                    value: 2,
                    label: "Level 2",
                  },
                  {
                    value: 3,
                    label: "Level 3",
                  },
                  {
                    value: 4,
                    label: "Level 4",
                  },
                  {
                    value: 5,
                    label: "Level 5",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading ? true : false}
            >
              Cập nhật
            </Button>
            <Button type="primary" htmlType="button" onClick={onReset}>
              Làm Mới
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
