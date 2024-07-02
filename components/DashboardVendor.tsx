'use client'
import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import useDashboardSummaryStore from '@/store/dashboardStore';
import axios from "axios";
import {
    Button,
    Table,
    message,
} from "antd";

const { Meta } = Card;

interface DashboardSummary {
    vendorRegistered: number;
    vendorVerified: number;
}

interface VendorListSummary {
    id: number;
    companyName: string;
    name: string;
    email: string;
    phoneNumber: string;
    npwp: string
}

const DashboardVendor: React.FC = () => {
    const {
        data,
        vendorList,
        setDashboardSummary,
        setVendorListSummary
    } = useDashboardSummaryStore();

    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingVendor, setIsLoadingVendor] = useState(false)

    useEffect(() => {
        // Initialize data if needed
        getDashboardVendorSummary()
        getListVendor()
    }, []);

    const columns = [
        { title: "No", dataIndex: "id", key: "id" },
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
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
            title: "NPWP",
            dataIndex: "npwp",
            key: "npwp",
        },
    ]

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: VendorListSummary) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
                key: col.key,
            }),
        };
    });

    const getDashboardVendorSummary = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get("https://vendorv2.delpis.online/api/verifikator/stats", {
                // headers: {
                //     "Authorization": "Bearer 366|RSq8PgJAx7JEGhAK5tayWacrkWMtEMtmyDc8hrDwc61803d5"
                // }
            });
            console.log("Response from API:", response.data.data);
            const data: DashboardSummary = {
                vendorRegistered: response.data.data.vendor_registered,
                vendorVerified: response.data.data.vendor_verified
            }
            setDashboardSummary(data)
            console.log(data)
        } catch (error) {
            message.error(`Get Data Stats failed! ${error}`);
            console.error("Error Get Data Position:", error);
        } finally {
            setIsLoading(false)
        }
    }

    const getListVendor = async () => {
        setIsLoadingVendor(true)
        try {
            const vendorList: VendorListSummary[] = [
                { id: 1, companyName: "PT Jaya Abadi", name: "User 1", email: "ptjayaabadi@gmail.com", phoneNumber: "0811112222", npwp: "1234567890987654" },
                { id: 2, companyName: "PT Mulya Sentosa", name: "User 2", email: "ptmulyasentosa@gmail.com", phoneNumber: "0822223333", npwp: "1234567890987654" },
                { id: 3, companyName: "PT Cinta Sejati", name: "User 3", email: "ptcintasejati@gmail.com", phoneNumber: "0822223333", npwp: "1234567890987654" },
                { id: 4, companyName: "PT Aloha Tech", name: "User 4", email: "ptalohatech@gmail.com", phoneNumber: "0822223333", npwp: "1234567890987654" },
            ]; // Load your initial data here
            setVendorListSummary(vendorList);
        } catch (error) {
            message.error(`Get Data Vendor Summary failed! ${error}`);
            console.error("Error Get Data Vendor Summary:", error);
        } finally {
            setIsLoadingVendor(false)
        }
    }

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <h1 className="font-bold text-start text-xl mb-5">Dashboard</h1>
            <div className='flex flex-row mb-5'>
                <Card style={{ width: 250, marginTop: 16 }} className='me-5 border-2 border-black' loading={isLoading} title="" >
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                Vendor Registered
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {data.vendorRegistered.toString()}
                        </h1>}
                    />
                </Card>
                <Card style={{ width: 250, marginTop: 16 }} className='me-5 border-2 border-black' loading={isLoading}>
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                Vendor Verified
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {data.vendorVerified.toString()}
                        </h1>}
                    />
                </Card>
            </div>
            <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button>
            <Table
                components={{}}
                bordered
                rowKey={(record) => record.id.toString()}
                dataSource={vendorList}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    )
}

export default DashboardVendor;