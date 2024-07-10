"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
} from "antd";
import axios from "axios";
import vendorStore from "@/store/vendorStore";
import Link from 'next/link';
import { getCookie } from 'cookies-next' //change

interface VendorRegisteredList {
    id: number;
    company_name: string;
    vendor_number: string;
    pic_name: string;
    company_email: string;
    company_phone_number: string;
    status: string;
    vendor_type: string;
    status_vendor: string;
}

const VendorRegisteredList: React.FC = () => {
    const token = getCookie('token');
    const {
        vendorRegisteredList,
        initializeVendorRegisteredList,
    } = vendorStore.useVendorRegisteredStore();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        getAllVendorList();
    }, []);

    const getAllVendorList = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get("https://vendorv2.delpis.online/api/verifikator/vendor", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("Response from API:", response.data.data);
            let index = 0;
            response.data.data.forEach((e: any) => {
                index++;
                e.status_vendor = "Active";
                e.no = index;
            });
            const vendorList: VendorRegisteredList[] = await response.data.data;
            initializeVendorRegisteredList(vendorList);
        } catch (error) {
            message.error(`Get Data Vendor Registered failed! ${error}`);
            console.error("Error Get Data Vendor Registered:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
            sorter: (a: VendorRegisteredList, b: VendorRegisteredList) => a.id - b.id,
        },
        {
            title: "Company Name",
            dataIndex: "company_name",
            key: "company_name",
            render: (_: any, record: VendorRegisteredList) => (
                <Link href={`/vendor/detail/${record.id}`} style={{ marginRight: 8, textDecoration: 'underline' }} className="text-blue-500">
                    <p>{record.company_name}</p>
                </Link>
            ),
            filters: vendorRegisteredList.map(vendor => ({
                text: vendor.company_name,
                value: vendor.company_name,
            })),
            onFilter: (value: any, record: { company_name: string | any[]; }) => record.company_name.includes(value),
            filterSearch: true,
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
            filters: vendorRegisteredList.map(vendor => ({
                text: vendor.pic_name,
                value: vendor.pic_name,
            })),
            onFilter: (value: any, record: { pic_name: string | any[]; }) => record.pic_name.includes(value),
            filterSearch: true,
        },
        {
            title: "Email",
            dataIndex: "company_email",
            key: "company_email",
        },
        {
            title: "Phone Number",
            dataIndex: "company_phone_number",
            key: "company_phone_number",
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
    ];

    const onChange = (pagination: any, filters: any, sorter: any) => {
        console.log("params", pagination, filters, sorter);
    };

    return (
        <div className=''>
            <h1 className="font-bold text-start text-xl mb-5">Vendor List</h1>
            <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button>
            <Table
                components={{}}
                bordered
                loading={isLoading}
                rowKey={(record) => record.id.toString()}
                dataSource={vendorRegisteredList}
                columns={columns}
                rowClassName="editable-row"
                onChange={onChange}
                scroll={{
                    x: 1300,
                }}
            />
        </div>
    );
}

export default VendorRegisteredList;