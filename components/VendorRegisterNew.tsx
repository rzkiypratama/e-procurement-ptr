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
} from "antd";
import useRegisterStore from "../store/indexcopy";
import { useFormik } from "formik";
import EditableCell from "./EditableCell";

const { TabPane } = Tabs;
const { Option } = Select;

interface RegisterContactInfo {
  id: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactPosition: string;
  contactNPWP: string;
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
    setLoading
  } = useRegisterStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const formik = useFormik({
    initialValues: {
      companyName: registerProfilePerusahaan.companyName,
      companyNPWP: registerProfilePerusahaan.companyNPWP,
      companyStatus: registerProfilePerusahaan.companyStatus,
      companyAddress: registerProfilePerusahaan.companyAddress,
      companyCity: registerProfilePerusahaan.companyCity,
      companyProvince: registerProfilePerusahaan.companyProvince,
      companyPostalCode: registerProfilePerusahaan.companyPostalCode,
      companyPhone: registerProfilePerusahaan.companyPhone,
      companyFax: registerProfilePerusahaan.companyFax,
      companyEmail: registerProfilePerusahaan.companyEmail,
      username: registerAuthorization.username,
      password: registerAuthorization.password,
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactPosition: "",
      contactNPWP: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Simulating async operation
        await new Promise((resolve) => setTimeout(resolve, 2000));
        addContactInfo({ ...values, id: getNextId() });
        setFormSubmitted(true);
        setIsModalVisible(false);
        message.success(`register successfully`);
      } catch (error) {
        console.log("Error submitting data", error);
        message.error(`register failed`);
      } finally {
        setLoading(false); // Set loading to false when operation is done
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
      dataIndex: "contactName",
      key: "contactName",
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "contactPhone",
      key: "contactPhone",
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "contactEmail",
      key: "contactEmail",
      editable: true,
    },
    {
      title: "Location",
      dataIndex: "contactPosition",
      key: "contactPosition",
      editable: true,
    },
    {
      title: "NPWP",
      dataIndex: "contactNPWP",
      key: "contactNPWP",
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

  const mergedColumns = columns.map((col) => ({
    ...col,
    onCell: (record: RegisterContactInfo) => ({
      record,
      inputType:
        col.dataIndex === "noKTP" || col.dataIndex === "npwp"
          ? "number"
          : "text",
      dataIndex: col.dataIndex,
      title: col.title,
      editing: isEditing(record),
    }),
  }));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      addContactInfo({
        ...values,
        id: getNextId(), // Ensure unique ID
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
      <><Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Profile Perusahaan" key="1">
              <Form layout="vertical" form={form}>
                <Form.Item label="Nama Perusahaan">
                  <Input
                    id="companyName"
                    name="companyName"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyName} />
                </Form.Item>
                <Form.Item label="NPWP Perusahaan">
                  <Input
                    id="companyNPWP"
                    name="companyNPWP"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyNPWP} />
                </Form.Item>
                <Form.Item label="Status">
                  <Select
                    id="companyStatus"
                    onChange={(value) => formik.setFieldValue("companyStatus", value)}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyStatus}
                  >
                    <Option value="pusat">Pusat</Option>
                    <Option value="cabang">Cabang</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Alamat Perusahaan">
                  <Input
                    id="companyAddress"
                    name="companyAddress"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyAddress} />
                </Form.Item>
                <Form.Item label="Kota">
                  <Input
                    id="companyCity"
                    name="companyCity"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyCity} />
                </Form.Item>
                <Form.Item label="Provinsi">
                  <Input
                    id="companyProvince"
                    name="companyProvince"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyProvince} />
                </Form.Item>
                <Form.Item label="Kode Pos">
                  <Input
                    id="companyPostalCode"
                    name="companyPostalCode"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyPostalCode} />
                </Form.Item>
                <Form.Item label="Nomor Telepon Perusahaan">
                  <Input
                    id="companyPhone"
                    name="companyPhone"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyPhone} />
                </Form.Item>
                <Form.Item label="Nomor Fax Perusahaan">
                  <Input
                    id="companyFax"
                    name="companyFax"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyFax} />
                </Form.Item>
                <Form.Item
                  label="Email Perusahaan"
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
                    id="companyEmail"
                    name="companyEmail"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyEmail} />
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
                  }} />
                <Button type="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </Form>
            </TabPane>

            <TabPane tab="Authorization" key="3">
              <Form layout="vertical" onFinish={formik.handleSubmit}>
                <Form.Item
                  label="Username"
                  validateStatus={formik.errors.username && formik.touched.username ? "error" : ""}
                  help={formik.errors.username && formik.touched.username
                    ? formik.errors.username
                    : ""}
                  hasFeedback
                >
                  <Input
                    id="username"
                    name="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username} />
                </Form.Item>
                <Form.Item
                  label="Password"
                  validateStatus={formik.errors.password && formik.touched.password ? "error" : ""}
                  help={formik.errors.password && formik.touched.password
                    ? formik.errors.password
                    : ""}
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
                    value={formik.values.password} />
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
                        if (!value ||
                          getFieldValue("password") === formik.values.password) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The new password that you entered do not match!"
                          )
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
                  name="contactName"
                  label="Nama"
                  rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
                >
                  <Input
                    value={formik.values.contactName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                </Form.Item>
                <Form.Item
                  name="contactPhone"
                  label="Phone"
                  rules={[
                    { required: true, message: "Telepon tidak boleh kosong" },
                  ]}
                >
                  <Input
                    value={formik.values.contactPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                </Form.Item>
                <Form.Item
                  name="contactEmail"
                  label="Email"
                  rules={[
                    { required: true, message: "Email tidak boleh kosong" },
                  ]}
                >
                  <Input
                    value={formik.values.contactEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                </Form.Item>
                <Form.Item
                  name="contactPosition"
                  label="Position"
                  rules={[
                    { required: true, message: "Position tidak boleh kosong" },
                  ]}
                >
                  <Input
                    value={formik.values.contactPosition}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                </Form.Item>
                <Form.Item
                  name="contactNPWP"
                  label="NPWP"
                  rules={[{ required: true, message: "NPWP tidak boleh kosong" }]}
                >
                  <Input
                    value={formik.values.contactNPWP}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur} />
                </Form.Item>
              </Form>
            </Modal></>
      ) : (
        <div className="text-center">
          <div className="p-10">
            <p>
              Selamat {formik.values.companyEmail}, pendaftaran anda telah
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
