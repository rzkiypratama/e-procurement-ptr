import React, { useEffect, useState } from "react";
import { Button, Form, Input, DatePicker, message, Select } from "antd";
import dayjs from "dayjs";
import UserReqTimelineStore from "../store/CenterStore";
import { useFormik } from "formik";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

const { TextArea } = Input;

interface UserReqTimeline {
  id: number;
  choose_method: string;
  start_utilization_date: string;
  end_utilization_date: string;
  start_contract_date: string;
  end_contract_date: string;
  start_selection_date: string;
  end_selection_date: string;
  announcement_date: string;
}

interface ChooseMethodList {
  id: number;
  code: number;
  name: string;
  category_slug: string;
  category_name: string;
}

const UserTimeline: React.FC = () => {
  const { userReqTimeline, addUserReqTimeline, editUserReqTimeline, removeUserReqTimeline } = UserReqTimelineStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [getChooseMethodList, setGetChooseMethod] = useState<ChooseMethodList[]>([]);

  useEffect(() => {
    getChooseMethod()
  }, [])

  const formik = useFormik({
    initialValues: {
      choose_method: "",
      start_utilization_date: "",
      end_utilization_date: "",
      start_contract_date: "",
      end_contract_date: "",
      start_selection_date: "",
      end_selection_date: "",
      announcement_date: ""
    },
    onSubmit: async (values) => {
      const token = getCookie("token")
      const requisitionId = getCookie("requisition_id")

      if (!token) {
        message.error("Please Login first.");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang/timeline/${requisitionId}`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log("Response from API:", response.data);
        if (response.status === 201 || response.status === 200) {
          addUserReqTimeline({ ...values, id: response.data.data.id });
          // setFormSubmitted(true)
          deleteCookie('requisition_id');
          setIsEditMode(false);
          setEditingId(null);
          message.success("Add Procurement successfully");
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
  });

  const handleEdit = (record: UserReqTimeline) => {
    formik.setValues(record);
    setIsEditMode(true);
    setEditingId(record.id);
  };

  const handleDelete = (id: number) => {
    removeUserReqTimeline(id);
    message.success("SPT deleted successfully");
  };

  const getChooseMethod = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/master/parameters?filter[category_slug]=metode-pemilihan`,
      );

      const data = await response.data.data
      setGetChooseMethod(data)

      formik.values.choose_method = data[0].name
      form.setFieldValue('choose_method', data[0].name)
    } catch (error) {
      console.error("Error fetching data choose method:", error);
      message.error("Failed to fetch data choose method. Please try again later.");
    } finally {

    }
  }

  return (
    <div>
      <Form form={form} onFinish={formik.handleSubmit} layout="vertical">
        <Form.Item
          name="choose_method"
          label="Metode Pemilihan"
          rules={[{ required: true, message: "Metode pemilihan harus diisi" }]}
        >
          <Select id="choose_method"
            value={formik.values.choose_method}
            onChange={(value) => {
              formik.setFieldValue("choose_method", value);
            }}
            onBlur={formik.handleBlur}>
            {getChooseMethodList.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          // name='start_utilization_date'
          label="Pemanfaatan Barang Jasa"
          rules={[{ required: true, message: "Pemanfaatan Barang Jasa harus diisi" }]}
        >
          <div className="flex gap-5 items-center">
            <span className="flex flex-col items-center gap-3">
              <p>Mulai</p>
              <DatePicker
                value={
                  formik.values.start_utilization_date
                    ? dayjs(formik.values.start_utilization_date, "YYYY-MM-DD")
                    : null
                }
                format="DD-MM-YYYY"
                onChange={(date) =>
                  formik.setFieldValue(
                    "start_utilization_date",
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
              />
            </span>
            <span className="flex flex-col items-center gap-3">
              <p>Akhir</p>
              <DatePicker
                value={
                  formik.values.end_utilization_date
                    ? dayjs(formik.values.end_utilization_date, "YYYY-MM-DD")
                    : null
                }
                format="DD-MM-YYYY"
                onChange={(date) =>
                  formik.setFieldValue(
                    "end_utilization_date",
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
              />
            </span>
          </div>
        </Form.Item>
        <Form.Item
          // name='start_contract_date'
          label="Jadwal Pelaksanaan Kontrak"
          rules={[{ required: true, message: "Jadwal Pelaksanaan Kontrak harus diisi" }]}
        >
          <div className="flex gap-5 items-center">
            <span className="flex flex-col items-center gap-3">
              <p>Mulai</p>
              <DatePicker
                value={
                  formik.values.start_contract_date
                    ? dayjs(formik.values.start_contract_date, "YYYY-MM-DD")
                    : null
                }
                format="DD-MM-YYYY"
                onChange={(date) =>
                  formik.setFieldValue(
                    "start_contract_date",
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
              />
            </span>
            <span className="flex flex-col items-center gap-3">
              <p>Akhir</p>
              <DatePicker
                value={
                  formik.values.end_contract_date
                    ? dayjs(formik.values.end_contract_date, "YYYY-MM-DD")
                    : null
                }
                format="DD-MM-YYYY"
                onChange={(date) =>
                  formik.setFieldValue(
                    "end_contract_date",
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
              />
            </span>
          </div>
        </Form.Item>
        <Form.Item
          // name='start_selection_date'
          label="Jadwal Pemilihan Penyedia"
          rules={[{ required: true, message: "Jadwal Pemilihan Penyedia harus diisi" }]}
        >
          <div className="flex gap-5 items-center">
            <span className="flex flex-col items-center gap-3">
              <p>Mulai</p>
              <DatePicker
                value={
                  formik.values.start_selection_date
                    ? dayjs(formik.values.start_selection_date, "YYYY-MM-DD")
                    : null
                }
                format="DD-MM-YYYY"
                onChange={(date) =>
                  formik.setFieldValue(
                    "start_selection_date",
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
              />
            </span>
            <span className="flex flex-col items-center gap-3">
              <p>Akhir</p>
              <DatePicker
                value={
                  formik.values.end_selection_date
                    ? dayjs(formik.values.end_selection_date, "YYYY-MM-DD")
                    : null
                }
                format="DD-MM-YYYY"
                onChange={(date) =>
                  formik.setFieldValue(
                    "end_selection_date",
                    date ? date.format("YYYY-MM-DD") : "",
                  )
                }
              />
            </span>
          </div>
        </Form.Item>
        <Form.Item
          name="announcement_date"
          label="Tanggal Pengumuman"
          rules={[{ required: true, message: "Tanggal pengumuman harus diisi" }]}
        >
          <DatePicker
            value={
              formik.values.announcement_date
                ? dayjs(formik.values.announcement_date, "YYYY-MM-DD")
                : null
            }
            format="DD-MM-YYYY"
            onChange={(date) =>
              formik.setFieldValue(
                "announcement_date",
                date ? date.format("YYYY-MM-DD") : "",
              )
            }
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {isEditMode ? "Simpan Perubahan" : "Simpan Data"}
        </Button>
      </Form>
    </div>
  );
};

export default UserTimeline;