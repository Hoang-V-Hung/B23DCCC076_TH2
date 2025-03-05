import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
export interface Task1 {
    id: number;
    mamon: string;
    tenmon: string;
    sotinchi: number;

   
  }
  
  export const initialTasks: Task1[] = [
    { id: 1, mamon: "123",tenmon: "Toán", sotinchi: 3 },
  
  ];
  
const qlMonHoc1: React.FC = () => {
  const [tasks, setTasks] = useState<Task1[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task1 | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, []);

  const showModal = (task?: Task1) => {
    setEditingTask(task || null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (values: Omit<Task1, "id">) => {
    let newTasks;
    if (editingTask) {
      newTasks = tasks.map((t) =>
        t.id === editingTask.id ? { ...t, ...values } : t
      );
    } else {
      newTasks = [...tasks, { id: Date.now(), ...values }];
    }
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks)); // Lưu vào localStorage
    setIsModalOpen(false);
    form.resetFields();
  };
  
  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks)); // Cập nhật localStorage
  };
  

  const columns = [
   
    {
      title: "Mã môn",
      dataIndex: "mamon",
      key: "mamon",
    },
    {
        title: "Tên môn",
        dataIndex: "tenmon",
        key: "tenmon",
      },
      {
        title: "Số tín chỉ",
        dataIndex: "sotinchi",
        key: "sotinchi",
      },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Task1) => (
        <>
          <EditOutlined onClick={() => showModal(record)} style={{ marginRight: 8, cursor: "pointer" }} />
          <DeleteOutlined onClick={() => handleDelete(record.id)} style={{ color: "red", cursor: "pointer" }} />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Danh mục môn học</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
        Thêm môn học
      </Button>
      <Table columns={columns} dataSource={tasks} rowKey="id" style={{ marginTop: 20 }} />
      <Modal title={editingTask ? "Edit " : "Add "} visible={isModalOpen} onCancel={handleCancel} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          
          <Form.Item name="mamon" label="Mã môn" rules={[{ required: true, }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tenmon" label="Tên môn" rules={[{ required: true, }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sotinchi" label="So Tín chỉ" rules={[{ required: true, }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default qlMonHoc1;
