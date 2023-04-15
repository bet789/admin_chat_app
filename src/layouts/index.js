import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { UserSwitchOutlined } from "@ant-design/icons";
import Header from "./header";

import DashboardPage from "../pages/dashboard";
import AccountsPages from "../pages/accounts";

import { useNavigate, useLocation, Link } from "react-router-dom";
import ChatMangement from "../pages/chatmanagement";

const { Content, Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const authProtectedRoutes = [
  // {
  //   label: "Tổng Quan",
  //   key: "dashboard",
  //   icon: <DashboardOutlined />,
  //   children: [
  //     {
  //       label: "Tổng Quan",
  //       key: "subdashboard",
  //       path: "/dashboard",
  //       component: <DashboardPage />,
  //       icon: null,
  //     },
  //   ],
  // },
  {
    label: "QL Tài Khoản",
    key: "manage-accounts",
    icon: <UserSwitchOutlined />,
    children: [
      {
        label: "Tài Khoản",
        key: "accounts",
        path: "/accounts",
        component: <AccountsPages />,
        icon: null,
      },
    ],
  },
  {
    label: "QL Chat",
    key: "manage-chats",
    icon: <UserSwitchOutlined />,
    children: [
      {
        label: "Tài Khoản",
        key: "chats",
        path: "/manage-chats",
        component: <ChatMangement />,
        icon: null,
      },
    ],
  },
];

const itemsMenuSideBar = authProtectedRoutes.map((item, index) => {
  if (item.path === "/") return null;
  return getItem(
    item.label,
    item.key,
    item.icon,
    item.children?.map((itemChildren) => {
      return getItem(itemChildren.label, itemChildren.key, itemChildren.icon);
    })
  );
});

// submenu keys of first level
const rootSubmenuKeys = authProtectedRoutes.map((item, index) => {
  return item.key;
});

const AuthProtectedLayout = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const [components, setComponents] = useState(null);
  const [openKeys, setOpenKeys] = useState(["manage-accounts"]);
  const [selectedKeys, setSelectedKeys] = useState("accounts");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //set navigation defaults for url "/"
    if (location.pathname === "/") return navigate("/accounts");

    let _item = "";
    authProtectedRoutes.forEach((element) => {
      element.children &&
        element.children.forEach((elementChildren) => {
          if (elementChildren.path === location.pathname) {
            _item = elementChildren;
            return;
          }
        });
    });
    if (!_item) return navigate("/404");

    setSelectedKeys(_item.key);
    handleSetOpenKeys(_item.key);
    setComponents(_item.component);
  }, [location.pathname]);

  const onClickItemMenu = (item) => {
    authProtectedRoutes.forEach((element) => {
      element.children &&
        element.children.forEach((elementChildren) => {
          if (elementChildren.key === item.key) {
            return navigate(elementChildren.path);
          }
        });
    });
  };

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const handleSetOpenKeys = (expression) => {
    switch (expression) {
      case "posts":
        setOpenKeys(["manage-posts"]);
        break;
      case "categories":
        setOpenKeys(["manage-categories"]);
        break;
      case "media":
        setOpenKeys(["manage-media"]);
        break;
      case "branchs":
        setOpenKeys(["manage-branchs"]);
        break;
      default:
        setOpenKeys(["manage-accounts"]);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Sider
          width={250}
          className="site-layout-background"
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKeys]}
            openKeys={openKeys}
            onOpenChange={onOpenChange}
            items={itemsMenuSideBar}
            onClick={(item) => onClickItemMenu(item)}
          />
        </Sider>
        <Layout>
          <Content
            className="site-layout-background"
            style={{
              padding: 12,
              margin: 0,
            }}
          >
            {components}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default AuthProtectedLayout;
