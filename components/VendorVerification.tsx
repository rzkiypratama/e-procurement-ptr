"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
    Typography,
    Input,
} from "antd";
import axios from "axios";
import vendorStore from "@/store/vendorStore";
import { useRouter } from 'next/navigation'
import { getCookie } from "cookies-next";

const { Search } = Input
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

interface Links {
    first: String,
    last: String,
    prev: String | null,
    next: String | null,
}

interface MetaLink {
    url: String | null,
    label: String | null,
    active: String | null,
}

interface Meta {
    current_page: number,
    from: number,
    last_page: number,
    links: MetaLink[]
    path: String
    per_page: number
    to: number
    total: number
}

interface Paginate {
    data: VendorVerificationList[]
    links: Links
    meta: Meta
}

const VendorVerificationList: React.FC = () => {
    const router = useRouter()
    const {
        paginateVendorVerification,
        initializeVendorVerificationList,
    } = vendorStore.useVendorVerificationStore();

    const [isLoading, setIsLoading] = useState(false)
    const [searchLoading, setSearchLoading] = useState(false)
    const [sortBy, setSortBy] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        // Initialize data if needed
        getAllVendorList("", 1)
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
            sorter: true,
        },
        {
            title: "PIC",
            dataIndex: "pic_name",
            key: "pic_name",
            sorter: true,
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
            title: "Status Verification",
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

    const getAllVendorList = async (params: String, page: number) => {
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
            //${process.env.NEXT_PUBLIC_API_URL}
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-ID": userId,
                    "Vendor-ID": vendorId,
                },
            });

            console.log("Response from API:", response.data);
            let index = page > 1 ? ((page * 10) + 1) : 1;
            response.data.data.map((e: any) => {
                index++
                e.status_vendor = "Active"
                e.no = index
            })
            const vendorList: Paginate = await response.data
            initializeVendorVerificationList(vendorList);
        } catch (error) {
            message.error(`Get Data Vendor Registered failed! ${error}`);
            console.error("Error Get Data Vendor Registered:", error);
        } finally {
            setIsLoading(false)
        }
    }

    const onChange = (pagination: any, filters: any, sorter: any) => {
        let params = `?page=${pagination.current}`
        if (searchQuery != "") {
            params = params + `&filter[company_name]=${searchQuery}`
        }

        if (sorter.field != "no") {
            const sort = sorter.order == 'ascend' ? '' : '-'
            params = params + `&sort=${sort}${sorter.field}`
            setSortBy(`sort=${sort}${sorter.field}`)
        }
        console.log(sorter)
        getAllVendorList(params, pagination.current)
    };

    const searchVendor = (value: string) => {
        setSearchLoading(true)
        setSearchQuery(value)
        let params = `?page=1&filter[company_name]=${value}`
        if (sortBy != "") {
            params = params + `&${sortBy}`
        }
        getAllVendorList(params, 1)
    }

    return (
        <div className=''>
            <h1 className="font-bold text-start text-xl mb-5">Verification</h1>
            {/* <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button> */}
            <Search placeholder="Search Company Name" onSearch={searchVendor}
                size="large"
                allowClear
                enterButton
                className="mb-5"
                style={{ width: 304 }} loading={isLoading} />
            <Table
                components={{}}
                bordered
                loading={isLoading}
                rowKey={(record) => record.id.toString()}
                dataSource={paginateVendorVerification.data}
                columns={mergedColumns}
                onChange={onChange}
                pagination={{
                    pageSize: 20,
                    total: paginateVendorVerification.meta.total,
                    hideOnSinglePage: true,
                    onChange: (page, pageSize) => { console.log() },
                    showSizeChanger: false,
                }}
                scroll={{
                    x: 1300,
                }}
            />
        </div>
    )
}

export default VendorVerificationList