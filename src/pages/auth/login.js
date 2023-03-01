import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Input, Col, Row, notification, Typography } from "antd";
import { login } from "../../helpers/helper";
import img_login from "../../assets/images/img-signin.png";
import bg from "../../assets/images/cover-pattern.png";
import logo from "../../assets/images/taipei101.png";

const { Title } = Typography;

export default function LoginPage() {
  document.title = "Đăng nhập";

  const [api, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const _req = {
      userName: values.username,
      password: values.password,
    };

    setLoading(true);

    const _res = await login(_req);
    if (_res?.data === null) {
      setLoading(false);
      return api["error"]({
        message: "Lỗi",
        description: `${_res?.message}`,
      });
    }

    if (_res?.status === 1) {
      setLoading(false);
      sessionStorage.setItem("token", _res?.data?.token);
      sessionStorage.setItem("infoUsers", JSON.stringify(_res.data));
      axios.defaults.headers.common["Authorization"] =
        "Bearer " + _res.data?.token.replace(/"/g, "");

      return window.location.replace("/");
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Row
      align="middle"
      justify="center"
      gutter={[16, 16]}
      className="login-pages"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <Row
        className="container-login"
        align="middle"
        justify="center"
        gutter={[16, 16]}
      >
        {contextHolder}
        <Col span={13} className="img-login">
          <img src={img_login} alt="" />
        </Col>
        <Col span={8} className="box-login">
          <Row>
            <Col span={24} justify="center" align="middle">
              <img src={logo} alt="" />
            </Col>
          </Row>

          <Title level={2}>Login - A2ZCHAT</Title>
          <Form
            name="basic"
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
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading ? true : false}
                style={{ width: "100%" }}
              >
                ĐĂNG NHẬP
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Row>
  );
}
