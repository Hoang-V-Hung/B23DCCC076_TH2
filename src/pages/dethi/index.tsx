import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { saveAs } from "file-saver";

interface Course {
  id: number;
  name: string;
  macauhoi: string;
  mucdo: string;
  content: string;
  khoikienthuc: string;
}

interface Exam {
  id: number;
  code: string;
  subject: string;
  questions: Course[];
}

const dethi: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) setCourses(JSON.parse(storedCourses));

    const storedExams = localStorage.getItem("exams");
    if (storedExams) setExams(JSON.parse(storedExams));
  }, []);

  const generateExamCode = () => {
    for (let i = 0; i < 1000; i++) {
      const code = `DT${i.toString().padStart(3, "0")}`;
      if (!exams.some(exam => exam.code === code)) {
        return code;
      }
    }
    return null;
  };

  const showModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getRandomQuestions = (subject: string, difficulty: string, count: number) => {
    const filteredQuestions = courses.filter(
      (q) => q.name === subject && q.mucdo === difficulty
    );
    if (filteredQuestions.length < count) {
      return null;
    }
    return filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, count);
  };

  const handleSubmit = (values: { subject: string; easy: number; medium: number; hard: number }) => {
    const easyQuestions = getRandomQuestions(values.subject, "Dễ", values.easy);
    const mediumQuestions = getRandomQuestions(values.subject, "Trung bình", values.medium);
    const hardQuestions = getRandomQuestions(values.subject, "Khó", values.hard);

    if (!easyQuestions || !mediumQuestions || !hardQuestions) {
      message.error("Không đủ câu hỏi để tạo đề thi. Vui lòng kiểm tra lại số lượng câu hỏi có sẵn.");
      return;
    }

    const examCode = generateExamCode();
    if (!examCode) {
      message.error("Đã đạt giới hạn số lượng mã đề thi. Không thể tạo thêm!");
      return;
    }

    const selectedQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
    const newExam = { id: Date.now(), code: examCode, subject: values.subject, questions: selectedQuestions };
    const updatedExams = [...exams, newExam];
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
    setIsModalOpen(false);
  };

  const handleExportExam = (exam: Exam) => {
    const examContent = `Mã đề thi: ${exam.code}\nMôn học: ${exam.subject}\n\n` +
      exam.questions.map((q, index) => `Câu ${index + 1}: ${q.content}`).join("\n");
    const blob = new Blob([examContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `DeThi_${exam.subject}_${exam.code}.txt`);
  };

  const handleDeleteExam = (examId: number) => {
    const updatedExams = exams.filter((exam) => exam.id !== examId);
    setExams(updatedExams);
    localStorage.setItem("exams", JSON.stringify(updatedExams));
    message.success("Đề thi đã được xóa thành công!");
  };

  const columns = [
    { title: "Mã đề thi", dataIndex: "code", key: "code" },
    { title: "Môn học", dataIndex: "subject", key: "subject" },
    { title: "Số câu hỏi", dataIndex: "questions", key: "questions", render: (questions: Course[]) => questions.length },
    {
      title: "Xuất đề thi",
      key: "export",
      render: (_: any, record: Exam) => (
        <Button type="link" onClick={() => handleExportExam(record)}>
          Xuất File
        </Button>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: Exam) => (
        <Button type="link" icon={<DeleteOutlined />} onClick={() => handleDeleteExam(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Quản lý đề thi</h1>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Tạo đề thi
      </Button>
      <Table columns={columns} dataSource={exams} rowKey="id" style={{ marginTop: 20 }} />
      <Modal title="Tạo đề thi" visible={isModalOpen} onCancel={handleCancel} onOk={() => form.submit()}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}> 
            <Select>
              {[...new Set(courses.map(course => course.name))].map(subject => (
                <Select.Option key={subject} value={subject}>{subject}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="easy" label="Số câu dễ" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" />
          </Form.Item>
          <Form.Item name="medium" label="Số câu trung bình" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" />
          </Form.Item>
          <Form.Item name="hard" label="Số câu khó" rules={[{ required: true, message: "Vui lòng nhập số câu hỏi!" }]}> 
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default dethi;
