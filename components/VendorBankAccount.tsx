import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Typography,
  Popconfirm,
  Modal,
  Select,
  message,
} from "antd";
import useBankAccountStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import axios from "axios";
import { getCookie } from "cookies-next";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { positionOptions } from "@/utils/positionOptions";
import { bankOptions, currencyOptions } from "@/utils/bankOptions";

const { TextArea } = Input;

const { Option } = Select;

interface ContactPerson {
    id: number;
    contact_name: string;
    contact_email: string;
    contact_identity_no: string;
    contact_phone: string;
    contact_npwp: string;
    position_id: string;
  }

  interface BankAccount {
    id: number;
    bank_id: string;
    currency_id: string;
    account_number: string;
    // bank: {
    //   id: number;
    //   bank_name: string;
    // };
    // currency: {
    //   id: number;
    //   name: string;
    // };
  }

  interface Bank {
    id: number;
    bank_name: string;
  }
  
  interface CurrencyID {
    id: string;
    code: string;
    name: string;
  }
  
const ContactInfo: React.FC = () => {
  const {
    bankAccount,
    addBankAccount,
    editBankAccount,
    removeBankAccount,
    initializeBankAccount,
  } = useBankAccountStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      bank_id: "",
      currency_id: "",
      account_number: "",
    },
    onSubmit: async (values, { setErrors }) => {
      // Dapatkan token, user_id, dan vendor_id dari cookies
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      try {
        setIsLoading(true)
        const response = await axios.post(
          "https://vendorv2.delpis.online/api/vendor/bank",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );
        console.log("Response from API:", response.data);
        setIsModalVisible(false);
        message.success("Contact added successful");
        addBankAccount({
          ...formik.values,
          id: bankAccount.length + 2,
        });
        setIsModalVisible(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error submitting data:", error);
        if (axios.isAxiosError(error)) {
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const backendErrors = error.response.data.errors;
            setErrors(backendErrors);
            Object.keys(backendErrors).forEach((key) => {
              message.error(`${backendErrors[key]}`);
            });
          } else {
            message.error("An error occurred. Please try again later.");
          }
        } else {
          message.error("An unexpected error occurred. Please try again later.");
        }
      }finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true)
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");
  
        if (!token || !userId || !vendorId) {
          message.error("Token, User ID, or Vendor ID is missing.");
          return;
        }
  
        const response = await axios.get(
          "https://vendorv2.delpis.online/api/vendor/bank",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          }
        );
  
        console.log("Response from API:", response.data);
        // Pastikan response.data adalah object dan memiliki properti yang berisi array
        if (response.data && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(
            (account: { id: any; bank_name: any }) => ({
              ...account,
            }),
          );

          initializeBankAccount(mappedData);
        } else {
          console.error("Response data is not in expected format:", response.data);
          message.error("Failed to fetch contact information.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch contact information.");
      }finally {
        setIsLoading(false);
      }
    };
  
    fetchContactInfo();
  }, [initializeBankAccount]);

  useEffect(() => {
    // Initialize data if needed
    const initialData: BankAccount[] = []; // Load your initial data here
    initializeBankAccount(initialData);
  }, [initializeBankAccount]);

  const isEditing = (record: BankAccount) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<BankAccount> & { id: React.Key }) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.id.toString());
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (id: React.Key) => {
    try {
      const row = (await form.validateFields()) as BankAccount;
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");
  
      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
  
      await axios.put(
        `https://vendorv2.delpis.online/api/vendor/bank/${id}`,
        row,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      editBankAccount({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
      message.error("Failed to save data. Please try again.");
    }
  };

  const handleDelete = async (id: React.Key) => {
    try {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");
  
      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
  
      await axios.delete(
        `https://vendorv2.delpis.online/api/vendor/bank/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        }
      );
  
      removeBankAccount(Number(id)); // Pastikan Anda memiliki fungsi removeContactInfo yang sesuai
      message.success("Contact information deleted successfully.");
    } catch (error) {
      console.error("Error deleting contact information:", error);
      message.error("Failed to delete contact information. Please try again.");
    }
  };

  const getBankName = (positionId: string) => {
    const vendor_position = bankOptions.find(option => option.value === positionId);
    return vendor_position ? vendor_position.label : positionId;
  };

  const getCurrencyName = (positionId: string) => {
    const vendor_position = currencyOptions.find(option => option.value === positionId);
    return vendor_position ? vendor_position.label : positionId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "No Rekening",
      dataIndex: "account_number",
      key: "account_number",
      editable: true,
    },
    {
      title: "Nama Bank",
      dataIndex: "bank_id",
      key: "bank_id",
      options: bankOptions,
      editable: true,
      render: (text: string) => getBankName(text),
    },
    {
      title: "Nama Currency",
      dataIndex: "currency_id",
      key: "currency_id",
      options: currencyOptions,
      editable: true,
      render: (text: string) => getCurrencyName(text),
    },
    {
      title: "Operation",
      dataIndex: "operation",
      render: (_: any, record: BankAccount) => {
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
        <span className="flex items-center gap-5 justify-center">
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined />
          </Typography.Link>
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <DeleteOutlined className="text-red-500" />
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
      onCell: (record: BankAccount) => ({
        record,
        inputType:
       col.dataIndex === "currency_id" || col.dataIndex === "bank_id"
              ? "select"
              : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        options: col.options,
        editing: isEditing(record),
      }),
    };
  });

  const showModal = () => {
    setIsModalVisible(true);
    form.resetFields()
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    console.log("Submitting data:", bankAccount);
    // Additional submission logic if needed
    formik.handleSubmit(); // Trigger Formik's submit function
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Kontak Perusahaan
      </Button>
      <Modal
        title="Tambah Kontak Perusahaan"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <>
           <Button onClick={handleCancel}>
            Batalkan
          </Button>
          <Button key="submit" type="primary" onClick={handleSubmit} loading={isLoading}>
            Simpan Data
          </Button>
          </>
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="account_number"
            label="No Rekening"
            // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.account_number}
              onChange={formik.handleChange}
            />
          </Form.Item>
          <Form.Item label="Nama Currency" required hasFeedback>
            <Select
              id="currency_id"
              onChange={(value) => formik.setFieldValue("currency_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.currency_id}
            >
             {columns
                .find((col) => col.dataIndex === "currency_id")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Nama Bank" required hasFeedback>
            <Select
              id="bank_id"
              onChange={(value) => formik.setFieldValue("bank_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.bank_id}
            >
             {columns
                .find((col) => col.dataIndex === "bank_id")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Form form={form} component={false}>
        <Table
          rowKey={(record) => record.id.toString()}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={bankAccount}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
          loading={isLoading}
        />
      </Form>
    </div>
  );
};

export default ContactInfo;
