import { useState } from "react";
import {
  Tabs,
  Button,
  Form,
  Input,
  Select,
  Table,
  Space,
  Modal,
  Spin,
  message,
  InputNumber,
} from "antd";
import { useFormStore } from "../store";
import { useFormik } from "formik";
import axios from "axios";
import NumericInput from "@/lib/NumericInput";

const { TabPane } = Tabs;
const { Option } = Select;

interface ContactPerson {
  id: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  position_id: string;
  contact_npwp: string;
  contact_identity_no: string;
}

const RegistrationForm = () => {
  const {
    setGeneralInfo,
    setContactInfo,
    setAuthorization,
    generalInfo,
    contactInfo,
    authorization,
  } = useFormStore();
  const { loading, setLoading } = useFormStore();
  const [activeTab, setActiveTab] = useState("1");
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextId, setNextId] = useState<number>(1);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      ...generalInfo,
      ...contactInfo,
      ...authorization,
    },
    validate: (values) => {
      const errors: { [key: string]: string } = {};
      if (!values.username) {
        errors.username = 'Username is required';
      } else if (values.username.length < 8) {
        errors.username = 'The username must be at least 8 characters';
      }
      if (!values.company_phone_number) {
        errors.company_phone_number = 'Company number is required';
      } else if (!/^\d+$/.test(values.company_phone_number)) {
        errors.company_phone_number = 'Company number must be a number';
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
        message.success(`register successfully`);
      } catch (error) {
        message.error(`register failed, use different email/username`);
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }

      setGeneralInfo({
        company_name: values.company_name,
        company_npwp: values.company_npwp,
        vendor_type: values.vendor_type,
        company_address: values.company_address,
        city_id: values.city_id,
        province_id: values.province_id,
        postal_code: values.postal_code,
        company_phone_number: values.company_phone_number,
        company_fax: values.company_fax,
        company_email: values.company_email,
      });

      setContactInfo({
        contact_name: Array.isArray(values.contact_name)
          ? values.contact_name.map((name) => name.trim()).join("| ")
          : values.contact_name,
        contact_phone: Array.isArray(values.contact_phone)
          ? values.contact_phone.map((phone) => phone.trim()).join("| ")
          : values.contact_phone,
        contact_email: Array.isArray(values.contact_email)
          ? values.contact_email.map((email) => email.trim()).join("| ")
          : values.contact_email,
        position_id: Array.isArray(values.position_id)
          ? values.position_id.map((position) => position.trim()).join(", ")
          : values.position_id,
        contact_npwp: Array.isArray(values.contact_npwp)
          ? values.contact_npwp.map((npwp) => npwp.trim()).join("| ")
          : values.contact_npwp,
        contact_identity_no: Array.isArray(values.contact_identity_no)
          ? values.contact_identity_no.map((ktp) => ktp.trim()).join("| ")
          : values.contact_identity_no,
      });

      setAuthorization({
        username: values.username,
        password: values.password,
      });
    },
  });

  const handleAddContact = () => {
    const newContact: ContactPerson = {
      id: nextId,
      contact_name: formik.values.contact_name,
      contact_phone: formik.values.contact_phone,
      contact_email: formik.values.contact_email,
      position_id: formik.values.position_id,
      contact_npwp: formik.values.contact_npwp,
      contact_identity_no: formik.values.contact_identity_no,
    };

    const updatedContacts = [...contactPersons, newContact];
    setContactPersons(updatedContacts);

    formik.setValues({
      ...formik.values,
      contact_name: updatedContacts
        .map((contact) => contact.contact_name)
        .join(" | "),
      contact_phone: updatedContacts
        .map((contact) => contact.contact_phone)
        .join(" | "),
      contact_email: updatedContacts
        .map((contact) => contact.contact_email)
        .join(" | "),
      contact_identity_no: updatedContacts
        .map((contact) => contact.contact_identity_no)
        .join(" | "),
      position_id: updatedContacts
        .map((contact) => contact.position_id)
        .join(" | "),
      contact_npwp: updatedContacts
        .map((contact) => contact.contact_npwp)
        .join(" | "),
    });

    setNextId(nextId + 1);
    setIsModalVisible(false);
  };

  const handleEditContact = (id: number) => {
    // Logic to edit contact
  };

  const handleDeleteContact = (id: number) => {
    setContactPersons(contactPersons.filter((contact) => contact.id !== id));
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "No",
      dataIndex: "id",
      key: "id",
      width: "5%",
      editable: false,
    },
    {
      title: "Nama",
      dataIndex: "contact_name",
      key: "contact_name",
      editable: true,
    },
    {
      title: "Nomor Handphone",
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
      title: "NPWP",
      dataIndex: "contact_npwp",
      key: "contact_npwp",
    },
    {
      title: "NO KTP",
      dataIndex: "contact_identity_no",
      key: "contact_identity_no",
    },
    {
      title: "Aksi",
      key: "action",
      render: (_text: any, record: ContactPerson) => (
        <Space size="middle">
          <Button onClick={() => handleDeleteContact(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
    // Additional submission logic if needed
  };

  return (
    <div className="rounded-md border p-5 shadow-md">
      {loading ? (
        <div className="text-center">
          <Spin size="large" />
          <p>Mengirimkan formulir...</p>
        </div>
      ) : !formSubmitted ? (
        <div>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Profile Perusahaan" key="1">
              <div>
                <Form layout="vertical">
                  {/* General Info Fields */}
                  <Form.Item
                    label="Nama Perusahaan"
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
                  >
                    <Input
                      id="company_name"
                      name="company_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company_name}
                    />
                  </Form.Item>
                  <Form.Item
                    label="NPWP Perusahaan"
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
                  >
                    <Input
                      id="company_npwp"
                      name="company_npwp"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company_npwp}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Status"
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
                  >
                    <Select
                      id="vendor_type"
                      onChange={(value) =>
                        formik.setFieldValue("vendor_type", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.vendor_type}
                    >
                      <Option value="1">Pusat</Option>
                      <Option value="2">Cabang</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Alamat Perusahaan"
                    hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Harap isi data",
                    }]}
                  >
                    <Input
                      id="company_address"
                      name="company_address"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company_address}
                      minLength={2}
                      maxLength={5}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Kota"
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
                  >
                    <Select
                      id="city_id"
                      onChange={(value) =>
                        formik.setFieldValue("city_id", value)
                      }
                      onBlur={formik.handleBlur}
                      value={formik.values.city_id}
                    >
                      <Option value={1}>Medan</Option>
                      <Option value={2}>Banjarnegara</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    label="Provinsi"
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
                  >
                    <Input
                      id="province_id"
                      name="province_id"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.province_id}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Kode Pos"
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
                  >
                    <InputNumber
                      placeholder="Input a number"
                      value={formik.values.postal_code}
                      onChange={(value) =>
                        formik.setFieldValue("postal_code", value)
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label="Nomor Telepon Perusahaan"
                    validateStatus={
                      formik.errors.company_phone_number &&
                      formik.touched.company_phone_number
                        ? "error"
                        : ""
                    }
                    help={
                      formik.errors.company_phone_number &&
                      formik.touched.company_phone_number
                        ? formik.errors.company_phone_number
                        : ""
                    }
                  >
                    <Input
                      id="company_phone_number"
                      name="company_phone_number"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company_phone_number}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Nomor Fax Perusahaan"
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
                  >
                    {/* <Input
                      id="company_fax"
                      name="company_fax"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company_fax}
                    /> */}

                    <NumericInput
        placeholder="Input a number"
        value={formik.values.company_fax}
        onChange={(value) => formik.setFieldValue("company_fax", value)}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Email Perusahaan"
                    validateStatus={
                      formik.errors.company_email &&
                      formik.touched.company_email
                        ? "error"
                        : ""
                    }
                    help={
                      formik.errors.company_email &&
                      formik.touched.company_email
                        ? formik.errors.company_email
                        : ""
                    }
                    rules={[
                      {
                        type: "email",
                        message: "The input is not valid E-mail!",
                      },
                      {
                        required: true,
                        message: "Please input your E-mail!",
                      },
                    ]}
                  >
                    <Input
                      id="company_email"
                      name="company_email"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.company_email}
                    />
                  </Form.Item>
                </Form>
              </div>
            </TabPane>
            <TabPane tab="Contact Person" key="2">
              <Form onFinish={handleAddContact}>
                <Button type="primary" onClick={showModal}>
                  Tambah Contact
                </Button>
              </Form>
              <Table
                dataSource={contactPersons}
                columns={columns}
                rowKey={(record) => record.id.toString()}
              />
            </TabPane>
            <TabPane tab="Authorization" key="3">
              <Form onFinish={handleSubmit} layout="vertical">
                {/* Authorization Fields */}
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
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
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
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
                {Object.keys(formik.errors).length > 0 && (
                  <span style={{ color: "red" }}>
                    Please fill in all required fields.
                  </span>
                )}
              </Form>
            </TabPane>
          </Tabs>
          <Modal
            title="Tambah Contact"
            open={isModalVisible}
            onOk={handleAddContact}
            onCancel={handleCancel}
          >
            <Form layout="vertical">
              <Form.Item
                label="Nama"
                name="contact_name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input
                  name="contact_name"
                  onChange={formik.handleChange}
                  value={formik.values.contact_name}
                />
              </Form.Item>

              <Form.Item
                label="Nomor Handphone"
                name="contact_phone"
                rules={[
                  {
                    required: true,
                    message: "Please input your phone number!",
                  },
                ]}
              >
                <Input
                  name="contact_phone"
                  onChange={formik.handleChange}
                  value={formik.values.contact_phone}
                />
              </Form.Item>

              <Form.Item
                label="Email"
                name="contact_email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  name="contact_email"
                  onChange={formik.handleChange}
                  value={formik.values.contact_email}
                />
              </Form.Item>

              <Form.Item
                label="Jabatan"
                name="position_id"
                rules={[
                  { required: true, message: "Please input your position!" },
                ]}
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
                  <Option value="2">Komisaris</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="NPWP"
                name="contact_npwp"
                rules={[{ required: true, message: "Please input your NPWP!" }]}
              >
                <Input
                  name="contact_npwp"
                  onChange={formik.handleChange}
                  value={formik.values.contact_npwp}
                />
              </Form.Item>

              <Form.Item
                label="NO KTP"
                name="contact_identity_no"
                rules={[{ required: true, message: "Please input your KTP!" }]}
              >
                <Input
                  name="contact_identity_no"
                  onChange={formik.handleChange}
                  value={formik.values.contact_identity_no}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
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

export default RegistrationForm;
