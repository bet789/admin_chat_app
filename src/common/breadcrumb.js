import React from "react";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

const BreadcrumbCustom = (props) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/">
        <HomeOutlined />
      </Breadcrumb.Item>
      <Breadcrumb.Item>{props.parentTitle}</Breadcrumb.Item>
      <Breadcrumb.Item>{props.subTitle}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
export default BreadcrumbCustom;
