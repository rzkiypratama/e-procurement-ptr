import React, { useEffect, useState } from "react";
import { Button, Form, Input, DatePicker, message, List, Typography, Popconfirm, Select, Spin } from "antd";
import dayjs from "dayjs";
import useGeneralInformationStore from "../store/CenterStore";
import { useFormik } from "formik";
import axios from "axios";
import { setCookie, getCookie } from 'cookies-next';
import formatCurrency from '@/hook/formatCurrency';

const { Option } = Select;

interface GeneralInformation {
  id: number;
  procurement_type: string;
  master_budget_id: string;
  package_name: string;
  work_unit: string;
  year: string;
  product_local: string;
  sources_of_funds: string;
  capex_opex: string;
  location: string;
  total_anggaran: string;
}

interface MasterBudgetRekening {
  id: number;
  rekening: string;
  total: string;
}

const ReqGeneralInfo: React.FC = () => {
  const { generalInformation, addGeneralInformation, editGeneralInformation, removeGeneralInformation, initializeGeneralInformation } = useGeneralInformationStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [rekeningList, setRekeningList] = useState<MasterBudgetRekening[]>([]);


  const token = getCookie("token")

  useEffect(() => {
    const requisitionId = getCookie('requisition_id')
    if (requisitionId != "" && requisitionId != undefined) {
      getGeneralInfo(requisitionId)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      master_budget_id: "",
      procurement_type: "p-barang",
      package_name: "",
      work_unit: "",
      year: "",
      product_local: "",
      sources_of_funds: "",
      capex_opex: "",
      location: "",
      total_anggaran: "",
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        const updatedData = { ...values, id: editingId };
        editGeneralInformation(updatedData);
        message.success("Procurement updated successfully");
      } else {
        console.log(values);
        setIsLoading(true);
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/general`, values, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          console.log("Response from API:", response.data);
          if (response.status == 201 || response.status == 200) {
            addGeneralInformation({ ...values, id: response.data.data.id })
            setFormSubmitted(true)
            setCookie('requisition_id', response.data.data.id)
            setIsEditMode(false);
            setEditingId(null);
            message.success(`Add Procurement successfully`)
          } else {
            message.error(`${response.data.message}`);
          }
        } catch (error) {
          message.error(`Add Procurement failed! ${error}`);
          console.error("Error submitting form:", error);
        } finally {
          setIsLoading(false);
        }
      }
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

  const getGeneralInfo = async (requisitionId: string | undefined) => {
    try {
      setIsLoadingData(true)
      setFormSubmitted(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/general/${requisitionId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        },
      )

      const data = await response.data.data[0]
      initializeGeneralInformation({ ...data })
      console.log(generalInformation)
      console.log(data)
      form.setFieldsValue({
        ...data, year: dayjs(data.year, "YYYY"),
        procurement_type: data.procurement_type.code
      });
      formik.setValues({
        ...data,
        procurement_type: data.procurement_type.code
      });
      formik.initialValues = {
        ...data,
        procurement_type: data.procurement_type.code,
      }
      console.log(formik.values)
    } catch (error) {
      message.error("Gagal memuat data general info")
      console.error("[Error] ", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const getSumberDana = async (type: string) => {
    const userId = getCookie("user_id");

    if (!token || !userId) {
      message.error("Token or User ID is missing.");
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/general/source-of-funds/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
          },
        },
      );

      if (response.data.message === "Success") {
        const data = response.data.data;
        setRekeningList(data);
      } else {
        console.error("Data fetched is not in the expected format:", response.data);
        message.error("Data fetched is not in the expected format.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    if (formik.values.capex_opex) {
      getSumberDana(formik.values.capex_opex);
    }
  }, [formik.values.capex_opex]);

  return (
    <div className="">
      {isLoadingData ? <div className="text-center mt-5">
        <Spin size="large" />
        <p>Memuat Detail Information...</p>
      </div>
        : <div>
          {isEditMode ? <div></div>
            : formSubmitted ?
              <Button type="primary" style={{ borderColor: '#f59e0b', color: '#ffffff', backgroundColor: '#f59e0b' }} className="mb-5">Edit</Button>
              : <div></div>}
          <Form form={form} onFinish={() => {
            form.validateFields().then((values) => {
              console.log(formik.values)
              formik.handleSubmit()
            });
          }} layout="vertical">
            <Form.Item
              name="procurement_type"
              label="Jenis Pengadaan"
              rules={[{ required: true, message: "Jenis Pengadaan harus diisi" }]}>
              <Select
                disabled={formSubmitted}
                id="procurement_type"
                onChange={(value) => formik.setFieldValue("procurement_type", value)}
                onBlur={formik.handleBlur}
                value={formik.values.procurement_type}>
                <Option value="p-barang" key={"p-barang"}>Pengadaan Barang</Option>
                <Option value="p-konstruksi" key={"p-konstruksi"}>Pengadaan Pekerjaan Konstruksi</Option>
                <Option value="p-konsultasi" key={"p-konsultasi"}>Pengadaan Jasa Konsultasi</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="package_name"
              label="Nama Paket"
              rules={[{ required: true, message: "Nama Paket harus diisi" }]}>
              <Input
                disabled={formSubmitted}
                name="package_name"
                value={formik.values.package_name}
                onChange={(e) => formik.setFieldValue("package_name", e.target.value)}
              />
            </Form.Item>
            <Form.Item
              name="work_unit"
              label="Satuan Kerja"
              rules={[{ required: true, message: "Satuan Kerja harus diisi" }]}>
              <Input
                disabled={formSubmitted}
                name="work_unit"
                value={formik.values.work_unit}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item
              name="year"
              label="Tahun Anggaran"
              rules={[{ required: true, message: "Tahun Anggaran harus diisi" }]}>
              <DatePicker.YearPicker name="year" value={formik.values.year}
                onChange={(date, dateString) => {
                  formik.setFieldValue("year", dateString)
                }
                } style={{ width: '100%' }} placement="topLeft"
                disabled={formSubmitted} />
            </Form.Item>
            <Form.Item
              name="product_local"
              label="Produk Dalam Negeri"
              rules={[{ required: true, message: "Produk Dalam Negeri harus diisi" }]}>
              <Input
                disabled={formSubmitted}
                name="product_local"
                value={formik.values.product_local}
                onChange={formik.handleChange}
              />
            </Form.Item>
            <Form.Item
              name="location"
              label="Lokasi Pekerjaan"
              rules={[{ required: true, message: "Lokasi Pekerjaan harus diisi" }]}>
              <Input name="location" value={formik.values.year}
                onChange={formik.handleChange}
                disabled={formSubmitted} />
            </Form.Item>
            <Form.Item
              name="capex_opex"
              label="Opex / Capex"
              rules={[{ required: true, message: "Nilai Opex Capex harus diisi" }]}>
              <Select
                disabled={formSubmitted}
                id="capex_opex"
                onChange={(value) => formik.setFieldValue("capex_opex", value)}
                onBlur={formik.handleBlur}
                value={formik.values.capex_opex}
              >
                <Option value="opex">Opex</Option>
                <Option value="capex">Capex</Option>
              </Select>
            </Form.Item>
            <Form.Item
            name="master_budget_id"
            label="Sumber Dana"
            key={1}
            rules={[
              { required: true, message: "Sumber Dana harus dipilih" },
            ]}
            initialValue={rekeningList.at(0)}>
            <Select
              id="master_budget_id"
              disabled={formSubmitted}
              onChange={(value) => formik.setFieldValue("master_budget_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.master_budget_id}>
              {rekeningList.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.rekening} - {formatCurrency(option.total)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
            <Form.Item
              name="total_anggaran"
              label="Total Anggaran"
              rules={[{ required: true, message: "Total Anggaran harus diisi" }]}>
              <Input
                disabled={formSubmitted}
                name="total_anggaran"
                value={formik.values.total_anggaran}
                onChange={formik.handleChange}
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
            </Button>
          </Form>
        </div>}
    </div >
  );
};

export default ReqGeneralInfo;