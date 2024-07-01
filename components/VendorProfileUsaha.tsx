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
import {cityOptions, provinceOptions } from "@/utils/cityOptions"

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
  city: {
    id: number;
    province_id: number;
    name: string;
    province: {
      id: number;
      name: string;
    };
  };
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
      // Dapatkan token, user_id, dan vendor_id dari cookies
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      try {
        const response = await axios.post(
          "https://vendorv2.delpis.online/api/vendor/informasi-umum",
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
      }
    },
  });

  // get untuk type data object
  useEffect(() => {
    const fetchProfilePerusahaan = async () => {
      try {
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Token, User ID, or Vendor ID is missing.");
          return;
        }

        const response = await axios.get(
          "https://vendorv2.delpis.online/api/vendor/informasi-umum",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );

        console.log("Response from API:", response.data);

        if (response.data && response.data.data) {
          const profileData: ProfilePerusahaan = {
            ...response.data.data,
            city_id: response.data.data.city.name,
            province_id: response.data.data.city.province.name
          };

          initializeProfilePerusahaan([profileData]);
        } else {
          console.error("Failed to fetch company profile information.");
          message.error("Failed to fetch company profile information.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch company profile information.");
      }
    };

    fetchProfilePerusahaan();
  }, [initializeProfilePerusahaan]);

  const isEditing = (record: ProfilePerusahaan) => {
    if (record && record.id) {
      return record.id.toString() === editingKey;
    }
    return false;
  };

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
      editProfilePerusahaan({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeProfilePerusahaan(Number(id));
  };

  const getProvinceName = (provinceId: string) => {
    const province_id = provinceOptions.find(option => option.value === provinceId);
    return province_id ? province_id.label : provinceId;
  };
  
  const getCityName = (cityId: string) => {
    const city_id = cityOptions.find(option => option.value === cityId);
    return city_id ? city_id.label : cityId;
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
      options: cityOptions,
      render: (text: string) => getCityName(text),
    },
    {
      title: "Provinsi",
      dataIndex: "province_id",
      key: "province_id",
      editable: true,
      options: provinceOptions,
      render: (text: string) => getProvinceName(text),
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addProfilePerusahaan({
      ...formik.values,
      id: profilePerusahaan.length + 2,
      city: {
        id: 0,
        province_id: 0,
        name: "",
        province: {
          id: 0,
          name: ""
        }
      }
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
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Profile Perusahaan
      </Button>
      <Modal
        title="Tambah Profile Perusahaan"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      // footer={[
      //   <>
      //    <Button onClick={handleCancel}>
      //     Batalkan
      //   </Button>
      //   <Button key="submit" type="primary" onClick={handleSubmit}>
      //     Simpan Data
      //   </Button>
      //   </>
      // ]}
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
              //   onChange={(value) => formik.setFieldValue("noKTPPengurus", value)}
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
          <Form.Item label="Kota" required hasFeedback>
            <Select
              id="city_id"
              onChange={(value) => formik.setFieldValue("city_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.city_id}
            >
              {columns
                .find((col) => col.dataIndex === "city_id")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Provinsi" required hasFeedback>
            <Select
              id="province_id"
              onChange={(value) => formik.setFieldValue("province_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.province_id}
            >
              {columns
                .find((col) => col.dataIndex === "province_id")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="postal_code"
            label="Kode Pos Perusahaan"
          // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.postal_code}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="company_fax"
            label="Nomor Fax Perusahaan"
          // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
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
          // rowKey={(record) => record.id.toString()}
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
        />
        <Button type="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default PengurusPerusahaan;
