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
import useTenagaAhliStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface TenagaAhli {
  id: number;
  name: string;
  birth_date: string;
  identity_no: string;
  npwp_no: string;
  last_education: string;
  last_experience: string;
}

const TenagaAhli: React.FC = () => {
  const {
    tenagaAhli,
    addTenagaAhli,
    editTenagaAhli,
    removeTenagaAhli,
    initializeTenagaAhli,
  } = useTenagaAhliStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: "",
      birth_date: "",
      identity_no: "",
      npwp_no: "",
      last_education: "",
      last_experience: "",
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
  setIsLoading(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/expert`,
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
        message.success("Tenaga Ahli added successful");
        addTenagaAhli({ ...values, id: response.data.data.id });
        formik.resetForm();
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // ini untuk get dengan type data array of object
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/expert`,
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
          initializeTenagaAhli(response.data.data); // Initialize Tenaga Ahli state with the array of Tenaga Ahli objects
        } else {
          console.error("Tenaga Ahli data fetched is not in expected format:", response.data);
          message.error("Tenaga Ahli data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching Tenaga Ahli data:", error);
        message.error("Failed to fetch Tenaga Ahli data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBankAccounts();
  }, [initializeTenagaAhli]);

  const isEditing = (record: TenagaAhli) => record.id.toString() === editingKey;

  const edit = (record: Partial<TenagaAhli> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      birth_date: record.birth_date
        ? dayjs(record.birth_date, "YYYY-MM-DD")
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
        birth_date: dayjs(row.birth_date).format("YYYY-MM-DD"),
      };
  
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/expert/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      editTenagaAhli(updatedRow);
      setEditingKey("");
      message.success("Tenaga Ahli updated successfully.");
    } catch (error) {
      console.error("Error updating Tenaga Ahli:", error);
      message.error("Failed to update Tenaga Ahli. Please try again.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/expert/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      removeTenagaAhli(Number(id));
      message.success("Tenaga Ahli deleted successfully.");
    } catch (error) {
      console.error("Error deleting Tenaga Ahli:", error);
      message.error("Failed to delete Tenaga Ahli. Please try again.");
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Tanggal Lahir",
      dataIndex: "birth_date",
      key: "birth_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
    },
    {
      title: "Nomor KTP",
      dataIndex: "identity_no",
      key: "identity_no",
      editable: true,
    },
    {
      title: "Nomor NPWP",
      dataIndex: "npwp_no",
      key: "npwp_no",
      editable: true,
    },
    {
      title: "Pendidikan Terakhir",
      dataIndex: "last_education",
      key: "last_education",
      editable: true,
    },
    {
      title: "Pengalaman Terakhir",
      dataIndex: "last_experience",
      key: "last_experience",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: TenagaAhli) => {
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
      onCell: (record: TenagaAhli) => ({
        record,
        inputType:
          col.dataIndex === "birth_date"
            ? "date"
            : col.dataIndex === "identity_no" ||
              col.dataIndex === "npwp_no"
              ? "text"
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
    addTenagaAhli({ ...formik.values, id: tenagaAhli.length + 2 });
    setIsModalVisible(false);
    // formik.resetForm();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", tenagaAhli);
    // Additional submission logic if needed
    formik.handleSubmit();
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Tenaga Ahli
      </Button>
      <Modal
        title="Tambah Tenaga Ahli"
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
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="birth_date"
            label="Tanggal Lahir"
            rules={[
              { required: true, message: "Tanggal Lahir tidak boleh kosong" },
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              value={
                formik.values.birth_date
                  ? dayjs(formik.values.birth_date, "YYYY-MM-DD")
                  : null
              }
              onChange={(date) =>
                formik.setFieldValue(
                  "birth_date",
                  date ? date.format("DD-MM-YYYY") : "",
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="identity_no"
            label="Nomor KTP"
            rules={[
              { required: true, message: "Nomor KTP harus berupa angka" },
            ]}
          >
            <Input
              name="identity_no"
              value={formik.values.identity_no}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="npwp_no"
            label="Nomor NPWP"
            rules={[
              { required: true, message: "Nomor NPWP harus berupa angka" },
            ]}
          >
            <Input
              name="npwp_no"
              value={formik.values.npwp_no}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="last_education"
            label="Pendidikan Terakhir"
            rules={[{ required: true, message: "Pendidikan tidak boleh kosong" }]}
          >
            <Input
              name="last_education"
              value={formik.values.last_education}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="last_experience"
            label="Pengalaman Terakhir"
            rules={[{ required: true, message: "Pengalaman tidak boleh kosong" }]}
          >
            <Input
              name="last_experience"
              value={formik.values.last_experience}
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
          dataSource={tenagaAhli}
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

export default TenagaAhli;
