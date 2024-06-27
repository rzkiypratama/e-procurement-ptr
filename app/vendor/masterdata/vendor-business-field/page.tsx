"use client";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import {
    Form,
    Modal,
    Button,
    Input,
    Table,
    Switch
} from "antd";
import { useFormik } from "formik";
import useMasterDataStore from "@/store/masterData";

interface MasterData {
    id: number;
    name: string;
    status: string;
}

const VendorBusinessField = () => {
    const {
        masterDatas,
        addMasterData,
        editMasterData,
        removeMasterData,
        initializeMasterData,
    } = useMasterDataStore();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const columns = [
        { title: "No", dataIndex: "id", key: "id" },
        {
            title: "Business Field Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
        },
    ];

    const showModal = () => {
        setIsModalVisible(true);
    };

    const changeStatus = (value: boolean) => {
        setIsActive(value);
    };

    const [form] = Form.useForm();
    const formik = useFormik({
        initialValues: {},
        validationSchema: Yup.object({
            name: Yup.string().required("Required"),
        }),
        onSubmit: (values) => {
            console.log("Form Values:", values);
        }
    })

    useEffect(() => {
        // Initialize data if needed
        const initialData: MasterData[] = [
            { id: 1, name: "Konstruksi", status: "Aktif" },
            { id: 2, name: "Mining", status: "Aktif" },
            { id: 3, name: "Logistic", status: "Aktif" },
        ]; // Load your initial data here
        initializeMasterData(initialData);
    }, [initializeMasterData]);

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: MasterData) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
            }),
        };
    });

    const handleOk = () => {
        form.validateFields().then((values) => {
            console.log("Valid")
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <Button type="primary" onClick={showModal} className="mb-5 float-end">
                Tambah
            </Button>
            <Modal
                title="Add Business Field"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Business Filed Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" label="Status" rules={[]}>
                        <div className="grid grid-flow-col auto-cols-max">
                            <Switch className="me-2" onChange={changeStatus} defaultValue={isActive} >
                            </Switch>
                            <h2 className="float-right">{isActive ? "Active" : "Inactive"}</h2>
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
            <Table
                components={{}}
                bordered
                dataSource={masterDatas}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div >
    )
}

export default VendorBusinessField