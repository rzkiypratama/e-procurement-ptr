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
  message,
} from "antd";
import useAttachmentStore from "../store/attachmenDocStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { UploadOutlined } from "@ant-design/icons";

const { TextArea } = Input;

interface AttachmentDoc {
  id: number;
  namaAttachment: string;
  kategoriAttachment: string;
  fileAttachment: any; // Ubah menjadi any karena akan menampung informasi file
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

  const formik = useFormik({
    initialValues: {
      namaAttachment: "",
      kategoriAttachment: "",
      fileAttachment: "", // Inisialisasi dengan string kosong, bisa diubah sesuai kebutuhan
    },
    onSubmit: (values) => {
      console.log("Pengurus Value:", values);
      addAttachment({ ...values, id: attachmentDoc.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    // Initialize data if needed
    const initialData: AttachmentDoc[] = []; // Load your initial data here
    initializeAttachment(initialData);
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
      editAttachment({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeAttachment(Number(id));
  };

  // Fungsi untuk menangani perubahan file
  const handleFileChange = (info: any) => {
    console.log("File Info:", info);
    // Dapatkan nama file dari informasi file yang diunggah
    const { name } = info.file;
    formik.setFieldValue("fileAttachment", name); // Atur nilai fileAttachment dengan nama file
  };

  // Konfigurasi untuk komponen Upload
  const uploadProps = {
    name: "file",
    multiple: false,
    onChange: handleFileChange,
    beforeUpload: () => false, // Menonaktifkan perilaku upload default
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Dokumen",
      dataIndex: "namaAttachment",
      key: "namaAttachment",
      editable: true,
    },
    {
      title: "Kategori Dokumen",
      dataIndex: "kategoriAttachment",
      key: "kategoriAttachment",
      editable: true,
    },
    {
      title: "Dokumen",
      dataIndex: "fileAttachment",
      key: "fileAttachment",
      render: (text: any, record: AttachmentDoc) => (
        <span>{record.fileAttachment}</span> // Menampilkan nama file
      ),
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
          col.dataIndex === "noKTP" || col.dataIndex === "npwp"
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
      id: attachmentDoc.length + 1,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", attachmentDoc);
    // Additional submission logic if needed
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Dokumen
      </Button>
      <Modal
        title="Tambah Dokumen"
        visible={isModalVisible} // Gunakan visible bukan open untuk modal
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="namaAttachment"
            label="Nama Dokumen"
            rules={[{ required: true, message: "Dokumen tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.namaAttachment}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="kategoriAttachment"
            label="Kategori Dokumen"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.kategoriAttachment}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="fileAttachment"
            label="File"
            rules={[{ required: true, message: "File attachment is required" }]}
          >
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
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
          dataSource={attachmentDoc}
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

export default AttachmentDocument;