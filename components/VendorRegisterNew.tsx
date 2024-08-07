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
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

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

interface GetCityList {
  id: number;
  province_id: number;
  name: string;
  province: {
    id: number;
    name: string;
  };
}

interface GetProvinceList {
  id: number;
  name: string;
}

interface PositionList {
  id: number;
  name: string;
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
  } = useRegisterStore();

  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getCity, setGetCityList] = useState<GetCityList[]>([]);
  const [getProvince, setGetProvinceList] = useState<GetProvinceList[]>([]);
  const [getPositions, setGetpositions] = useState<PositionList[]>([]);

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
      if (!values.vendor_type) {
        errors.vendor_type = "Status vendor is required";
      }
      if (!values.postal_code) {
        errors.postal_code = "Postal Code is required";
      }
      if (!values.company_address) {
        errors.company_address = "Company address is required";
      }
      if (!values.company_email) {
        errors.company_email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.company_email)
      ) {
        errors.company_email = "Invalid email address";
      }
      if (!values.contact_name) {
        errors.contact_name = "Contact name is required";
      }
      if (!values.contact_email) {
        errors.contact_email = "Required";
      } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.contact_email)
      ) {
        errors.contact_email = "Invalid email address";
      }
      return errors;
    },
    onSubmit: async (values, { setErrors }) => {
      setIsLoading(true);
      try {
        values.position_id = values.position_id.toString();
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          values,
        );
        console.log("Response from API:", response.data);
        setFormSubmitted(true);
        message.success("Registration successful");
        setIsModalVisible(false);
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
          message.error(
            "An unexpected error occurred. Please try again later.",
          );
        }
      } finally {
        setIsLoading(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch City Data
        const cityResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/master/city`,
        );

        if (
          typeof cityResponse.data === "object" &&
          Array.isArray(cityResponse.data.data)
        ) {
          const mappedCities = cityResponse.data.data.map(
            (city: { city: { name: any }; city_id: any }) => ({
              ...city,
              city_id: city.city ? city.city.name : city.city_id,
            }),
          );

          setGetCityList(mappedCities);
        } else {
          console.error(
            "City data fetched is not in expected format:",
            cityResponse.data,
          );
          message.error("City data fetched is not in expected format.");
        }

        // Fetch Province Data
        const provinceResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/master/province`,
        );

        if (
          typeof provinceResponse.data === "object" &&
          Array.isArray(provinceResponse.data.data)
        ) {
          const mappedProvinces = provinceResponse.data.data.map(
            (province: { province: { name: any }; province_id: any }) => ({
              ...province,
              province_id: province.province
                ? province.province.name
                : province.province_id,
            }),
          );

          setGetProvinceList(mappedProvinces);
        } else {
          console.error(
            "Province data fetched is not in expected format:",
            provinceResponse.data,
          );
          message.error("Province data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchPositionList = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/master/vendor-position`,
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
            "Business field data fetched is not in expected format:",
            response.data,
          );
          message.error(
            "Business field data fetched is not in expected format.",
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

  const isEditing = (record: RegisterContactInfo) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<RegisterContactInfo> & { id: React.Key }) => {
    const positionName =
      getPositions.find(
        (position_id) => position_id.id === Number(record.position_id),
      )?.name || record.position_id?.toString();
    console.log(positionName);
    form.setFieldsValue({ ...record, position_id: positionName });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as RegisterContactInfo;
      const positionId =
        getPositions.find((position) => position.name === row.position_id)
          ?.id || row.position_id;

      editContactInfo({
        ...row,
        id: Number(id),
        position_id: String(positionId),
      });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeContactInfo(Number(id));
  };

  const getPositionName = (positionId: string) => {
    const vendor_position = getPositions.find(
      (position) => String(position.id) === positionId,
    );
    return vendor_position ? vendor_position.name : positionId;
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
      options: getPositions.map((businessField) => ({
        key: businessField.id,
        value: businessField.id,
        label: businessField.name,
      })),
      render: (text: string) => getPositionName(text),
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

  const showModal = () => {
    let emptyData = {
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      position_id: "",
      contact_identity_no: "",
      contact_npwp: "",
    };
    form.setFieldsValue({ ...emptyData });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = (await form.validateFields()) as RegisterContactInfo;
      const positionId =
        getPositions.find((position) => position.name === values.position_id)
          ?.id || values.position_id;

      addContactInfo({
        ...values,
        id: getNextId(),
        position_id: String(positionId),
      });

      setIsModalVisible(false);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitted data:", formik.values);
    formik.handleSubmit(); // Trigger Formik's submit function
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: RegisterContactInfo) => ({
        record,
        inputType:
          col.dataIndex === "position_id" ||
            col.dataIndex.includes("position_id")
            ? "select"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        editing: isEditing(record),
      }),
    };
  });

  const items = [
    {
      key: "1",
      label: "Profile Perusahaan",
      children: (
        <Form layout="vertical" form={form}>
          <Form.Item
            name="company_name"
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
            required
            hasFeedback
          >
            <Input
              id="company_name"
              name="company_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company_name}
              placeholder="Input company name"
            />
          </Form.Item>
          {/* <Form.Item
            name="company_npwp"
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
            required
            hasFeedback
          >
            <NumericNumber
              placeholder="Input a number"
              value={formik.values.company_npwp}
              onChange={(value) => formik.setFieldValue("company_npwp", value)}
            />
          </Form.Item> */}
          <Form.Item
            name="company_npwp"
            label="NPWP Perusahaan"
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
              value={formik.values.company_npwp}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Input NPWP Company Number"
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
            required
            hasFeedback
          >
            <Select
              id="vendor_type"
              onChange={(value) => formik.setFieldValue("vendor_type", value)}
              onBlur={formik.handleBlur}
              value={formik.values.vendor_type}
            >
              <Option value="pusat">Pusat</Option>
              <Option value="cabang">Cabang</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Alamat Perusahaan"
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
            required
            hasFeedback
          >
            <Input
              id="company_address"
              name="company_address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company_address}
              placeholder="Input company address"
            />
          </Form.Item>
          <Form.Item label="Provinsi" required hasFeedback>
            <Select
              id="province_id"
              onChange={(value) => {
                const provinceId = parseInt(value, 10);
                formik.setFieldValue("province_id", provinceId);

                // Find the first city that matches the selected province_id
                const firstCity = getCity.find(
                  (city) => city.province_id === provinceId,
                );
                if (firstCity) {
                  // Set city_id value in Formik to the first city's ID
                  formik.setFieldValue("city_id", firstCity.id);
                } else {
                  // If no city matches, reset city_id
                  formik.setFieldValue("city_id", "");
                }
              }}
              onBlur={formik.handleBlur}
              value={formik.values.province_id}
            >
              {getProvince.map((province) => (
                <Select.Option key={province.id} value={province.id}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Kota" required hasFeedback>
            <Select
              id="city_id"
              onChange={(value) => formik.setFieldValue("city_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.city_id}
              disabled={!formik.values.province_id} // Disable city selection until province is selected
            >
              {getCity
                .filter(
                  (city) =>
                    city.province_id === Number(formik.values.province_id),
                )
                .map((city) => (
                  <Select.Option key={city.id} value={city.id}>
                    {city.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Kode POS"
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
            required
            hasFeedback
          >
            <InputNumber
              id="postal_code"
              placeholder="Input postal code"
              value={formik.values.postal_code}
              onChange={(value) => formik.setFieldValue("postal_code", value)}
            />
          </Form.Item>
          <Form.Item
            name="company_phone_number"
            label="Nomor Telepon Perusahaan"
            rules={[
              {
                // required: true,
              },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject(
                      "Phone company number has to be a number.",
                    );
                  }
                  // if (value.length < 10) {
                  //   return Promise.reject("Your KTP Number is too sort");
                  // }
                  // if (value.length > 16) {
                  //   return Promise.reject("NPWP code can't be more than 16 digits");
                  // }
                  return Promise.resolve();
                },
              }),
            ]}
            required
            hasFeedback
          >
            {/* <NumericInput
              value={formik.values.company_phone_number}
              onChange={(value) =>
                formik.setFieldValue("company_phone_number", value)
              }
              onBlur={formik.handleBlur}
              placeholder="Input company phone number"
            /> */}
            <Input
              id="company_phone_number"
              name="company_phone_number"
              onChange={formik.handleChange}
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
            required
            hasFeedback
          >
            <Input
              id="company_fax"
              name="company_fax"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company_fax}
              placeholder="(123)-456-7890"
            />
          </Form.Item>
          <Form.Item
            label="Email Perusahaan"
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
            required
            hasFeedback
          >
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
      ),
    },
    {
      key: "2",
      label: "Contact Info",
      children: (
        <Form form={form} component={false}>
          <Button type="primary" onClick={showModal} className="mb-4">
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
          <p className="mt-5 italic opacity-60">
            * Seluruh Notifikasi ke Vendor ini akan di kirim ke email yg
            terdaftar di contact person
          </p>
        </Form>
      ),
    },
    {
      key: "3",
      label: "Authorization",
      children: (
        <Form layout="vertical" onFinish={formik.handleSubmit}>
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
              formik.errors.password && formik.touched.password ? "error" : ""
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
      ),
    },
  ];

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
          <Tabs
            activeKey={activeTab}
            onChange={handleTabChange}
            items={items}
          />
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
                  {
                    required: true,
                    message: "Telepon tidak boleh kosong",
                    min: 5,
                  },
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
                  { type: 'email', message: "Email is not valid" }
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
                  {getPositions.map((option) => (
                    <Select.Option key={option.id} value={option.id}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
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
                        return Promise.reject(
                          "NPWP can't be less than 16 digits",
                        );
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
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
              <Form.Item
                label="Nomor KTP"
                name="contact_identity_no"
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
                        return Promise.reject("KTP number has to be a number.");
                      }
                      if (value.length < 6) {
                        return Promise.reject("Your KTP Number is too sort");
                      }

                      if (value.length > 16) {
                        return Promise.reject(
                          "KTP number can't be more than 16 digits",
                        );
                      }
                      // if (value.length > 16) {
                      //   return Promise.reject("NPWP code can't be more than 16 digits");
                      // }
                      return Promise.resolve();
                    },
                  }),
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
            <Button
              onClick={() => router.push("/login")}
              className="mt-4 bg-transparent font-semibold text-blue-700 hover:bg-blue-500"
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePerusahaan;
