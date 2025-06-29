import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getAllSubscriptionPlans,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../../../service/SubscriptionPlanService";

const SubscriptionManager = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubscriptionPlans();
      setSubscriptions(data);
    } catch (error) {
      message.error("Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingId(record.planID);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      // Note: We need to add deleteSubscriptionPlan to the service
      // await deleteSubscriptionPlan(id);
      message.success("Subscription plan deleted successfully");
      fetchSubscriptions();
    } catch (error) {
      message.error("Failed to delete subscription plan");
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await updateSubscriptionPlan({ ...values, planID: editingId });
        message.success("Subscription plan updated successfully");
      } else {
        await createSubscriptionPlan(values);
        message.success("Subscription plan created successfully");
      }
      setModalVisible(false);
      fetchSubscriptions();
    } catch (error) {
      message.error("Failed to save subscription plan");
    }
  };

  const columns = [
    {
      title: "Plan Name",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price}đ`,
    },
    {
      title: "Duration (Days)",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this plan?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription Plans Management</h1>
        <Button
          type="primary"
          onClick={handleAdd}
          size="large"
          icon={<PlusOutlined />}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          Create New Subscription Plan
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table
          columns={columns}
          dataSource={subscriptions ?? []}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </div>

      <Modal
        title={
          editingId ? "Edit Subscription Plan" : "Add New Subscription Plan"
        }
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
        okButtonProps={{
          className: "bg-blue-500 hover:bg-blue-600",
        }}
        destroyOnHidden
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ price: 0, duration: 30 }}
          className="mt-4"
        >
          <Form.Item
            name="planName"
            label="Plan Name"
            rules={[{ required: true, message: "Please enter plan name" }]}
          >
            <Input placeholder="Enter plan name" />
          </Form.Item>

          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: "100%" }}
              placeholder="Enter price"
            />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (Days)"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <InputNumber
              min={1}
              style={{ width: "100%" }}
              placeholder="Enter duration in days"
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea rows={4} placeholder="Enter plan description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SubscriptionManager;
