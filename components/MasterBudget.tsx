'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message } from 'antd';
import useDashboardSummaryStore from '@/store/CenterStore';
import { symbol } from 'zod';
import axios from "axios";
import { getCookie } from 'cookies-next';

const { Meta } = Card;

interface DashboardMasterBudget {
    id: number;
    tahun_anggaran: string;
    department: string;
    total_pengadaan: string;
    total_anggaran_digunakan: string
}

interface DashboardStatistic {
    anggaran: number;
    pengadaan: number;
}

const DashboardAnggaran: React.FC = () => {
    const {
        dashboardStatistic,
        dashboardMasterBudget,
        setDashboardStatistic,
        setDashboardMasterBudget
    } = useDashboardSummaryStore();

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingVendor, setIsLoadingVendor] = useState(false);

    useEffect(() => {
        // Initialize data if needed
        getDashboardAnggaranSummary();
        getListAnggaran();
    }, []);

    const columns = [
        { title: "No", dataIndex: "id", key: "id" },
        {
            title: "Tahun Anggaran",
            dataIndex: "tahun_anggaran",
            key: "tahun_anggaran",
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Total Pengadaan",
            dataIndex: "total_pengadaan",
            key: "total_pengadaan",
        },
        {
            title: "Total Anggaran Digunakan",
            dataIndex: "total_anggaran_digunakan",
            key: "total_anggaran_digunakan",
        },
    ];

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: DashboardMasterBudget) => ({
                record,
                dataindex: col.dataIndex,
                title: col.title,
                key: col.key,
            }),
        };
    });

    const getDashboardAnggaranSummary = () => {
        setIsLoading(true);
        try {
            const data: DashboardStatistic = {
                pengadaan: 10000000,
                anggaran: 200000000,
            };
            setDashboardStatistic(data);
            console.log(data);
        } catch (error) {
            message.error(`Get Data Stats failed! ${error}`);
            console.error("Error Get Data Stats:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getListAnggaran = async () => {
        setIsLoadingVendor(true);
        try {
            const token = getCookie("token");
            const userId = getCookie("user_id");
            if (!token || !userId) {
                message.error("Please login first.");
                return;
            }
            //${process.env.NEXT_PUBLIC_API_URL}
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/master/budget`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "User-ID": userId,
                },
            });
            let index = 1;
            response.data.data.map((e: any) => {
                e.statusName = e.status == 1 ? "Active" : "Inactive"
                e.id = index
                index++
            })
            const summaryAnggaran: DashboardMasterBudget[] = await response.data.data
            setDashboardMasterBudget(summaryAnggaran);
        } catch (error) {
            message.error(`Get Data Vendor Summary failed! ${error}`);
            console.error("Error Get Data Vendor Summary:", error);
        } finally {
            setIsLoadingVendor(false);
        }
    };

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <h1 className="font-bold text-start text-xl mb-5">Dashboard</h1>
            <div className='flex flex-row mb-5'>
                <Card style={{ width: 350, marginTop: 16 }} className='me-5 border-2 border-black text-center' loading={isLoading} title="" >
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                Tahun 2024
                            </h1>}
                        description={
                            <div className='grid gap-4 grid-cols-2'>
                                <div>
                                    <h1 className='font-normal text-sm text-center text-black'>
                                        Pengadaan
                                    </h1>
                                    <h1 className='font-normal text-xl text-center text-green-500'>
                                        {dashboardStatistic.pengadaan.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            currencyDisplay: "code",
                                            minimumFractionDigits: 0,
                                        })}
                                    </h1>
                                </div>

                                <div>
                                    <h1 className='font-normal text-sm text-center text-black'>
                                        Pengeluaran
                                    </h1>
                                    <h1 className='font-normal text-xl text-center text-red-500'>
                                        {dashboardStatistic.pengadaan.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            currencyDisplay: "code",
                                            minimumFractionDigits: 0,
                                        })}
                                    </h1>
                                </div>
                            </div>
                        }
                    />
                </Card>
                <Card style={{ width: 400, marginTop: 16 }} className='me-5 border-2 border-black text-center' loading={isLoading}>
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                Tahun 2025
                            </h1>}
                        description={<div className='grid gap-4 grid-cols-2'>
                            <div>
                                <h1 className='font-normal text-sm text-center text-black'>
                                    Pengadaan
                                </h1>
                                <h1 className='font-normal text-xl text-center text-green-500'>
                                    {dashboardStatistic.pengadaan.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        currencyDisplay: "code",
                                        minimumFractionDigits: 0,
                                    })}
                                </h1>
                            </div>

                            <div>
                                <h1 className='font-normal text-sm text-center text-black'>
                                    Pengeluaran
                                </h1>
                                <h1 className='font-normal text-xl text-center text-red-500'>
                                    {dashboardStatistic.pengadaan.toLocaleString("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        currencyDisplay: "code",
                                        minimumFractionDigits: 0,
                                    })}
                                </h1>
                            </div>
                        </div>}
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
                dataSource={dashboardMasterBudget}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    );
};

export default DashboardAnggaran;