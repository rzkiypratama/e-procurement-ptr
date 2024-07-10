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
import { getCookie } from "cookies-next";


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
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            sorter: (a: VendorVerificationList, b: VendorVerificationList) => a.id - b.id,
        },
        {
            title: "Vendor Number",
            dataIndex: "vendor_number",
            key: "vendor_number",
        },
        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
            filters: vendorVerificationList.map(vendor => ({
                text: vendor.company_name,
                value: vendor.company_name,
            })),
            onFilter: (value: any, record: { company_name: string | any[]; }) => record.company_name.includes(value),
            filterSearch: true,
        },
        {
            title: "PIC",
            dataIndex: "pic_name",
            key: "pic_name",
            filters: vendorVerificationList.map(vendor => ({
                text: vendor.pic_name,
                value: vendor.pic_name,
            })),
            onFilter: (value: any, record: { pic_name: string | any[]; }) => record.pic_name.includes(value),
            filterSearch: true,
        },
        {
            title: "Type",
            dataIndex: "vendor_type",
            key: "vendor_type",
        },
        {
            title: "Status Vendor",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Verification Status",
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
            sorter: (a: VendorVerificationList, b: VendorVerificationList) => a.id - b.id,
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

            const token = getCookie("token");
            const userId = getCookie("user_id");
            const vendorId = getCookie("vendor_id");
            const groupUserCode = getCookie('group_user_code')

            if (!token || !userId || (groupUserCode == 'vendor' && !vendorId)) {
                message.error("Please login first.");
                return;
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor`, {
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

    const onChange = (pagination: any, filters: any, sorter: any) => {
        console.log("params", pagination, filters, sorter);
    };

    return (
        <div className=''>
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
                onChange={onChange}
                scroll={{
                    x: 1300,
                }}
            />
        </div>
    )
}

export default VendorVerificationList