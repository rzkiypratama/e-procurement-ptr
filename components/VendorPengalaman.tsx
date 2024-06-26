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
} from "antd";
import usePengalamanStore from "../store/pengalamanStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";

const { TextArea } = Input;

interface Pengalaman {
    id: number;
    namaPekerjaan: string;
    bidangPekerjaan: string;
    lokasiPekerjaan: string;
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

  const formik = useFormik({
    initialValues: {
        namaPekerjaan: "",
        bidangPekerjaan: "",
        lokasiPekerjaan: "",
    },
    onSubmit: (values) => {
      console.log("Pengurus Value:", values);
      addPengalaman({ ...values, id: pengalaman.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    // Initialize data if needed
    const initialData: Pengalaman[] = []; // Load your initial data here
    initializePengalaman(initialData);
  }, [initializePengalaman]);

  const isEditing = (record: Pengalaman) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<Pengalaman> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as Pengalaman;
      editPengalaman({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removePengalaman(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    { title: "Nama Pekerjaan", dataIndex: "namaPekerjaan", key: "namaPekerjaan", editable: true },
    { title: "Bidang Pekerjaan", dataIndex: "bidangPekerjaan", key: "bidangPekerjaan", editable: true },
    { title: "Lokasi Pekerjaan", dataIndex: "lokasiPekerjaan", key: "lokasiPekerjaan", editable: true },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: Pengalaman) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link disabled={editingKey !== ""} onClick={() => edit(record)} style={{ marginRight: 8 }}>
              Edit
            </Typography.Link>
            <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
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
      onCell: (record: Pengalaman) => ({
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
    addPengalaman({
      ...formik.values,
      id: pengalaman.length + 1,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", pengalaman);
    // Additional submission logic if needed
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Pengalaman
      </Button>
      <Modal
        title="Tambah Pengalaman"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="namaPekerjaan"
            label="Nama Pekerjaan"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.namaPekerjaan}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="bidangPekerjaan"
            label="Bidang Pekerjaan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.bidangPekerjaan}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="lokasiPekerjaan"
            label="Lokasi Pekerjaan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.lokasiPekerjaan}
              onChange={formik.handleChange}
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
          dataSource={pengalaman}
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
