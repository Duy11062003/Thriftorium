import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Switch,
  Select,
  message,
  Popconfirm,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import VoucherTemplateService from "../../../service/VoucherTemplateService";
import moment from "moment";

const { Option } = Select;

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  // Fetch vouchers
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await VoucherTemplateService.getAllVoucherTemplates();
      setVouchers(data);
    } catch (error) {
      message.error("Failed to fetch vouchers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const voucherData = {
        ...values,
        startedAt: values.startedAt.toISOString(),
        expiredAt: values.expiredAt.toISOString(),
      };

      if (editingId) {
        await VoucherTemplateService.updateVoucherTemplate({
          ...voucherData,
          id: editingId,
        });
        message.success("Voucher updated successfully");
      } else {
        await VoucherTemplateService.createVoucherTemplate(voucherData);
        message.success("Voucher created successfully");
      }

      setModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchVouchers();
    } catch (error) {
      message.error("Operation failed");
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await VoucherTemplateService.deleteVoucherTemplate(id);
      message.success("Voucher deleted successfully");
      fetchVouchers();
    } catch (error) {
      message.error("Failed to delete voucher");
      console.error(error);
    }
  };

  // Handle edit
  const handleEdit = (record) => {
    setEditingId(record.voucherTemplateID);
    form.setFieldsValue({
      ...record,
      voucherTemplateID: record.voucherTemplateID,
      startedAt: moment(record.startedAt),
      expiredAt: moment(record.expiredAt),
    });
    setModalVisible(true);
  };

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Milestone Amount",
      dataIndex: "milestoneAmount",
      key: "milestoneAmount",
      render: (value) => `${value?.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: "Voucher Type",
      dataIndex: "voucherTypes",
      key: "voucherTypes",
      render: (type) => {
        const types = {
          1: "Discount",
          2: "Free Shipping",
          3: "Special Offer",
        };
        return types[type] || type;
      },
    },
    {
      title: "Discount %",
      dataIndex: "discountPercentage",
      key: "discountPercentage",
      render: (value) => `${value}%`,
    },
    {
      title: "Membership Only",
      dataIndex: "isMembership",
      key: "isMembership",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      title: "Start Date",
      dataIndex: "startedAt",
      key: "startedAt",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "End Date",
      dataIndex: "expiredAt",
      key: "expiredAt",
      render: (date) => moment(date).format("YYYY-MM-DD"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this voucher?"
            onConfirm={() => handleDelete(record.voucherTemplateID)}
            okText="Yes"
            okButtonProps={{
              className: "bg-blue-500 hover:bg-blue-600",
            }}
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Voucher Management</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingId(null);
            form.resetFields();
            setModalVisible(true);
          }}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add New Voucher
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={vouchers}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "Edit Voucher" : "Create New Voucher"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: true,
            isMembership: false,
          }}
        >
          <Form.Item
            name="name"
            label="Voucher Name"
            rules={[{ required: true, message: "Please enter voucher name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="milestoneAmount"
            label="Milestone Amount"
            rules={[{ required: true, message: "Please enter milestone amount" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " ₫"}
              parser={(value) => value.replace(/[^\d]/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="voucherTypes"
            label="Voucher Type"
            rules={[{ required: true, message: "Please select voucher type" }]}
          >
            <Select>
              <Option value={1}>Discount</Option>
              <Option value={2}>Free Shipping</Option>
              <Option value={3}>Special Offer</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="discountPercentage"
            label="Discount Percentage"
            rules={[{ required: true, message: "Please enter discount percentage" }]}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: "100%" }}
              formatter={(value) => `${value}%`}
              parser={(value) => value.replace("%", "")}
            />
          </Form.Item>

          <Form.Item
            name="startedAt"
            label="Start Date"
            rules={[{ required: true, message: "Please select start date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="expiredAt"
            label="End Date"
            rules={[{ required: true, message: "Please select end date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="isMembership" label="Membership Only" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item className="flex justify-end">
            <Space>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  form.resetFields();
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
              <Button className="bg-blue-500 hover:bg-blue-600" type="primary" htmlType="submit">
                {editingId ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherManager;
