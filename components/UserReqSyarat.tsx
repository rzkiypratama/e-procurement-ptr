import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  Popconfirm,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import useSyaratKualifikasiStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface SyaratKualifikasi {
  id: number;
  kualifikasi: string;
  detail_kualifikasi: string;
}

const SyaratKualifikasi: React.FC = () => {
  const {
    syaratKualifikasi,
    addSyaratKualifikasi,
    editSyaratKualifikasi,
    removeSyaratKualifikasi,
    initializeSyaratKualifikasi,
  } = useSyaratKualifikasiStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      kualifikasi: "",
      detail_kualifikasi: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editSyaratKualifikasi(updatedData);
        message.success("Detail Information updated successfully");
      } else {
        const newData = { ...values, id: syaratKualifikasi.length + 1 };
        addSyaratKualifikasi(newData);
        message.success("Detail Information added successfully");
      }
      setIsModalVisible(false);
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  const isEditing = (record: SyaratKualifikasi) => record.id === editingId;

  const handleEdit = (record: SyaratKualifikasi) => {
    form.setFieldsValue({
      ...record,
      //   date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
    });
    formik.setValues(record);
    setIsModalVisible(true);
    setIsEditMode(true);
    setEditingId(record.id);
  };

  const handleDelete = (id: number) => {
    removeSyaratKualifikasi(id);
    message.success("Detail Information deleted successfully");
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    formik.resetForm();
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Kualifikasi",
      dataIndex: "kualifikasi",
      key: "kualifikasi",
    },
    {
      title: "Detail Kualifikasi",
      dataIndex: "detail_kualifikasi",
      key: "detail_kualifikasi",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: SyaratKualifikasi) => (
        <span className="flex items-center justify-center gap-5">
          <Typography.Link onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined className="text-red-500" />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Syarat Kualifikasi
      </Button>
      <Modal
        title={isEditMode ? "Edit Syarat Kualifikasi" : "Tambah Syarat Kualifikasi"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <>
            <Button onClick={handleCancel}>Batalkan</Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => formik.handleSubmit()}
              loading={isLoading}
            >
              {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="kualifikasi"
            label="Kualifikasi"
            rules={[{ required: true, message: "Kualifikasi harus diisi" }]}
          >
            <Input
              value={formik.values.kualifikasi}
              onChange={(e) =>
                formik.setFieldValue("spesifikasi", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="detail_kualifikasi"
            label="Detail Spesifikasi"
            rules={[
              { required: true, message: "Detail Kualifikasi harus diisi" },
            ]}
          >
            <Input
              value={formik.values.detail_kualifikasi}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={syaratKualifikasi}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default SyaratKualifikasi;
