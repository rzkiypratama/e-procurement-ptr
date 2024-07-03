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
import { ExclamationCircleFilled } from '@ant-design/icons';
import { useFormik } from "formik";
import useMasterDataStore from "@/store/masterData";
import axios from "axios";

interface VendorBusinessField {
    name: string;
    status: boolean;
}

interface VendorBusinessFieldList {
    id: number;
    name: string;
    statusName: string;
    status: boolean;
}

const VendorBusinessField = () => {
    const {
        masterData,
        masterDataList,
        initializeMasterDataList,
        addMasterDataList,
        removeItem
    } = useMasterDataStore();

    const { loading, setLoading } = useMasterDataStore();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedId, setSelectedID] = useState(-1);
    const [selectedItem, setSelectedItem] = useState(masterData);

    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Business Field Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Status",
            dataIndex: "statusName",
            key: "statusName",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_: any, record: VendorBusinessFieldList) => {
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
    ];

    const showModal = () => {
        setIsModalVisible(true);
        form.resetFields()
        formik.resetForm()
        let emptyData = {
            name: "",
            status: false,
        }
        form.setFieldsValue({ ...emptyData })
        setIsActive(false)
        setIsEdit(false)
    };

    const changeStatus = (value: boolean) => {
        formik.values.status = value
        setIsActive(value);
    };

    const [form] = Form.useForm();
    const formik = useFormik({
        initialValues: {
            ...masterData
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("Form Values:", values);
            setLoading(true);
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/master/vendor-business-field`, values, {
                    headers: {
                        "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                    }
                });
                console.log("Response from API:", response.data);
                setFormSubmitted(true);
                if (response.status == 201) {
                    const newBusinessField = {
                        no: masterDataList.length + 1,
                        id: response.data.data.id,
                        name: response.data.data.name,
                        status: response.data.data.status,
                        statusName: response.data.data.status ? "Active" : "Inactive"
                    }
                    let jsonStr = JSON.stringify(newBusinessField)
                    let newData: VendorBusinessFieldList = JSON.parse(jsonStr)
                    addMasterDataList(newData)
                    message.success(`Add new business field successfully`)
                    setIsModalVisible(false)
                    setIsActive(false)
                } else {
                    message.error(`${response.data.message}`);
                }
            } catch (error) {
                message.error(`Add Business Field failed! ${error}`);
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }
    })

    useEffect(() => {
        // Initialize data if needed
        listVendorBusinessField()
    }, []);

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: VendorBusinessFieldList) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
            }),
        };
    });

    const handleOk = async () => {
        if (!isEdit) {
            console.log(isEdit)
            form.validateFields().then((values) => {
                formik.values.name = values.name;
                formik.handleSubmit()
            });
        } else {
            await updateVendorBusinessField()
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    const listVendorBusinessField = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/master/vendor-business-field`, {
                headers: {
                    "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                }
            });
            console.log("Response from API:", response.data.data);
            let index = 0;
            response.data.data.map((e: any) => {
                index++
                e.statusName = e.status == 1 ? "Active" : "Inactive"
                e.no = index
            })
            const data: VendorBusinessFieldList[] = await response.data.data
            initializeMasterDataList(data)
            console.log(masterDataList.length)
        } catch (error) {
            message.error(`Get Data Business Field failed! ${error}`);
            console.error("Error Get Data Business Field:", error);
        } finally {
            setLoading(false)
        }
    }

    const editModal = (record: VendorBusinessFieldList) => {
        console.log(record)
        form.resetFields()
        form.setFieldsValue({ ...record })
        formik.setFieldValue("name", record.name)
        formik.setFieldValue("status", record.status)
        setIsActive(record.status)
        setIsModalVisible(true)
        setIsEdit(true)
        setSelectedID(record.id)
    };

    const showModalConfirm = (record: VendorBusinessFieldList) => {
        setIsModalConfirmVisible(true)
        setSelectedItem(record)
        setSelectedID(record.id)
    };

    const updateVendorBusinessField = async () => {
        const body = {
            ...formik.values,
            _method: "PUT"
        }
        console.log(body)
        setLoading(true)
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/master/vendor-business-field/${selectedId}`, body, {
                headers: {
                    "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                }
            });
            console.log("Response from API:", response.data);
            setFormSubmitted(true);
            message.success(`Update Business Field successfully`);
            setIsModalVisible(false)
            var indexSelected = masterDataList.findIndex(x => x.id == selectedId)
            masterDataList[indexSelected].name = response.data.data.name
            masterDataList[indexSelected].status = response.data.data.status
            masterDataList[indexSelected].statusName = response.data.data.status ? "Active" : "Inactive"
        } catch (error) {
            message.error(`Edit Business Field failed! ${error}`);
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    }

    const deleteVendorBusinessField = async () => {
        setLoading(true)
        try {
            const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/master/vendor-business-field/${selectedId}`, {
                // headers: {
                //     "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                // }
            });
            console.log("Response from API:", response.data);
            setFormSubmitted(true);
            message.success(`Delete business field successfully`)
            setIsModalConfirmVisible(false)
            var selectedIndex = masterDataList.findIndex(x => x.id == selectedId)
            console.log(selectedIndex)
            // delete masterDataList[selectedIndex]

            // masterDataList.splice(selectedIndex, 1)
            removeItem(selectedIndex)
            console.log(masterDataList)
        } catch (error) {
            message.error(`Delete Business Field failed! ${error}`);
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <Button type="primary" onClick={showModal} className="mb-5 float-end">
                Tambah
            </Button>
            <Modal
                title={isEdit ? "Edit Business Field" : "Add Business Field"}
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Business Field Name"
                        initialValue={formik.values.name}
                        rules={[{ required: true, message: "Business field name is required" }]}>
                        <Input name="name" onChange={formik.handleChange} value={formik.values.name} />
                    </Form.Item>
                    <div className="grid grid-flow-col auto-cols-max">
                        <Switch className="me-2" onChange={changeStatus} defaultValue={isActive} value={isActive} >
                        </Switch>
                        <h2 className="float-right">{isActive ? "Active" : "Inactive"}</h2>
                    </div>
                </Form>
            </Modal>
            <Table
                components={{}}
                bordered
                loading={loading}
                rowKey={(record) => record.id.toString()}
                dataSource={masterDataList}
                columns={mergedColumns}
                rowClassName="editable-row"
            />

            <Modal centered open={isModalConfirmVisible}
                onOk={deleteVendorBusinessField}
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
                <h1>Are you sure delete this business field <b>{selectedItem.name}</b>?</h1>
            </Modal>
        </div >
    )
}

export default VendorBusinessField