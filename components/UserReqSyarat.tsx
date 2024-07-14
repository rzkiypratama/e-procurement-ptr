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
import axios from "axios";
import { getCookie } from 'cookies-next'

const { TextArea } = Input;

interface SyaratKualifikasi {
  no: number;
  id: number;
  qualification: string;
  qualification_detail: string;
}

const SyaratKualifikasi: React.FC = () => {
  const token = getCookie("token")

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
      no: 0,
      id: 0,
      qualification: "",
      qualification_detail: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editSyaratKualifikasi(updatedData);
        message.success("Detail Information updated successfully");
      } else {
        const newData = { ...values, no: syaratKualifikasi.length + 1, id: syaratKualifikasi.length + 1 };
        addSyaratKualifikasi(newData);
        message.success("Detail Information added successfully");

        // setIsLoading(true);
        // try {
        //   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/anggaran`, values, {
        //     headers: {
        //       "Authorization": `Bearer ${token}`
        //     }
        //   });
        //   console.log("Response from API:", response.data);
        //   if (response.status == 201 || response.status == 200) {
        // addSyaratKualifikasi({
        //   ...values,
        //   id: response.data.data.id,
        //   no: syaratKualifikasi.length + 1,
        // })
        //     message.success(`Add Anggaran successfully`)

        //     form.resetFields()
        //     formik.resetForm()
        //     setIsModalVisible(false)
        //   } else {
        //     message.error(`${response.data.message}`);
        //   }
        // } catch (error) {
        //   message.error(`Add Anggaran failed! ${error}`);
        //   console.error("Error submitting form:", error);
        // } finally {
        //   setLoading(false);
        // }
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      formik.handleSubmit()
    });
  }

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const body = {
        ...formik.values
      }

      const row = formik.values
      const updatedRow = {
        ...row,
      };

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL_REQ}/-/${editingId}`, body, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Response from API:", response.data);
      if (response.status == 200) {
        message.success(`Update Qualification successfully`)

        editSyaratKualifikasi(updatedRow)
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      message.error(`Edit Qualification failed! ${error}`);
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
      form.resetFields()
      formik.resetForm()
      setIsModalVisible(false)
      setEditingId(null);
      setIsEditMode(false)
    }
  }

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
              onClick={handleSubmit}
              loading={isLoading}
            >
              {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="qualification"
            label="Kualifikasi"
            rules={[{ required: true, message: "Kualifikasi harus diisi" }]}>
            <Input
              name="qualification"
              value={formik.values.qualification}
              onChange={(e) =>
                formik.setFieldValue("spesifikasi", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="qualification_detail"
            label="Detail Spesifikasi"
            rules={[
              { required: true, message: "Detail Kualifikasi harus diisi" },
            ]}>
            <Input
              name="qualification_detail"
              value={formik.values.qualification_detail}
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
