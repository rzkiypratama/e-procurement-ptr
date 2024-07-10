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
import useMasterDataInputAnggaranStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface MasterBudgetInputAnggaran {
    id: number;
    tahun_anggaran: string;
    department: string;
    anggaran_digunakan: string;
    updated_by: string;
  }

const SyaratKualifikasi: React.FC = () => {
  const {
    masterBudgetInputAnggaran,
    addMasterBudgetInputAnggaran,
    editMasterBudgetInputAnggaran,
    removeMasterBudgetInputAnggaran,
    initializeMasterBudgetInputAnggaran,
  } = useMasterDataInputAnggaranStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
        id: 0,
        tahun_anggaran: "",
        department: "",
        anggaran_digunakan: "",
        updated_by: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editMasterBudgetInputAnggaran(updatedData);
        message.success("Detail Information updated successfully");
      } else {
        const newData = { ...values, id: masterBudgetInputAnggaran.length + 1 };
        addMasterBudgetInputAnggaran(newData);
        message.success("Detail Information added successfully");
      }
      setIsModalVisible(false);
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  const isEditing = (record: MasterBudgetInputAnggaran) => record.id === editingId;

  const handleEdit = (record: MasterBudgetInputAnggaran) => {
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
    removeMasterBudgetInputAnggaran(id);
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
      title: "Tahun Anggaran",
      dataIndex: "tahun_anggaran",
      key: "tahun_anggaran",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
        title: "Anggaran Digunakan",
        dataIndex: "anggaran_digunakan",
        key: "anggaran_digunakan",
      },
      {
        title: "Updated By",
        dataIndex: "updated_by",
        key: "updated_by",
      },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: MasterBudgetInputAnggaran) => (
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
        Add
      </Button>
      <Modal
        title={isEditMode ? "Edit Input Anggaran" : "Tambah Input Anggaran"}
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
            name="tahun_anggaran"
            label="Tahun Anggaran"
            rules={[{ required: true, message: "tahun_anggaran harus diisi" }]}
          >
            <Input
              value={formik.values.tahun_anggaran}
              onChange={(e) =>
                formik.setFieldValue("tahun_anggaran", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="department"
            label="Department"
            rules={[
              { required: true, message: "Detail Kualifikasi harus diisi" },
            ]}
          >
            <Input
              value={formik.values.department}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="anggaran_digunakan"
            label="Anggaran Digunakan"
            rules={[
              { required: true, message: "Detail Kualifikasi harus diisi" },
            ]}
          >
            <Input
              value={formik.values.anggaran_digunakan}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="updated_by"
            label="Updated By"
            rules={[
              { required: true, message: "Detail Kualifikasi harus diisi" },
            ]}
          >
            <Input
              value={formik.values.updated_by}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={masterBudgetInputAnggaran}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
};

export default SyaratKualifikasi;
