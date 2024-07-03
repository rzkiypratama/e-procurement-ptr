import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Typography,
  Popconfirm,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import useLandasanHukumStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface LandasanHukum {
  id: number;
  document_no: string;
  document_date: string;
  notaris_name: string;
}

const LandasanHukum: React.FC = () => {
  const {
    landasanHukum,
    addLandasanHukum,
    editLandasanHukum,
    removeLandasanHukum,
    initializeLandasanHukum,
  } = useLandasanHukumStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      notaris_name: "",
      document_no: "",
      document_date: "",
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
        setIsLoading(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/legal-foundation`,
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
        message.success("Dokumen Landasan Hukum added successful");
        addLandasanHukum({ ...values, id: response.data.data.id });
    setIsModalVisible(false);
        formik.resetForm();
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data");
      }finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setIsLoading(true)
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");
  
        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }
  
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/legal-foundation`,
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
          initializeLandasanHukum(response.data.data); // Initialize bank account state with the array of bank account objects
        } else {
          console.error("Bank account data fetched is not in expected format:", response.data);
          message.error("Bank account data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching bank account data:", error);
        message.error("Failed to fetch bank account data. Please try again later.");
      }finally {
        setIsLoading(false);
      }
    };
  
    fetchBankAccounts();
  }, [initializeLandasanHukum]);

  const isEditing = (record: LandasanHukum) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<LandasanHukum> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      document_date: record.document_date
        ? dayjs(record.document_date, "YYYY-MM-DD")
        : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");
  
      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
  
      const row = await form.validateFields();
      const updatedRow = {
        ...row,
        id: Number(id),
        document_date: dayjs(row.document_date).format("YYYY-MM-DD"),
      };
  
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/legal-foundation/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      editLandasanHukum(updatedRow); // Pastikan Anda memiliki fungsi editIzinUsaha yang sesuai
      setEditingKey("");
      message.success("Landasan Hukum updated successfully.");
    } catch (error) {
      console.error("Error updating Landasan Hukum:", error);
      message.error("Failed to update Landasan Hukum. Please try again.");
    }
  };

  const handleDelete = async (id: React.Key) => {
    try {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");
  
      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
  
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/legal-foundation/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      removeLandasanHukum(Number(id)); // Menghapus item dari state setelah berhasil dihapus di backend
      message.success("Landasan Hukum deleted successfully.");
    } catch (error) {
      console.error("Error deleting Landasan Hukum:", error);
      message.error("Failed to delete Landasan Hukum. Please try again.");
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Notaris",
      dataIndex: "notaris_name",
      key: "notaris_name",
      editable: true,
    },
    {
      title: "Nomor Dokumen",
      dataIndex: "document_no",
      key: "document_no",
      editable: true,
    },
    {
      title: "Tahun Dokumen",
      dataIndex: "document_date",
      key: "document_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: LandasanHukum) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
          <Typography.Link
            onClick={() => save(record.id)}
            style={{ marginRight: 8 }}
          >
            Save
          </Typography.Link>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            <a>Cancel</a>
          </Popconfirm>
        </span>
      ) : (
        <span className="flex items-center gap-5 justify-center">
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined className="text-red-500" />
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
      onCell: (record: LandasanHukum) => ({
        record,
        inputType:
                col.dataIndex === "document_date" || col.dataIndex.includes("document_date") ? "date" :
                col.dataIndex === "document_no" || col.dataIndex.includes("document_no") ? "number" :
                "text",
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
    addLandasanHukum({ ...formik.values, id: landasanHukum.length + 2 });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", landasanHukum);
    // Additional submission logic if needed
    formik.handleSubmit()
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Landasan Hukum
      </Button>
      <Modal
        title="Tambah Landasan Hukum"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <>
           <Button onClick={handleCancel}>
            Batalkan
          </Button>
          <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
            Simpan Data
          </Button>
          </>
        ]}
      >
        <Form>
          <Form.Item
            name="notaris_name"
            label="Nama Notaris"
            // rules={[{ required: true }]}
          >
            <Input
              name="notaris_name"
              value={formik.values.notaris_name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="document_no"
            label="Nomor Dokumen"
            // rules={[{ required: true }]}
          >
            <Input
              name="document_no"
              value={formik.values.document_no}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="document_date"
            label="Tahun Dokumen"
            // rules={[{ required: true }]}
          >
            <DatePicker
              name="document_date"
              format="YYYY-MM-DD"
              onChange={(date, dateString) =>
                formik.setFieldValue("document_date", dateString)
              }
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
          dataSource={landasanHukum}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          loading={isLoading}
        />
      </Form>
    </div>
  );
};

export default LandasanHukum;
