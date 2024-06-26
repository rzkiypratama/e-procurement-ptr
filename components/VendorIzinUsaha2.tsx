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
import dayjs from "dayjs";
import useIzinUsahaStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";

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

  const formik = useFormik({
    initialValues: {
      jenisIzin: "",
      nomorIzin: 0,
      tanggalIzin: "",
      tanggalBerakhir: "",
      instansiPemberiIzin: "",
      instansiBerlakuIzinUsaha: "",
      bidangUsaha: "",
    },
    onSubmit: (values) => {
      console.log("Izin Usaha Value:", values);
      addIzinUsaha({ ...values, id: izinUsaha.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    const initialData: IzinUsaha[] = [];
    initializeIzinUsaha(initialData);
  }, [initializeIzinUsaha]);

  const isEditing = (record: IzinUsaha) => record.id.toString() === editingKey;

  const edit = (record: Partial<IzinUsaha> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      tanggalIzin: record.tanggalIzin
        ? dayjs(record.tanggalIzin, "DD-MM-YYYY")
        : null,
      tanggalBerakhir: record.tanggalBerakhir
        ? dayjs(record.tanggalBerakhir, "DD-MM-YYYY")
        : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as IzinUsaha;
      const updatedRow = {
        ...row,
        id: Number(id),
        tanggalIzin: dayjs(row.tanggalIzin).format("DD-MM-YYYY"),
        tanggalBerakhir: dayjs(row.tanggalBerakhir).format("DD-MM-YYYY"),
      };
      editIzinUsaha(updatedRow);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeIzinUsaha(Number(id));
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
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
    },
    {
      title: "Tanggal Berakhir",
      dataIndex: "tanggalBerakhir",
      key: "tanggalBerakhir",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
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
      onCell: (record: IzinUsaha) => ({
        record,
        inputType:
        col.dataIndex === "nomorIzin" ? "number" :
        col.dataIndex === "tanggalIzin" || col.dataIndex.includes("tanggalIzin") ? "date" :
        col.dataIndex === "tanggalBerakhir" || col.dataIndex.includes("tanggalBerakhir") ? "date" :
        "text",
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
    addIzinUsaha({ ...formik.values, id: izinUsaha.length + 1 });
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", izinUsaha);
    // Additional submission logic if needed
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Izin Usaha
      </Button>
      <Modal
        title="Tambah Landasan Hukum"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
        <Form.Item
            name="jenisIzin"
            label="Jenis Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="jenisIzin"
              value={formik.values.jenisIzin}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="nomorIzin"
            label="Nomor Izin"
            rules={[{ required: true }]}
          >
            <InputNumber
              name="nomorIzin"
              value={formik.values.nomorIzin}
              onChange={(value) => formik.setFieldValue("nomorIzin", value)}
            />
          </Form.Item>
          <Form.Item
            name="tanggalIzin"
            label="Tanggal Izin"
            rules={[{ required: true }]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              name="tanggalIzin"
              onChange={(date, dateString) =>
                formik.setFieldValue("tanggalIzin", dateString)
              }
            />
          </Form.Item>
          <Form.Item
            name="tanggalBerakhir"
            label="Tanggal Berakhir"
            rules={[{ required: true }]}
          >
            <DatePicker
              name="tanggalBerakhir"
              format="DD-MM-YYYY"
              onChange={(date, dateString) =>
                formik.setFieldValue("tanggalBerakhir", dateString)
              }
            />
          </Form.Item>
          <Form.Item
            name="instansiPemberiIzin"
            label="Instansi Pemberi Izin"
            rules={[{ required: true }]}
          >
            <Input
              name="instansiPemberiIzin"
              value={formik.values.instansiPemberiIzin}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="instansiBerlakuIzinUsaha"
            label="Masa Berlaku Izin Usaha"
            rules={[{ required: true }]}
          >
            <Input
              name="instansiBerlakuIzinUsaha"
              value={formik.values.instansiBerlakuIzinUsaha}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="bidangUsaha"
            label="Bidang Usaha"
            rules={[{ required: true }]}
          >
            <TextArea
              name="bidangUsaha"
              value={formik.values.bidangUsaha}
              onChange={formik.handleChange}
              rows={4}
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
          dataSource={izinUsaha}
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

export default IzinUsaha;
