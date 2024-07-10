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
import useSPTStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface SPTTahunan {
  id: number;
  year: string;
  spt_number: string;
  date: string;
}

const SPTTahunan: React.FC = () => {
  const {
    sptTahunan,
    addSPTTahunan,
    editSPTTahunan,
    removeSPTTahunan,
    initializeSPTTahunan,
  } = useSPTStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      year: "",
      spt_number: "",
      date: "",
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/annual-spt`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );
        console.log("Response from API:", response.data);
        setIsModalVisible(false);
        message.success("SPT added successful");
        addSPTTahunan({ ...values, id: response.data.data.id });
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
        setIsLoading(true);

        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/annual-spt`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        // Check if response.data is an object containing an array
        if (response.data && Array.isArray(response.data.data)) {
          initializeSPTTahunan(response.data.data); // Initialize SPT state with the array of SPT objects
        } else {
          console.error(
            "SPT data fetched is not in expected format:",
            response.data,
          );
          message.error("SPT data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching SPT data:", error);
        message.error("Failed to fetch SPT data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankAccounts();
  }, [initializeSPTTahunan]);

  const isEditing = (record: SPTTahunan) => record.id.toString() === editingKey;

  const edit = (record: Partial<SPTTahunan> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
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
      console.log(row.date);
      const updatedRow = {
        ...row,
        id: Number(id),
        date: dayjs(row.date).format("YYYY-MM-DD"),
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/annual-spt/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      editSPTTahunan(updatedRow);
      setEditingKey("");
      message.success("Annual SPT updated successfully.");
    } catch (error) {
      console.error("Error updating Annual SPT:", error);
      message.error("Failed to update Annual SPT. Please try again.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/annual-spt/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      removeSPTTahunan(Number(id));
      message.success("Annual SPT deleted successfully.");
    } catch (error) {
      console.error("Error deleting Annual SPT:", error);
      message.error("Failed to delete Annual SPT. Please try again.");
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Tahun SPT",
      dataIndex: "year",
      key: "year",
      editable: true,
    },
    {
      title: "Nomor SPT",
      dataIndex: "spt_number",
      key: "spt_number",
      editable: true,
    },
    {
      title: "Tanggal Lapor SPT",
      dataIndex: "date",
      key: "date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: SPTTahunan) => {
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
          <span className="flex items-center justify-center gap-5">
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
      onCell: (record: SPTTahunan) => ({
        record,
        inputType:
          col.dataIndex === "date"
            ? "date"
            : col.dataIndex.includes("date")
              ? "date"
              : col.dataIndex === "year"
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
    form.resetFields();
    formik.resetForm();
    setIsModalVisible(true);
    let emptyData = {
      year: "",
      spt_number: "",
      date: "",
    };
    form.setFieldsValue({ ...emptyData });
    formik.setValues({ ...emptyData })
  };

  const handleOk = (response: { data: { data: { id: any; }; }; }) => {
    addSPTTahunan({ ...formik.values, id: response.data.data.id });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", sptTahunan);
    form.validateFields().then((values) => {
      formik.handleSubmit()
    });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah SPT
      </Button>
      <Modal
        title="Tambah SPT"
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
        <Form form={form}>
          <Form.Item
            name="year"
            label="Tahun Izin"
            rules={[{ required: true, message: "Tahun izin harus diisi" }]}
          >
            <Input
              value={formik.values.year}
              onChange={(e) => formik.setFieldValue("year", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="spt_number"
            label="Nomor Izin"
            rules={[{ required: true, message: "Nomor Izin harus diisi" }]}
          >
            <Input
              value={formik.values.spt_number}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="date"
            label="Tanggal Lapor SPT"
            rules={[{ required: true, message: "Tanggal Laport SPT harus diisi" }]}
          >
            <DatePicker
              value={
                formik.values.date
                  ? dayjs(formik.values.date, "YYYY-MM-DD")
                  : null
              }
              format="DD-MM-YYYY"
              onChange={(date) =>
                formik.setFieldValue(
                  "date",
                  date ? date.format("YYYY-MM-DD") : "",
                )
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
          dataSource={sptTahunan}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          loading={isLoading}
          scroll={{
            x: 1300,
          }}
        />
      </Form>
    </div>
  );
};

export default SPTTahunan;
