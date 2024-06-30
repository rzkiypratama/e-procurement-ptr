"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
} from "antd";
import axios from "axios";
import useVendorRegisteredStore from "@/store/vendorStore";


interface VendorRegisteredList {
    id: number;
    companyName: string;
    vendorNumber: string;
    pic: string;
    email: string;
    phoneNumber: string;
    status: string;
    type: string;
    statusVendor: string;
}

const VendorRegisteredList: React.FC = () => {
    const {
        vendorRegisteredList,
        initializeVendorRegisteredList,
    } = useVendorRegisteredStore();

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Initialize data if needed
        getAllVendorList()
    }, []);

    const columns = [
        { title: "No", dataIndex: "id", key: "id" },
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
        },
        {
            title: "Vendor Number",
            dataIndex: "vendorNumber",
            key: "vendorNumber",
        },
        {
            title: "PIC",
            dataIndex: "pic",
            key: "pic",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone Number",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Status Vendor",
            dataIndex: "statusVendor",
            key: "statusVendor",
        },
    ]

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: VendorRegisteredList) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
                key: col.key,
            }),
        };
    });

    const getAllVendorList = async () => {
        setIsLoading(true)
        try {
            const vendorList: VendorRegisteredList[] = [
                { id: 1, companyName: "PT Jaya Abadi", vendorNumber: "00001", pic: "User 1", email: "ptjayaabadi@gmail.com", phoneNumber: "0811112222", status: "Registered", type: "Internal", statusVendor: "Active" },
                { id: 2, companyName: "PT Mulya Sentosa", vendorNumber: "00002", pic: "User 2", email: "ptmulyasentosa@gmail.com", phoneNumber: "0822223333", status: "Registered", type: "Internal", statusVendor: "Active" },
                { id: 3, companyName: "PT Cinta Sejati", vendorNumber: "00003", pic: "User 3", email: "ptcintasejati@gmail.com", phoneNumber: "0822223333", status: "Registered", type: "Internal", statusVendor: "Active" },
                { id: 4, companyName: "PT Aloha Tech", vendorNumber: "00004", pic: "User 4", email: "ptalohatech@gmail.com", phoneNumber: "0822223333", status: "Verified", type: "External", statusVendor: "Inactive" },
            ]; // Load your initial data here
            initializeVendorRegisteredList(vendorList);
        } catch (error) {
            message.error(`Get Data Vendor Registered failed! ${error}`);
            console.error("Error Get Data Vendor Registered:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button>
            <Table
                components={{}}
                bordered
                rowKey={(record) => record.id.toString()}
                dataSource={vendorRegisteredList}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    )
}

export default VendorRegisteredList