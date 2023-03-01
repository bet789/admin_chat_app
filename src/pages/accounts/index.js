import React, { useEffect, useState } from "react";
import {
  Divider,
  Form,
  Input,
  Button,
  Space,
  Table,
  notification,
  Popconfirm,
  Row,
  Col,
  Select,
  Tag,
} from "antd";
import qs from "qs";
import dayjs from "dayjs";
import {
  SaveOutlined,
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import BreadcrumbCustom from "../../common/breadcrumb.js";
import {
  getPagingUser,
  insertUser,
  updateUser,
  deleteUser,
  getAllRole,
} from "../../helpers/helper.js";
import { textConfirmDelete, UserStatus } from "../../common/const.js";

export default function AccountsPages() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [textSave, setTextSave] = useState("Lưu");
  const [data, setData] = useState();
  const [listRole, setListRole] = useState([]);

  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    fetchDataRole();
  }, []);

  useEffect(() => {
    fetchDataAccount();
  }, [JSON.stringify(tableParams)]);

  const fetchDataAccount = async () => {
    setLoadingTable(true);
    if (form.getFieldValue("userName") || form.getFieldValue("fullName")) {
      setLoadingTable(false);
      return;
    }

    const _paging = {
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };

    const _res = await getPagingUser(qs.stringify(_paging));
    setData(_res.data || []);
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: _res?.totalPages * tableParams.pagination.pageSize,
      },
    });

    setLoadingTable(false);
  };

  const fetchDataRole = async () => {
    setLoading(true);
    const _res = await getAllRole();
    setListRole(_res || []);
    setLoading(false);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    if (!values.id) {
      const _res = await insertUser(values);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchDataAccount();
        return api["success"]({
          message: "Thành công",
          description: "Thêm người dùng thành công!",
        });
      }
    } else {
      const _req = {
        userName: values.userName,
        password: values.password,
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        activeStatus: values.activeStatus,
        role: values.roleId,
      };
      const _res = await updateUser(values?.id, _req);
      if (_res?.data === null) {
        setLoading(false);
        return api["error"]({
          message: "Lỗi",
          description: _res?.message,
        });
      } else {
        setLoading(false);
        fetchDataAccount();
        return api["success"]({
          message: "Thành công",
          description: "Cập nhật người dùng thành công!",
        });
      }
    }
  };

  const onFinishFailed = (values) => {};

  const onReset = () => {
    form.resetFields();
    fetchDataAccount();
    setTextSave("Lưu");
  };

  const onEdit = (id) => {
    setTextSave("Cập nhật");
    const dataEdit = data.filter((item) => item._id === id);
    form.setFieldsValue({
      id: dataEdit[0]._id,
      roleId: dataEdit[0].role._id,
      email: dataEdit[0].email,
      phoneNumber: dataEdit[0].phoneNumber,
      fullName: dataEdit[0].fullName,
      userName: dataEdit[0].userName,
      activeStatus: dataEdit[0].activeStatus,
    });
  };

  const onDelete = async (id) => {
    const _res = await deleteUser(id);
    if (_res?.status !== 1) {
      setLoading(false);
      return api["error"]({
        message: "Lỗi",
        description: _res?.message,
      });
    } else {
      setLoading(false);
      fetchDataAccount();
      return api["success"]({
        message: "Thành công",
        description: "Xóa người dùng thành công!",
      });
    }
  };

  const onSearch = async () => {
    const _req = {
      userName: form.getFieldValue("userName") || "",
      fullName: form.getFieldValue("fullName") || "",
      pageIndex: tableParams.pagination.current,
      pageSize: tableParams.pagination.pageSize,
    };

    const _res = await getPagingUser(qs.stringify(_req));
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        total: _res?.totalPages * tableParams.pagination.pageSize,
      },
    });
    setData(_res.data || []);
  };

  const columns = [
    {
      title: "Tên tài khoản",
      dataIndex: "userName",
    },
    {
      title: "Họ Tên",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdTime",
      render: (_, record) => {
        return dayjs(_).format("DD/MM/YYYY HH:mm:ss");
      },
    },
    {
      title: "IP",
      dataIndex: "ip",
    },
    {
      title: "FP",
      dataIndex: "fp",
    },
    {
      title: "Vai trò",
      dataIndex: "roleName",
      render: (_, record) => {
        return record.role.roleName;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "activeStatus",
      render: (_, record) => {
        let color = _ === 1 ? "green" : "volcano";

        return (
          <Tag color={color} key={_}>
            {_ === 1 ? "Kích hoạt" : "Ngưng kích hoạt"}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "",
      key: "x",
      render: (_, record) => {
        if (record.userName === "admin") return;

        return (
          <Space>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit(record._id)}
            />
            <Popconfirm
              placement="top"
              title={textConfirmDelete}
              description={""}
              onConfirm={() => onDelete(record._id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} size="small" />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  document.title = "QL Tài Khoản";
  return (
    <div>
      {contextHolder}
      <BreadcrumbCustom parentTitle={"QL Tài Khoản"} subTitle={"Tài Khoản"} />
      <Divider />

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
        <Form.Item name="id" label="Id" hidden={true}>
          <Input name="id" />
        </Form.Item>
        <Row gutter={[16, 0]}>
          <Col span={6}>
            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên",
                },
              ]}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Tên đăng nhập"
              name="userName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên đăng nhập!",
                },
              ]}
            >
              <Input placeholder="Nhập tên đăng nhập" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Mật khẩu "
              name="password"
              rules={[
                {
                  required:
                    textSave.toUpperCase() === "CẬP NHẬT" ? false : true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                autoComplete="new-password"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Email" name="email">
              <Input placeholder="Nhập email" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Số điện thoại" name="phoneNumber">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Vai trò"
              name="roleId"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn vai trò!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                style={{
                  width: "100%",
                }}
                // onSelect={onSelectRole}
                placeholder="Chọn vai trò"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={
                  listRole &&
                  listRole?.map((item, i) => {
                    return {
                      value: item._id,
                      label: item.roleName,
                    };
                  })
                }
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Trạng thái"
              name="activeStatus"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trạng thái hoạt động!",
                },
              ]}
            >
              <Select
                allowClear
                showSearch
                style={{
                  width: "100%",
                }}
                // onSelect={onSelectRole}
                placeholder="Chọn trạng thái hoạt động"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                options={
                  UserStatus &&
                  UserStatus?.map((item, i) => {
                    return {
                      value: item.value,
                      label: item.label,
                    };
                  })
                }
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
              icon={<SaveOutlined />}
            >
              {textSave}
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={onReset}
              icon={<SyncOutlined />}
            >
              Làm Mới
            </Button>
            <Button
              type="primary"
              htmlType="button"
              onClick={onSearch}
              icon={<SearchOutlined />}
            >
              Tìm kiếm
            </Button>
          </Space>
        </Form.Item>
      </Form>

      <Divider />

      <Table
        size="middle"
        columns={columns}
        rowKey={(record) => {
          return record.id;
        }}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loadingTable}
        onChange={handleTableChange}
      />
    </div>
  );
}
