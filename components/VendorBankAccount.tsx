"use client";
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
import axios from "axios";
import useBankAccountStore from "../store/CenterStore";
import EditableCell from "./EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import { bankOptions, currencyOptions } from "@/utils/bankOptions";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

interface BankAccount {
  id: number;
  bank_id: string;
  currency_id: string;
  account_number: string;
}

interface Bank {
  id: number;
  bank_name: string;
}

const PengurusPerusahaan: React.FC = () => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);

  const formik = useFormik({
    initialValues: {
      bank_id: "",
      currency_id: "",
      account_number: "",
    },
    onSubmit: async (values) => {
      const token = getCookie("token");
      const userId = getCookie("user_id");
      const vendorId = getCookie("vendor_id");

      if (!token || !userId || !vendorId) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }
      try {
        setIsLoading(true);
        const response = await axios.post(
          "https://vendorv2.delpis.online/api/vendor/bank",
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );
        console.log("Response from API:", response.data);
        setIsModalVisible(false);
        message.success("Bank Account added successful");
        addBankAccount({
          ...formik.values,
          id: bankAccount.length + 2,
        });
        formik.resetForm();
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data");
      } finally {
        setIsLoading(false);
      }
    },
  });

  // ini untuk get dengan type data array of object
  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        setIsLoading(true);

        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
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
          },
        );

        if (response.data && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(
            (account: {
              bank: { bank_name: any };
              bank_id: any;
              currency: { name: any };
              currency_id: any;
            }) => ({
              ...account,
              bank_id: account.bank ? account.bank.bank_name : account.bank_id,
              currency_id: account.currency
                ? account.currency.name
                : account.currency_id,
            }),
          );
          initializeBankAccount(mappedData);
        } else {
          console.error(
            "Bank account data fetched is not in expected format:",
            response.data,
          );
          message.error("Bank account data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching bank account data:", error);
        message.error(
          "Failed to fetch bank account data. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchBankAccounts();
  }, [initializeBankAccount]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setIsLoading(true);
        const token = getCookie("token");
        const userId = getCookie("user_id");
        const vendorId = getCookie("vendor_id");

        if (!token || !userId || !vendorId) {
          message.error("Please login first.");
          return;
        }

        const response = await axios.get(
          "https://vendorv2.delpis.online/api/master/bank",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        if (response.data && Array.isArray(response.data.data)) {
          const mappedData = response.data.data.map(
            (account: { id: any; bank_name: any }) => ({
              ...account,
            }),
          );

          setBanks(mappedData);
        } else {
          console.error(
            "Bank data fetched is not in expected format:",
            response.data,
          );
          message.error("Bank data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching bank data:", error);
        message.error("Failed to fetch bank data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanks();
  }, []);

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
        },
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
        },
      );

      removeBankAccount(Number(id)); // Pastikan Anda memiliki fungsi removeBankAccount yang sesuai
      message.success("Bank account deleted successfully.");
    } catch (error) {
      console.error("Error deleting bank account:", error);
      message.error("Failed to delete bank account. Please try again.");
    }
  };

  // const getBankName = (bankId: string) => {
  //   const bank = banks.find(bank => bank.id.toString() === bankId);
  //   return bank ? bank.bank_name : bankId;
  // };

  const getBankName = (bankId: string) => {
    const bank = bankOptions.find((option) => option.value === bankId);
    return bank ? bank.label : bankId;
  };

  const getCurrencyName = (currencyId: string) => {
    const currency = currencyOptions.find(
      (option) => option.value === currencyId,
    );
    return currency ? currency.label : currencyId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Bank",
      dataIndex: "bank_id",
      key: "bank_id",
      editable: true,
      // options: bankOptions,
      render: (text: string) => getBankName(text),
    },
    {
      title: "Currency",
      dataIndex: "currency_id",
      key: "currency_id",
      editable: true,
      options: currencyOptions,
      render: (text: string) => getCurrencyName(text),
    },
    {
      title: "Nomor Rekening",
      dataIndex: "account_number",
      key: "account_number",
      editable: true,
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
          <span className="flex items-center justify-center gap-5">
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
          col.dataIndex === "noKTPPengurus" || col.dataIndex === "npwpPengurus"
            ? "number"
            : col.dataIndex === "bank_id" ||
                col.dataIndex === "currency_id" ||
                col.dataIndex === "vendor_type"
              ? "number"
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
  };

  const handleOk = () => {
    addBankAccount({
      ...formik.values,
      id: bankAccount.length + 2,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    console.log("Submitting data:", bankAccount);
    formik.handleSubmit();
  };

  return (
    <div>
      <Button type="primary" onClick={showModal} className="mb-4">
        Tambah Rekening Perusahaan
      </Button>
      <Modal
        title="Tambah Rekening Perusahaan"
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
              Simpan Data
            </Button>
          </>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Nama Bank" required hasFeedback>
            <Select
              id="bank_id"
              onChange={(value) => formik.setFieldValue("bank_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.bank_id}
            >
              {bankOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
              {/* data dinamis tapi value akan berupa angka di table, tapi akan berubah jadi benar saat refresh */}
              {/* {banks.map((bank) => (
        <Select.Option key={bank.id} value={bank.id}>
          {bank.bank_name}
        </Select.Option>
      ))} */}
            </Select>
          </Form.Item>
          <Form.Item label="Currency" required hasFeedback>
            <Select
              id="currency_id"
              onChange={(value) => formik.setFieldValue("currency_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.currency_id}
            >
              {currencyOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="account_number"
            label="Nomor Rekening Perusahaan"
            // rules={[{ required: true, message: "NPWP harus berupa angka" }]}
          >
            <Input
              value={formik.values.account_number}
              onChange={formik.handleChange}
            />
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

export default PengurusPerusahaan;
