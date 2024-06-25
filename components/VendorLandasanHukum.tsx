import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  Popconfirm,
  Modal,
} from "antd";
import useLandasanHukumStore from "../store/landasanHukumStore";
import EditableCell from "./EditableCell";

const { TextArea } = Input;

interface LandasanHukum {
  id: number;
  nomor: string;
  tanggal: string;
  tentang: string;
}

const LandasanHukum: React.FC = () => {
  const {
    landasanHukum,
    addLandasanHukum,
    editLandasanHukum,
    removeLandasanHukum,
    initializeLandasanHukum,
  } = useLandasanHukumStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");

  useEffect(() => {
    // Initialize data if needed
    const initialData: LandasanHukum[] = []; // Load your initial data here
    initializeLandasanHukum(initialData);
  }, [initializeLandasanHukum]);

  const isEditing = (record: LandasanHukum) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<LandasanHukum> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as LandasanHukum;
      editLandasanHukum({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    { title: "Nomor", dataIndex: "nomor", key: "nomor", editable: true },
    {
      title: "Tanggal Dokumen",
      dataIndex: "tanggal",
      key: "tanggal",
      editable: true,
      render: (text: string) =>
      new Date(text).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    {
      title: "Nama Notaris",
      dataIndex: "tentang",
      key: "tentang",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: LandasanHukum) => {
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
      onCell: (record: LandasanHukum) => ({
        record,
        inputType: col.dataIndex === "tanggal" ? "date" : "text",
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
      addLandasanHukum({ ...values, id: landasanHukum.length + 1 });
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
        Tambah Landasan Hukum
      </Button>
      <Modal
        title="Tambah Landasan Hukum"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nomor" label="Nomor" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="tanggal"
            label="Tanggal"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            name="tentang"
            label="Tentang"
            rules={[{ required: true }]}
          >
            <TextArea rows={4} />
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
          dataSource={landasanHukum}
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

export default LandasanHukum;
