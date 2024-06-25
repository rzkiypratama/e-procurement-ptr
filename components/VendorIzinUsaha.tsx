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
import useIzinUsahaStore from "../store/izinUsahaStore";
import EditableCell from "./EditableCell";

const { TextArea } = Input;

interface IzinUsaha {
  id: number;
  jenisIzin: string;
  nomorIzin: number;
  tanggalIzin: string;
  tanggalBerakhir: string;
  instansiPemberiIzin: string;
  instansiBerlakuIzinUsaha: string;
  bidangUsaha: string;
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

  useEffect(() => {
    // Initialize data if needed
    const initialData: IzinUsaha[] = []; // Load your initial data here
    initializeIzinUsaha(initialData);
  }, [initializeIzinUsaha]);

  const isEditing = (record: IzinUsaha) => record.id.toString() === editingKey;

  const edit = (record: Partial<IzinUsaha> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as IzinUsaha;
      editIzinUsaha({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Jenis Izin",
      dataIndex: "jenisIzin",
      key: "jenisIzin",
      editable: true,
    },
    {
      title: "Nomor Izin",
      dataIndex: "nomorIzin",
      key: "nomorIzin",
      editable: true,
    },
    {
      title: "Tanggal Izin",
      dataIndex: "tanggalIzin",
      key: "tanggalIzin",
      editable: true,
      render: (text: string) =>
      new Date(text).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    {
      title: "Tanggal Berakhir",
      dataIndex: "tanggalBerakhir",
      key: "tanggalBerakhir",
      editable: true,
      render: (text: string) =>
      new Date(text).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    {
      title: "Instansi Pemberi Izin",
      dataIndex: "instansiPemberiIzin",
      key: "instansiPemberiIzin",
      editable: true,
    },
    {
      title: "Masa Berlaku Izin Usaha",
      dataIndex: "instansiBerlakuIzinUsaha",
      key: "instansiBerlakuIzinUsaha",
      editable: true,
    },
    {
      title: "Bidang Usaha",
      dataIndex: "bidangUsaha",
      key: "bidangUsaha",
      editable: true,
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
      onCell: (record: IzinUsaha) => ({
        record,
        inputType:
          col.dataIndex === "nomorIzin"
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
      addIzinUsaha({ ...values, id: izinUsaha.length + 1 });
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
        Tambah Izin Usaha
      </Button>
      <Modal
        title="Tambah Izin Usaha"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="jenisIzin"
            label="Jenis Izin"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nomorIzin"
            label="Nomor Izin"
            rules={[{ required: true }]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item
            name="tanggalIzin"
            label="Tanggal Izin"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="tanggalBerakhir"
            label="Tanggal Berakhir"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="instansiPemberiIzin"
            label="Instansi Pemberi Izin"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="instansiBerlakuIzinUsaha"
            label="Masa Berlaku Izin Usaha"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bidangUsaha"
            label="Bidang Usaha"
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
          dataSource={izinUsaha}
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

export default IzinUsaha;
