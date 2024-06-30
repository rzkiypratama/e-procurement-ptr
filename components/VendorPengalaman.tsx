import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Typography,
  Popconfirm,
  Modal,
  message,
} from "antd";
import usePengalamanStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";

const { TextArea } = Input;

interface Pengalaman {
  id: number;
  job_name: string;
  business_field_id: string;
  location: string;
}

const PengurusPerusahaan: React.FC = () => {
  const {
    pengalaman,
    addPengalaman,
    editPengalaman,
    removePengalaman,
    initializePengalaman,
  } = usePengalamanStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      job_name: "",
      business_field_id: "",
      location: "",
    },
    onSubmit: async (values) => {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
      try {
        const response = await axios.post(
          "https://vendorv2.delpis.online/api/vendor/experience",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );
        console.log("Response from API:", response.data);
        setIsModalVisible(false);
        message.success("Data Pengalaman added successful");
        formik.resetForm();
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data");
      }
    },
  });

  // ini untuk get dengan type data array of object
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }

        const response = await axios.get(
          "https://vendorv2.delpis.online/api/vendor/experience",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );

        // Check if response.data is an object containing an array
        if (response.data && Array.isArray(response.data.data)) {
          initializePengalaman(response.data.data); // Initialize Data Pengalaman state with the array of Data Pengalaman objects
        } else {
          console.error("Data Pengalaman data fetched is not in expected format:", response.data);
          message.error("Data Pengalaman data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching Data Pengalaman data:", error);
        message.error("Failed to fetch Data Pengalaman data. Please try again later.");
      }
    };

    fetchBankAccounts();
  }, [initializePengalaman]);

  const isEditing = (record: Pengalaman) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<Pengalaman> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as Pengalaman;
      editPengalaman({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removePengalaman(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    { title: "Nama Pekerjaan", dataIndex: "job_name", key: "job_name", editable: true },
    { title: "Bidang Pekerjaan", dataIndex: "business_field_id", key: "business_field_id", editable: true },
    { title: "Lokasi Pekerjaan", dataIndex: "location", key: "location", editable: true },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: Pengalaman) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              Edit
            </Typography.Link>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
              <a>Delete</a>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Pengalaman) => ({
        record,
        inputType:
          col.dataIndex === "noKTP" || col.dataIndex === "npwp"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addPengalaman({
      ...formik.values,
      id: pengalaman.length + 2,
    });
    setIsModalVisible(false);
    // form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", pengalaman);
    // Additional submission logic if needed
    formik.handleSubmit();
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Pengalaman
      </Button>
      <Modal
        title="Tambah Pengalaman"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="job_name"
            label="Nama Pekerjaan"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.job_name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="business_field_id"
            label="Bidang Pekerjaan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.business_field_id}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="location"
            label="Lokasi Pekerjaan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.location}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={pengalaman}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      <Button type="primary" onClick={handleSubmit}>
        Save
      </Button>
    </div>
  );
};

export default PengurusPerusahaan;
