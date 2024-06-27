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
import useLandasanHukumStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";

const { TextArea } = Input;

interface LandasanHukum {
  id: number;
  nomorDokumen: string;
  namaNotaris: string;
  tahunDokumen: string;
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

  const formik = useFormik({
    initialValues: {
      namaNotaris: "",
      nomorDokumen: "",
      tahunDokumen: "",
    },
    onSubmit: (values) => {
      console.log("Landasan Hukum Value:", values);
      addLandasanHukum({ ...values, id: landasanHukum.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    const initialData: LandasanHukum[] = [];
    initializeLandasanHukum(initialData);
  }, [initializeLandasanHukum]);

  const isEditing = (record: LandasanHukum) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<LandasanHukum> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      tahunDokumen: record.tahunDokumen
        ? dayjs(record.tahunDokumen, "DD-MM-YYYY")
        : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as LandasanHukum;
      const updatedRow = {
        ...row,
        id: Number(id),
        tahunDokumen: dayjs(row.tahunDokumen).format("DD-MM-YYYY"),
      };
      editLandasanHukum(updatedRow);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeLandasanHukum(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Notaris",
      dataIndex: "namaNotaris",
      key: "namaNotaris",
      editable: true,
    },
    {
      title: "Nomor Dokumen",
      dataIndex: "nomorDokumen",
      key: "nomorDokumen",
      editable: true,
    },
    {
      title: "Tahun Dokumen",
      dataIndex: "tahunDokumen",
      key: "tahunDokumen",
      editable: true,
      render: (text: string) =>
        text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : "",
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
      onCell: (record: LandasanHukum) => ({
        record,
        inputType:
                col.dataIndex === "tahunDokumen" || col.dataIndex.includes("tahunDokumen") ? "date" :
                col.dataIndex === "nomorDokumen" || col.dataIndex.includes("nomorDokumen") ? "number" :
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
    addLandasanHukum({ ...formik.values, id: landasanHukum.length + 1 });
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", landasanHukum);
    // Additional submission logic if needed
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Landasan Hukum
      </Button>
      <Modal
        title="Tambah Landasan Hukum"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item
            name="namaNotaris"
            label="Nama Notaris"
            // rules={[{ required: true }]}
          >
            <Input
              name="namaNotaris"
              value={formik.values.namaNotaris}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item
            name="nomorDokumen"
            label="Nomor Dokumen"
            // rules={[{ required: true }]}
          >
            <InputNumber
              name="nomorDokumen"
              value={formik.values.nomorDokumen}
              onChange={(value) => formik.setFieldValue("nomorDokumen", value)}
            />
          </Form.Item>
          <Form.Item
            name="tahunDokumen"
            label="Tahun Dokumen"
            // rules={[{ required: true }]}
          >
            <DatePicker
              name="tahunDokumen"
              format="DD-MM-YYYY"
              onChange={(date, dateString) =>
                formik.setFieldValue("tahunDokumen", dateString)
              }
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
          dataSource={landasanHukum}
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

export default LandasanHukum;
