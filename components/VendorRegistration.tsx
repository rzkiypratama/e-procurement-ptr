import { useState } from "react";
import { Tabs, Button, Form, Input, Select, Table, Space, Modal } from "antd";
import { useFormStore } from "../store";
import * as Yup from "yup";
import { useFormik } from "formik";

const { TabPane } = Tabs;
const { Option } = Select;

interface ContactPerson {
  id: number;
  name: string;
  phone: string;
  email: string;
  position: string;
  npwp: string;
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
  const [activeTab, setActiveTab] = useState("1");
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nextId, setNextId] = useState<number>(1);

  const formik = useFormik({
    initialValues: {
      ...generalInfo,
      ...contactInfo,
      ...authorization,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Required"),
      companyNPWP: Yup.string().required("Required"),
      status: Yup.string().required("Required"),
      companyAddress: Yup.string().required("Required"),
      city: Yup.string().required("Required"),
      province: Yup.string().required("Required"),
      postalCode: Yup.string().required("Required"),
      companyPhone: Yup.string().required("Required"),
      companyFax: Yup.string().required("Required"),
      companyEmail: Yup.string().required("Required"),
      username: Yup.string().required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log("Form Values:", values);
      setGeneralInfo({
        companyName: values.companyName,
        companyNPWP: values.companyNPWP,
        status: values.status,
        companyAddress: values.companyAddress,
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
        companyPhone: values.companyPhone,
        companyFax: values.companyFax,
        companyEmail: values.companyEmail,
      });
    
      setContactInfo({
        contactName: Array.isArray(values.contactName)
          ? values.contactName.map((name) => name.trim()).join(", ")
          : values.contactName,
        contactPhone: Array.isArray(values.contactPhone)
          ? values.contactPhone.map((phone) => phone.trim()).join(", ")
          : values.contactPhone,
        contactEmail: Array.isArray(values.contactEmail)
          ? values.contactEmail.map((email) => email.trim()).join(", ")
          : values.contactEmail,
        contactPosition: Array.isArray(values.contactPosition)
          ? values.contactPosition.map((position) => position.trim()).join(", ")
          : values.contactPosition,
        contactNPWP: Array.isArray(values.contactNPWP)
          ? values.contactNPWP.map((npwp) => npwp.trim()).join(", ")
          : values.contactNPWP,
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
      name: formik.values.contactName,
      phone: formik.values.contactPhone,
      email: formik.values.contactEmail,
      position: formik.values.contactPosition,
      npwp: formik.values.contactNPWP,
    };
  
    const updatedContacts = [...contactPersons, newContact];
    setContactPersons(updatedContacts);
  
    formik.setValues({
      ...formik.values,
      contactName: updatedContacts.map((contact) => contact.name).join(", "),
      contactPhone: updatedContacts.map((contact) => contact.phone).join(", "),
      contactEmail: updatedContacts.map((contact) => contact.email).join(", "),
      contactPosition: updatedContacts.map((contact) => contact.position).join(", "),
      contactNPWP: updatedContacts.map((contact) => contact.npwp).join(", "),
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "5%",
      editable: false,
    },
    {
      title: "Nama",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Nomor Handphone",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      editable: true,
    },
    {
      title: "Jabatan",
      dataIndex: "position",
      key: "position",
      editable: true,
    },
    {
      title: "NPWP",
      dataIndex: "npwp",
      key: "npwp",
    },
    {
      title: "Aksi",
      key: "action",
      render: (_text: any, record: ContactPerson) => (
        <Space size="middle">
          <Button onClick={() => handleEditContact(record.id)}>Edit</Button>
          <Button onClick={() => handleDeleteContact(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleNext = () => {
    const currentTab = parseInt(activeTab);
    const nextTab = (currentTab + 1).toString();
    setActiveTab(nextTab);
  };

  const handleSubmit = () => {
    formik.handleSubmit();
    // Additional submission logic if needed
  };

  return (
    <div className="rounded-md border p-5 shadow-md">
      <Tabs activeKey={activeTab} onChange={handleTabChange}>
        <TabPane tab="Informasi Umum" key="1">
          <div>
            <Form onFinish={handleNext} layout="vertical">
              {/* General Info Fields */}
              <Form.Item
                label="Nama Perusahaan"
                validateStatus={
                  formik.errors.companyName && formik.touched.companyName
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.companyName && formik.touched.companyName
                    ? formik.errors.companyName
                    : ""
                }
              >
                <Input
                  id="companyName"
                  name="companyName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyName}
                />
              </Form.Item>
              <Form.Item
                label="NPWP Perusahaan"
                validateStatus={
                  formik.errors.companyNPWP && formik.touched.companyNPWP
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.companyNPWP && formik.touched.companyNPWP
                    ? formik.errors.companyNPWP
                    : ""
                }
              >
                <Input
                  id="companyNPWP"
                  name="companyNPWP"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyNPWP}
                />
              </Form.Item>
              <Form.Item
                label="Status"
                validateStatus={
                  formik.errors.status && formik.touched.status ? "error" : ""
                }
                help={
                  formik.errors.status && formik.touched.status
                    ? formik.errors.status
                    : ""
                }
              >
                <Select
                  id="status"
                  onChange={(value) => formik.setFieldValue("status", value)}
                  onBlur={formik.handleBlur}
                  value={formik.values.status}
                >
                  <Option value="pusat">Pusat</Option>
                  <Option value="cabang">Cabang</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Alamat Perusahaan"
                validateStatus={
                  formik.errors.companyAddress && formik.touched.companyAddress
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.companyAddress && formik.touched.companyAddress
                    ? formik.errors.companyAddress
                    : ""
                }
              >
                <Input
                  id="companyAddress"
                  name="companyAddress"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyAddress}
                />
              </Form.Item>
              <Form.Item
                label="Kota"
                validateStatus={
                  formik.errors.city && formik.touched.city ? "error" : ""
                }
                help={
                  formik.errors.city && formik.touched.city
                    ? formik.errors.city
                    : ""
                }
              >
                <Input
                  id="city"
                  name="city"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                />
              </Form.Item>
              <Form.Item
                label="Provinsi"
                validateStatus={
                  formik.errors.province && formik.touched.province
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.province && formik.touched.province
                    ? formik.errors.province
                    : ""
                }
              >
                <Input
                  id="province"
                  name="province"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.province}
                />
              </Form.Item>
              <Form.Item
                label="Kode Pos"
                validateStatus={
                  formik.errors.postalCode && formik.touched.postalCode
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.postalCode && formik.touched.postalCode
                    ? formik.errors.postalCode
                    : ""
                }
              >
                <Input
                  id="postalCode"
                  name="postalCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.postalCode}
                />
              </Form.Item>
              <Form.Item
                label="Nomor Telepon Perusahaan"
                validateStatus={
                  formik.errors.companyPhone && formik.touched.companyPhone
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.companyPhone && formik.touched.companyPhone
                    ? formik.errors.companyPhone
                    : ""
                }
              >
                <Input
                  id="companyPhone"
                  name="companyPhone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyPhone}
                />
              </Form.Item>
              <Form.Item
                label="Nomor Fax Perusahaan"
                validateStatus={
                  formik.errors.companyFax && formik.touched.companyFax
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.companyFax && formik.touched.companyFax
                    ? formik.errors.companyFax
                    : ""
                }
              >
                <Input
                  id="companyFax"
                  name="companyFax"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyFax}
                />
              </Form.Item>
              <Form.Item
                label="Email Perusahaan"
                validateStatus={
                  formik.errors.companyEmail && formik.touched.companyEmail
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.companyEmail && formik.touched.companyEmail
                    ? formik.errors.companyEmail
                    : ""
                }
              >
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyEmail}
                />
              </Form.Item>
              {/* <Button type="primary" htmlType="submit">
              Next
            </Button> */}
            </Form>
          </div>
        </TabPane>
        <TabPane tab="Contact Person" key="2">
          <Form onFinish={handleAddContact}>
            <Button type="primary" onClick={showModal}>
              Tambah Contact
            </Button>
          </Form>
          <Table dataSource={contactPersons} columns={columns} />
        </TabPane>
        <TabPane tab="Authorization" key="3">
          <Form onFinish={handleSubmit}  layout="vertical">
            {/* Authorization Fields */}
            <Form.Item
              label="Username"
              validateStatus={
                formik.errors.username && formik.touched.username ? "error" : ""
              }
              help={
                formik.errors.username && formik.touched.username
                  ? formik.errors.username
                  : ""
              }
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
                formik.errors.password && formik.touched.password ? "error" : ""
              }
              help={
                formik.errors.password && formik.touched.password
                  ? formik.errors.password
                  : ""
              }
            >
              <Input.Password
                id="password"
                name="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
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
  onOk={handleAddContact} // Ubah onFinish menjadi handleAddContact
  onCancel={handleCancel}
>
  <Form layout="vertical">
    <Form.Item
      label="Nama"
      name="contactName"
      rules={[{ required: true, message: "Please input your name!" }]}
    >
      <Input
        name="contactName"
        onChange={formik.handleChange}
        value={formik.values.contactName}
      />
    </Form.Item>

    <Form.Item
      label="Nomor Handphone"
      name="contactPhone"
      rules={[
        { required: true, message: "Please input your phone number!" },
      ]}
    >
      <Input
        name="contactPhone"
        onChange={formik.handleChange}
        value={formik.values.contactPhone}
      />
    </Form.Item>

    <Form.Item
      label="Email"
      name="contactEmail"
      rules={[{ required: true, message: "Please input your email!" }]}
    >
      <Input
        name="contactEmail"
        onChange={formik.handleChange}
        value={formik.values.contactEmail}
      />
    </Form.Item>

    <Form.Item
      label="Jabatan"
      name="contactPosition"
      rules={[
        { required: true, message: "Please input your position!" },
      ]}
    >
      <Input
        name="contactPosition"
        onChange={formik.handleChange}
        value={formik.values.contactPosition}
      />
    </Form.Item>

    <Form.Item
      label="NPWP"
      name="contactNPWP"
      rules={[{ required: true, message: "Please input your NPWP!" }]}
    >
      <Input
        name="contactNPWP"
        onChange={formik.handleChange}
        value={formik.values.contactNPWP}
      />
    </Form.Item>
  </Form>
</Modal>
    </div>
  );
};

export default RegistrationForm;
