import React, { useState, useEffect } from "react";
import {
  Steps,
  Modal,
  Button,
  Form,
  Input,
  Divider,
  Radio,
  message,
  Spin,
  Select,
  Popconfirm,
  Empty,
} from "antd";
import { useFormik } from "formik";
import axios from "axios";
import StatusReportStore from "../store/CenterStore";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";

const { TextArea } = Input;

interface Step {
  id: number;
  remark: string;
  approved_at: string;
  approved_by: string;
  status_code: string;
  procurement_status: {
    id: number;
    status_name: string;
    code: string;
  };
}

interface getStatus {
  id: number;
  status_name: string;
  code: string;
}

const TimelinePage: React.FC = () => {
  const {
    statusReport,
    addStatusReport,
    editStatusReport,
    removeStatusReport,
    initializeStatusReport,
  } = StatusReportStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newStepAdded, setNewStepAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getStatus, setGetStatus] = useState<getStatus[]>([]);
  const [approvedBy, setApprovedBy] = useState<string>("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setIsLoading(true);
        const token = getCookie("token");

        if (!token) {
          message.error("Please Login First.");
          return;
        }

        const response = await axios.get(
          "https://requisition.eproc.latansa.sch.id/api/master/procurementStatus",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.data && Array.isArray(response.data.data)) {
          setGetStatus(response.data.data);
        } else {
          console.error(
            "Data fetched is not in expected format:",
            response.data,
          );
          message.error("Data fetched is not in expected format.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    const fetchSteps = async () => {
      const token = getCookie("token");
      const requisitionId = getCookie("requisition_id");
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/status/${requisitionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.status === 200) {
          const reversedData = response.data.data.slice().reverse();
          initializeStatusReport(reversedData);
        } else {
          message.error(`Failed to fetch steps: ${response.data.message}`);
        }
      } catch (error) {
        message.error(`Failed to fetch steps: ${error}`);
        console.error("Error fetching steps:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteps();
  }, [initializeStatusReport]);

  useEffect(() => {
    const fetchApprovedBy = async () => {
      try {
        const token = getCookie("token");
        const requisitionId = getCookie("requisition_id");

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/status/${requisitionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200 && response.data.data.length > 0) {
          const latestStep = response.data.data[0];
          setApprovedBy(latestStep.approved_by);
        } else {
          console.error("Failed to fetch latest step:", response.data.message);
          message.error("Failed to fetch latest step.");
        }
      } catch (error) {
        console.error("Error fetching latest step:", error);
        message.error("Failed to fetch latest step. Please try again later.");
      }
    };

    fetchApprovedBy();
  }, []);

  const showModal = (step: Step | null = null) => {
    setCurrentStep(step);
    if (step) {
      formik.setFieldValue("remark", step.remark);
      formik.setFieldValue("status_code", step.status_code);
      formik.setFieldValue("approved_at", step.approved_at);
      formik.setFieldValue("approved_by", step.approved_by);
      formik.setFieldValue("status_name", step.procurement_status.status_name);
    } else {
      formik.setFieldValue("approved_by", approvedBy); // Set approved_by saat menampilkan form untuk submit baru
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
    setCurrentStep(null);
    setIsAdding(false);
  };

  const handleDelete = async (id: React.Key) => {
    try {
      const token = getCookie("token");
      const requisitionId = getCookie("requisition_id");

      if (!token) {
        message.error("Token, User ID, or Vendor ID is missing.");
        return;
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/status/${requisitionId}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      removeStatusReport(Number(id)); // Pastikan Anda memiliki fungsi removeBankAccount yang sesuai
      message.success("Report status deleted successfully.");
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error deleting status report:", error);
      message.error("Failed to delete. Please try again.");
    }
  };

  const handleEdit = async () => {
    try {
      setIsLoading(true);
      const token = getCookie("token");
      const requisitionId = getCookie("requisition_id");

      if (!token) {
        message.error("Token or Requisition ID is missing.");
        return;
      }

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/status/${requisitionId}/${currentStep?.id}`,
        {
          remark: formik.values.remark,
          status_code: formik.values.status_code,
          approved_at: currentStep?.approved_at,
          approved_by: currentStep?.approved_by,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        const updatedStep: Step = {
          id: currentStep?.id || 0,
          remark: formik.values.remark,
          status_code: formik.values.status_code,
          approved_at: currentStep?.approved_at || dayjs().format(),
          approved_by: currentStep?.approved_by || approvedBy,
          procurement_status: {
            id: currentStep?.procurement_status.id || 0,
            status_name:
              getStatus.find(
                (status) => status.code === formik.values.status_code,
              )?.status_name || "",
            code: formik.values.status_code,
          },
        };

        editStatusReport(updatedStep);
        message.success("Step updated successfully.");
        setIsModalVisible(false);
        formik.resetForm();
        setCurrentStep(null);
        setIsAdding(false);
      } else {
        message.error(`Failed to update step: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating step:", error);
      message.error("Failed to update step. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      remark: "",
      status_code: "",
      approved_at: "",
      approved_by: approvedBy, // Set approved_by di initialValues
      status_name: "",
    },
    onSubmit: async (values) => {
      const token = getCookie("token");
      const requisitionId = getCookie("requisition_id");
      setIsLoading(true);
      try {
        // Cari status_name berdasarkan status_code yang dipilih
        const selectedStatus = getStatus.find(
          (status) => status.code === values.status_code,
        );
        const status_name = selectedStatus ? selectedStatus.status_name : "";

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/status/${requisitionId}`,
          {
            ...values,
            approved_at: currentStep
              ? currentStep.approved_at
              : dayjs().format(),
            approved_by: currentStep ? currentStep.approved_by : approvedBy,
            status_name: status_name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log("Response from API:", response.data);
        if (response.status === 201 || response.status === 200) {
          if (currentStep) {
            const updatedSteps = statusReport.map((step: Step) =>
              step.id === currentStep.id
                ? {
                    ...step,
                    remark: values.remark,
                    status_code: values.status_code,
                    approved_at: currentStep.approved_at,
                    approved_by: currentStep.approved_by,
                    procurement_status: {
                      ...step.procurement_status,
                      status_name: status_name,
                    },
                  }
                : step,
            );
            initializeStatusReport(updatedSteps.reverse());
          } else {
            const newStep: Step = {
              id: statusReport.length + 1,
              remark: values.remark,
              status_code: values.status_code,
              approved_at: dayjs().format(),
              approved_by: approvedBy,
              procurement_status: {
                id: 0,
                status_name: status_name,
                code: values.status_code,
              },
            };
            addStatusReport(newStep);
          }
          setIsModalVisible(false);
          formik.resetForm();
          setCurrentStep(null);
          setIsAdding(false);
          message.success("Step successfully added/updated");
        } else {
          message.error(`Failed to add/update step: ${response.data.message}`);
        }
      } catch (error) {
        message.error(`Failed to add/update step: ${error}`);
        console.error("Error submitting form:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="p-5">
      {statusReport.length === 0 ? (
      <Empty></Empty>
      ) : (
        <Steps
          progressDot
          current={10}
          direction="vertical"
          items={statusReport.map((step: Step, index) => ({
            title: (
              <span
                onClick={() => showModal(step)}
                className={
                  step.status_code.includes("approved")
                    ? "cursor-pointer text-green-600"
                    : step.status_code === "rejected"
                    ? "cursor-pointer text-red-600"
                    : "cursor-pointer"
                }
              >
                {step.procurement_status.status_name}{" "}
              </span>
            ),
            description: (
              <div>
                <p>{step.remark}</p>
                <p className="text-sm text-gray-500">
                  {dayjs(step.approved_at).format("DD-MM-YYYY HH:mm:ss")}
                </p>
                <p className="text-sm text-gray-500">{step.approved_by}</p>
              </div>
            ),
            className: newStepAdded && index === 0 ? "step-new" : "",
          }))}
        />
      )}
      <Divider />
      <Button
        type="primary"
        onClick={() => {
          setIsAdding(true);
          showModal();
        }}
      >
        Add New Step
      </Button>
      <Modal
        title={isAdding ? "Add New Step" : "Edit Detail"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={
          !isAdding ? (
            <div className="flex gap-3">
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(currentStep?.id ?? 0)}
              >
                <Button key="delete" type="primary" danger>
                  Delete
                </Button>
              </Popconfirm>

              <Button key="save" onClick={handleEdit} loading={isLoading}>
                Simpan Perubahan
              </Button>
            </div>
          ) : (
            <Button
              key="submit"
              type="primary"
              loading={isLoading}
              onClick={() => formik.handleSubmit()}
            >
              Submit
            </Button>
          )
        }
      >
        <Form layout="vertical">
          <Form.Item label="Description">
            <TextArea
              rows={4}
              value={formik.values.remark}
              onChange={(e) => formik.setFieldValue("remark", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Status"
            rules={[{ required: true, message: "Status harus diisi" }]}
          >
            <Select
              id="status_code"
              onChange={(value) => formik.setFieldValue("status_code", value)}
              onBlur={formik.handleBlur}
              value={formik.values.status_code}
            >
              {getStatus.map((status) => (
                <Select.Option key={status.id} value={status.code}>
                  {status.status_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimelinePage;
