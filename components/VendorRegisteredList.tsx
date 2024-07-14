"use client";
import React, { useState, useEffect } from "react";
import {
    Button,
    Table,
    message,
    Input,
} from "antd";
import axios from "axios";
import vendorStore from "@/store/vendorStore";
import Link from 'next/link';
import { getCookie } from 'cookies-next' //change
import fs from 'fs'
import path from "path";

const { Search } = Input;

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
    data: VendorRegisteredList[]
    links: Links
    meta: Meta
}

const VendorRegisteredList: React.FC = () => {
    const token = getCookie('token');
    const {
        paginateVendorRegistered,
        initializeVendorRegisteredList,
    } = vendorStore.useVendorRegisteredStore();

    const [isLoading, setIsLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isLoadingExport, setIsLoadingExport] = useState(false);
    const [sortBy, setSortBy] = useState("");
    const [searchQuery, setSearchQuery] = useState("")
    const [progressDownload, setProgressDownload] = useState("")
    // const [paginateData, setPaginateData] = useState<Paginate>();

    useEffect(() => {
        getAllVendorList("", 1);
    }, []);

    const getAllVendorList = async (params: String, page: number) => {
        setIsLoading(true);
        try {
            // const param = searchQuery.length > 0 ? `?page=1&filter[company_name]=${searchQuery}` : ''
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor${params}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("Response from API:", response.data.data);
            let index = page > 1 ? ((page * 10) + 1) : 1;
            response.data.data.forEach((e: any) => {
                e.status_vendor = "Active";
                e.no = index;
                index++;
            });
            // const vendorList: VendorRegisteredList[] = await response.data.data;
            // initializeVendorRegisteredList(vendorList);
            const vendorListPaginate: Paginate = await response.data;
            initializeVendorRegisteredList(vendorListPaginate);
            console.log(paginateVendorRegistered);
        } catch (error) {
            message.error(`Get Data Vendor Registered failed! ${error}`);
            console.error("Error Get Data Vendor Registered:", error);
        } finally {
            setSearchLoading(false)
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
            title: "Vendor Number",
            dataIndex: "vendor_number",
            key: "vendor_number",
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
            // filters: paginateVendorRegistered.data.map(vendor => ({
            //     text: vendor.company_name,
            //     value: vendor.id,
            // })),
            // onFilter: (value: any, record: { company_name: string | any[], id: number; }) => record.id = value || record.company_name.includes(value),
            // filterSearch: true,
            sorter: true,
        },
        {
            title: "PIC",
            dataIndex: "pic_name",
            key: "pic_name",
            // filters: paginateVendorRegistered.data.map(vendor => ({
            //     text: vendor.pic_name,
            //     value: vendor.pic_name,
            // })),
            // onFilter: (value: any, record: { pic_name: string | any[]; }) => record.pic_name.includes(value),
            // filterSearch: true,
            sorter: true,
        },
        {
            title: "Type",
            dataIndex: "vendor_type",
            key: "vendor_type",
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
            title: "Status Vendor",
            dataIndex: "status",
            key: "status",
        },
        {
            title: "Status Verification",
            dataIndex: "status_vendor",
            key: "status_vendor",
        },
    ];

    const searchVendor = (value: string) => {
        setSearchLoading(true)
        setSearchQuery(value)
        let params = `?page=1&filter[company_name]=${value}`
        if (sortBy != "") {
            params = params + `&${sortBy}`
        }
        getAllVendorList(params, 1)
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

    const downloadReport = async () => {
        setIsLoadingExport(true)
        try {
            const filePath = path.join(process.cwd(),
                "public", "Data Vendor Registered.xlsx"); // Path to your file

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor/export`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                responseType: "blob",
            })

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            // Setting filename received in response
            link.setAttribute("download", "Data Vendor Registered.xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            message.error(`Export Data Vendor Registered failed! ${error}`);
            console.error("Error Export Data Vendor Registered:", error);
        } finally {
            setIsLoadingExport(false)
        }
    }

    return (
        <div className=''>
            <h1 className="font-bold text-start text-xl mb-5">Vendor List</h1>
            <Button type="primary" onClick={downloadReport} className="mb-5 float-end" loading={isLoadingExport}>
                Download Report
            </Button>
            <Search placeholder="Search Company Name" onSearch={searchVendor}
                size="large"
                allowClear
                enterButton
                style={{ width: 304 }} loading={searchLoading} />
            <Table
                components={{}}
                bordered
                loading={isLoading}
                rowKey={(record) => record.id.toString()}
                dataSource={paginateVendorRegistered.data}
                columns={columns}
                rowClassName="editable-row"
                onChange={onChange}
                pagination={{
                    pageSize: 20,
                    total: paginateVendorRegistered?.meta.total,
                    hideOnSinglePage: true,
                    onChange: (page, pageSize) => { console.log() },
                    showSizeChanger: false,
                }}
                scroll={{
                    x: 1300,
                }}
            />
        </div>
    );
}

export default VendorRegisteredList;