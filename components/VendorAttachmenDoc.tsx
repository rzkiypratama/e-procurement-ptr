import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Typography,
  Popconfirm,
  Modal,
  Upload,
  Spin,
  DatePicker,
  message,
  Checkbox,
} from "antd";
import useAttachmentStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getCookie } from "cookies-next";
import axios from "axios";

const { TextArea } = Input;

interface AttachmentDoc {
  id: number;
  name: string;
  document: string;
  category: string;
  expiration_date: string;
  document_path: string;
}

const AttachmentDocument: React.FC = () => {
  const {
    attachmentDoc,
    addAttachment,
    editAttachment,
    removeAttachment,
    initializeAttachment,
  } = useAttachmentStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [loadingSubmit, setLoadingSubmit] = useState(false); // State untuk loading saat submit
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  const [tableKey, setTableKey] = useState(0);

  const formik = useFormik({
    initialValues: {
      name: "",
      document: "",
      category: "",
      expiration_date: "",
      document_path: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("document", values.document); // Menggunakan originFileObj untuk file asli
        formData.append("name", values.name);
        formData.append("category", values.category);
        formData.append("expiration_date", values.expiration_date);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/attachment`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
              "Content-Type": "multipart/form-data", // Penting untuk FormData
            },
          }
        );

        console.log("Response from API:", response.data);
        setIsModalVisible(false);
        message.success("Dokumen berhasil ditambahkan");

        // Memperbarui objek data attachment dengan tambahan document_path
        const attachmentData = {
          ...values,
          id: response.data.data.id,
          document_path: response.data.data.document_path,
        };

        addAttachment(attachmentData);
        formik.resetForm();
      } catch (error) {
        console.error("Gagal menambahkan dokumen:", error);
        message.error("Gagal menambahkan dokumen. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
        setSubmitting(false); // Pastikan setSubmitting disetel ke false untuk menghentikan proses loading
      }
    },
  });

  // ini untuk get dengan type data array of object
  useEffect(() => {
    const fetchBankAccounts = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/attachment`,
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
          initializeAttachment(response.data.data); // Initialize Tenaga Ahli state with the array of Tenaga Ahli objects
        } else {
          console.error("Tenaga Ahli data fetched is not in expected format:", response.data);
          message.error("Tenaga Ahli data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching Tenaga Ahli data:", error);
        message.error("Failed to fetch Tenaga Ahli data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankAccounts();
  }, [initializeAttachment]);

  const isEditing = (record: AttachmentDoc) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<AttachmentDoc> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      expiration_date: record.expiration_date
        ? dayjs(record.expiration_date, "YYYY-MM-DD")
        : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as AttachmentDoc;
      const updatedRow = {
        ...row,
        id: Number(id),
        expiration_date: dayjs(row.expiration_date).format(
          "YYYY-MM-DD",
        ),
      };
      editAttachment({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/attachment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );

      removeAttachment(Number(id));
      message.success("Attachment deleted successfully.");
    } catch (error) {
      console.error("Error deleting attachment:", error);
      message.error("Failed to delete attachment. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const isJpgOrPngOrPdf = file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf";
      if (!isJpgOrPngOrPdf) {
        message.error("Hanya file JPEG, PNG, atau PDF yang diizinkan!");
        return;
      }
      if (file.size / 1024 / 1024 >= 2) {
        message.error("File must be smaller than 2MB!");
        return;
      }
      // Set field value with the whole file object
      formik.setFieldValue("document", file);
      message.success(`${file.name} file selected successfully`);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    onChange: handleFileChange,
    beforeUpload: (file: File) => {
      const isJpgOrPngOrPdf = file.type === "image/jpeg" || file.type === "image/png" || file.type === "application/pdf";
      if (!isJpgOrPngOrPdf) {
        message.error("Hanya file JPEG, PNG, atau PDF yang diizinkan!");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must be smaller than 2MB!");
        return Upload.LIST_IGNORE;
      }
      return isJpgOrPngOrPdf && isLt2M;
    },
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Dokumen",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Kategori Dokumen",
      dataIndex: "category",
      key: "category",
      editable: true,
    },
    {
      title: "Dokumen",
      dataIndex: "document_path",
      key: "document",
      editable: true,
      render: (text: any, record: { document_path: string; }) => <a href={record.document_path} target="_blank">{text}</a>
    },
    {
      title: "Masa Berlaku Dokumen",
      dataIndex: "expiration_date",
      key: "expiration_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "YYYY-MM-DD").format("DD-MM-YYYY") : "",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: AttachmentDoc) => {
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
          <span className="flex items-center justify-center">
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
      onCell: (record: AttachmentDoc) => ({
        record,
        inputType:
          col.dataIndex === "expiration_date"
            ? "date"
            : col.dataIndex === "identity_no" ||
              col.dataIndex === "npwp_no"
              ? "number"
              : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = () => {
    form.resetFields();
    formik.resetForm();
    let emptyData = {
      name: "",
      document: "",
      category: "",
      expiration_date: "",
      document_path: "",
    };
    form.setFieldsValue({ ...emptyData });
    setIsModalVisible(true);
  };

  const handleOk = () => {
    addAttachment({
      ...formik.values,
      id: attachmentDoc.length + 2,
    });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", attachmentDoc);
    // Additional submission logic if needed
    formik.handleSubmit();
  };

  const handleSubmitAll = async () => {
    setLoadingSubmit(true);

    const token = getCookie("token");
    const userId = getCookie("user_id");
    const vendorId = getCookie("vendor_id");

    if (!token || !userId || !vendorId) {
      message.error("Token, User ID, or Vendor ID is missing.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const formData = {
        submit: isChecked ? "yes" : "no", // Menyesuaikan nilai submit berdasarkan isChecked
      };

      const response = await axios.post(
        "https://vendorv2.delpis.online/api/vendor/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from API:", response.data);
      message.success("Data berhasil disubmit!");
    } catch (error) {
      console.error("Gagal men-submit data:", error);
      message.error("Gagal men-submit data. Silakan coba lagi.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleCheckboxChange = (e: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIsChecked(e.target.checked); // Mengubah nilai isChecked berdasarkan status Checkbox
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Dokumen
      </Button>
      <Modal
        title="Tambah Dokumen"
        open={isModalVisible} // Gunakan visible bukan open untuk modal
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
            label="Nama Dokumen"
            rules={[{ required: true, message: "Dokumen tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Kategori Dokumen"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.category}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="document"
            label="File"
            rules={[{ required: true, message: "File attachment is required" }]}
          >
            <input type="file"
              {...uploadProps}

            ></input>
          </Form.Item>
          <Form.Item
            name="expiration_date"
            label="Masa Berlaku Dokumen"
            rules={[
              { required: true, message: "expiration date tidak boleh kosong" },
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              value={
                formik.values.expiration_date
                  ? dayjs(formik.values.expiration_date, "YYYY-MM-DD")
                  : null
              }
              onChange={(date) =>
                formik.setFieldValue(
                  "expiration_date",
                  date ? date.format("YYYY-MM-DD") : "",
                )
              }
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
          dataSource={attachmentDoc}
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
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="flex gap-3 w-[40rem] items-center">
          <Checkbox onChange={handleCheckboxChange}></Checkbox>
          <p className="text-center">Anda setuju bahwa Data yang Anda Masukkan telah benar, jika terdapat
            kekeliruan maka proses akan berlangsung sesuai dengan hukum yang berlaku.
          </p>
        </div>
        <Button
          type="primary"
          onClick={handleSubmitAll}
          loading={loadingSubmit}
          disabled={!isChecked}
          className="mt-5"
        >
          Submit All
        </Button>
      </div>
    </div>
  );
};

export default AttachmentDocument;