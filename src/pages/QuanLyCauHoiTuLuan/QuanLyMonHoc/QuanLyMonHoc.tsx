import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, Table } from "antd";
import { ExamSystem } from "./examSystem";

const LOCAL_STORAGE_KEY = "subjects";

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<ExamSystem.Subject[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subjects));
  }, [subjects]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        let updatedSubjects;
        if (editingIndex !== null) {
          updatedSubjects = [...subjects];
          updatedSubjects[editingIndex] = values;
        } else {
          updatedSubjects = [...subjects, values];
        }
        setSubjects(updatedSubjects);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubjects));
        form.resetFields();
        setIsModalOpen(false);
        setEditingIndex(null);
      })
      .catch((error) => {
        console.log("Validation Failed:", error);
      });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(subjects[index]);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedSubjects = subjects.filter((_, i) => i !== index);
    setSubjects(updatedSubjects);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubjects));
  };

  const columns = [
    { title: "Mã môn học", dataIndex: "ma_mon", key: "ma_mon", align: "center" },
    { title: "Tên môn học", dataIndex: "ten_mon", key: "ten_mon", align: "center" },
    { title: "Số tín chỉ", dataIndex: "tin_chi", key: "tin_chi", align: "center" },
    { title: "Khối kiến thức", dataIndex: "khoi_kien_thuc", key: "khoi_kien_thuc", align: "center" },
    {
      title: "Sửa/Xoá",
      key: "actions",
      align: "center",
      render: (_: any, _record: any, index: number) => (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <Button onClick={() => handleEdit(index)}>Sửa</Button>
          <Button onClick={() => handleDelete(index)} type='primary' danger>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Quản lý Môn Học</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm môn học
      </Button>
      <Modal
        title={editingIndex !== null ? "Chỉnh sửa môn học" : "Thêm môn học"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingIndex(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Mã môn học"
            name="ma_mon"
            rules={[{ required: true, message: "Vui lòng nhập mã môn học!" }]}
          >
            <Input placeholder="Nhập mã môn học" />
          </Form.Item>
          <Form.Item
            label="Tên môn học"
            name="ten_mon"
            rules={[{ required: true, message: "Vui lòng nhập tên môn học!" }]}
          >
            <Input placeholder="Nhập tên môn học" />
          </Form.Item>
          <Form.Item
            label="Số tín chỉ"
            name="tin_chi"
            rules={[{ required: true, message: "Vui lòng nhập số tín chỉ!" }]}
          >
            <Input type="number" placeholder="Nhập số tín chỉ" />
          </Form.Item>
          <Form.Item
            label="Khối kiến thức"
            name="khoi_kien_thuc"
            rules={[{ required: true, message: "Vui lòng nhập khối kiến thức!" }]}
          >
            <Input placeholder="Nhập khối kiến thức" />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setIsModalOpen(false)}>Huỷ</Button>
            <Button type="primary" onClick={handleOk} style={{ marginLeft: 8 }}>
              {editingIndex !== null ? "Lưu" : "OK"}
            </Button>
          </div>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={subjects.map((subject, index) => ({ ...subject, key: index }))}
        pagination={false}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default SubjectManager;
