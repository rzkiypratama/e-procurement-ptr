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
import usePengurusPerusahaanStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";

const { TextArea } = Input;
interface PengurusPerusahaan {
  id: number;
  namaPengurus: string;
  jabatanPengurus: string;
  noKTPPengurus: number;
  npwpPengurus: number;
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

  const formik = useFormik({
    initialValues: {
      namaPengurus: "",
      jabatanPengurus: "",
      noKTPPengurus: 0,
      npwpPengurus: 0,
    },
    onSubmit: (values) => {
      console.log("Pengurus Value:", values);
      addPengurusPerusahaan({ ...values, id: pengurusPerusahaan.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    // Initialize data if needed
    const initialData: PengurusPerusahaan[] = []; // Load your initial data here
    initializePengurusPerusahaan(initialData);
  }, [initializePengurusPerusahaan]);

  const isEditing = (record: PengurusPerusahaan) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<PengurusPerusahaan> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as PengurusPerusahaan;
      editPengurusPerusahaan({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removePengurusPerusahaan(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    { title: "Nama", dataIndex: "namaPengurus", key: "namaPengurus", editable: true },
    { title: "Jabatan", dataIndex: "jabatanPengurus", key: "jabatanPengurus", editable: true },
    { title: "No KTP", dataIndex: "noKTPPengurus", key: "noKTPPengurus", editable: true },
    { title: "NPWP", dataIndex: "npwpPengurus", key: "npwpPengurus", editable: true },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: PengurusPerusahaan) => {
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
      onCell: (record: PengurusPerusahaan) => ({
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
    addPengurusPerusahaan({
      ...formik.values,
      id: pengurusPerusahaan.length + 1,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", pengurusPerusahaan);
    // Additional submission logic if needed
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Pengurus Perusahaan
      </Button>
      <Modal
        title="Tambah Pengurus Perusahaan"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="namaPengurus"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.namaPengurus}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="jabatanPengurus"
            label="Jabatan"
            rules={[{ required: true, message: "Jabatan tidak boleh kosong" }]}
          >
            <Input
              value={formik.values.jabatanPengurus}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="noKTPPengurus"
            label="No KTP"
            rules={[{ required: true, message: "KTP harus berupa angka" }]}
          >
            <InputNumber
              value={formik.values.noKTPPengurus}
              onChange={(value) => formik.setFieldValue("noKTPPengurus", value)}
            />
          </Form.Item>
          <Form.Item
            name="npwpPengurus"
            label="NPWP"
            rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <InputNumber
              value={formik.values.npwpPengurus}
              onChange={(value) => formik.setFieldValue("npwpPengurus", value)}
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
        />
      </Form>
    </div>
  );
};

export default PengurusPerusahaan;
