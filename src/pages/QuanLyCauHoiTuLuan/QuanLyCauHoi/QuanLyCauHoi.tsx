import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Form, Table, Select } from "antd";
import { ExamSystem } from "./examSystem";

const LOCAL_STORAGE_KEY = "questions";
const SUBJECTS_STORAGE_KEY = "subjects";

const QuestionManager: React.FC = () => {
  const [questions, setQuestions] = useState<ExamSystem.Question[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]")
  );
  const [subjects, setSubjects] = useState<ExamSystem.Subject[]>(
    JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || "[]")
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      let updatedQuestions;
      if (editingIndex !== null) {
        updatedQuestions = [...questions];
        updatedQuestions[editingIndex] = values;
      } else {
        updatedQuestions = [...questions, values];
      }
      setQuestions(updatedQuestions);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQuestions));
      form.resetFields();
      setIsModalOpen(false);
      setEditingIndex(null);
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    form.setFieldsValue(questions[index]);
    setIsModalOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedQuestions));
  };

  const handleSubjectChange = (value: string) => {
    const selectedSubject = subjects.find(subject => subject.ten_mon === value);
    if (selectedSubject) {
      form.setFieldsValue({ 
        mon_hoc: value,
        khoi_kien_thuc: []
      });
    }
  };

  const columns = [
    { title: "Mã câu hỏi", dataIndex: "ma_cau_hoi", key: "ma_cau_hoi", align: "center" },
    { title: "Môn học", dataIndex: "mon_hoc", key: "mon_hoc", align: "center" },
    { title: "Nội dung câu hỏi", dataIndex: "noi_dung", key: "noi_dung"},
    { title: "Mức độ khó", dataIndex: "muc_do", key: "muc_do", align: "center" },
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
      <h2>Quản lý Câu Hỏi</h2>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Thêm câu hỏi
      </Button>
      <Modal
        title={editingIndex !== null ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
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
            label="Mã câu hỏi"
            name="ma_cau_hoi"
            rules={[{ required: true, message: "Vui lòng nhập mã câu hỏi!" }]}
          >
            <Input placeholder="Nhập mã câu hỏi" />
          </Form.Item>
          <Form.Item
            label="Môn học"
            name="mon_hoc"
            rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
          >
            <Select placeholder="Chọn môn học" onChange={handleSubjectChange}>
              {subjects.map((subject) => (
                <Select.Option key={subject.ma_mon} value={subject.ten_mon}>
                  {subject.ten_mon}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Nội dung câu hỏi"
            name="noi_dung"
            rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}
          >
            <Input.TextArea placeholder="Nhập nội dung câu hỏi" />
          </Form.Item>
          <Form.Item
            label="Mức độ khó"
            name="muc_do"
            rules={[{ required: true, message: "Vui lòng chọn mức độ khó!" }]}
          >
            <Select placeholder="Chọn mức độ khó">
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
              <Select.Option value="Rất khó">Rất khó</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Khối kiến thức" name="khoi_kien_thuc">
            <Select mode="multiple" placeholder="Chọn khối kiến thức">
              {subjects.flatMap(subject => subject.khoi_kien_thuc).map((khoi, index) => (
                <Select.Option key={index} value={khoi}>{khoi}</Select.Option>
              ))}
            </Select>
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
        dataSource={questions.map((question, index) => ({ ...question, key: index }))}
        pagination={false}
        style={{ marginTop: "20px" }}
      />
    </div>
  );
};

export default QuestionManager;
