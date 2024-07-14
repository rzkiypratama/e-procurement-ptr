import React, { useState, useEffect } from "react";
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
  Select,
} from "antd";
import dayjs from "dayjs";
import useMasterDataInputAnggaranStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { getCookie } from 'cookies-next'

// const { TextArea } = Input;

interface MasterBudgetInputAnggaran {
  no: number;
  id: number;
  year: string;
  department: string;
  total: string;
  updated_by: string;
  department_id: number;
}

interface Department {
  id: number;
  department_name: string;
  department_code: string;
}

const SyaratKualifikasi: React.FC = () => {
  const {
    masterBudgetInputAnggaran,
    addMasterBudgetInputAnggaran,
    editMasterBudgetInputAnggaran,
    removeMasterBudgetInputAnggaran,
    initializeMasterBudgetInputAnggaran,
  } = useMasterDataInputAnggaranStore();

  const token = getCookie("token")

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setLoading] = useState(false);
  const [isLoadingData, setLoadingData] = useState(false);
  const [listDepartment, setListDepartment] = useState<Department[]>([]);

  const formik = useFormik({
    initialValues: {
      no: 0,
      id: 0,
      year: "",
      department_id: 0,
      department: "",
      total: "",
      updated_by: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      if (isEditMode && editingId !== null) {
        await updateAnggaran()
      } else {
        setLoading(true);
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/anggaran`, values, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          console.log("Response from API:", response.data);
          if (response.status == 201 || response.status == 200) {
            addMasterBudgetInputAnggaran({
              ...values,
              updated_by: response.data.data.updated_by,
              id: response.data.data.id,
              department: response.data.data.department.department_name,
              no: masterBudgetInputAnggaran.length + 1,
            })
            message.success(`Add Anggaran successfully`)

            form.resetFields()
            formik.resetForm()
            setIsModalVisible(false)
          } else {
            message.error(`${response.data.message}`);
          }
        } catch (error) {
          message.error(`Add Anggaran failed! ${error}`);
          console.error("Error submitting form:", error);
        } finally {
          setLoading(false);
        }
      }
      setIsModalVisible(false);
      formik.resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
  });

  // const isEditing = (record: MasterBudgetInputAnggaran) => record.id === editingId;

  const handleEdit = (record: MasterBudgetInputAnggaran) => {
    form.setFieldsValue({
      ...record, year: dayjs(record.year, "YYYY")
    });
    formik.setValues({ ...record });
    setIsModalVisible(true);
    setIsEditMode(true);
    setEditingId(record.id);
  };

  const updateAnggaran = async () => {
    setLoading(true);
    try {
      const body = {
        ...formik.values
      }

      const row = formik.values
      const updatedRow = {
        ...row,
        year: dayjs(row.year).format("YYYY"),
        department: listDepartment.find((item) => item.id === row.department_id)?.department_name ?? ""
      };

      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/anggaran/${editingId}`, body, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Response from API:", response.data);
      if (response.status == 200) {
        message.success(`Update Anggaran successfully`)

        editMasterBudgetInputAnggaran(updatedRow)
      } else {
        message.error(`${response.data.message}`);
      }
    } catch (error) {
      message.error(`Edit Anggaran failed! ${error}`);
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      form.resetFields()
      formik.resetForm()
      setIsModalVisible(false)
      setEditingId(null);
      setIsEditMode(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const userId = getCookie("user_id");
      if (!token || !userId) {
        message.error("Token, or User ID is missing.");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/anggaran/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
          },
        }
      );

      message.success("Anggaran deleted successfully");
      removeMasterBudgetInputAnggaran(id);
    } catch (error) {
      console.error("Error deleting Data Anggaran:", error);
      message.error("Failed to delete Data Anggaran. Please try again.");
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields();
    formik.resetForm();

    formik.setFieldValue("department_id", listDepartment.at(0)?.id.toString())
    setIsEditMode(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log(formik.values.year.toString())
      formik.handleSubmit()
    });
  };

  const columns = [
    { title: "No", dataIndex: "no", key: "no" },
    {
      title: "Tahun Anggaran",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Anggaran Digunakan",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Updated By",
      dataIndex: "updated_by",
      key: "updated_by",
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: MasterBudgetInputAnggaran) => (
        <span className="flex items-center justify-center gap-5">
          <Typography.Link onClick={() => handleEdit(record)}>
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}>
            <DeleteOutlined className="text-red-500" />
          </Popconfirm>
        </span>
      ),
    },
  ];

  useEffect(() => {
    // Initialize data if needed
    getListAnggaran()
    getDepartments()
  }, []);

  const getListAnggaran = async () => {
    setLoadingData(true)
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/anggaran`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      console.log("Response from API:", response.data.data);
      let index = 1;
      const data: MasterBudgetInputAnggaran[] = []
      response.data.data.map((e: any) => {
        e.no = index
        index++
        console.log(e.department.name)
        const row: MasterBudgetInputAnggaran = {
          ...e,
          department: e.department.department_name,
        }

        data.push(row)
      })
      console.log(data)
      // const data: MasterBudgetInputAnggaran[] = await response.data.data
      initializeMasterBudgetInputAnggaran(data)
    } catch (error) {
      message.error(`Get Data Anggaran failed! ${error}`);
      console.error("Error Get Data Anggaran:", error);
    } finally {
      setLoadingData(false)
    }
  }

  const getDepartments = async () => {
    const userId = getCookie("user_id");

    if (!token || !userId) {
      message.error("Token, User ID, or Vendor ID is missing.");
      return;
    }
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/department`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-ID": userId,
        },
      },
    );

    console.log(response.data);
    if (response.data.message == "Success") {
      const data: Department[] = await response.data.data
      setListDepartment(data)
    } else {
      console.error(
        "City data fetched is not in expected format:",
      );
      message.error("City data fetched is not in expected format.");
    }
  }

  return (
    <div>
      <Button key="add" type="primary" onClick={showModal} className="mb-4">
        Add
      </Button>
      <Modal
        title={isEditMode ? "Edit Input Anggaran" : "Tambah Input Anggaran"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key={"cancel"} onClick={handleCancel}>Batalkan</Button>,
          <Button
            key={"submit"}
            type="primary"
            onClick={handleSubmit}
            loading={isLoading}>
            {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
          </Button>
        ]}>
        <Form form={form} layout="vertical">
          <Form.Item
            name="year"
            label="Tahun Anggaran"
            key={0}
            rules={[{ required: true, message: "Tahun Anggaran harus diisi" }]}>
            <DatePicker.YearPicker name="year" value={formik.values.year}
              onChange={(date, dateString) => {
                formik.setFieldValue("year", dateString)
              }
              } style={{ width: '100%' }} placement="topLeft" />
          </Form.Item>
          <Form.Item
            name="department_id"
            label="Department"
            key={1}
            rules={[
              { required: true, message: "Department harus dipilih" },
            ]}
            initialValue={listDepartment.at(0)?.department_name.toString()}>
            <Select
              id="department_id"
              onChange={(value) => formik.setFieldValue("department_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.department_id.toString()}
              defaultValue={listDepartment.at(0)?.id.toString()}>
              {listDepartment.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.department_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="total"
            label="Anggaran Digunakan"
            key={2}
            rules={[
              { required: true, message: "Total Anggaran harus diisi" },
            ]}>
            <Input
              name="total"
              value={formik.values.total}
              onChange={formik.handleChange}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={masterBudgetInputAnggaran}
        columns={columns}
        rowKey={(record) => record.id.toString()}
        loading={isLoadingData}
      />
    </div>
  );
};

export default SyaratKualifikasi;
