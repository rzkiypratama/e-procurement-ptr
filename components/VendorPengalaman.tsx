import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Typography,
  Popconfirm,
  Modal,
  message,
  Select,
} from "antd";
import usePengalamanStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { bidangUsahaOptions } from "@/utils/bidangUsahaOptions";

const { TextArea } = Input;
const { Option } = Select;

interface Pengalaman {
  id: number;
  job_name: string;
  business_field_id: string;
  location: string;
}

interface BusinessField {
  id: number;
  name: string;
}

const PengurusPerusahaan: React.FC = () => {
  const {
    pengalaman,
    addPengalaman,
    editPengalaman,
    removePengalaman,
    initializePengalaman,
  } = usePengalamanStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [getBusinessField, setGetBusinessField] = useState<BusinessField[]>([]);

  const formik = useFormik({
    initialValues: {
      job_name: "",
      business_field_id: "",
      location: "",
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
        setIsLoading(true);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/experience`,
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
          const { vendor_business_field, ...vendorData } = response.data.data;

          const mappedData: Pengalaman = {
            ...vendorData,
            business_field_id: vendor_business_field ? vendor_business_field.name : vendor_business_field,
          };

          console.log("Response from API:", response.data);
          setIsModalVisible(false);
          message.success("Data Pengalaman added successful");
          addPengalaman(mappedData);
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

  // ini untuk get dengan type data array of object
  useEffect(() => {
    const fetchBankAccounts = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/experience`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        // Check if response.data is an object containing an array
        if (response.data && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(
            (business_field: {
              vendor_business_field: { name: any };
              business_field_id: any;
            }) => ({
              ...business_field,
              business_field_id: business_field.vendor_business_field
                ? business_field.vendor_business_field.name
                : business_field.vendor_business_field,
            }),
          );
          initializePengalaman(mappedData);
        } else {
          console.error(
            "Data Pengalaman data fetched is not in expected format:",
            response.data,
          );
          message.error(
            "Data Pengalaman data fetched is not in expected format.",
          );
        }
      } catch (error) {
        console.error("Error fetching Data Pengalaman data:", error);
        message.error(
          "Failed to fetch Data Pengalaman data. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankAccounts();
  }, [initializePengalaman]);

  // get buseinss field
  useEffect(() => {
    const fetchBusinessField = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/master/vendor-business-field`,
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
            (business_field: { id: any; name: any }) => ({
              ...business_field,
            }),
          );

          setGetBusinessField(mappedData);
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

    fetchBusinessField();
  }, []);

  const isEditing = (record: Pengalaman) => record.id.toString() === editingKey;

  const edit = (record: Partial<Pengalaman> & { id: React.Key }) => {
    const business_field_name =
      getBusinessField.find(
        (business_field_id) =>
          business_field_id.id === Number(record.business_field_id),
      )?.name || record.business_field_id;
    form.setFieldsValue({ ...record, business_field_id: business_field_name });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as Pengalaman;
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      const business_field_get_id =
        getBusinessField.find(
          (business_field_id) =>
            business_field_id.name === row.business_field_id,
        )?.id || row.business_field_id;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/experience/${id}`,
        { ...row, business_field_id: business_field_get_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      if (response.data && response.data.data) {
        const { vendor_business_field, ...vendorData } = response.data.data;

        const updatedVendorId: Pengalaman = {
          ...vendorData,
          business_field_id: vendor_business_field
            ? vendor_business_field.name
            : "", // Display bank_name if available
        };

        editPengalaman({ ...updatedVendorId, id: Number(id) });
        setEditingKey("");
        message.success("Pengalaman updated successfully.");
      } else {
        console.error("Failed to get valid data from API response");
        message.error("Failed to get valid data from API response");
      }
    } catch (error) {
      console.error("Failed to save data", error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/experience/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      removePengalaman(Number(id));
      message.success("Pengalaman deleted successfully.");
    } catch (error) {
      console.error("Error deleting Pengalaman:", error);
      message.error("Failed to delete Pengalaman. Please try again.");
    }
  };

  const getPositionName = (positionId: number) => {
    const vendor_position = bidangUsahaOptions.find(
      (option) => option.value === positionId,
    );
    return vendor_position ? vendor_position.label : positionId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Pekerjaan",
      dataIndex: "job_name",
      key: "job_name",
      editable: true,
    },
    {
      title: "Bidang Pekerjaan",
      dataIndex: "business_field_id",
      key: "business_field_id",
      editable: true,
      options: getBusinessField.map((businessField) => ({
        key: businessField.id,
        value: businessField.id,
        label: businessField.name,
      })),
    },
    {
      title: "Lokasi Pekerjaan",
      dataIndex: "location",
      key: "location",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: Pengalaman) => {
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
      onCell: (record: Pengalaman) => ({
        record,
        inputType: col.dataIndex === "business_field_id" ? "select" : "text",
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
    setIsModalVisible(true);
    let emptyData = {
      job_name: "",
      business_field_id: "",
      location: "",
    };
    form.setFieldsValue({ ...emptyData });
    formik.setValues({ ...emptyData });
  };

  const handleOk = () => {
    addPengalaman({
      ...formik.values,
      id: pengalaman.length + 2,
    });
    setIsModalVisible(false);
    // form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", pengalaman);
    // Additional submission logic if needed
    form.validateFields().then((values) => {
      // formik.values.name = values.name;
      formik.handleSubmit()
    });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Pengalaman
      </Button>
      <Modal
        title="Tambah Pengalaman"
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
            name="job_name"
            label="Nama Pekerjaan"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.job_name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="business_field_id"
            label="Bidang Pekerjaan"
            rules={[{ required: true, message: "Harap pilih Bidang pekerjaan" }]}
          >
            <Select
              id="business_field_id"
              onChange={(value) =>
                formik.setFieldValue("business_field_id", value)
              }
              onBlur={formik.handleBlur}
              value={formik.values.business_field_id}
              placeholder="Select bidang usaha"
            >
              {getBusinessField.map((business_field) => (
                <Option key={business_field.id} value={business_field.id}>
                  {business_field.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="Lokasi Pekerjaan"
            rules={[{ required: true, message: "Lokasi pekerjaan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.location}
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
          dataSource={pengalaman}
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
