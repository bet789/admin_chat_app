import React from "react";
import { Avatar, Dropdown, Space, Layout, Typography } from "antd";
import { Link } from "react-router-dom";

import logo from "../assets/images/taipei101.png";

const { Header } = Layout;
const { Text } = Typography;

const items = [
  {
    key: "1",
    label: <Link to="/logout">Đăng Xuất</Link>,
  },
];

const infoUsers = sessionStorage.getItem("infoUsers")
  ? JSON.parse(sessionStorage.getItem("infoUsers"))
  : null;

export default function HeaderCustom() {
  return (
    <Header className="header">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <Dropdown
        menu={{
          items,
        }}
      >
        <Space className="ant-space-item-header">
          <Avatar
            style={{
              backgroundColor: `#${Math.floor(
                Math.random() * 16777215
              ).toString(16)}`,
              verticalAlign: "middle",
            }}
            size={30}
          >
            {infoUsers?.user?.fullName.charAt(0)}
          </Avatar>
          <div className="group-info-sidebar">
            <Text className="username-sidebar" strong>
              {infoUsers?.user?.fullName}
            </Text>
            <Text className="rolename-sidebar">
              {infoUsers?.user?.role?.roleName}
            </Text>
          </div>
        </Space>
      </Dropdown>
    </Header>
  );
}
