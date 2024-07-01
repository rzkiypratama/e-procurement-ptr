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
import useCurrencyStore from "@/store/currencyStore";

interface Currency {
    name: string;
    status: boolean;
}

interface CurrencyList {
    id: number;
    code: string;
    name: string;
    statusName: string;
    status: boolean;
}

const CurrencyData: React.FC = () => {
    const {
        currencyData,
        currencyDataList,
        initializeCurrencyList,
        addCurrencyList,
        removeItem
    } = useCurrencyStore();

    const { loading, setLoading } = useCurrencyStore()
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModalConfirmVisible, setIsModalConfirmVisible] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const [formSubmitted, setFormSubmitted] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedId, setSelectedID] = useState(-1)
    const [selectedItem, setSelectedItem] = useState(currencyData)

    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Code",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Name",
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
            render: (_: any, record: CurrencyList) => {
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
            code: "",
            name: "",
            status: false,
        }
        form.setFieldsValue({ ...emptyData })
        setIsActive(false)
        setIsEdit(false)
    }

    const changeStatus = (value: boolean) => {
        formik.values.status = value
        setIsActive(value);
    }

    const [form] = Form.useForm();
    const formik = useFormik({
        initialValues: {
            ...currencyData
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            console.log("Form Values: ", values);
            setLoading(true);
            try {
                const response = await axios.post("https://vendorv2.delpis.online/api/master/currency", values, {
                    headers: {
                        "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                    }
                });
                console.log("Response from API:", response.data);
                setFormSubmitted(true);
                if (response.status == 201) {
                    console.log(currencyDataList.length)
                    console.log(currencyDataList.length + 1)
                    const newPosition = {
                        no: currencyDataList.length + 1,
                        id: response.data.data.id,
                        code: response.data.data.code,
                        name: response.data.data.name,
                        status: response.data.data.status,
                        statusName: response.data.data.status ? "Active" : "Inactive"
                    }
                    let jsonStr = JSON.stringify(newPosition)
                    let newData: CurrencyList = JSON.parse(jsonStr)
                    addCurrencyList(newData)
                    message.success(`Add Currency Successfully`)

                    form.resetFields()
                    formik.resetForm()
                    setIsModalVisible(false)
                    setIsActive(false)
                } else {
                    message.error(`${response.data.message}`);
                }
            } catch (error) {
                message.error(`Add Currency failed! ${error}`);
                console.error("Error submitting form:", error);
            } finally {
                setLoading(false);
            }
        }
    })

    useEffect(() => {
        // Initialize data if needed
        listCurrency()
    }, []);

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: CurrencyList) => ({
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
                formik.values.code = values.code;
                formik.values.name = values.name;
                formik.handleSubmit()
            });
        } else {
            await updateCurrency()
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const listCurrency = async () => {
        try {
            const response = await axios.get("https://vendorv2.delpis.online/api/master/currency", {
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
            const data: CurrencyList[] = await response.data.data
            initializeCurrencyList(data)
            console.log(currencyDataList.length)
        } catch (error) {
            message.error(`Get Data Currency failed! ${error}`);
            console.error("Error Get Data Position:", error);
        } finally {

        }
    }

    const editModal = (record: CurrencyList) => {
        console.log(record)
        form.resetFields()
        form.setFieldsValue({ ...record })
        formik.setFieldValue("code", record.code)
        formik.setFieldValue("name", record.name)
        formik.setFieldValue("status", record.status)
        setIsActive(record.status)
        setIsModalVisible(true)
        setIsEdit(true)
        setSelectedID(record.id)
    };

    const showModalConfirm = (record: CurrencyList) => {
        setIsModalConfirmVisible(true)
        setSelectedItem(record)
        setSelectedID(record.id)
    };

    const updateCurrency = async () => {
        const body = {
            ...formik.values,
            _method: "PUT"
        }
        setLoading(true)
        try {
            const response = await axios.post(`https://vendorv2.delpis.online/api/master/currency/${selectedId}`, body, {
                headers: {
                    "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                }
            })
            console.log("Response from API:", response.data)
            setFormSubmitted(true)
            message.success(`Update Currency Successfully`)
            setIsModalVisible(false)
            var indexSelected = currencyDataList.findIndex(x => x.id == selectedId)
            currencyDataList[indexSelected].code = response.data.data.code
            currencyDataList[indexSelected].name = response.data.data.name
            currencyDataList[indexSelected].status = response.data.data.status
            currencyDataList[indexSelected].statusName = response.data.data.status ? "Active" : "Inactive"
        } catch (error) {
            message.error(`Update Currency failed! ${error}`);
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    }

    const deleteCurrency = async () => {
        setLoading(true)
        try {
            const response = await axios.delete(`https://vendorv2.delpis.online/api/master/currency/${selectedId}`, {
                headers: {
                    "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                }
            });
            console.log("Response from API:", response.data);
            setFormSubmitted(true);
            message.success(`Delete Currency Successfully`)
            setIsModalConfirmVisible(false)
            var selectedIndex = currencyDataList.findIndex(x => x.id == selectedId)
            console.log(selectedIndex)
            removeItem(selectedIndex)
            console.log(currencyDataList)
        } catch (error) {
            message.error(`Delete Currency failed! ${error}`);
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
                title="Add Position"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item name="code" label="Code"
                        initialValue={formik.values.name}
                        rules={[{ required: true, message: "Code is required" }]}>
                        <Input name="code" onChange={formik.handleChange} value={formik.values.code} />
                    </Form.Item>
                    <Form.Item name="name" label="Name"
                        initialValue={formik.values.name}
                        rules={[{ required: true, message: "Name is required" }]}>
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
                dataSource={currencyDataList}
                columns={mergedColumns}
                rowClassName="editable-row"
            />

            <Modal centered open={isModalConfirmVisible}
                onOk={deleteCurrency}
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
                <h1>Are you sure delete this currency <b>{selectedItem.name}</b>?</h1>
            </Modal>
        </div >
    )
}

export default CurrencyData