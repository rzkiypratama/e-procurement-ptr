import React, { useState, useEffect } from "react";
import { Table, Button, Form, Input, InputNumber, DatePicker, Typography, Popconfirm, Modal } from "antd";
import dayjs from "dayjs";
import useSPTStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";

const { TextArea } = Input;

interface SPTTahunan {
    id: number;
    tahunSpt: number;
    nomorSPT: number;
    tanggalSpt: string;
  }

const SPTTahunan: React.FC = () => {
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

  const formik = useFormik({
    initialValues: {
      tahunSpt: 0,
      nomorSPT: 0,
      tanggalSpt: "",
    },
    onSubmit: (values) => {
      console.log("SPT Value:", values);
      addSPTTahunan({ ...values, id: sptTahunan.length + 1 });
      setIsModalVisible(false);
      formik.resetForm();
    },
  });

  useEffect(() => {
    const initialData: SPTTahunan[] = [];
    initializeSPTTahunan(initialData);
  }, [initializeSPTTahunan]);

  const isEditing = (record: SPTTahunan) => record.id.toString() === editingKey;

  const edit = (record: Partial<SPTTahunan> & { id: React.Key }) => {
    form.setFieldsValue({
      ...record,
      tanggalSpt: record.tanggalSpt ? dayjs(record.tanggalSpt, "DD-MM-YYYY") : null,
    });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as SPTTahunan;
      const updatedRow = {
        ...row,
        id: Number(id),
        tanggalSpt: dayjs(row.tanggalSpt).format("DD-MM-YYYY"),
      };
      editSPTTahunan(updatedRow);
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeSPTTahunan(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Tahun Izin",
      dataIndex: "tahunIzinSpt",
      key: "tahunIzinSpt",
      editable: true,
    },
    {
      title: "Nomor Izin",
      dataIndex: "nomorSpt",
      key: "nomorSpt",
      editable: true,
    },
    {
      title: "Tahun Dokumen",
      dataIndex: "tahunSpt",
      key: "tahunSpt",
      editable: true,
      render: (text: string) => (text ? dayjs(text, "DD-MM-YYYY").format("DD-MM-YYYY") : ""),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: SPTTahunan) => {
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
      onCell: (record: SPTTahunan) => ({
        record,
        inputType: col.dataIndex === "tahunSpt" ? "date" : col.dataIndex.includes("tahunSpt") ? "date" : col.dataIndex === "tahunIzinSpt" ? "number" : "text",
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
    addSPTTahunan({ ...formik.values, id: sptTahunan.length + 1 });
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    console.log("Submitting data:", sptTahunan);
    // Additional submission logic if needed
  };

  return (
    <div>
    <Button type="primary" onClick={showModal}>
      Tambah SPT
    </Button>
    <Modal title="Tambah SPT" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
      <Form form={form}>
        <Form.Item name="tahunIzinSpt" label="Tahun Izin" rules={[{ required: true }]}>
          <Input
            value={formik.values.tahunSpt}
            onChange={(e) => formik.setFieldValue("tahunIzinSpt", e.target.value)}
          />
        </Form.Item>
        <Form.Item name="nomorSpt" label="Nomor Izin" rules={[{ required: true }]}>
          <InputNumber
            value={formik.values.nomorSPT}
            onChange={(value) => formik.setFieldValue("nomorSpt", value)}
          />
        </Form.Item>
        <Form.Item name="tahunSpt" label="Tanggal Dokumen" rules={[{ required: true }]}>
          <DatePicker
            value={formik.values.tanggalSpt ? dayjs(formik.values.tanggalSpt, "DD-MM-YYYY") : null}
            format="DD-MM-YYYY"
            onChange={(date, dateString) => formik.setFieldValue("tanggalSpt", dateString)}
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

export default SPTTahunan;