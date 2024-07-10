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
import usePengurusPerusahaanStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import axios from "axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { positionOptions } from "@/utils/positionOptions";

const { TextArea } = Input;
interface PengurusPerusahaan {
  id: number;
  name: string;
  position_id: string;
  identity_no: string;
  npwp_no: string;
}

interface PositionList {
  id: number;
  name: string;
}

const PengurusPerusahaan: React.FC = () => {
  const {
    pengurusPerusahaan,
    addPengurusPerusahaan,
    editPengurusPerusahaan,
    removePengurusPerusahaan,
    initializePengurusPerusahaan,
  } = usePengurusPerusahaanStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [getPositions, setGetpositions] = useState<PositionList[]>([]);

  const formik = useFormik({
    initialValues: {
      name: "",
      position_id: "",
      identity_no: "",
      npwp_no: "",
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/director`,
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
          const { vendor_position, ...vendorData } = response.data.data;

          const mappedData: PengurusPerusahaan = {
            ...vendorData,
            position_id: vendor_position.id ? vendor_position.name : '',
          };

          console.log("Response from API:", response.data);
          setIsModalVisible(false);
          message.success("Data Pengurus Perusahaan added successful");
          addPengurusPerusahaan(mappedData);
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
    const fetchPengurusPerusahaan = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/director`,
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
          const mappedData = response.data.data.map((contact: { vendor_position: { name: any; }; position_id: any; }) => ({
            ...contact,
            position_id: contact.vendor_position ? contact.vendor_position.name : contact.position_id,
          }));
          initializePengurusPerusahaan(mappedData); // Initialize bank account state with the array of bank account objects
        } else {
          console.error("Pengurus Perusahaan data fetched is not in expected format:", response.data);
          message.error("Pengurus Perusahaan data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching Pengurus Perusahaan data:", error);
        message.error("Failed to fetch Pengurus Perusahaan data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPengurusPerusahaan();
  }, [initializePengurusPerusahaan]);

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

  const isEditing = (record: PengurusPerusahaan) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<PengurusPerusahaan> & { id: React.Key }) => {
    const positionName =
      getPositions.find(
        (position_id) =>
          position_id.id === Number(record.position_id),
      )?.name || record.position_id;
    form.setFieldsValue({
      ...record,
      position_id: positionName, // Assign the position name for display in the form
    });
    setEditingKey(record.id.toString());
  };

  // const edit = (record: Partial<PengurusPerusahaan> & { id: React.Key }) => {
  //   form.setFieldsValue({
  //     ...record,
  //     // position_id: record.position_id && !isNaN(Number(record.position_id)) ? Number(record.position_id) : "",
  //   });
  //   setEditingKey(record.id.toString());
  // };

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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/director/${id}`,
        updatedRow,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );

      if (response.data && response.data.data) {
        const { vendor_position, ...directorData } = response.data.data;

        const updatedDirector: PengurusPerusahaan = {
          ...directorData,
          position_id: vendor_position ? vendor_position.name : "", // Menampilkan nama posisi jika tersedia
        };

        editPengurusPerusahaan(updatedDirector); // Memperbarui data pengurus perusahaan
        setEditingKey("");
        message.success("Data details updated successfully.");
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/director/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );

      removePengurusPerusahaan(Number(id));
      message.success("Data deleted successfully.");
    } catch (error) {
      console.error("Error deleting director:", error);
      message.error("Failed to delete data. Please try again.");
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    { title: "Nama", dataIndex: "name", key: "name", editable: true },
    {
      title: "Jabatan", dataIndex: "position_id", key: "position_id", editable: true,
      // render: (text: string) => getPositionsName(text),
      options: getPositions.map((businessField) => ({
        key: businessField.id,
        value: businessField.id,
        label: businessField.name,
      })),
    },
    { title: "No KTP", dataIndex: "identity_no", key: "identity_no", editable: true },
    { title: "NPWP", dataIndex: "npwp_no", key: "npwp_no", editable: true },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: PengurusPerusahaan) => {
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
      onCell: (record: PengurusPerusahaan) => ({
        record,
        inputType:
          col.dataIndex === "position_id"
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
    setIsModalVisible(true);
    let emptyData = {
      name: "",
      position_id: "",
      identity_no: "",
      npwp_no: "",
    };
    form.setFieldsValue({ ...emptyData });
    formik.setValues({ ...emptyData })
  };

  const handleOk = () => {
    addPengurusPerusahaan({
      ...formik.values,
      id: pengurusPerusahaan.length + 2,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", pengurusPerusahaan);
    // Additional submission logic if needed

    form.validateFields().then((values) => {
      // formik.values.name = values.name;
      formik.handleSubmit()
    });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Pengurus Perusahaan
      </Button>
      <Modal
        title="Tambah Pengurus Perusahaan"
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
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="position_id"
            label="Jabatan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Select
              onChange={(value) => formik.setFieldValue("position_id", value)}
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
            name="identity_no"
            label="No KTP"
            rules={[
              { required: true, message: "KTP tidak boleh kosong" },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("KTP number has to be a number.");
                  }
                  if (value.length < 16) {
                    return Promise.reject("KTP number be less than 16 digits");
                  }
                  if (value.length > 16) {
                    return Promise.reject(
                      "KTP number can't be more than 16 digits",
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              value={formik.values.identity_no}
              onChange={formik.handleChange}
            // onChange={(value) => formik.setFieldValue("identity_no", value)}
            />
          </Form.Item>
          <Form.Item
            name="npwp_no"
            label="NPWP"
            rules={[
              { required: true, message: "NPWP tidak boleh kosong" },
              () => ({
                validator(_, value) {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (isNaN(value)) {
                    return Promise.reject("NPWP code has to be a number.");
                  }
                  if (value.length < 16) {
                    return Promise.reject("NPWP code can't be less than 16 digits");
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
          >
            <Input
              value={formik.values.npwp_no}
              onChange={formik.handleChange}
            // on change dibawah untuk Input berupa number InputNumber
            // onChange={(value) => formik.setFieldValue("npwp_no", value)}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={pengurusPerusahaan}
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
