import React, { useState } from "react";
import { Steps, Modal, Button, Form, Input, Divider } from "antd";
import { useFormik } from "formik";
import dayjs from "dayjs";

const { TextArea } = Input;

interface Step {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "pending" | "approved" | "rejected"; // Tipe status yang sesuai
}

const initialSteps: Step[] = [
  {
    id: 1,
    title: "Finished",
    description: "This is a description. This is a description.",
    date: dayjs().subtract(3, "day").format("DD-MM-YYYY HH:mm"),
    status: "pending",
  },
  {
    id: 2,
    title: "Finished",
    description: "This is a description. This is a description.",
    date: dayjs().subtract(2, "day").format("DD-MM-YYYY HH:mm"),
    status: "pending",
  },
  {
    id: 3,
    title: "In Progress",
    description: "This is a description. This is a description.",
    date: dayjs().subtract(1, "day").format("DD-MM-YYYY HH:mm"),
    status: "pending",
  },
  {
    id: 4,
    title: "Waiting",
    description: "This is a description.",
    date: dayjs().format("DD-MM-YYYY HH:mm"),
    status: "pending",
  },
  {
    id: 5,
    title: "Waiting",
    description: "This is a description.",
    date: dayjs().add(1, "day").format("DD-MM-YYYY HH:mm"),
    status: "pending",
  },
];

const TimelinePage: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);

  const showModal = (step: Step) => {
    setCurrentStep(step);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
    setCurrentStep(null);
  };

  const formik = useFormik({
    initialValues: {
      comment: "",
      status: "pending", // Initial status
    },
    onSubmit: (values) => {
      if (currentStep) {
        const updatedSteps = steps.map((step) =>
          step.id === currentStep.id
            ? {
                ...step,
                description: values.comment,
                status: values.status as "pending" | "approved" | "rejected", // Cast values.status to the correct type
              }
            : step
        );
        setSteps(updatedSteps);
      }
      setIsModalVisible(false);
      formik.resetForm();
      setCurrentStep(null);
    },
  });

  return (
    <div className="p-5">
      <Steps
        progressDot={(progressDot, { index }) => (
          <div onClick={() => showModal(steps[index])} className="cursor-pointer bg-black text-blue-300 rounded-full">
            {progressDot}
          </div>
        )}
        current={1}
        direction="vertical"
        items={steps.map((step) => ({
          title: (
            <span className={step.status === "approved" ? "text-green-600" : step.status === "rejected" ? "text-red-600" : ""}>
              {step.title}
            </span>
          ),
          description: (
            <div>
              <p>{step.description}</p>
              <p className="text-sm text-gray-500">{step.date}</p>
            </div>
          ),
        }))}
      />
      <Divider />
      <Modal
        title={currentStep ? currentStep.title : "Step Detail"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="reject" type="primary" danger onClick={() => formik.setFieldValue("status", "rejected")}>
            Reject
          </Button>,
          <Button key="approve" type="primary" onClick={() => formik.setFieldValue("status", "approved")}>
            Approve
          </Button>,
          <Button key="submit" type="primary" onClick={() => formik.handleSubmit()}
          >
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item>
            <TextArea
              rows={4}
              value={formik.values.comment}
              onChange={(e) => formik.setFieldValue("comment", e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimelinePage;