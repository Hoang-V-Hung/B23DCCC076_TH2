import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ExamSystem } from "./examSystem";

const LOCAL_STORAGE_KEY = "exams";
const QUESTIONS_STORAGE_KEY = "questions";
const SUBJECTS_STORAGE_KEY = "subjects";

const ExamManager: React.FC = () => {
  const [exams, setExams] = useState<ExamSystem.Exam[]>(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]"));
  const [subjects, setSubjects] = useState<ExamSystem.Subject[]>(() => JSON.parse(localStorage.getItem(SUBJECTS_STORAGE_KEY) || "[]"));
  const [questions, setQuestions] = useState<ExamSystem.Question[]>(() => JSON.parse(localStorage.getItem(QUESTIONS_STORAGE_KEY) || "[]"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableQuestions, setAvailableQuestions] = useState<{ [key: string]: { easy: number; medium: number; hard: number; veryHard: number } }>({});
  const [form] = Form.useForm();
  const [editingExam, setEditingExam] = useState<ExamSystem.Exam | null>(null);  // State for the exam being edited

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exams));
  }, [exams]);

  const showModal = (examToEdit?: ExamSystem.Exam) => {
    setEditingExam(examToEdit || null);
    if (examToEdit) {
      form.setFieldsValue({
        maDeThi: examToEdit.maDeThi,
        maMonHoc: examToEdit.maMonHoc,
        easy: examToEdit.danhSachCauHoi.filter(q => q.muc_do === "Dễ").length,
        medium: examToEdit.danhSachCauHoi.filter(q => q.muc_do === "Trung bình").length,
        hard: examToEdit.danhSachCauHoi.filter(q => q.muc_do === "Khó").length,
        veryHard: examToEdit.danhSachCauHoi.filter(q => q.muc_do === "Rất khó").length,
      });
    } else {
      form.resetFields();  // Clear form for new exam
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getAvailableQuestionsCount = (subject: string) => {
    const filteredQuestions = questions.filter(q => q.mon_hoc === subject);
    const counts = {
      easy: filteredQuestions.filter(q => q.muc_do === "Dễ").length,
      medium: filteredQuestions.filter(q => q.muc_do === "Trung bình").length,
      hard: filteredQuestions.filter(q => q.muc_do === "Khó").length,
      veryHard: filteredQuestions.filter(q => q.muc_do === "Rất khó").length,
    };
    return counts;
  };

  const handleSubjectChange = (subject: string) => {
    const counts = getAvailableQuestionsCount(subject);
    setAvailableQuestions(prev => ({ ...prev, [subject]: counts }));
    form.setFieldsValue({
      easy: counts.easy,
      medium: counts.medium,
      hard: counts.hard,
      veryHard: counts.veryHard,
    });
  };

  const handleSubmit = (values: { maDeThi: string; maMonHoc: string; easy: number; medium: number; hard: number; veryHard: number }) => {
    const { maMonHoc, easy, medium, hard, veryHard } = values;

    const availableEasy = availableQuestions[maMonHoc]?.easy || 0;
    const availableMedium = availableQuestions[maMonHoc]?.medium || 0;
    const availableHard = availableQuestions[maMonHoc]?.hard || 0;
    const availableVeryHard = availableQuestions[maMonHoc]?.veryHard || 0;

    if (easy > availableEasy || medium > availableMedium || hard > availableHard || veryHard > availableVeryHard) {
      message.warning("Không đủ câu hỏi cho đề thi!");
      return;
    }

    const selectedQuestions = [
      ...getRandomQuestions(maMonHoc, "Dễ", easy),
      ...getRandomQuestions(maMonHoc, "Trung bình", medium),
      ...getRandomQuestions(maMonHoc, "Khó", hard),
      ...getRandomQuestions(maMonHoc, "Rất khó", veryHard),
    ];

    if (editingExam) {
      const updatedExams = exams.map((exam) =>
        exam.maDeThi === editingExam.maDeThi ? { ...exam, ...values, danhSachCauHoi: selectedQuestions } : exam
      );
      setExams(updatedExams);
    } else {
      const newExam = { maDeThi: values.maDeThi, maMonHoc: values.maMonHoc, danhSachCauHoi: selectedQuestions };
      const updatedExams = [...exams, newExam];
      setExams(updatedExams);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(exams));
    setIsModalOpen(false);
  };

  const getRandomQuestions = (subject: string, difficulty: string, count: number) => {
    const filteredQuestions = questions.filter((q) => q.mon_hoc === subject && q.muc_do === difficulty);
    return filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const handleDeleteExam = (index: number) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đề thi này?",
      onOk: () => setExams(exams.filter((_, i) => i !== index)),
    });
  };

  const columns = [
    { title: "Mã đề thi", dataIndex: "maDeThi", key: "maDeThi" },
    { title: "Môn học", dataIndex: "maMonHoc", key: "maMonHoc" },
    { title: "Số câu hỏi", dataIndex: "danhSachCauHoi", key: "danhSachCauHoi", render: (list: ExamSystem.Question[]) => list.length },
    {
      title: "Sửa/Xóa",
      key: "action",
      render: (_: any, record: ExamSystem.Exam, index: number) => (
        <div>
          <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
          <Button type="link" danger onClick={() => handleDeleteExam(index)}>Xóa</Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Quản lý Đề Thi</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
        Tạo đề thi
      </Button>
      <Table columns={columns} dataSource={exams} rowKey="maDeThi" style={{ marginTop: 20 }} />
      <Modal title={editingExam ? "Sửa đề thi" : "Tạo đề thi"} visible={isModalOpen} onCancel={handleCancel} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="maDeThi" label="Mã đề thi" rules={[{ required: true, message: "Vui lòng nhập mã đề thi!" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="maMonHoc" label="Môn học" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}> 
            <Select onChange={handleSubjectChange}>
              {subjects.map(subject => (
                <Select.Option key={subject.ma_mon} value={subject.ma_mon}>{subject.ten_mon}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="easy" label="Số câu dễ" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item name="medium" label="Số câu trung bình" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item name="hard" label="Số câu khó" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" disabled />
          </Form.Item>
          <Form.Item name="veryHard" label="Số câu rất khó" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ExamManager;
