import React, { useEffect, useState } from "react";
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
  Spin
} from "antd";
import useDetailInformationStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { getCookie } from 'cookies-next';
import { AlignType } from 'rc-table/lib/interface';

interface DetailInformation {
  id: number;
  specification_name: string;
  specification_detail: string;
  unit: string;
  quantity: string;
  price: string;
  ppn: string;
  total_after_ppn: string
  total: string;
}

const SPTTahunanPage: React.FC = () => {
  const {
    detailInformation,
    addDetailInformation,
    editDetailInformation,
    removeDetailInformation,
    initializeDetailInformation,
  } = useDetailInformationStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const token = getCookie("token")

  useEffect(() => {
    const requisitionId = getCookie('requisition_id')
    if (requisitionId != "" && requisitionId != undefined) {
      getDetailInfo(requisitionId)
    }
  }, [])

  const formik = useFormik({
    initialValues: {
      specification_name: "",
      specification_detail: "",
      unit: "",
      quantity: "",
      price: "",
      ppn: "",
      total_after_ppn: "",
      total: "",
    },
    onSubmit: async (values) => {
      if (isEditMode && editingId !== null) {
        message.error("Sedang dalam tahap pengembangan")
        // const updatedData = { ...values, id: editingId };
        // editDetailInformation(updatedData);
        // message.success("Detail Information updated successfully");
      } else {
        setIsLoading(true);
        try {
          const requisitionId = getCookie("requisition_id")
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/detail/${requisitionId}`, values, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          console.log("Response from API:", response.data);
          if (response.status == 201 || response.status == 200) {
            setIsEditMode(false);
            setEditingId(null);
            const newData = { ...values, no: detailInformation.length + 1, id: response.data.data.id };
            addDetailInformation(newData);
            message.success("Detail Information added successfully");
          } else {
            message.error(`${response.data.message}`);
          }
        } catch (error) {
          message.error(`Add Detail Information failed! ${error}`);
          console.error("Error submitting form:", error);
        } finally {
          setIsLoading(false);
        }
      }
      setIsModalVisible(false);
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  const isEditing = (record: DetailInformation) => record.id === editingId;

  const handleEdit = (record: DetailInformation) => {
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
    removeDetailInformation(id);
    message.success("Detail Information deleted successfully");
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      formik.handleSubmit()
    });
  };

  const getDetailInfo = async (requisitionId: string | undefined) => {
    try {
      setIsLoadingData(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/detail/${requisitionId}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        },
      )

      let index = 0;
      response.data.data.map((e: any) => {
        index++
        e.no = index
      })
      const data = await response.data.data

      initializeDetailInformation(data)
    } catch (error) {
      message.error("Gagal memuat data general info")
      console.error("[Error] ", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "Spesifikasi",
      dataIndex: "specification_name",
      key: "specification_name",
    },
    {
      title: "Detail Spesifikasi",
      dataIndex: "specification_detail",
      key: "specification_detail",
    },
    {
      title: "Harga Satuan",
      dataIndex: "price",
      align: 'right' as AlignType,
      key: "price",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      align: 'right' as AlignType,
      key: "quantity",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      align: 'right' as AlignType,
      key: "unit",
    },
    {
      title: "Subtotal (Sebelum PPN)",
      dataIndex: "total",
      key: "total",
      align: 'right' as AlignType,
    },
    {
      title: "Pajak (PPN 10%)",
      dataIndex: "ppn",
      align: 'right' as AlignType,
      key: "ppn",
    },
    {
      title: "Subtotal (Setelah PPN)",
      dataIndex: "total_after_ppn",
      key: "total_after_ppn",
      align: 'right' as AlignType,
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: DetailInformation) => (
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
    <div>
      {isLoadingData ?
        <div className="text-center mt-5">
          <Spin size="large" />
          <p>Memuat Detail Information...</p>
        </div>
        :
        <div>
          <Button type="primary" onClick={showModal} className="mb-4">
            Tambah Data
          </Button>
          <Modal
            title={isEditMode ? "Edit Detail Information" : "Tambah Detail Information"}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <>
                <Button onClick={handleCancel}>Batalkan</Button>
                <Button
                  key="submit"
                  type="primary"
                  onClick={handleSubmit}
                  loading={isLoading}
                >
                  {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
                </Button>
              </>,
            ]}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="specification_name"
                label="Spesifikasi"
                rules={[{ required: true, message: "Spesifikasi harus diisi" }]}>
                <Input
                  name="specification_name"
                  value={formik.values.specification_name}
                  onChange={(e) => formik.setFieldValue("specification_name", e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="specification_detail"
                label="Detail Spesifikasi"
                rules={[{ required: true, message: "Detail Specification harus diisi" }]}
              >
                <Input
                  name="specification_detail"
                  value={formik.values.specification_detail}
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item
                name="quantity"
                label="Quantity"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (isNaN(value)) {
                        return Promise.reject(
                          "Quantity input has to be a number.",
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                required>
                <Input
                  name="quantity"
                  value={formik.values.quantity}
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item
                name="unit"
                label="Unit"
                // rules={[
                //   () => ({
                //     validator(_, value) {
                //       if (!value) {
                //         return Promise.reject();
                //       }
                //       if (isNaN(value)) {
                //         return Promise.reject(
                //           "Unit input has to be a number.",
                //         );
                //       }
                //       return Promise.resolve();
                //     },
                //   }),
                // ]}
                required
              >
                <Input
                  name="unit"
                  value={formik.values.unit}
                  onChange={formik.handleChange}
                />
              </Form.Item>
              <Form.Item
                name="total"
                label="Harga Satuan"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (!value) {
                        return Promise.reject();
                      }
                      if (isNaN(value)) {
                        return Promise.reject(
                          "Total input has to be a number.",
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
                required>
                <Input
                  value={formik.values.total}
                  onChange={formik.handleChange}
                />
              </Form.Item>
            </Form>
          </Modal>
          <Table
            dataSource={detailInformation}
            columns={columns}
            rowKey={(record) => record.id.toString()}
          />
        </div>}
    </div>
  );
};

export default SPTTahunanPage;
