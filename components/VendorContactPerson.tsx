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

interface PositionList {
  id: number;
  name: string;
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
  const [isLoading, setIsLoading] = useState(false);
  const [getPositions, setGetpositions] = useState<PositionList[]>([]);

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
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/contact-person`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );
        if (response.data && response.data.data) {
          const { vendor_position, ...vendorData } = response.data.data;

          const mappedData: ContactPerson = {
            ...vendorData,
            position_id: vendor_position
              ? vendor_position.name
              : vendor_position,
          };

          console.log("Response from API:", response.data);
          setIsModalVisible(false);
          message.success("Data Contact Perusahaan added successful");
          addContactInfo(mappedData);
          formik.resetForm();
        } else {
          console.error("Failed to get valid data from API response");
          message.error("Failed to get valid data from API response");
        }
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true);
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Token, User ID, or Vendor ID is missing.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/contact-person`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        console.log("Response from API:", response.data);
        // Pastikan response.data adalah object dan memiliki properti yang berisi array
        if (
          typeof response.data === "object" &&
          Array.isArray(response.data.data)
        ) {
          const mappedData = response.data.data.map(
            (data: { vendor_position: { name: any }; position_id: any }) => ({
              ...data,
              position_id: data.vendor_position
                ? data.vendor_position.name
                : data.position_id,
            }),
          );
          initializeContactInfo(mappedData);
        } else {
          console.error(
            "Response data is not in expected format:",
            response.data,
          );
          message.error("Failed to fetch contact information.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch contact information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, [initializeContactInfo]);

  useEffect(() => {
    const fetchPositionList = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/master/vendor-position`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        if (response.data && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(
            (vendor_position: { id: any; name: any }) => ({
              ...vendor_position,
            }),
          );
          setGetpositions(mappedData);
        } else {
          console.error(
            "business field data fetched is not in expected format:",
            response.data,
          );
          message.error(
            "business field data fetched is not in expected format.",
          );
        }
      } catch (error) {
        console.error("Error fetching business field data:", error);
        message.error(
          "Failed to fetch business field data. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPositionList();
  }, []);

  const isEditing = (record: ContactPerson) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<ContactPerson> & { id: React.Key }) => {
    const positionName =
      getPositions.find(
        (position_id) => position_id.id === Number(record.position_id),
      )?.name || record.position_id;
    form.setFieldsValue({ ...record, position_id: positionName });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = await form.validateFields();
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      const positionValue =
        getPositions.find((position) => position.name === row.position_id)?.id ||
        row.position_id; // Mengambil nilai ID dari posisi

      const updatedRow = {
        ...row,
        id: Number(id),
        position_id: positionValue, // Mengatur ID posisi bukan labelnya
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/contact-person/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      if (response.data && response.data.data) {
        const { vendor_position, ...directorData } = response.data.data;

        const updatedDirector: ContactPerson = {
          ...directorData,
          position_id: vendor_position ? vendor_position.name : "", // Menampilkan nama posisi jika tersedia
        };

        console.log("row contact", row);
        editContactInfo(updatedDirector);
        setEditingKey("");
        message.success("Data contact updated successfully.");
      } else {
        console.error("Failed to get valid data from API response");
        message.error("Failed to get valid data from API response");
      }
    } catch (error) {
      console.error("Error updating data details:", error);
      message.error("Failed to update data details. Please try again.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/contact-person/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      removeContactInfo(Number(id)); // Pastikan Anda memiliki fungsi removeContactInfo yang sesuai
      message.success("Contact information deleted successfully.");
    } catch (error) {
      console.error("Error deleting contact information:", error);
      message.error("Failed to delete contact information. Please try again.");
    }
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
    // {
    //   title: "No KTP",
    //   dataIndex: "contact_identity_no",
    //   key: "contact_identity_no",
    //   editable: true,
    // },
    // {
    //   title: "No NPWP",
    //   dataIndex: "contact_npwp",
    //   key: "contact_npwp",
    //   editable: true,
    // },
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
      editable: true,
      options: getPositions.map((businessField) => ({
        key: businessField.id,
        value: businessField.id,
        label: businessField.name,
      })),
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
    form.resetFields();
    formik.resetForm();
    let emptyData = {
      contact_name: "",
      contact_email: "",
      contact_phone: "",
      contact_identity_no: "",
      contact_npwp: "",
      position_id: "",
    };
    form.setFieldsValue({ ...emptyData });
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
    // formik.handleSubmit(); // Trigger Formik's submit function
    form.validateFields().then((values) => {
      formik.handleSubmit() // Trigger Formik's submit function
    });
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
            <Button onClick={handleCancel}>Batalkan</Button>
            <Button
              key="submit"
              type="primary"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Simpan Data
            </Button>
          </>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="contact_name"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.contact_name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="contact_email"
            label="Email"
            rules={[{ required: true, message: "Email tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.contact_email}
              onChange={formik.handleChange}
            />
          </Form.Item>
          {/* <Form.Item
            name="contact_identity_no"
            label="No KTP"
            rules={[
              {
                required: true,
                message: "Please enter KTP number",
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("KTP Number has to be a number.");
                  }
                  if (value.length < 16) {
                    return Promise.reject("KTP Number can't be less than 16 digits");
                  }
                  if (value.length > 16) {
                    return Promise.reject(
                      "KTP Number can't be more than 16 digits",
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            hasFeedback
          >
            <Input
              value={formik.values.contact_identity_no}
              //   onChange={(value) => formik.setFieldValue("noKTPPengurus", value)}
              onChange={formik.handleChange}
            />
          </Form.Item> */}
          <Form.Item
            name="contact_phone"
            label="No Telepon"
            rules={[{ required: true, message: "Nomor Telepon harus berupa angka" }]}
            required
            hasFeedback
          >
            <Input
              value={formik.values.contact_phone}
              onChange={(e) =>
                formik.setFieldValue("contact_phone", e.target.value)
              }
            />
          </Form.Item>
          {/* <Form.Item
            name="contact_npwp"
            label="NPWP"
            rules={[
              {
                required: true,
                message: "Please enter NPWP number",
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("NPWP code has to be a number.");
                  }
                  if (value.length < 16) {
                    return Promise.reject("NPWP can't be less than 16 digits");
                  }
                  if (value.length > 16) {
                    return Promise.reject(
                      "NPWP code can't be more than 16 digits",
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
            hasFeedback
          >
            <Input
              value={formik.values.contact_npwp}
              onChange={formik.handleChange}
            />
          </Form.Item> */}
          <Form.Item label="Jabatan" rules={[
            {
              required: true,
              message: "Silahkan pilih jabatan",
            },
          ]} required hasFeedback>
            <Select
              id="position_id"
              onChange={(value) => formik.setFieldValue("position_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.position_id}
              defaultValue={getPositions.at(0)?.id.toString()}
            >
              {getPositions.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
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
          scroll={{
            x: 1300,
          }}
        />
      </Form>
    </div >
  );
};

export default ContactInfo;
