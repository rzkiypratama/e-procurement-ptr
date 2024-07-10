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
import EditableCell from "../components/EditableCell";
import { useFormik } from "formik";
import { getCookie } from "cookies-next";
import { bankOptions, currencyOptions } from "@/utils/bankOptions";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

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
  id: number;
  code: string;
  name: string;
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
  const [getCurrency, setGetCurrency] = useState<CurrencyID[]>([]);

  const formik = useFormik({
    initialValues: {
      bank_id: "",
      currency_id: "",
      account_number: "",
    },
    onSubmit: async (values, formik) => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/bank`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        if (response.data && response.data.data) {
          const { bank, currency, ...bankAccountData } = response.data.data;

          const bankAccount: BankAccount = {
            ...bankAccountData,
            bank_id: bank ? bank.bank_name : "",
            currency_id: currency ? currency.name : "",
          };

          console.log("Response from API:", response.data);
          setIsModalVisible(false);
          message.success("Bank Account added successfully");
          addBankAccount(bankAccount); // assuming addBankAccount accepts the transformed data
          formik.resetForm();
        } else {
          console.error("Failed to get valid data from API response");
          message.error("Failed to get valid data from API response");
        }
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data. Please try again later.");
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
          `${process.env.NEXT_PUBLIC_API_URL}/vendor/bank`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "User-ID": userId,
              "Vendor-ID": vendorId,
            },
          },
        );

        if (
          typeof response.data === "object" &&
          Array.isArray(response.data.data)
        ) {
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
          `${process.env.NEXT_PUBLIC_API_URL}/master/bank`,
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

  useEffect(() => {
    const fetchCurrency = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/master/currency`,
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
            (account: { id: any; name: any }) => ({
              ...account,
            }),
          );

          setGetCurrency(mappedData);
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
    fetchCurrency();
  }, []);

  const isEditing = (record: BankAccount) =>
    record.id.toString() === editingKey;

  const edit = (record: Partial<BankAccount> & { id: React.Key }) => {
    // Transform bank_id to bank_name for display
    const bankName =
      banks.find((bank) => bank.id === Number(record.bank_id))?.bank_name ||
      record.bank_id;
    // const currencyName = getCurrency.find((currency) => currency.id === record.currency_id)?.name;
    const currencyName =
      getCurrency.find((currency) => currency.id === Number(record.currency_id))
        ?.name || record.currency_id;

    form.setFieldsValue({
      ...record,
      bank_id: bankName, // Display bank_name in the form
      currency_id: currencyName, // Display currency_id as is
    });
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

      // Transform bank_id back to its original id for submission
      const bankId =
        banks.find((bank) => bank.bank_name === row.bank_id)?.id || row.bank_id;
      const currencyId =
        getCurrency.find((currency) => currency.name === row.currency_id)?.id ||
        row.currency_id;

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/bank/${id}`,
        { ...row, bank_id: bankId, currency_id: currencyId }, // Ensure bank_id is sent as id, not bank_name
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "User-ID": userId,
            "Vendor-ID": vendorId,
          },
        },
      );

      if (response.data && response.data.data) {
        const { bank, currency, ...bankAccountData } = response.data.data;

        const updatedBankAccount: BankAccount = {
          ...bankAccountData,
          bank_id: bank ? bank.bank_name : "", // Display bank_name if available
          currency_id: currency ? currency.name : "", // Display currency name if available
        };

        editBankAccount({ ...updatedBankAccount, id: Number(id) });
        setEditingKey("");
        message.success("Bank account edited successfully.");
      } else {
        console.error("Failed to get valid data from API response");
        message.error("Failed to get valid data from API response");
      }
    } catch (error) {
      console.error("Failed to save data", error);
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
        `${process.env.NEXT_PUBLIC_API_URL}/vendor/bank/${id}`,
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

  const getPositionName = (positionId: string) => {
    const vendor_position = currencyOptions.find(
      (option) => option.value === positionId,
    );
    return vendor_position ? vendor_position.label : positionId;
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Bank",
      dataIndex: "bank_id",
      key: "bank_id",
      editable: true,
      options: banks.map((bank) => ({
        key: bank.id,
        value: bank.id,
        label: bank.bank_name,
      })),
    },
    {
      title: "Currency",
      dataIndex: "currency_id",
      key: "currency_id",
      editable: true,
      options: getCurrency.map((currency) => ({
        key: currency.id,
        value: currency.id,
        label: currency.name,
      })),
      // render: (text: string) => getPositionName(text),
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
    form.resetFields();
    formik.resetForm();
    let emptyData = {
      bank_id: "",
      currency_id: "",
      account_number: "",
      bank: {
        id: 0,
        bank_name: "",
      },
      currency: {
        id: 0,
        name: "",
      },
    };
    form.setFieldsValue({ ...emptyData });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    console.log("Submitting data:", bankAccount);
    console.log(
      "Options:",
      columns.find((col) => col.dataIndex === "bank_id")?.options,
    );
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
              onChange={(value) => {
                formik.setFieldValue("bank_id", value);
              }}
              onBlur={formik.handleBlur}
              value={formik.values.bank_id}
            >
              {banks.map((bank) => (
                <Select.Option key={bank.id} value={bank.id}>
                  {bank.bank_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Currency" required hasFeedback>
            <Select
              id="currency_id"
              onChange={(value) => formik.setFieldValue("currency_id", value)}
              onBlur={formik.handleBlur}
              value={formik.values.currency_id}
            >
              {/* {columns
                .find((col) => col.dataIndex === "currency_id")
                ?.options?.map((option) => (
                  <Select.Option key={option.value} value={option.value}>
                    {option.label}
                  </Select.Option>
                ))} */}
              {getCurrency.map((currency) => (
                <Select.Option key={currency.id} value={currency.id}>
                  {currency.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="account_number"
            label="Nomor Rekening Perusahaan"
            required
            hasFeedback
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
          scroll={{
            x: 1300,
          }}
        />
      </Form>
    </div>
  );
};

export default PengurusPerusahaan;
