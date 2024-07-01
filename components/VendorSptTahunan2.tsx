import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, InputNumber, DatePicker, Typography, Popconfirm, Modal, message } from "antd";
import dayjs from "dayjs";
import useSPTStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";

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
        const response = await axios.post(
          "https://vendorv2.delpis.online/api/vendor/annual-spt",
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
        message.success("SPT added successful");
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
          "https://vendorv2.delpis.online/api/vendor/annual-spt",
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
          initializeSPTTahunan(response.data.data); // Initialize SPT state with the array of SPT objects
        } else {
          console.error("SPT data fetched is not in expected format:", response.data);
          message.error("SPT data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching SPT data:", error);
        message.error("Failed to fetch SPT data. Please try again later.");
      }
    };

    fetchBankAccounts();
  }, [initializeSPTTahunan]);

  const isEditing = (record: SPTTahunan) => record.id.toString() === editingKey;

  const edit = (record: Partial<SPTTahunan> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      tanggalSpt: record.date ? dayjs(record.date, "DD-MM-YYYY") : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as SPTTahunan;
      const updatedRow = {
        ...row,
        id: Number(id),
        tanggalSpt: dayjs(row.date).format("DD-MM-YYYY"),
      };
      editSPTTahunan(updatedRow);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeSPTTahunan(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Tahun Izin",
      dataIndex: "year",
      key: "year",
      editable: true,
    },
    {
      title: "Nomor Izin",
      dataIndex: "spt_number",
      key: "spt_number",
      editable: true,
    },
    {
      title: "Tahun Dokumen",
      dataIndex: "date",
      key: "date",
      editable: true,
      render: (text: string) => (text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : ""),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: SPTTahunan) => {
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
      onCell: (record: SPTTahunan) => ({
        record,
        inputType: col.dataIndex === "date" ? "date" : col.dataIndex.includes("date") ? "date" : col.dataIndex === "year" ? "number" : "text",
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
    addSPTTahunan({ ...formik.values, id: sptTahunan.length + 2 });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", sptTahunan);
    // Additional submission logic if needed
    formik.handleSubmit()
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah SPT
      </Button>
      <Modal title="Tambah SPT" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item name="year" label="Tahun Izin" rules={[{ required: true }]}>
            <Input
              value={formik.values.year}
              onChange={(e) => formik.setFieldValue("year", e.target.value)}
            />
          </Form.Item>
          <Form.Item name="spt_number" label="Nomor Izin" rules={[{ required: true }]}>
            <Input
              value={formik.values.spt_number}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item name="date" label="Tanggal Dokumen" rules={[{ required: true }]}>
            <DatePicker
              value={formik.values.date ? dayjs(formik.values.date, "DD-MM-YYYY") : null}
              format="DD-MM-YYYY"
              // onchange yang benar untuk type date
              onChange={(date, dateString) =>
                formik.setFieldValue("date", dateString)
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
        />
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default SPTTahunan;