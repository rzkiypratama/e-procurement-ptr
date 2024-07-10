'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message } from 'antd';
import useDashboardSummaryStore from '@/store/CenterStore';

const { Meta } = Card;

interface DashboardSummary {
    user_request_pengadaan_barang: number;
    user_request_pengadaan_pekerjaan_konstruksi: number;
    user_request_pengadaan_jasa_konsultasi: number;
}

interface PengadaanBarang {
    id: number;
    kode_rencana_umum_pengadaan: string;
    kode_paket_pengadaan: string;
    nama_paket: string;
    metode_pengadaan: string;
    jenis_pengadaan: string;
    jenis_kontrak: string;
    hps: string;
    status_report: string;
}

const DashboardVendor: React.FC = () => {
    const {
        data,
        pengadaanBarang,
        setDashboardSummary,
        addPengadaanBarang,
        initializePengadaanBarang
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
            title: "Kode Rencana Umum Pengadaan",
            dataIndex: "kode_rencana_umum_pengadaan",
            key: "kode_rencana_umum_pengadaan",
        },
        {
            title: "Kode Paket Pengadaan",
            dataIndex: "kode_paket_pengadaan",
            key: "kode_paket_pengadaan",
        },
        {
            title: "Nama Paket",
            dataIndex: "nama_paket",
            key: "nama_paket",
        },
        {
            title: "Metode Pengadaan",
            dataIndex: "metode_pengadaan",
            key: "metode_pengadaan",
        },
        {
            title: "Jenis Pengadaan",
            dataIndex: "jenis_pengadaan",
            key: "jenis_pengadaan",
        },
        {
            title: "Jenis Kontrak",
            dataIndex: "jenis_kontrak",
            key: "jenis_kontrak",
        },
        {
            title: "HPS",
            dataIndex: "hps",
            key: "hps",
        },
        {
            title: "Status Report",
            dataIndex: "status_report",
            key: "status_report",
            render: (status: string) => {
                let color = 'black';
                if (status === 'berhasil') {
                    color = 'green';
                } else if (status === 'gagal') {
                    color = 'red';
                }
                return <span style={{ color }}>{status}</span>;
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        return {
            ...col,
            onCell: (record: PengadaanBarang) => ({
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
            const data: DashboardSummary = {
                user_request_pengadaan_barang: 5,
                user_request_pengadaan_pekerjaan_konstruksi: 10,
                user_request_pengadaan_jasa_konsultasi: 2,
            };
            setDashboardSummary(data);
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
            const vendorList: PengadaanBarang[] = [
                { id: 1, kode_rencana_umum_pengadaan: "PT Jaya Abadi", kode_paket_pengadaan: "User 1", nama_paket: "ptjayaabadi@gmail.com", metode_pengadaan: "0811112222", jenis_pengadaan: "1234567890987654", jenis_kontrak: "pertama", hps: "pertama", status_report: "berhasil" },
                { id: 2, kode_rencana_umum_pengadaan: "PT Mulya Sentosa", kode_paket_pengadaan: "User 2", nama_paket: "ptmulyasentosa@gmail.com", metode_pengadaan: "0822223333", jenis_pengadaan: "1234567890987654", jenis_kontrak: "pertama", hps: "pertama", status_report: "gagal" },
                { id: 3, kode_rencana_umum_pengadaan: "PT Cinta Sejati", kode_paket_pengadaan: "User 3", nama_paket: "ptcintasejati@gmail.com", metode_pengadaan: "0822223333", jenis_pengadaan: "1234567890987654", jenis_kontrak: "pertama", hps: "pertama", status_report: "proses" },
                { id: 4, kode_rencana_umum_pengadaan: "PT Aloha Tech", kode_paket_pengadaan: "User 4", nama_paket: "ptalohatech@gmail.com", metode_pengadaan: "0822223333", jenis_pengadaan: "1234567890987654", jenis_kontrak: "pertama", hps: "pertama", status_report: "berhasil" },
            ];
            initializePengadaanBarang(vendorList);
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
                                User Request Pengadaan Barang
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {data.user_request_pengadaan_barang.toString()}
                        </h1>}
                    />
                </Card>
                <Card style={{ width: 400, marginTop: 16 }} className='me-5 border-2 border-black text-center' loading={isLoading}>
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                User Request Pengadaan Pekerjaan Konstruksi
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {data.user_request_pengadaan_pekerjaan_konstruksi.toString()}
                        </h1>}
                    />
                </Card>
                <Card style={{ width: 350, marginTop: 16 }} className='me-5 border-2 border-black text-center' loading={isLoading}>
                    <Meta
                        title={
                            <h1 className='font-normal text-md'>
                                User Request Pengadaan Jasa Konsultasi
                            </h1>}
                        description={<h1 className='font-normal text-5xl text-center text-black'>
                            {data.user_request_pengadaan_jasa_konsultasi.toString()}
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
                dataSource={pengadaanBarang}
                columns={mergedColumns}
                rowClassName="editable-row"
            />
        </div>
    );
};

export default DashboardVendor;