import React, { useState, useEffect } from "react";
import { Button, Table, Modal, Form, Input, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface Course {
  id: number;
  name: string;
  macauhoi: string;
  mucdo: string;
  content: string;
  khoikienthuc: string;
}

interface Task1 {
  id: number;
  tenmon: string;
}

const qlCauhoi: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [tasks, setTasks] = useState<Task1[]>([]);
  const [search, setSearch] = useState("");
  const [filterMucDo, setFilterMucDo] = useState("");
  const [filterMonHoc, setFilterMonHoc] = useState("");
  const [filterKhoiKienThuc, setFilterKhoiKienThuc] = useState("");

  useEffect(() => {
    const storedCourses = localStorage.getItem("courses");
    if (storedCourses) setCourses(JSON.parse(storedCourses));

    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) setTasks(JSON.parse(storedTasks));
  }, []);

  const showModal = (course?: Course) => {
    setEditingCourse(course || null);
    form.setFieldsValue(course || {});
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values: Omit<Course, "id">) => {
    const newCourses = editingCourse
      ? courses.map((c) => (c.id === editingCourse.id ? { ...c, ...values } : c))
      : [...courses, { id: Date.now(), ...values }];
    
    setCourses(newCourses);
    localStorage.setItem("courses", JSON.stringify(newCourses));
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    const updatedCourses = courses.filter((course) => course.id !== id);
    setCourses(updatedCourses);
    localStorage.setItem("courses", JSON.stringify(updatedCourses));
  };

  const filteredCourses = courses.filter((course) =>
    course.name.includes(filterMonHoc) &&
    course.mucdo.includes(filterMucDo) &&
    course.khoikienthuc.includes(filterKhoiKienThuc) &&
    (course.name.includes(search) ||
      course.macauhoi.includes(search) ||
      course.content.includes(search))
  );

  const columns = [
    { title: "Tên môn", dataIndex: "name", key: "name" },
    { title: "Mã câu hỏi", dataIndex: "macauhoi", key: "macauhoi" },
    { title: "Mức độ", dataIndex: "mucdo", key: "mucdo" },
    { title: "Nội dung câu hỏi", dataIndex: "content", key: "content" },
    { title: "Khối kiến thức", dataIndex: "khoikienthuc", key: "khoikienthuc" },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Course) => (
        <>
          <EditOutlined onClick={() => showModal(record)} style={{ marginRight: 8, cursor: "pointer" }} />
          <DeleteOutlined onClick={() => handleDelete(record.id)} style={{ color: "red", cursor: "pointer" }} />
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center" }}>Danh sách câu hỏi</h1>
      <Input
        placeholder="Tìm kiếm câu hỏi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 10, width: "30%" }}
      />
      <Select
        placeholder="Lọc theo môn học"
        onChange={setFilterMonHoc}
        style={{ marginLeft: 10, marginBottom: 10, width: "20%" }}
        allowClear
      >
        {tasks.map((task) => (
          <Select.Option key={task.id} value={task.tenmon}>{task.tenmon}</Select.Option>
        ))}
      </Select>
      <Select
        placeholder="Lọc theo mức độ"
        onChange={setFilterMucDo}
        style={{ marginLeft: 10, marginBottom: 10, width: "20%" }}
        allowClear
      >
        <Select.Option value="Dễ">Dễ</Select.Option>
        <Select.Option value="Trung bình">Trung bình</Select.Option>
        <Select.Option value="Khó">Khó</Select.Option>
      </Select>
      <Select
        placeholder="Lọc theo khối kiến thức"
        onChange={setFilterKhoiKienThuc}
        style={{ marginLeft: 10, marginBottom: 10, width: "20%" }}
        allowClear
      >
        {[...new Set(courses.map(course => course.khoikienthuc))].map(khoikienthuc => (
          <Select.Option key={khoikienthuc} value={khoikienthuc}>{khoikienthuc}</Select.Option>
        ))}
      </Select>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginLeft: 10 }}>
        Thêm câu hỏi
      </Button>
      <Table columns={columns} dataSource={filteredCourses} rowKey="id" style={{ marginTop: 20 }} />
      <Modal
        title={editingCourse ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi"}
        visible={isModalOpen}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item name="name" label="Tên môn" rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}> 
            <Select>
              {tasks.map((task) => (
                <Select.Option key={task.id} value={task.tenmon}>{task.tenmon}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="macauhoi" label="Mã câu hỏi" rules={[{ required: true, message: "Vui lòng nhập mã câu hỏi!" }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="mucdo" label="Mức độ" rules={[{ required: true, message: "Vui lòng chọn mức độ!" }]}> 
            <Select>
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="content" label="Nội dung câu hỏi" rules={[{ required: true, message: "Vui lòng nhập nội dung câu hỏi!" }]}> 
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="khoikienthuc" label="Khối kiến thức"> 
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default qlCauhoi;
