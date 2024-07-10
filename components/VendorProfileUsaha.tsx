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
import useProfilePerusahaanStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import { cityOptions, provinceOptions } from "@/utils/cityOptions";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface ProfilePerusahaan {
  id: number;
  company_name: string;
  company_npwp: string;
  vendor_type: string;
  company_address: string;
  city_id: string;
  postal_code: string;
  company_phone_number: string;
  company_email: string;
  company_fax: string;
  province_id: string;
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

const PengurusPerusahaan: React.FC = () => {
  const {
    profilePerusahaan,
    addProfilePerusahaan,
    editProfilePerusahaan,
    removeProfilePerusahaan,
    initializeProfilePerusahaan,
  } = useProfilePerusahaanStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [getCity, setGetCityList] = useState<GetCityList[]>([]);
  const [getProvince, setGetProvinceList] = useState<GetProvinceList[]>([]);

  const formik = useFormik({
    initialValues: {
      company_name: "",
      company_npwp: "",
      vendor_type: "",
      company_address: "",
      city_id: "",
      province_id: "",
      postal_code: "",
      company_phone_number: "",
      company_email: "",
      company_fax: "",
    },
    onSubmit: async (values, { setErrors }) => {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      try {
        setIsLoading(true);
        values.city_id = getCity.find((item) => item.name == values.city_id)?.id.toString() ?? ""
        values.province_id = getProvince.find((item) => item.name == values.province_id)?.id.toString() ?? ""
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/informasi-umum`,
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
        if (response.data && response.data.data) {
          const profileData: ProfilePerusahaan = {
            ...response.data.data,
            city_id: response.data.data.city.name,
            province_id: response.data.data.city.province.name,
          };
          editProfilePerusahaan(profileData);
          setIsModalVisible(false);
          formik.resetForm();
          message.success("Data submitted successfully");
        }
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

  // get untuk type data object
  useEffect(() => {
    const fetchProfilePerusahaan = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/informasi-umum`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        console.log("Response from API:", response.data);

        if (response.data && response.data.data) {
          const profileData: ProfilePerusahaan = {
            ...response.data.data,
            city_id: response.data.data.city.name,
            province_id: response.data.data.city.province.name,
          };

          initializeProfilePerusahaan([profileData]);
        } else {
          console.error("Failed to fetch company profile information.");
          message.error("Failed to fetch company profile information.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch company profile information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfilePerusahaan();
  }, [initializeProfilePerusahaan]);

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

  const isEditing = (record: ProfilePerusahaan) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<ProfilePerusahaan> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as ProfilePerusahaan;
      formik.handleSubmit();
      editProfilePerusahaan({ ...row, id: Number(id) });
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Perusahaan",
      dataIndex: "company_name",
      key: "company_name",
      editable: true,
    },
    {
      title: "Email Perusahaan",
      dataIndex: "company_email",
      key: "company_email",
      editable: true,
    },
    {
      title: "NPWP Perusahaan",
      dataIndex: "company_npwp",
      key: "company_npwp",
      editable: true,
    },
    {
      title: "No Telepon Perusahaan",
      dataIndex: "company_phone_number",
      key: "company_phone_number",
      editable: true,
    },
    {
      title: "Type",
      dataIndex: "vendor_type",
      key: "vendor_type",
      editable: true,
      options: [
        { value: "pusat", label: "Pusat" },
        { value: "cabang", label: "Cabang" },
      ],
    },
    {
      title: "Alamat Perusahaan",
      dataIndex: "company_address",
      key: "company_address",
      editable: true,
    },
    {
      title: "Kota",
      dataIndex: "city_id",
      key: "city_id",
      editable: true,
      options: getCity.map((city) => ({
        key: city.id,
        value: city.id,
        label: city.name,
      })),
      // render: (text: string) => getCityName(text),
    },
    {
      title: "Provinsi",
      dataIndex: "province_id",
      key: "province_id",
      editable: true,
      options: getProvince.map((province) => ({
        key: province.id,
        value: province.id,
        label: province.name,
      })),
      // render: (text: string) => getProvinceName(text),
    },
    {
      title: "Kode Pos",
      dataIndex: "postal_code",
      key: "postal_code",
      editable: true,
    },
    {
      title: "Nomor Fax Perusahaan",
      dataIndex: "company_fax",
      key: "company_fax",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: ProfilePerusahaan) => {
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
            <Typography.Link disabled={editingKey !== ""} onClick={(() => showModal(record))}>
              <EditOutlined />
            </Typography.Link>
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
      onCell: (record: ProfilePerusahaan) => ({
        record,
        inputType:
          col.dataIndex === "noKTPPengurus" || col.dataIndex === "npwpPengurus"
            ? "number"
            : col.dataIndex === "city_id" ||
              col.dataIndex === "province_id" ||
              col.dataIndex === "vendor_type"
              ? "select"
              : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = (record: ProfilePerusahaan) => {
    console.log(record.province_id)
    console.log(record.city_id)
    let saveData = {
      company_name: record.company_name,
      company_npwp: record.company_npwp,
      vendor_type: record.vendor_type,
      company_address: record.company_address,
      city_id: record.city_id,
      postal_code: record.postal_code,
      company_phone_number: record.company_phone_number,
      company_email: record.company_email,
      company_fax: record.company_fax,
      province_id: record.province_id,
    };
    form.setFieldsValue({ ...saveData });
    formik.setValues({ ...saveData })
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addProfilePerusahaan({
      ...formik.values,
      id: profilePerusahaan.length + 2,
    });
    setIsModalVisible(false);
    // form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", profilePerusahaan);
    // Additional submission logic if needed
    formik.handleSubmit(); // Trigger Formik's submit function
  };

  return (
    <div>
      <Modal
        title="Tambah Profile Perusahaan"
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
            name="company_name"
            label="Nama Perusahaan"
          // rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.company_name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="company_email"
            label="Email Perusahaan"
          // rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.company_email}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="company_npwp"
            label="NPWP Perusahaan"
            rules={[{ required: true, message: "NPWP harus berupa angka" }]}
            hasFeedback
          >
            <Input
              value={formik.values.company_npwp}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="company_phone_number"
            label="No Telepon Perusahaan"
          // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.company_phone_number}
              onChange={(e) =>
                formik.setFieldValue("company_phone_number", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item id="vendor_type" label="Status" required hasFeedback>
            <Select
              id="vendor_type"
              onChange={(value) => formik.setFieldValue("vendor_type", value)}
              onBlur={formik.handleBlur}
              value={formik.values.vendor_type}
            >
              {columns
                .find((col) => col.dataIndex === "vendor_type")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            id="company_address"
            name="company_address"
            label="Alamat Perusahaan"
          // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.company_address}
              onChange={formik.handleChange}
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
          <Form.Item name="postal_code" label="Kode Pos Perusahaan">
            <Input
              value={formik.values.postal_code}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="company_fax"
            label="Nomor Fax Perusahaan"
          // rules={[{ required: true, message: "Fax harus berupa angka" }]}
          >
            <Input
              value={formik.values.company_fax}
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
          dataSource={profilePerusahaan}
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

export default PengurusPerusahaan;
