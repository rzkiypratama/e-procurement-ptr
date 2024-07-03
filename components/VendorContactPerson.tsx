import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Typography,
  Popconfirm,
  Modal,
  Select,
  message,
} from "antd";
import useContactPersonStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { positionOptions } from "@/utils/positionOptions";

const { TextArea } = Input;

const { Option } = Select;

interface ContactPerson {
    id: number;
    contact_name: string;
    contact_email: string;
    contact_identity_no: string;
    contact_phone: string;
    contact_npwp: string;
    position_id: string;
  }

const ContactInfo: React.FC = () => {
  const {
    contactInfo,
    addContactInfo,
    editContactInfo,
    removeContactInfo,
    initializeContactInfo,
  } = useContactPersonStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      contact_identity_no: "",
      contact_npwp: "",
      position_id: "",
    },
    onSubmit: async (values, { setErrors }) => {
      // Dapatkan token, user_id, dan vendor_id dari cookies
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
          "https://vendorv2.delpis.online/api/vendor/contact-person",
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
        message.success("Contact added successful");
        addContactInfo({ ...values, id: response.data.data.id });
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
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true)
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");
  
        if (!token || !userId || !vendorId) {
          message.error("Token, User ID, or Vendor ID is missing.");
          return;
        }
  
        const response = await axios.get(
          "https://vendorv2.delpis.online/api/vendor/contact-person",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );
  
        console.log("Response from API:", response.data);
        // Pastikan response.data adalah object dan memiliki properti yang berisi array
        if (typeof response.data === "object" && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map((data: { vendor_position: { name: any; }; position_id: any; }) => ({
            ...data,
            position_id: data.vendor_position ? data.vendor_position.name : data.position_id,
          }));
          initializeContactInfo(mappedData);
        } else {
          console.error("Response data is not in expected format:", response.data);
          message.error("Failed to fetch contact information.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch contact information.");
      }finally {
        setIsLoading(false);
      }
    };
  
    fetchContactInfo();
  }, [initializeContactInfo]);

  useEffect(() => {
    // Initialize data if needed
    const initialData: ContactPerson[] = []; // Load your initial data here
    initializeContactInfo(initialData);
  }, [initializeContactInfo]);

  const isEditing = (record: ContactPerson) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<ContactPerson> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as ContactPerson;
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");
  
      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
  
      await axios.put(
        `https://vendorv2.delpis.online/api/vendor/contact-person/${id}`,
        row,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      editContactInfo({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      message.error("Failed to save data. Please try again.");
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
        `https://vendorv2.delpis.online/api/vendor/contact-person/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      removeContactInfo(Number(id)); // Pastikan Anda memiliki fungsi removeContactInfo yang sesuai
      message.success("Contact information deleted successfully.");
    } catch (error) {
      console.error("Error deleting contact information:", error);
      message.error("Failed to delete contact information. Please try again.");
    }
  };

  const getPositionName = (positionId: string) => {
    const vendor_position = positionOptions.find(option => option.value === positionId);
    return vendor_position ? vendor_position.label : positionId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama",
      dataIndex: "contact_name",
      key: "contact_name",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "contact_email",
      key: "contact_email",
      editable: true,
    },
    {
      title: "No KTP",
      dataIndex: "contact_identity_no",
      key: "contact_identity_no",
      editable: true,
    },
    {
      title: "No NPWP",
      dataIndex: "contact_npwp",
      key: "contact_npwp",
      editable: true,
    },
    {
      title: "Nomor Telepon",
      dataIndex: "contact_phone",
      key: "contact_phone",
      editable: true,
    },
    {
      title: "Jabatan",
      dataIndex: "position_id",
      key: "position_id",
      options: positionOptions,
      editable: true,
      render: (text: string) => getPositionName(text),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: ContactPerson) => {
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
      onCell: (record: ContactPerson) => ({
        record,
        inputType:
       col.dataIndex === "position_id" || col.dataIndex === "bank_id"
              ? "select"
              : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields()
        formik.resetForm()
        let emptyData = {
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          contact_identity_no: "",
          contact_npwp: "",
          position_id: "",
        }
        form.setFieldsValue({ ...emptyData })
  };

  const handleOk = () => {
    addContactInfo({
      ...formik.values,
      id: contactInfo.length + 2,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", contactInfo);
    // Additional submission logic if needed
    formik.handleSubmit(); // Trigger Formik's submit function
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Kontak Perusahaan
      </Button>
      <Modal
        title="Tambah Kontak Perusahaan"
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
            name="contact_name"
            label="Nama"
            // rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.contact_name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="contact_email"
            label="Email"
            // rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.contact_email}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="contact_identity_no"
            label="No KTP"
            rules={[{ required: true, message: "NPWP harus berupa angka" }]}
            hasFeedback
          >
            <Input
              value={formik.values.contact_identity_no}
              //   onChange={(value) => formik.setFieldValue("noKTPPengurus", value)}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="contact_phone"
            label="No Telepon"
            // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.contact_phone}
              onChange={(e) =>
                formik.setFieldValue("contact_phone", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item
            name="contact_npwp"
            label="NPWP"
            // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.contact_npwp}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item label="Jabatan" required hasFeedback>
            <Select
              id="position_id"
              onChange={(value) => formik.setFieldValue("position_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.position_id}
            >
             {columns
                .find((col) => col.dataIndex === "position_id")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
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
          dataSource={contactInfo}
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

export default ContactInfo;
