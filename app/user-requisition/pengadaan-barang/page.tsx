"use client";
import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Typography,
  Popconfirm,
  Modal,
  message,
} from "antd";
import dayjs from "dayjs";
import usePengadaanBarangStore from "@/store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import LayoutNew from "@/components/LayoutNew";
import VendorRegisteredList from "@/components/VendorRegisteredList";
import Link from "next/link";

const { TextArea } = Input;

interface PengadaanBarang {
    id: number;
    kode_rencana_umum_pengadaan: string;
    kode_paket_pengadaan: string;
    nama_paket: string;
    metode_pengadaan: string;
    jenis_pengadaan: string;
    hps: string;
    status_report: string;
    jenis_kontrak: string;
  }

const PengadaanBarang: React.FC = () => {
  const { pengadaanBarang, addPengadaanBarang, editPengadaanBarang, removePengadaanBarang, initializePengadaanBarang } =
    usePengadaanBarangStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
        kode_rencana_umum_pengadaan: "",
        kode_paket_pengadaan: "",
        nama_paket: "",
        metode_pengadaan: "",
        jenis_pengadaan: "",
        hps: "",
        status_report: "",
        jenis_kontrak: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editPengadaanBarang(updatedData);
        message.success("SPT updated successfully");
      } else {
        const newData = { ...values, id: pengadaanBarang.length + 1 };
        addPengadaanBarang(newData);
        message.success("SPT added successfully");
      }
      setIsModalVisible(false);
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  const isEditing = (record: PengadaanBarang) => record.id === editingId;

  const handleEdit = (record: PengadaanBarang) => {
    form.setFieldsValue({
      ...record,
    //   date: record.date ? dayjs(record.date, "YYYY-MM-DD") : null,
    });
    formik.setValues(record);
    setIsModalVisible(true);
    setIsEditMode(true);
    setEditingId(record.id);
  };

  const handleDelete = (id: number) => {
    removePengadaanBarang(id);
    message.success("SPT deleted successfully");
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    formik.resetForm();
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Kode Rencana Umum Pengadaan",
      dataIndex: "kode_rencana_umum_pengadaan",
      key: "kode_rencana_umum_pengadaan",
    },
    {
      title: "Kode Paket Pengadaan",
      dataIndex: "kode_paket_pengadaan",
      key: "kode_paket_pengadaan",
    },
    {
        title: "Nama Paket",
        dataIndex: "nama_paket",
        key: "nama_paket",
      },
      {
        title: "Metode Pengadaan",
        dataIndex: "metode_pengadaan",
        key: "metode_pengadaan",
      },
      {
        title: "Jenis Pengadaan",
        dataIndex: "jenis_pengadaan",
        key: "jenis_pengadaan",
      },
      {
        title: "HPS",
        dataIndex: "hps",
        key: "hps",
      },
      {
        title: "Status Report",
        dataIndex: "status_report",
        key: "status_report",
      },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: PengadaanBarang) => (
        <span className="flex items-center justify-center gap-5">
          <Typography.Link onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined className="text-red-500" />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <LayoutNew>
        <Link href="/user-requisition/pengadaan-barang/edit">
      <Button type="primary" className="mb-4">
        Add
      </Button>
        </Link>
      <Modal
        title={isEditMode ? "Edit SPT" : "Tambah SPT"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <>
            <Button onClick={handleCancel}>Batalkan</Button>
            <Button
              key="submit"
              type="primary"
              onClick={() => formik.handleSubmit()}
              loading={isLoading}
            >
              {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </>,
        ]}
      >
      </Modal>
      <Table
        dataSource={pengadaanBarang}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </LayoutNew>
  );
};

export default PengadaanBarang;
