"use client";
import React, { useState, useEffect } from "react";
import {
    Form,
    Modal,
    Button,
    Input,
    Table,
    Switch,
    message,
    Typography
} from "antd";
import { useFormik } from "formik";
import { ExclamationCircleFilled } from '@ant-design/icons';
import axios from "axios";
import useDepartmentStore from "@/store/departmentStore";
import { getCookie } from "cookies-next";

interface Department {
    id: number;
    department_name: string;
    department_code: string;
}

const ViewDepartment: React.FC = () => {
    const {
        department,
        departmentList,
        initializeDepartmentList,
        addDepartmentList,
        removeItem
    } = useDepartmentStore();

    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedId, setSelectedID] = useState(-1)
    const [selectedItem, setSelectedItem] = useState(department)

    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Name",
            dataIndex: "department_name",
            key: "department_name",
        },
        {
            title: "Department Code",
            dataIndex: "department_code",
            key: "department_code",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_: any, record: Department) => {
                return (
                    <span>
                        <Typography.Link onClick={() => editModal(record)} style={{ marginRight: 8 }}>
                            Edit
                        </Typography.Link>
                        <Typography.Link onClick={() => showModalConfirm(record)} style={{ marginRight: 8, color: "#dc2626" }}>
                            Delete
                        </Typography.Link>
                    </span>
                );
            },
        },
    ]

    const showModal = () => {
        setIsModalVisible(true);
        form.resetFields()
        formik.resetForm()
        let emptyData = {
            department_name: "",
            department_code: "",
        }
        form.setFieldsValue({ ...emptyData })
        setIsEdit(false)
    }

    const [form] = Form.useForm();
    const formik = useFormik({
        initialValues: {
            ...department
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("Form Values: ", values);
            setLoading(true);
            try {
                const token = getCookie("token");
                const userId = getCookie("user_id");
                const vendorId = getCookie("vendor_id");

                if (!token || !userId) {
                    message.error("Please login first.");
                    return;
                }
                const response = await axios.post(`https://requisition.eproc.latansa.sch.id/api/master/department`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "User-ID": userId,
                        "Vendor-ID": vendorId,
                    },
                });
                console.log("Response from API:", response.data);
                setFormSubmitted(true);
                if (response.status == 201 || response.status == 200) {
                    const newDepartment = {
                        no: departmentList.length + 1,
                        id: response.data.data.id,
                        department_name: response.data.data.department_name,
                        department_code: response.data.data.department_code
                    }
                    let jsonStr = JSON.stringify(newDepartment)
                    let newData: Department = JSON.parse(jsonStr)
                    addDepartmentList(newData)
                    message.success(`Add Department Successfully`)

                    form.resetFields()
                    formik.resetForm()
                    setIsModalVisible(false)
                } else {
                    message.error(`${response.data.message}`);
                }
            } catch (error) {
                message.error(`Add Department failed! ${error}`);
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }
    })

    useEffect(() => {
        // Initialize data if needed
        listDepartment()
    }, []);

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: Department) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
                key: col.key,
            }),
        };
    });

    const handleOk = async () => {
        if (!isEdit) {
            console.log(isEdit)
            form.validateFields().then((values) => {
                // formik.values.department_name = values.department_name;
                formik.handleSubmit()
            });
        } else {
            await updateDepartment()
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const listDepartment = async () => {
        try {
            const token = getCookie("token");
            const userId = getCookie("user_id");
            const vendorId = getCookie("vendor_id");

            if (!token || !userId || !vendorId) {
                message.error("Please login first.");
                return;
            }

            const response = await axios.get(`https://requisition.eproc.latansa.sch.id/api/master/department`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-ID": userId,
                    "Vendor-ID": vendorId,
                },
            });
            console.log("Response from API:", response.data.data);
            let index = 0;
            response.data.data.map((e: any) => {
                index++
                e.no = index
            })
            const data: Department[] = await response.data.data
            initializeDepartmentList(data)
            console.log(departmentList.length)
        } catch (error) {
            message.error(`Get Data Department failed! ${error}`);
            console.error("Error Get Data Position:", error);
        } finally {

        }
    }

    const editModal = (record: Department) => {
        console.log(record)
        form.resetFields()
        form.setFieldsValue({ ...record })
        formik.setFieldValue("department_name", record.department_name)
        formik.setFieldValue("department_code", record.department_code)
        setIsModalVisible(true)
        setIsEdit(true)
        setSelectedID(record.id)
    };

    const showModalConfirm = (record: Department) => {
        setIsModalConfirmVisible(true)
        setSelectedItem(record)
        setSelectedID(record.id)
    };

    const updateDepartment = async () => {
        console.log("TEST : ")
        console.log(formik.values)
        const body = {
            ...formik.values,
            _method: "PUT"
        }
        setLoading(true)
        try {
            const token = getCookie("token");
            const userId = getCookie("user_id");
            const vendorId = getCookie("vendor_id");

            if (!token || !userId) {
                message.error("Please login first.");
                return;
            }
            const response = await axios.post(`https://requisition.eproc.latansa.sch.id/api/master/department/${selectedId}`, body, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-ID": userId,
                    "Vendor-ID": vendorId,
                },
            })
            console.log("Response from API:", response.data)
            setFormSubmitted(true)
            message.success(`Update Department Successfully`)
            setIsModalVisible(false)
            var indexSelected = departmentList.findIndex(x => x.id == selectedId)
            departmentList[indexSelected].department_name = response.data.data.department_name
            departmentList[indexSelected].department_code = response.data.data.department_code
        } catch (error) {
            message.error(`Update Department failed! ${error}`);
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    }

    const deleteDepartment = async () => {
        setLoading(true)
        try {
            const token = getCookie("token");
            const userId = getCookie("user_id");
            const vendorId = getCookie("vendor_id");

            if (!token || !userId || !vendorId) {
                message.error("Please login first.");
                return;
            }
            const response = await axios.delete(`https://requisition.eproc.latansa.sch.id/api/master/department/${selectedId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-ID": userId,
                    "Vendor-ID": vendorId,
                },
            });
            console.log("Response from API:", response.data);
            setFormSubmitted(true);
            message.success(`Delete Department Successfully`)
            setIsModalConfirmVisible(false)
            var selectedIndex = departmentList.findIndex(x => x.id == selectedId)
            console.log(selectedIndex)
            removeItem(selectedIndex)
            console.log(departmentList)
        } catch (error) {
            message.error(`Delete Department failed! ${error}`);
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <Button type="primary" onClick={showModal} className="mb-5 float-start">
                Add Department
            </Button>
            <Modal
                title="Add Department"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item name="department_name" id="department_name" label="Department Name"
                        initialValue={formik.values.department_name}
                        rules={[{ required: true, message: "Department Name is required" }]}>
                        <Input name="department_name" onChange={formik.handleChange} value={formik.values.department_name} />
                    </Form.Item>
                    {!isEdit ? <Form.Item name="department_code" label="Department Code"
                        initialValue={formik.values.department_code}
                        rules={[{ required: true, message: "Department Code is required" }]}>
                        <Input name="department_code" onChange={formik.handleChange} value={formik.values.department_code} />
                    </Form.Item> : <div></div>}
                </Form>
            </Modal>
            <Table
                components={{}}
                bordered
                loading={loading}
                rowKey={(record) => record.id.toString()}
                dataSource={departmentList}
                columns={mergedColumns}
                rowClassName="editable-row"
            />

            <Modal centered open={isModalConfirmVisible}
                onOk={deleteDepartment}
                onCancel={() => setIsModalConfirmVisible(false)}
                title={
                    <div className="flex flex-row">
                        <ExclamationCircleFilled style={{ color: "#eab308" }} />
                        <h1 className="ms-2">Delete Confirmation!</h1>
                    </div>
                }
                confirmLoading={loading}
                okText="Delete"
                okType='danger'>
                <h1>Are you sure delete this currency <b>{selectedItem.department_name}</b>?</h1>
            </Modal>
        </div >
    )
}

export default ViewDepartment