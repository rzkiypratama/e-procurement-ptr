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
import useIzinUsahaStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface IzinUsaha {
  id: number;
  type: string;
  permit_number: string;
  start_date: string;
  end_date: string;
  licensing_agency: string;
  vendor_business_field_id: number;
}

const IzinUsaha: React.FC = () => {
  const {
    izinUsaha,
    addIzinUsaha,
    editIzinUsaha,
    removeIzinUsaha,
    initializeIzinUsaha,
  } = useIzinUsahaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      type: "",
      permit_number: "",
      start_date: "",
      end_date: "",
      licensing_agency: "",
      vendor_business_field_id: 0,
    },
    onSubmit: async (values, { setErrors }) => {
      // Dapatkan token, user_id, dan vendor_id dari cookies
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Please login first.");
        return;
      }

      try {
        setIsLoading(true)
        const response = await axios.post(
          "https://vendorv2.delpis.online/api/vendor/business-permit",
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
        message.success("Izin Usaha added successful");
        addIzinUsaha({ ...formik.values, id: izinUsaha.length + 2 });
    setIsModalVisible(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting data:", error);
        if (axios.isAxiosError(error)) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const backendErrors = error.response.data.errors;
            setErrors(backendErrors);
            Object.keys(backendErrors).forEach((key) => {
              message.error(`${backendErrors[key]}`);
            });
          } else {
            message.error("An error occurred. Please try again later.");
          }
        } else {
          message.error("An unexpected error occurred. Please try again later.");
        }
      }finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
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
          "https://vendorv2.delpis.online/api/vendor/business-permit",
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
          initializeIzinUsaha(response.data.data); // Initialize izinUsaha state with the array of IzinUsaha objects
        } else {
          console.error("Data fetched is not in expected format:", response.data);
          message.error("Data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      }finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [initializeIzinUsaha]);

  const isEditing = (record: IzinUsaha) => record.id.toString() === editingKey;

  const edit = (record: Partial<IzinUsaha> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      start_date: record.start_date
        ? dayjs(record.start_date, "DD-MM-YYYY")
        : null,
      end_date: record.end_date
        ? dayjs(record.end_date, "DD-MM-YYYY")
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
        start_date: dayjs(row.start_date).format("DD-MM-YYYY"),
        end_date: dayjs(row.end_date).format("DD-MM-YYYY"),
      };
  
      await axios.put(
        `https://vendorv2.delpis.online/api/vendor/business-permit/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      editIzinUsaha(updatedRow); // Pastikan Anda memiliki fungsi editIzinUsaha yang sesuai
      setEditingKey("");
      message.success("Business permit updated successfully.");
    } catch (error) {
      console.error("Error updating business permit:", error);
      message.error("Failed to update business permit. Please try again.");
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
        `https://vendorv2.delpis.online/api/vendor/business-permit/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      removeIzinUsaha(Number(id)); // Menghapus item dari state setelah berhasil dihapus di backend
      message.success("Business permit deleted successfully.");
    } catch (error) {
      console.error("Error deleting business permit:", error);
      message.error("Failed to delete business permit. Please try again.");
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Jenis Izin",
      dataIndex: "type",
      key: "type",
      editable: true,
    },
    {
      title: "Nomor Izin",
      dataIndex: "permit_number",
      key: "permit_number",
      editable: true,
    },
    {
      title: "Tanggal Izin",
      dataIndex: "start_date",
      key: "start_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
    },
    {
      title: "Tanggal Berakhir",
      dataIndex: "end_date",
      key: "end_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
    },
    {
      title: "Instansi Pemberi Izin",
      dataIndex: "licensing_agency",
      key: "licensing_agency",
      editable: true,
    },
    {
      title: "Bidang Usaha",
      dataIndex: "vendor_business_field_id",
      key: "vendor_business_field_id",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: IzinUsaha) => {
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
      onCell: (record: IzinUsaha) => ({
        record,
        inputType:
        col.dataIndex === "permit_number" || col.dataIndex.includes("permit_number") ? "text" :
        col.dataIndex === "start_date" || col.dataIndex.includes("start_date") ? "date" :
        col.dataIndex === "end_date" || col.dataIndex.includes("end_date") ? "date" :
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
    addIzinUsaha({ ...formik.values, id: izinUsaha.length + 2 });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", izinUsaha);
    formik.handleSubmit();
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Izin Usaha
      </Button>
      <Modal
        title="Tambah Izin Usaha"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          {/* jenis izin nanti berupa select */}
          {/* Izin Usaha 2 */}
        <Form.Item
            name="type"
            label="Jenis Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="permit_number"
            label="Nomor Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="permit_number"
              value={formik.values.permit_number}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Tanggal Izin"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              name="start_date"
              onChange={(date, dateString) =>
                formik.setFieldValue("start_date", dateString)
              }
            />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Tanggal Berakhir"
            rules={[{ required: true }]}
          >
            <DatePicker
              name="end_date"
              format="DD-MM-YYYY"
              onChange={(date, dateString) =>
                formik.setFieldValue("end_date", dateString)
              }
            />
          </Form.Item>
          <Form.Item
            name="licensing_agency"
            label="Instansi Pemberi Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="licensing_agency"
              value={formik.values.licensing_agency}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="vendor_business_field_id"
            label="Bidang Usaha"
            rules={[{ required: true }]}
          >
            <Input
              name="vendor_business_field_id"
              value={formik.values.vendor_business_field_id}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Form form={form} component={false}>
        <Table
          rowKey={(record) => record.id.toString()}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={izinUsaha}
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

export default IzinUsaha;
