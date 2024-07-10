import React, { useState } from "react";
import { Button, Form, Input, DatePicker, message, List, Typography, Popconfirm, Select } from "antd";
import dayjs from "dayjs";
import useGeneralInformationStore from "../store/CenterStore";
import { useFormik } from "formik";

const { Option } = Select;

interface GeneralInformation {
    id: number;
    nama_paket: string;
    satuan_kerja: string;
    tahun_anggaran: string;
    produk_dalam_negeri: string;
    sumber_dana: string;
    total_pagu: string;
    nilai_hps: string;
    capex_opex: string;
  }

const SPTTahunanPage: React.FC = () => {
  const { generalInformation, addGeneralInformation, editGeneralInformation, removeGeneralInformation, initializeGeneralInformation } = useGeneralInformationStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
        nama_paket: "",
        satuan_kerja: "",
        tahun_anggaran: "",
        produk_dalam_negeri: "",
        sumber_dana: "",
        total_pagu: "",
        nilai_hps: "",
        capex_opex: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editGeneralInformation(updatedData);
        message.success("SPT updated successfully");
      } else {
        // const newData = { ...values, id: generalInformation.length + 1 };
        // addGeneralInformation(newData);
        message.success("SPT added successfully");
      }
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  const handleEdit = (record: GeneralInformation) => {
    formik.setValues(record);
    setIsEditMode(true);
    setEditingId(record.id);
  };

  const handleDelete = (id: number) => {
    removeGeneralInformation(id);
    message.success("SPT deleted successfully");
  };

  return (
    <div>
      <Form form={form} onFinish={formik.handleSubmit} layout="vertical">
        <Form.Item
          name="nama_paket"
          label="Nama Paket"
          rules={[{ required: true, message: "Nama Paket harus diisi" }]}
        >
          <Input
            value={formik.values.nama_paket}
            onChange={(e) => formik.setFieldValue("nama_paket", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="satuan_kerja"
          label="Satuan Kerja"
          rules={[{ required: true, message: "Satuan Kerja harus diisi" }]}
        >
          <Input
            value={formik.values.satuan_kerja}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="tahun_anggaran"
          label="Tahun Anggaran"
          rules={[{ required: true, message: "Tahun Anggaran harus diisi" }]}
        >
          <Input
            value={formik.values.tahun_anggaran}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="produk_dalam_negeri"
          label="Produk Dalam Negeri"
          rules={[{ required: true, message: "Produk Dalam Negeri harus diisi" }]}
        >
          <Input
            value={formik.values.produk_dalam_negeri}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="sumber_dana"
          label="Sumber Dana"
          rules={[{ required: true, message: "Sumber Dana harus diisi" }]}
        >
          <Input
            value={formik.values.sumber_dana}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="total_pagu"
          label="Total Pagu"
          rules={[{ required: true, message: "Total Pagu harus diisi" }]}
        >
          <Input
            value={formik.values.total_pagu}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="nilai_hps"
          label="Nilai HPS"
          rules={[{ required: true, message: "Nilai HPS harus diisi" }]}
        >
          <Input
            value={formik.values.nilai_hps}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
        name="capex_opex"
        label="Opex / Capex"
        rules={[{ required: true, message: "Nilai Opex Capex harus diisi" }]}
        >
        <Select
              id="capex_opex"
              onChange={(value) => formik.setFieldValue("capex_opex", value)}
              onBlur={formik.handleBlur}
              value={formik.values.capex_opex}
            >
              <Option value="Opex">Opex</Option>
              <Option value="Capex">Capex</Option>
            </Select>
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={isLoading}>
          {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
        </Button>
      </Form>
    </div>
  );
};

export default SPTTahunanPage;