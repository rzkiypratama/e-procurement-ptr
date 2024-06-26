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
import useTenagaAhliStore from "../store/tenagaAhliStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";

const { TextArea } = Input;

interface TenagaAhli {
  id: number;
  namaTenagaAhli: string;
  tanggalLahirTenagaAhli: string;
  nomorKtpTenagaAhli: number;
  npwpTenagaAhli: number;
  pendidikanTenagaAhli: string;
  pengalamanTenagaAhli: string;
}

const TenagaAhli: React.FC = () => {
  const {
    tenagaAhli,
    addTenagaAhli,
    editTenagaAhli,
    removeTenagaAhli,
    initializeTenagaAhli,
  } = useTenagaAhliStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");

  const formik = useFormik({
    initialValues: {
      namaTenagaAhli: "",
      tanggalLahirTenagaAhli: "",
      nomorKtpTenagaAhli: 0,
      npwpTenagaAhli: 0,
      pendidikanTenagaAhli: "",
      pengalamanTenagaAhli: "",
    },
    onSubmit: (values) => {
      console.log("Tenaga Ahli Value:", values);
      addTenagaAhli({ ...values, id: tenagaAhli.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    const initialData: TenagaAhli[] = [];
    initializeTenagaAhli(initialData);
  }, [initializeTenagaAhli]);

  const isEditing = (record: TenagaAhli) => record.id.toString() === editingKey;

  const edit = (record: Partial<TenagaAhli> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      tanggalLahirTenagaAhli: record.tanggalLahirTenagaAhli
        ? dayjs(record.tanggalLahirTenagaAhli, "DD-MM-YYYY")
        : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as TenagaAhli;
      const updatedRow = {
        ...row,
        id: Number(id),
        tanggalLahirTenagaAhli: dayjs(row.tanggalLahirTenagaAhli).format(
          "DD-MM-YYYY",
        ),
      };
      editTenagaAhli(updatedRow);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeTenagaAhli(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama",
      dataIndex: "namaTenagaAhli",
      key: "namaTenagaAhli",
      editable: true,
    },
    {
      title: "Tanggal Lahir",
      dataIndex: "tanggalLahirTenagaAhli",
      key: "tanggalLahirTenagaAhli",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
    },
    {
      title: "Nomor KTP",
      dataIndex: "nomorKtpTenagaAhli",
      key: "nomorKtpTenagaAhli",
      editable: true,
    },
    {
      title: "Nomor NPWP",
      dataIndex: "npwpTenagaAhli",
      key: "npwpTenagaAhli",
      editable: true,
    },
    {
      title: "Pendidikan Terakhir",
      dataIndex: "pendidikanTenagaAhli",
      key: "pendidikanTenagaAhli",
      editable: true,
    },
    {
      title: "Pengalaman Terakhir",
      dataIndex: "pengalamanTenagaAhli",
      key: "pengalamanTenagaAhli",
      editable: true,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: TenagaAhli) => {
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
      onCell: (record: TenagaAhli) => ({
        record,
        inputType:
          col.dataIndex === "tanggalLahirTenagaAhli"
            ? "date"
            : col.dataIndex === "nomorKtpTenagaAhli" ||
              col.dataIndex === "npwpTenagaAhli"
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
    addTenagaAhli({ ...formik.values, id: tenagaAhli.length + 1 });
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", tenagaAhli);
    // Additional submission logic if needed
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Tenaga Ahli
      </Button>
      <Modal
        title="Tambah Tenaga Ahli"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="namaTenagaAhli"
            label="Nama"
            rules={[{ required: true, message: "Nama tidak boleh kosong" }]}
          >
            <Input
              name="namaTenagaAhli"
              value={formik.values.namaTenagaAhli}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="tanggalLahirTenagaAhli"
            label="Tanggal Lahir"
            rules={[
              { required: true, message: "Tanggal Lahir tidak boleh kosong" },
            ]}
          >
            <DatePicker
              format="DD-MM-YYYY"
              value={
                formik.values.tanggalLahirTenagaAhli
                  ? dayjs(formik.values.tanggalLahirTenagaAhli, "DD-MM-YYYY")
                  : null
              }
              onChange={(date) =>
                formik.setFieldValue(
                  "tanggalLahirTenagaAhli",
                  date ? date.format("DD-MM-YYYY") : "",
                )
              }
            />
          </Form.Item>
          <Form.Item
            name="nomorKtpTenagaAhli"
            label="Nomor KTP"
            rules={[
              { required: true, message: "Nomor KTP harus berupa angka" },
            ]}
          >
            <InputNumber
              name="nomorKtpTenagaAhli"
              value={formik.values.nomorKtpTenagaAhli}
              onChange={(value) =>
                formik.setFieldValue("nomorKtpTenagaAhli", value)
              }
            />
          </Form.Item>
          <Form.Item
            name="npwpTenagaAhli"
            label="Nomor NPWP"
            rules={[
              { required: true, message: "Nomor NPWP harus berupa angka" },
            ]}
          >
            <InputNumber
              name="npwpTenagaAhli"
              value={formik.values.nomorKtpTenagaAhli}
              onChange={(value) =>
                formik.setFieldValue("npwpTenagaAhli", value)
              }
            />
          </Form.Item>
          <Form.Item
            name="pendidikanTenagaAhli"
            label="Pendidikan Terakhir"
            rules={[{ required: true, message: "Pendidikan tidak boleh kosong" }]}
          >
            <Input
              name="pendidikanTenagaAhli"
              value={formik.values.pendidikanTenagaAhli}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="pengalamanTenagaAhli"
            label="Pengalaman Terakhir"
            rules={[{ required: true, message: "Pengalaman tidak boleh kosong" }]}
          >
            <Input
              name="pengalamanTenagaAhli"
              value={formik.values.pengalamanTenagaAhli}
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
          dataSource={tenagaAhli}
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

export default TenagaAhli;
