import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Typography,
  Popconfirm,
  Modal,
  message,
  Select,
} from "antd";
import dayjs from "dayjs";
import useIzinUsahaStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { bidangUsahaOptions } from "@/utils/bidangUsahaOptions";
import { izinUsahaOptions } from "@/utils/izinUsahaOptions";

const { Option } = Select;
const { TextArea } = Input;

interface IzinUsaha {
  id: number;
  type: string;
  permit_number: string;
  start_date: string;
  end_date: string;
  licensing_agency: string;
  vendor_business_field_id: number;
}

interface BusinessField {
  id: number;
  name: string;
}

interface IzinUsahaList {
  id: number;
  name: string;
}

const IzinUsaha: React.FC = () => {
  const {
    izinUsaha,
    addIzinUsaha,
    editIzinUsaha,
    removeIzinUsaha,
    initializeIzinUsaha,
  } = useIzinUsahaStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [getBusinessField, setGetBusinessField] = useState<BusinessField[]>([]);
  const [getIzinUsahaList, setGetIzinUsahaList] = useState<IzinUsahaList[]>([]);

  const formik = useFormik({
    initialValues: {
      type: "",
      permit_number: "",
      start_date: "",
      end_date: "",
      licensing_agency: "",
      vendor_business_field_id: 0,
    },
    onSubmit: async (values, { setErrors }) => {
      // Dapatkan token, user_id, dan vendor_id dari cookies
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Please login first.");
        return;
      }

      try {
        setIsLoading(true)
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/business-permit`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );

        if (response.data && response.data.data) {
          const { vendor_business_field, ...vendorData } = response.data.data;

          const mappedData: IzinUsaha = {
            ...vendorData,
            vendor_business_field_id: vendor_business_field
              ? vendor_business_field.name
              : vendor_business_field,
          };

          console.log("Response from API:", response.data);
          setIsModalVisible(false);
          message.success("Izin Usaha added successful");
          addIzinUsaha(mappedData);
          setIsModalVisible(false);
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
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/business-permit`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );

        // Check if response.data is an object containing an array
        if (response.data && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(
            (business_field: {
              vendor_business_field: { name: any };
              vendor_business_field_id: any;
            }) => ({
              ...business_field,
              vendor_business_field_id: business_field.vendor_business_field
                ? business_field.vendor_business_field.name
                : business_field.vendor_business_field,
            }),
          );
          initializeIzinUsaha(mappedData);
        } else {
          console.error("Data fetched is not in expected format:", response.data);
          message.error("Data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [initializeIzinUsaha]);

  // get izin usaha
  useEffect(() => {
    const fetchIzinUsahaList = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/master/parameters?filter[category_slug]=izin-usaha`,
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
            (type: { id: any; name: any }) => ({
              ...type,
            }),
          );

          setGetIzinUsahaList(mappedData);
        } else {
          console.error(
            "business field data fetched is not in expected format:",
            response.data,
          );
          message.error("business field data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching business field data:", error);
        message.error("Failed to fetch business field data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchIzinUsahaList();
  }, []);

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
            (vendor_business_field_id: { id: any; name: any }) => ({
              ...vendor_business_field_id,
            }),
          );

          setGetBusinessField(mappedData);
        } else {
          console.error(
            "business field data fetched is not in expected format:",
            response.data,
          );
          message.error("business field data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching business field data:", error);
        message.error("Failed to fetch business field data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessField();
  }, []);

  const isEditing = (record: IzinUsaha) => record.id.toString() === editingKey;

  const edit = (record: Partial<IzinUsaha> & { id: React.Key }) => {
    const business_field_name = getBusinessField.find((vendor_business_field_id) => vendor_business_field_id.id === Number(record.vendor_business_field_id))?.name || record.vendor_business_field_id;
    form.setFieldsValue({
      ...record,
      start_date: record.start_date
        ? dayjs(record.start_date, "YYYY-MM-DD")
        : null,
      end_date: record.end_date
        ? dayjs(record.end_date, "YYYY-MM-DD")
        : null,
      vendor_business_field_id: business_field_name
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      const row = await form.validateFields();
      const businessFieldId = getBusinessField.find(
        (field) => field.name === row.vendor_business_field_id
      )?.id || row.vendor_business_field_id;

      const updatedRow = {
        ...row,
        id: Number(id),
        start_date: dayjs(row.start_date).format("YYYY-MM-DD"),
        end_date: dayjs(row.end_date).format("YYYY-MM-DD"),
        vendor_business_field_id: businessFieldId,
      };

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/business-permit/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );

      // Mengubah kembali business_field_id menjadi name untuk frontend
      const updatedRowForFrontend = {
        ...updatedRow,
        vendor_business_field_id: getBusinessField.find(
          (field) => field.id === updatedRow.vendor_business_field_id
        )?.name || updatedRow.vendor_business_field_id,
      };

      editIzinUsaha(updatedRowForFrontend); // Pastikan Anda memiliki fungsi editIzinUsaha yang sesuai
      setEditingKey("");
      message.success("Business permit updated successfully.");
    } catch (error) {
      console.error("Error updating business permit:", error);
      message.error("Failed to update business permit. Please try again.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/business-permit/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );

      removeIzinUsaha(Number(id)); // Menghapus item dari state setelah berhasil dihapus di backend
      message.success("Business permit deleted successfully.");
    } catch (error) {
      console.error("Error deleting business permit:", error);
      message.error("Failed to delete business permit. Please try again.");
    }
  };

  const getPositionName = (positionId: number) => {
    const vendor_position = bidangUsahaOptions.find(option => option.value === positionId);
    return vendor_position ? vendor_position.label : positionId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Jenis Izin",
      dataIndex: "type",
      key: "type",
      editable: true,
      options: getIzinUsahaList.map((izinUsahaList) => ({
        key: izinUsahaList.id,
        value: izinUsahaList.name,
        label: izinUsahaList.name,
      })),
    },
    {
      title: "Nomor Izin",
      dataIndex: "permit_number",
      key: "permit_number",
      editable: true,
    },
    {
      title: "Tanggal Izin",
      dataIndex: "start_date",
      key: "start_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
    },
    {
      title: "Tanggal Berakhir",
      dataIndex: "end_date",
      key: "end_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
    },
    {
      title: "Instansi Pemberi Izin",
      dataIndex: "licensing_agency",
      key: "licensing_agency",
      editable: true,
    },
    {
      title: "Bidang Usaha",
      dataIndex: "vendor_business_field_id",
      key: "vendor_business_field_id",
      editable: true,
      options: getBusinessField.map((businessField) => ({
        key: businessField.id,
        value: businessField.id,
        label: businessField.name,
      })),
      // render: (text: number) => getPositionName(text),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: IzinUsaha) => {
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
      onCell: (record: IzinUsaha) => ({
        record,
        inputType:
          col.dataIndex === "permit_number" || col.dataIndex.includes("permit_number") ? "text" :
            col.dataIndex === "start_date" || col.dataIndex.includes("start_date") ? "date" :
              col.dataIndex === "end_date" || col.dataIndex.includes("end_date") ? "date" :
                col.dataIndex === "vendor_business_field_id" || col.dataIndex.includes("vendor_business_field_id") ? "select" :
                  col.dataIndex === "type" || col.dataIndex.includes("type") ? "select" :
                    "text",
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
      type: "",
      permit_number: "",
      start_date: "",
      end_date: "",
      licensing_agency: "",
      vendor_business_field_id: 0,
    };
    form.setFieldsValue({ ...emptyData });
    formik.setValues({ ...emptyData })
  };

  const handleOk = () => {
    addIzinUsaha({ ...formik.values, id: izinUsaha.length + 2 });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", izinUsaha);
    form.validateFields().then((values) => {
      formik.handleSubmit()
    });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Izin Usaha
      </Button>
      <Modal
        title="Tambah Izin Usaha"
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
        <Form form={form}>
          {/* jenis izin nanti berupa select */}
          {/* Izin Usaha 2 */}
          <Form.Item
            name="type"
            label="Jenis Izin"
            rules={[{ required: true }]}
          >
            <Select
              id="type"
              onChange={(value) => formik.setFieldValue("type", value)}
              onBlur={formik.handleBlur}
              value={formik.values.type}
              placeholder="Pilih jenis izin"
            >
              {getIzinUsahaList.map((option) => (
                <Option key={option.id} value={option.name}>
                  {option.name}
                </Option>
              ))}
            </Select>
            {/* <Input
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
            /> */}
          </Form.Item>
          <Form.Item
            name="permit_number"
            label="Nomor Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="permit_number"
              value={formik.values.permit_number}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Tanggal Izin"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              name="start_date"
              onChange={(date) =>
                formik.setFieldValue(
                  "start_date",
                  date ? date.format("YYYY-MM-DD") : "",
                )
              }
              // style={{
              //   height: "auto",
              //   width: "250px",
              // }}
            />
          </Form.Item>
          <Form.Item
            name="end_date"
            label="Tanggal Berakhir"
            rules={[{ required: true }]}
          >
            <DatePicker
              name="end_date"
              format="YYYY-MM-DD"
              onChange={(date, dateString) =>
                formik.setFieldValue("end_date", dateString)
              }
            />
          </Form.Item>
          <Form.Item
            name="licensing_agency"
            label="Instansi Pemberi Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="licensing_agency"
              value={formik.values.licensing_agency}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="vendor_business_field_id"
            label="Bidang Usaha"
            rules={[{ required: true }]}
          >
            <Select
              id="vendor_business_field_id"
              onChange={(value) => formik.setFieldValue("vendor_business_field_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.vendor_business_field_id}
              placeholder="Select bidang usaha"
            >
              {getBusinessField.map((option) => (
                <Option key={option.id} value={option.id}>
                  {option.name}
                </Option>
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
          dataSource={izinUsaha}
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

export default IzinUsaha;
