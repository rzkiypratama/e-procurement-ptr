import React, { useState, useEffect } from "react";
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
import axios from "axios";
import { getCookie } from 'cookies-next'

const { TextArea } = Input;

interface MasterBudgetInputAnggaran {
  id: number;
  year: string;
  department: Department;
  total: string;
  updated_by: string;
  department_id: number;
}

interface Department {
  id: number;
  department_name: string;
  department_code: string;
}

const SyaratKualifikasi: React.FC = () => {
  const {
    masterBudgetInputAnggaran,
    addMasterBudgetInputAnggaran,
    editMasterBudgetInputAnggaran,
    removeMasterBudgetInputAnggaran,
    initializeMasterBudgetInputAnggaran,
  } = useMasterDataInputAnggaranStore();

  const token = getCookie("token")

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
      year: "",
      department_id: 0,
      department: {
        id: 0,
        department_code: "",
        department_name: "",
      },
      total: "",
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
    { title: "No", dataIndex: "no", key: "no" },
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

  useEffect(() => {
    // Initialize data if needed
    getListAnggaran()
  }, []);

  const getListAnggaran = async () => {
    setLoading(true)
    try {
      //${process.env.NEXT_PUBLIC_API_URL}
      const response = await axios.get(`https://requisition.eproc.latansa.sch.id/api/master/anggaran`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Response from API:", response.data.data);
      let index = 1;
      response.data.data.map((e: any) => {
        e.no = index
        index++
      })
      const data: MasterBudgetInputAnggaran[] = await response.data.data
      initializeMasterBudgetInputAnggaran(data)
      console.log(masterBudgetInputAnggaran.length)
    } catch (error) {
      message.error(`Get Data Anggaran failed! ${error}`);
      console.error("Error Get Data Anggaran:", error);
    } finally {
      setLoading(false)
    }
  }

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
            name="year"
            label="Tahun Anggaran"
            rules={[{ required: true, message: "tahun_anggaran harus diisi" }]}
          >
            <Input
              name="year"
              value={formik.values.year}
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
              value={formik.values.department_id}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="total"
            label="Anggaran Digunakan"
            rules={[
              { required: true, message: "Detail Kualifikasi harus diisi" },
            ]}
          >
            <Input
              name="total"
              value={formik.values.total}
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
      />
    </div>
  );
};

export default SyaratKualifikasi;
