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
} from "antd";
import { id } from "date-fns/locale";
import useSPTStore from "../store/sptStore";
import EditableCell from "./EditableCell";

const { TextArea } = Input;

interface SPTTahunan {
  id: number;
  tahun: number;
  nomorSPT: number;
  tanggal: string;
}

const SptUsaha: React.FC = () => {
  const {
    sptTahunan,
    addSPTTahunan,
    editSPTTahunan,
    removeSPTTahunan,
    initializeSPTTahunan,
  } = useSPTStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");

  useEffect(() => {
    // Initialize data if needed
    const initialData: SPTTahunan[] = []; // Load your initial data here
    initializeSPTTahunan(initialData);
  }, [initializeSPTTahunan]);

  const isEditing = (record: SPTTahunan) => record.id.toString() === editingKey;

  const edit = (record: Partial<SPTTahunan> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as SPTTahunan;
      editSPTTahunan({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Tahun",
      dataIndex: "tahunSpt",
      key: "tahunSpt",
      editable: true,
    },
    {
      title: "Nomor Izin",
      dataIndex: "nomorSpt",
      key: "nomorSpt",
      editable: true,
    },
    {
      title: "Tanggal Izin",
      dataIndex: "tanggalSpt",
      key: "tanggalSpt",
      editable: true,
      render: (text: string) =>
      new Date(text).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: SPTTahunan) => {
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
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            Edit
          </Typography.Link>
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
      onCell: (record: SPTTahunan) => ({
        record,
        inputType:
          col.dataIndex === "nomorSpt"
            ? "number"
            : col.dataIndex.includes("tanggal")
              ? "date"
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
    form.validateFields().then((values) => {
      addSPTTahunan({ ...values, id: sptTahunan.length + 1 });
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah SPT
      </Button>
      <Modal
        title="Tambah SPT"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tahunSpt"
            label="Jenis Izin"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nomorSpt"
            label="Nomor Izin"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="tanggalSpt"
            label="Tanggal Izin"
            rules={[{ required: true }]}
          >
            <DatePicker />
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
          dataSource={sptTahunan}
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

export default SptUsaha;
