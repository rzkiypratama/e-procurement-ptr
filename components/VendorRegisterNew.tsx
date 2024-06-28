import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  Tabs,
  Typography,
  message,
  InputNumber,
  Tooltip,
} from "antd";
import useRegisterStore from "../store/indexcopy";
import { useFormik } from "formik";
import EditableCell from "./EditableCell";
import NumericNumber from "@/lib/NumericString";
import NumericInput from "@/lib/NumericInput";
import axios from "axios";

const { TabPane } = Tabs;
const { Option } = Select;

interface RegisterContactInfo {
  id: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  position_id: string;
  contact_identity_no: string;
  contact_npwp: string;
}

const ProfilePerusahaan: React.FC = () => {
  const {
    registerProfilePerusahaan,
    registerContactInfo,
    registerAuthorization,
    addContactInfo,
    editContactInfo,
    removeContactInfo,
    initializeContactInfo,
    initializeAuthorization,
    isLoading,
    setLoading,
  } = useRegisterStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      company_name: registerProfilePerusahaan.company_name,
      company_npwp: registerProfilePerusahaan.company_npwp,
      vendor_type: registerProfilePerusahaan.vendor_type,
      company_address: registerProfilePerusahaan.company_address,
      city_id: registerProfilePerusahaan.city_id,
      province_id: registerProfilePerusahaan.province_id,
      postal_code: registerProfilePerusahaan.postal_code,
      company_phone_number: registerProfilePerusahaan.company_phone_number,
      company_fax: registerProfilePerusahaan.company_fax,
      company_email: registerProfilePerusahaan.company_email,
      username: registerAuthorization.username,
      password: registerAuthorization.password,
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      position_id: "",
      contact_identity_no: "",
      contact_npwp: "",
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.username) {
        errors.username = "Username is required";
      } else if (values.username.length < 8) {
        errors.username = "The username must be at least 8 characters";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length > 20) {
        errors.username = "The password are too long, hard to remember.";
      }
      if (!values.company_name) {
        errors.company_name = "Company name is required";
      }
      if (!values.company_npwp) {
        errors.company_npwp = "Company npwp is required";
      } else {
        const npwpString = values.company_npwp.toString();
        if (npwpString.length < 16) {
          errors.company_npwp = "The npwp must be at least 15 or 16 characters";
        }
      }
      if (!values.vendor_type) {
        errors.vendor_type = "Status vendor is required";
      }
      if (!values.postal_code) {
        errors.postal_code = "Postal Code is required";
      }
      if (!values.company_address) {
        errors.company_address = "Company address is required";
      }
      if (!values.company_phone_number) {
        errors.company_phone_number = "Company number is required";
      } else if (!/^\d+$/.test(values.company_phone_number)) {
        errors.company_phone_number = "Company number must be a number";
      }
      if (!values.company_email) {
        errors.company_email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.company_email)) {
        errors.company_email = 'Invalid email address';
      }
      if (!values.contact_name) {
        errors.contact_name = "Contact name is required";
      }
      if (!values.contact_email) {
        errors.contact_email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.contact_email)) {
        errors.contact_email = 'Invalid email address';
      }
      return errors;
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          "https://vendor.eproc.latansa.sch.id/api/auth/register",
          values,
        );
        console.log("Response from API:", response.data);
        setFormSubmitted(true);
        message.success("Registration successful");
        setIsModalVisible(false);
      } catch (error) {
        console.error("Error submitting data:", error);
        message.error("Registration failed");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const initialData: RegisterContactInfo[] = []; // Load your initial data here
    initializeContactInfo(initialData);
  }, [initializeContactInfo]);

  const getNextId = () => {
    return registerContactInfo.length > 0
      ? Math.max(...registerContactInfo.map((info) => info.id)) + 1
      : 1;
  };

  const isEditing = (record: RegisterContactInfo) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<RegisterContactInfo> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as RegisterContactInfo;
      editContactInfo({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeContactInfo(Number(id));
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
      title: "Phone",
      dataIndex: "contact_phone",
      key: "contact_phone",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "contact_email",
      key: "contact_email",
      editable: true,
    },
    {
      title: "Jabatan",
      dataIndex: "position_id",
      key: "position_id",
      editable: true,
    },
    {
      title: "No KTP",
      dataIndex: "contact_identity_no",
      key: "contact_identity_no",
      editable: true,
    },
    {
      title: "NPWP",
      dataIndex: "contact_npwp",
      key: "contact_npwp",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: RegisterContactInfo) => {
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
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
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
      onCell: (record: RegisterContactInfo) => ({
        record,
        inputType:
          col.dataIndex === "contact_identity_no" ||
          col.dataIndex.includes("contact_identity_no")
            ? "number"
            : col.dataIndex === "contact_npwp" ||
                col.dataIndex.includes("contact_npwp")
              ? "number"
              : col.dataIndex === "tanggalBerakhir" ||
                  col.dataIndex.includes("tanggalBerakhir")
                ? "date"
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
    form.validateFields().then((values) => {
      addContactInfo({
        ...values,
        id: getNextId(),
      });
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitted data:", formik.values);
    formik.handleSubmit(); // Trigger Formik's submit function
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div className="container mx-auto">
      {isLoading ? (
        <div className="text-center">
          <Spin size="large" />
          <p>Mengirimkan formulir...</p>
        </div>
      ) : !formSubmitted ? (
        <>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Profile Perusahaan" key="1">
              <Form layout="vertical" form={form}>
                <Form.Item label="Nama Perusahaan" 
                validateStatus={
                  formik.errors.company_name && formik.touched.company_name
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.company_name && formik.touched.company_name
                    ? formik.errors.company_name
                    : ""
                }
                required hasFeedback>
                  <Input
                    id="company_name"
                    name="company_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company_name}
                    placeholder="Input company name"
                  />
                </Form.Item>
                <Form.Item label="NPWP Perusahaan" 
                 validateStatus={
                  formik.errors.company_npwp && formik.touched.company_npwp
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.company_npwp && formik.touched.company_npwp
                    ? formik.errors.company_npwp
                    : ""
                }
                required hasFeedback>
                  <NumericNumber
                    placeholder="Input a number"
                    value={formik.values.company_npwp}
                    onChange={(value) =>
                      formik.setFieldValue("company_npwp", value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Status" 
                 validateStatus={
                  formik.errors.vendor_type && formik.touched.vendor_type
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.vendor_type && formik.touched.vendor_type
                    ? formik.errors.vendor_type
                    : ""
                }
                required hasFeedback>
                  <Select
                    id="vendor_type"
                    onChange={(value) =>
                      formik.setFieldValue("vendor_type", value)
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.vendor_type}
                  >
                    <Option value="pusat">Pusat</Option>
                    <Option value="cabang">Cabang</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Alamat Perusahaan" 
                 validateStatus={
                  formik.errors.company_address && formik.touched.company_address
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.company_address && formik.touched.company_address
                    ? formik.errors.company_address
                    : ""
                }
                required hasFeedback>
                  <Input
                    id="company_address"
                    name="company_address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company_address}
                    placeholder="Input company address"
                  />
                </Form.Item>
                <Form.Item label="Kota" 
                 validateStatus={
                  formik.errors.city_id && formik.touched.city_id
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.city_id && formik.touched.city_id
                    ? formik.errors.city_id
                    : ""
                }
                required hasFeedback>
                  <Select
                    id="city_id"
                    onChange={(value) => formik.setFieldValue("city_id", value)}
                    onBlur={formik.handleBlur}
                    value={formik.values.city_id}
                  >
                    <Option value="1">Banjarbaru</Option>
                    <Option value="2">Bandung</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Provinsi" 
                validateStatus={
                  formik.errors.province_id && formik.touched.province_id
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.province_id && formik.touched.province_id
                    ? formik.errors.province_id
                    : ""
                }
                required hasFeedback>
                  <Select
                    id="province_id"
                    onChange={(value) =>
                      formik.setFieldValue("province_id", value)
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.province_id}
                    placeholder="Select province"
                  >
                    <Option value={1}>Kalimantan Selatan</Option>
                    <Option value={2}>Jawa Barat</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Kode POS" 
                validateStatus={
                  formik.errors.postal_code && formik.touched.postal_code
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.postal_code && formik.touched.postal_code
                    ? formik.errors.postal_code
                    : ""
                }
                required hasFeedback>
                  <InputNumber
                    id="postal_code"
                    placeholder="Input postal code"
                    value={formik.values.postal_code}
                    onChange={(value) =>
                      formik.setFieldValue("postal_code", value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Nomor Telepon Perusahaan" 
                validateStatus={
                  formik.errors.company_phone_number && formik.touched.company_phone_number
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.company_phone_number && formik.touched.company_phone_number
                    ? formik.errors.company_phone_number
                    : ""
                }
                required hasFeedback>
                  <NumericInput
                    value={formik.values.company_phone_number}
                    onChange={(value) =>
                      formik.setFieldValue("company_phone_number", value)
                    }
                    onBlur={formik.handleBlur}
                    placeholder="Input company phone number"
                  />
                  {/* <Input
                    id="company_phone_number"
                    name="company_phone_number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company_phone_number}
                  /> */}
                </Form.Item>
                <Form.Item label="Nomor Fax Perusahaan" 
                validateStatus={
                  formik.errors.company_fax && formik.touched.company_fax
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.company_fax && formik.touched.company_fax
                    ? formik.errors.company_fax
                    : ""
                }
                required hasFeedback>
                  <Input
                    id="company_fax"
                    name="company_fax"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company_fax}
                    placeholder="(123)-456-7890"
                  />
                </Form.Item>
                <Form.Item label="Email Perusahaan"
                validateStatus={
                  formik.errors.company_email && formik.touched.company_email
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.company_email && formik.touched.company_email
                    ? formik.errors.company_email
                    : ""
                }
                required hasFeedback>
                  <Input
                    id="company_email"
                    name="company_email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.company_email}
                    placeholder="johndoe@mail.com"
                  />
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Kontak Perusahaan" key="2">
              <Form form={form} component={false}>
                <Button type="primary" onClick={showModal}>
                  Tambah Kontak
                </Button>
                <Table
                  components={{
                    body: {
                      cell: EditableCell,
                    },
                  }}
                  bordered
                  rowKey={(record) => record.id.toString()}
                  // dataSource={registerContactInfo}
                  dataSource={registerContactInfo.map((contact, index) => ({
                    ...contact,
                    no: index + 1,
                    operation: contact,
                  }))}
                  columns={mergedColumns}
                  rowClassName="editable-row"
                  pagination={{
                    onChange: cancel,
                  }}
                />
                <p className="opacity-60 mt-5 italic">* Seluruh Notifikasi ke Vendor ini akan di kirim ke email yg terdaftar di contact person</p>
              </Form>
            </TabPane>

            <TabPane tab="Authorization" key="3">
              <Form layout="vertical" onFinish={formik.handleSubmit}>
                <Form.Item
                  label="Username"
                  validateStatus={
                    formik.errors.username && formik.touched.username
                      ? "error"
                      : ""
                  }
                  help={
                    formik.errors.username && formik.touched.username
                      ? formik.errors.username
                      : ""
                  }
                  hasFeedback
                  required
                >
                  <Input
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                </Form.Item>
                <Form.Item
                  label="Password"
                  validateStatus={
                    formik.errors.password && formik.touched.password
                      ? "error"
                      : ""
                  }
                  help={
                    formik.errors.password && formik.touched.password
                      ? formik.errors.password
                      : ""
                  }
                  required
                  hasFeedback
                >
                  <Input.Password
                    id="confirm"
                    name="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </Form.Item>
                <Form.Item
                  id="password"
                  name="password"
                  label="Confirm Password"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (
                          !value ||
                          getFieldValue("password") === formik.values.password
                        ) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!",
                          ),
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
                {Object.keys(formik.errors).length > 0 && (
                  <span className="ml-3 text-red-500">
                    Please fill in all required fields.
                  </span>
                )}
              </Form>
            </TabPane>
          </Tabs>
          <Modal
            title="Tambah Kontak"
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="contact_name"
                label="Nama"
                rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
                hasFeedback
              >
                <Input
                  value={formik.values.contact_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
              <Form.Item
                name="contact_phone"
                label="Phone"
                rules={[
                  { required: true, message: "Telepon tidak boleh kosong", min: 5 },
                ]}
                hasFeedback
              >
                <Input
                  value={formik.values.contact_phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
              <Form.Item
                name="contact_email"
                label="Email"
                rules={[
                  { required: true, message: "Email tidak boleh kosong" },
                ]}
                hasFeedback
              >
                <Input
                  value={formik.values.contact_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
              <Form.Item
                name="position_id"
                label="Position"
                rules={[
                  { required: true, message: "Position tidak boleh kosong" },
                ]}
                hasFeedback
              >
                <Select
                  id="position_id"
                  onChange={(value) =>
                    formik.setFieldValue("position_id", value)
                  }
                  onBlur={formik.handleBlur}
                  value={formik.values.position_id}
                >
                  <Option value="1">Direktur</Option>
                  <Option value="2">Manajer</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="contact_npwp"
                label="NPWP"
                rules={[{ required: true, message: "NPWP tidak boleh kosong" }]}
                hasFeedback
              >
                <Input
                  value={formik.values.contact_npwp}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
              <Form.Item label="Nomor KTP" name="contact_identity_no" rules={[
                  { required: true, message: "Nomor KTP tidak boleh kosong", min: 5 },
                ]}
                hasFeedback
                >
                <Input
                  placeholder="Input a number"
                  value={formik.values.contact_identity_no}
                  onChange={formik.handleChange}
                />
              </Form.Item>
            </Form>
          </Modal>
        </>
      ) : (
        <div className="text-center">
          <div className="p-10">
            <p>
              Selamat {formik.values.company_email}, pendaftaran anda telah
              berhasil!
            </p>
            <p>Silahkan cek email untuk konfirmasi pendaftaran.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePerusahaan;
