"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
    Typography
} from "antd";
import axios from "axios";
import vendorStore from "@/store/vendorStore";
import { useRouter } from 'next/navigation'


interface VendorVerificationList {
    id: number;
    company_name: string;
    vendor_number: string;
    pic_name: string;
    company_email: string;
    company_phone_number: string;
    status: string;
    verificator: string;
    progress_verification: string;
}

const VendorVerificationList: React.FC = () => {
    const router = useRouter()
    const {
        vendorVerificationList,
        initializeVendorVerificationList,
    } = vendorStore.useVendorVerificationStore();

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // Initialize data if needed
        getAllVendorList()
    }, []);

    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
        },
        {
            title: "Vendor Number",
            dataIndex: "vendor_number",
            key: "vendor_number",
        },
        {
            title: "PIC",
            dataIndex: "pic_name",
            key: "pic_name",
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Type",
            dataIndex: "vendor_type",
            key: "vendor_type",
        },
        {
            title: "Status Vendor",
            dataIndex: "status_vendor",
            key: "status_vendor",
        },
        {
            title: "Verificator",
            dataIndex: "verificator",
            key: "verificator",
        },
        {
            title: "Progress Verification",
            dataIndex: "progress_verification",
            key: "progress_verification",
        },
        {
            title: "",
            dataIndex: "action",
            key: "action",
            render: (_: any, record: VendorVerificationList) => {
                return (
                    <span>
                        <Typography.Link onClick={() => router.push(`/vendor/verification/${record.id}`)} style={{ marginRight: 8 }}>
                            Edit
                        </Typography.Link>
                    </span>
                );
            },
        },
    ]

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: VendorVerificationList) => ({
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
            const response = await axios.get("https://vendorv2.delpis.online/api/verifikator/vendor", {
                // headers: {
                //     "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                // }
            });
            console.log("Response from API:", response.data.data);
            let index = 0;
            response.data.data.map((e: any) => {
                index++
                e.status_vendor = "Active"
                e.no = index
            })
            const vendorList: VendorVerificationList[] = await response.data.data
            initializeVendorVerificationList(vendorList);
        } catch (error) {
            message.error(`Get Data Vendor Registered failed! ${error}`);
            console.error("Error Get Data Vendor Registered:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <h1 className="font-bold text-start text-xl mb-5">Verification</h1>
            <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button>
            <Table
                components={{}}
                bordered
                loading={isLoading}
                rowKey={(record) => record.id.toString()}
                dataSource={vendorVerificationList}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    )
}

export default VendorVerificationList