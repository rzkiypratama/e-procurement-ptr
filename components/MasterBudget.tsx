'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message } from 'antd';
import useDashboardSummaryStore from '@/store/CenterStore';

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

const DashboardVendor: React.FC = () => {
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
        getDashboardVendorSummary();
        getListVendor();
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

    const getDashboardVendorSummary = () => {
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

    const getListVendor = () => {
        setIsLoadingVendor(true);
        try {
            const vendorList: DashboardMasterBudget[] = [
                { id: 1, tahun_anggaran: "PT Jaya Abadi", department: "User 1", total_pengadaan: "ptjayaabadi@gmail.com", total_anggaran_digunakan: "0811112222"},
                { id: 2, tahun_anggaran: "PT Jaya Abadi", department: "User 1", total_pengadaan: "ptjayaabadi@gmail.com", total_anggaran_digunakan: "0811112222"},
                { id: 3, tahun_anggaran: "PT Jaya Abadi", department: "User 1", total_pengadaan: "ptjayaabadi@gmail.com", total_anggaran_digunakan: "0811112222"},
                { id: 4, tahun_anggaran: "PT Jaya Abadi", department: "User 1", total_pengadaan: "ptjayaabadi@gmail.com", total_anggaran_digunakan: "0811112222"},
                { id: 5, tahun_anggaran: "PT Jaya Abadi", department: "User 1", total_pengadaan: "ptjayaabadi@gmail.com", total_anggaran_digunakan: "0811112222"},
            ];
            setDashboardMasterBudget(vendorList);
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
                                Pengadaan
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {dashboardStatistic.pengadaan.toString()}
                        </h1>}
                    />
                </Card>
                <Card style={{ width: 400, marginTop: 16 }} className='me-5 border-2 border-black text-center' loading={isLoading}>
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                Anggaran
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {dashboardStatistic.anggaran.toString()}
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
                dataSource={dashboardMasterBudget}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    );
};

export default DashboardVendor;