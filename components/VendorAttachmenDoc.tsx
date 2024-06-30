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
import { UploadOutlined } from "@ant-design/icons";
import LandasanHukum from "./VendorLandasanHukum2";
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
}

const AttachmentDocument: React.FC = () => {
  const {
    attachmentDoc,
    pengurusPerusahaan,
    landasanHukum,
    izinUsaha,
    pengalaman,
    sptTahunan,
    tenagaAhli,
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

  const [tableKey, setTableKey] = useState(0);
  
  const formik = useFormik({
    initialValues: {
      name: "",
      document: "",
      category: "",
      expiration_date: "",
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
        const formData = new FormData();
        formData.append("document", values.document); // Menggunakan originFileObj untuk file asli
        formData.append("name", values.name);
        formData.append("category", values.category);
        formData.append("expiration_date", values.expiration_date);
    
        const response = await axios.post(
          "https://vendor.eproc.latansa.sch.id/api/vendor/attachment",
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
        formik.resetForm();
      } catch (error) {
        console.error("Gagal menambahkan dokumen:", error);
        message.error("Gagal menambahkan dokumen. Silakan coba lagi.");
      }
    },
  });

  // ini untuk get dengan type data array of object
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");
  
        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }
  
        const response = await axios.get(
          "https://vendor.eproc.latansa.sch.id/api/vendor/attachment",
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
      }
    };
  
    fetchBankAccounts();
  }, [initializeAttachment]);

  const isEditing = (record: AttachmentDoc) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<AttachmentDoc> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
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
        tanggalLahirTenagaAhli: dayjs(row.expiration_date).format(
          "DD-MM-YYYY",
        ),
      };
      editAttachment({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeAttachment(Number(id));
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
      formik.setFieldValue("document", info.file.originFileObj);
      formik.setFieldValue("documentname", info.file.name); 
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    onChange: handleFileChange,
    beforeUpload: (file: File) => {
      const isSupportedFormat =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/jpg" ||
        file.type === "application/pdf";
  
      if (!isSupportedFormat) {
        message.error("Hanya file JPEG, JPG, PNG, atau PDF yang diizinkan!");
        return Upload.LIST_IGNORE;
      }
  
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("File must smaller than 2MB!");
        return Upload.LIST_IGNORE;
      }
  
      return isSupportedFormat && isLt2M;
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
      dataIndex: "document",
      key: "document",
    },
    {
      title: "Masa Berlaku Dokumen",
      dataIndex: "expiration_date",
      key: "expiration_date",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
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

  // const handleSubmitAll = async () => {
  //   const token = getCookie("token");
  //   const userId = getCookie("user_id");
  //   const vendorId = getCookie("vendor_id");
  
  //   if (!token || !userId || !vendorId) {
  //     message.error("Token, User ID, or Vendor ID is missing.");
  //     return;
  //   }
  
  //   try {
  //     setLoadingSubmit(true); // Mengatur state loading sebelum memulai request
  //     await axios.post(
  //       "https://vendor.eproc.latansa.sch.id/api/vendor/submit",
  //       { status: "yes" },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "User-ID": userId,
  //           "Vendor-ID": vendorId,
  //         },
  //       }
  //     );
  
  //     message.success("Status berhasil diperbarui.");
  //   } catch (error) {
  //     console.error("Gagal memperbarui status:", error);
  //     message.error("Gagal memperbarui status. Silakan coba lagi.");
  //   } finally {
  //     setLoadingSubmit(false); // Mengatur state loading setelah request selesai
  //   }
  // };

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
        "https://vendor.eproc.latansa.sch.id/api/vendor/submit",
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
        onOk={handleOk}
        onCancel={handleCancel}
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
            <Upload 
            {...uploadProps} >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            name="expiration_date"
            label="Tanggal Lahir"
            rules={[
              { required: true, message: "Tanggal Lahir tidak boleh kosong" },
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              value={
                formik.values.expiration_date
                  ? dayjs(formik.values.expiration_date, "DD-MM-YYYY")
                  : null
              }
              onChange={(date) =>
                formik.setFieldValue(
                  "expiration_date",
                  date ? date.format("DD-MM-YYYY") : "",
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
        />
       <p>Apa kamu yakin?</p>
      <Checkbox onChange={handleCheckboxChange}></Checkbox>
      <Button
        type="primary"
        onClick={handleSubmitAll}
        loading={loadingSubmit}
        disabled={!isChecked}
        style={{ marginLeft: 8 }}
      >
        Submit All
      </Button>
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default AttachmentDocument;