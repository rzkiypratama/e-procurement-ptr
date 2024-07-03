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
  Select,
} from "antd";
import usePengurusPerusahaanStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { positionOptions } from "@/utils/positionOptions";

const { TextArea } = Input;
interface PengurusPerusahaan {
  id: number;
  name: string;
  position_id: number;
  identity_no: string;
  npwp_no: string;
}

const PengurusPerusahaan: React.FC = () => {
  const {
    pengurusPerusahaan,
    addPengurusPerusahaan,
    editPengurusPerusahaan,
    removePengurusPerusahaan,
    initializePengurusPerusahaan,
  } = usePengurusPerusahaanStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: "",
      position_id: 0,
      identity_no: "",
      npwp_no: "",
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/director`,
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
        message.success("Bank Account added successful");
        addPengurusPerusahaan({ ...values, id: response.data.data.id });
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
    const fetchPengurusPerusahaan = async () => {
      try {
        setIsLoading(true);

        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");
  
        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }
  
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/director`,
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
          const mappedData = response.data.data.map((contact: { vendor_position: { name: any; }; position_id: any; }) => ({
            ...contact,
            position_id: contact.vendor_position ? contact.vendor_position.name : contact.position_id,
          }));
          initializePengurusPerusahaan(mappedData); // Initialize bank account state with the array of bank account objects
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
  
    fetchPengurusPerusahaan();
  }, [initializePengurusPerusahaan]);

  const isEditing = (record: PengurusPerusahaan) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<PengurusPerusahaan> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
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
      };
  
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/director/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      editPengurusPerusahaan(updatedRow);
      setEditingKey("");
      message.success("Director's details updated successfully.");
    } catch (error) {
      console.error("Error updating director's details:", error);
      message.error("Failed to update director's details. Please try again.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/director/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      removePengurusPerusahaan(Number(id));
      message.success("Director deleted successfully.");
    } catch (error) {
      console.error("Error deleting director:", error);
      message.error("Failed to delete director. Please try again.");
    }
  };

  const getPositionName = (positionId: string) => {
    const vendor_position = positionOptions.find(option => option.value === positionId);
    return vendor_position ? vendor_position.label : positionId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    { title: "Nama", dataIndex: "name", key: "name", editable: true },
    { title: "Jabatan", dataIndex: "position_id", key: "position_id", editable: true,
      render: (text: string) => getPositionName(text), options: positionOptions  },
    { title: "No KTP", dataIndex: "identity_no", key: "identity_no", editable: true },
    { title: "NPWP", dataIndex: "npwp_no", key: "npwp_no", editable: true },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: PengurusPerusahaan) => {
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
      onCell: (record: PengurusPerusahaan) => ({
        record,
        inputType:
          col.dataIndex === "identity_no" || col.dataIndex === "npwp_no" || col.dataIndex === "position_id"
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
    addPengurusPerusahaan({
      ...formik.values,
      id: pengurusPerusahaan.length + 2,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", pengurusPerusahaan);
    // Additional submission logic if needed
    formik.handleSubmit()
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Pengurus Perusahaan
      </Button>
      <Modal
        title="Tambah Pengurus Perusahaan"
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
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="position_id"
            label="Jabatan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Select
              onChange={(value) => formik.setFieldValue("position_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.position_id}
            >
              {positionOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="identity_no"
            label="No KTP"
            rules={[{ required: true, message: "KTP harus berupa angka" }]}
          >
            <Input
              value={formik.values.identity_no}
              onChange={formik.handleChange}
              // onChange={(value) => formik.setFieldValue("identity_no", value)}
            />
          </Form.Item>
          <Form.Item
            name="npwp_no"
            label="NPWP"
            rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.npwp_no}
              onChange={formik.handleChange}
              // on change dibawah untuk Input berupa number InputNumber
              // onChange={(value) => formik.setFieldValue("npwp_no", value)}
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
          dataSource={pengurusPerusahaan}
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

export default PengurusPerusahaan;
