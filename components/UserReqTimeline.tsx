import React, { useState, useEffect } from "react";
import { Steps, Modal, Button, Form, Input, Divider, Radio } from "antd";
import { useFormik } from "formik";
import dayjs from "dayjs";

const { TextArea } = Input;

interface Step {
  id: number;
  title: string;
  description: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

const initialSteps: Step[] = [
  // {
  //   id: 1,
  //   title: "Finished",
  //   description: "This is a description. This is a description.",
  //   date: dayjs().subtract(3, "day").format("DD-MM-YYYY HH:mm"),
  //   status: "pending",
  // },
  // {
  //   id: 2,
  //   title: "Finished",
  //   description: "This is a description. This is a description.",
  //   date: dayjs().subtract(2, "day").format("DD-MM-YYYY HH:mm"),
  //   status: "pending",
  // },
  // {
  //   id: 3,
  //   title: "In Progress",
  //   description: "This is a description. This is a description.",
  //   date: dayjs().subtract(1, "day").format("DD-MM-YYYY HH:mm"),
  //   status: "pending",
  // },
  // {
  //   id: 4,
  //   title: "Waiting",
  //   description: "This is a description.",
  //   date: dayjs().format("DD-MM-YYYY HH:mm"),
  //   status: "pending",
  // },
  // {
  //   id: 5,
  //   title: "Waiting",
  //   description: "This is a description.",
  //   date: dayjs().add(1, "day").format("DD-MM-YYYY HH:mm"),
  //   status: "pending",
  // },
];

const TimelinePage: React.FC = () => {
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newStepAdded, setNewStepAdded] = useState(false);

  useEffect(() => {
    if (!isModalVisible && isAdding) {
      setNewStepAdded(true);
    }
  }, [isModalVisible, isAdding]);

  const showModal = (step: Step | null = null) => {
    setCurrentStep(step);
    if (step) {
      formik.setFieldValue("title", step.title);
      formik.setFieldValue("comment", step.description);
      formik.setFieldValue("status", step.status);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    formik.resetForm();
    setCurrentStep(null);
    setIsAdding(false);
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      comment: "",
      status: "pending",
    },
    onSubmit: (values) => {
      if (currentStep) {
        const updatedSteps = steps.map((step) =>
          step.id === currentStep.id
            ? {
                ...step,
                title: values.title,
                description: values.comment,
                status: values.status as "pending" | "approved" | "rejected",
              }
            : step
        );
        setSteps(updatedSteps);
      } else {
        const newStep: Step = {
          id: steps.length + 1,
          title: values.title || "New Step",
          description: values.comment,
          date: dayjs().format("DD-MM-YYYY HH:mm"),
          status: values.status as "pending" | "approved" | "rejected",
        };
        setSteps([...steps, newStep]);
      }
      setIsModalVisible(false);
      formik.resetForm();
      setCurrentStep(null);
      setIsAdding(false);
    },
  });

  return (
    <div className="p-5">
      <Steps
        progressDot
        current={10}
        direction="vertical"
        items={steps
          .slice()
          .reverse()
          .map((step, index) => ({
            title: (
              <span
                onClick={() => showModal(steps[steps.length - 1 - index])}
                className={
                  step.status === "approved"
                    ? "text-green-600 cursor-pointer"
                    : step.status === "rejected"
                    ? "text-red-600 cursor-pointer"
                    : "cursor-pointer"
                }
              >
                {step.title} -{" "}
                {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
              </span>
            ),
            description: (
              <div>
                <p>{step.description}</p>
                <p className="text-sm text-gray-500">{step.date}</p>
              </div>
            ),
            className: newStepAdded && index === 0 ? "step-new" : "",
          }))}
      />
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
        title={
          isAdding
            ? "Add New Step"
            : currentStep
            ? currentStep.title
            : "Step Detail"
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formik.handleSubmit()}
          >
            Submit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Title">
            <Input
              value={formik.values.title}
              onChange={(e) => formik.setFieldValue("title", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea
              rows={4}
              value={formik.values.comment}
              onChange={(e) => formik.setFieldValue("comment", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Status">
            <Radio.Group
              value={formik.values.status}
              onChange={(e) => formik.setFieldValue("status", e.target.value)}
            >
              <Radio value="approved">Approved</Radio>
              <Radio value="pending">Pending</Radio>
              <Radio value="rejected">Rejected</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TimelinePage;