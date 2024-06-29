'use client'
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

interface BankAccount {
  id: number;
  bank_id: string;
  currency_id: string;
  account_number: string;
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

  const formik = useFormik({
    initialValues: {
      bank_id: "",
      currency_id: "",
      account_number: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          "https://vendor.eproc.latansa.sch.id/api/vendor/bank",
          values
        );
        console.log("Bank Value:", values);
        // addBankAccount({ ...response.data, id: bankAccount.length + 1 });
        setIsModalVisible(false);
        formik.resetForm();
      } catch (error) {
        console.error("Failed to submit data", error);
        message.error("Failed to submit data");
      }
    },
  });

  useEffect(() => {
    const fetchBankAccounts = async () => {
      try {
        const response = await axios.get(
          "https://vendor.eproc.latansa.sch.id/api/vendor/bank"
        );
        initializeBankAccount(response.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        message.error("Failed to fetch data");
      }
    };

    fetchBankAccounts();
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
      editBankAccount({ ...row, id: Number(id) });
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = (id: React.Key) => {
    removeBankAccount(Number(id));
  };

  const columns = [
    { title: "No", dataIndex: "id", key: "id" },
    {
      title: "Nama Bank",
      dataIndex: "bank_id",
      key: "bank_id",
      editable: true,
      options: [
        { value: "3", label: "BCA" },
        { value: "4", label: "Mandiri" },
      ],
    },
    {
      title: "Currency",
      dataIndex: "currency_id",
      key: "currency_id",
      editable: true,
      options: [
        { value: "3", label: "Rupiah" },
        { value: "1", label: "Dollar" },
      ],
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
          <span>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: 8 }}
            >
              Edit
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.id)}
            >
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
      onCell: (record: BankAccount) => ({
        record,
        inputType:
          col.dataIndex === "noKTPPengurus" || col.dataIndex === "npwpPengurus"
            ? "number"
            : col.dataIndex === "city_id" ||
              col.dataIndex === "province_id" ||
              col.dataIndex === "vendor_type"
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
  };

  const handleOk = () => {
    addBankAccount({
      ...formik.values,
      id: bankAccount.length + 1,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    console.log("Submitting data:", bankAccount);
  formik.handleSubmit()
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Tambah Rekening Perusahaan
      </Button>
      <Modal
        title="Tambah Rekening Perusahaan"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
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
          <Form.Item label="Currency" required hasFeedback>
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
        />
        <Button type="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Form>
    </div>
  );
};

export default PengurusPerusahaan;