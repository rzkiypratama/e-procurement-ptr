import React, { useState } from "react";
import { Button, Form, Input, DatePicker, message, List, Typography, Popconfirm, Select } from "antd";
import dayjs from "dayjs";
import useGeneralInformationStore from "../store/CenterStore";
import { useFormik } from "formik";

const { Option } = Select;

interface GeneralInformation {
  id: number;
  procurement_type: string;
  package_name: string;
  work_unit: string;
  year: string;
  product_local: string;
  sources_of_funds: string;
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
      procurement_type: "",
      package_name: "",
      work_unit: "",
      year: "",
      product_local: "",
      sources_of_funds: "",
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
          name="procurement_type"
          label="Jenis Pengadaan"
          rules={[{ required: true, message: "Jenis Pengadaan harus diisi" }]}>
          <Input
            name="procurement_type"
            value={formik.values.procurement_type}
            onChange={(e) => formik.setFieldValue("procurement_type", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="package_name"
          label="Nama Paket"
          rules={[{ required: true, message: "Nama Paket harus diisi" }]}>
          <Input
            name="package_name"
            value={formik.values.package_name}
            onChange={(e) => formik.setFieldValue("nama_paket", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="work_unit"
          label="Satuan Kerja"
          rules={[{ required: true, message: "Satuan Kerja harus diisi" }]}
        >
          <Input
            name="work_unit"
            value={formik.values.work_unit}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="year"
          label="Tahun Anggaran"
          rules={[{ required: true, message: "Tahun Anggaran harus diisi" }]}
        >
          <DatePicker.YearPicker name="year" value={formik.values.year}
            onChange={(date, dateString) => {
              formik.setFieldValue("year", dateString)
            }
            } style={{ width: '100%' }} placement="topLeft" />
        </Form.Item>
        <Form.Item
          name="product_local"
          label="Produk Dalam Negeri"
          rules={[{ required: true, message: "Produk Dalam Negeri harus diisi" }]}
        >
          <Input
            name="product_local"
            value={formik.values.product_local}
            onChange={formik.handleChange}
          />
        </Form.Item>
        <Form.Item
          name="sources_of_funds"
          label="Sumber Dana"
          rules={[{ required: true, message: "Sumber Dana harus diisi" }]}
        >
          <Input
            name="sources_of_funds"
            value={formik.values.sources_of_funds}
            onChange={formik.handleChange}
          />
        </Form.Item>
        {/* <Form.Item
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
        </Form.Item> */}
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