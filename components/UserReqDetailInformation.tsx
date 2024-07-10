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
import useDetailInformationStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface DetailInformation {
    id: number;
    spesifikasi: string;
    detail_spesifikasi: string;
    unit: string;
    quantity: string;
    total: string;
    lokasi_pekerjaan: string;
  }

const SPTTahunanPage: React.FC = () => {
  const {
    detailInformation,
    addDetailInformation,
    editDetailInformation,
    removeDetailInformation,
    initializeDetailInformation,
  } = useDetailInformationStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      spesifikasi: "",
      detail_spesifikasi: "",
      unit: "",
      quantity: "",
      total: "",
      lokasi_pekerjaan: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editDetailInformation(updatedData);
        message.success("Detail Information updated successfully");
      } else {
        const newData = { ...values, id: detailInformation.length + 1 };
        addDetailInformation(newData);
        message.success("Detail Information added successfully");
      }
      setIsModalVisible(false);
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  const isEditing = (record: DetailInformation) => record.id === editingId;

  const handleEdit = (record: DetailInformation) => {
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
    removeDetailInformation(id);
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
      title: "Spesifikasi",
      dataIndex: "spesifikasi",
      key: "spesifikasi",
    },
    {
      title: "Detail Spesifikasi",
      dataIndex: "detail_spesifikasi",
      key: "detail_spesifikasi",
    },
    {
        title: "Unit",
        dataIndex: "unit",
        key: "unit",
      },
      {
        title: "Quantity",
        dataIndex: "quantity",
        key: "quantity",
      },
      {
        title: "Total",
        dataIndex: "total",
        key: "total",
      },
      {
        title: "Lokasi Pekerjaan",
        dataIndex: "lokasi_pekerjaan",
        key: "lokasi_pekerjaan",
      },

    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: DetailInformation) => (
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
        Tambah Data
      </Button>
      <Modal
        title={isEditMode ? "Edit SPT" : "Tambah SPT"}
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
            name="spesifikasi"
            label="Spesifikasi"
            rules={[{ required: true, message: "Spesifikasi harus diisi" }]}
          >
            <Input
              value={formik.values.spesifikasi}
              onChange={(e) => formik.setFieldValue("spesifikasi", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="detail_spesifikasi"
            label="Detail Spesifikasi"
            rules={[{ required: true, message: "Detail Spesifikasi harus diisi" }]}
          >
            <Input
              value={formik.values.detail_spesifikasi}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="unit"
            label="Unit"
            rules={[{ required: true, message: "Unit harus diisi" }]}
          >
            <Input
              value={formik.values.unit}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Quantity harus diisi" }]}
          >
            <Input
              value={formik.values.quantity}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="total"
            label="Total"
            rules={[{ required: true, message: "Total harus diisi" }]}
          >
            <Input
              value={formik.values.total}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="lokasi_pekerjaan"
            label="lokasi_pekerjaan"
            rules={[{ required: true, message: "lokasi_pekerjaan harus diisi" }]}
          >
            <Input
              value={formik.values.lokasi_pekerjaan}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={detailInformation}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default SPTTahunanPage;
