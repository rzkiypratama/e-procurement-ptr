'use client'
import React, { useState, useEffect } from 'react';
import { Card, Button, Table, message } from 'antd';
import useDashboardSummaryStore from '@/store/CenterStore';
import axios from "axios";
import { getCookie } from 'cookies-next'

const { Meta } = Card;

interface DashboardSummary {
    user_request_pengadaan_barang: number;
    user_request_pengadaan_pekerjaan_konstruksi: number;
    user_request_pengadaan_jasa_konsultasi: number;
}

interface PengadaanBarang {
    id: number;
    kode_rencana: string;
    kode_paket: string;
    nama_paket: string;
    metode_pengadaan: string;
    jenis_pengadaan: ProcurementType;
    jenis_kontrak: string;
    // hps: string;
    status_report: string;
}

interface ProcurementType {
    id: number
    type_name: string
    code: string
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
    const [isLoadingList, setIsLoadingList] = useState(false);
    const token = getCookie('token')

    useEffect(() => {
        // Initialize data if needed
        // getStatisticSummary();
        getListProcurement();
    }, []);

    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Kode Rencana Umum Pengadaan",
            dataIndex: "kode_rencana",
            key: "kode_rencana",
        },
        {
            title: "Kode Paket Pengadaan",
            dataIndex: "kode_paket",
            key: "kode_paket",
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

    // const getStatisticSummary = () => {
    //     setIsLoading(true);
    //     try {
    //         const data: DashboardSummary = {
    //             user_request_pengadaan_barang: 5,
    //             user_request_pengadaan_pekerjaan_konstruksi: 10,
    //             user_request_pengadaan_jasa_konsultasi: 2,
    //         };
    //         setDashboardSummary(data);
    //         console.log(data);
    //     } catch (error) {
    //         message.error(`Get Data Stats failed! ${error}`);
    //         console.error("Error Get Data Stats:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const getListProcurement = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL_REQ}/master/pengadaan-barang`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("Response from API:", response.data.data);
            const dataPengadaan = await response.data.data.pengadaan
            const statistic = await response.data.data.statistik
            let index = 1;
            const data: PengadaanBarang[] = []
            dataPengadaan.map((item: any) => {
                item.no = index
                index++
                const row: PengadaanBarang = {
                    ...item,
                    jenis_pengadaan: item.jenis_pengadaan.type_name,
                }

                data.push(row)
            })
            console.log(data)
            initializePengadaanBarang(data);

            let summary: DashboardSummary = {
                user_request_pengadaan_barang: 0,
                user_request_pengadaan_pekerjaan_konstruksi: 0,
                user_request_pengadaan_jasa_konsultasi: 0,
            };
            statistic.map((item: any) => {
                console.log("ASDASD", item)
                if (item.procurement_type.code == "p-barang") {
                    console.log("Barang", item.total)
                    summary.user_request_pengadaan_barang = item.total
                } else if (item.procurement_type.code == 'p-konstruksi') {
                    console.log("Konstruksi", item.total)
                    summary.user_request_pengadaan_pekerjaan_konstruksi = item.total
                } else if (item.procurement_type.code == 'p-konsultasi') {
                    console.log("Konsultasi", item.total)
                    summary.user_request_pengadaan_jasa_konsultasi = item.total
                }
            })
            setDashboardSummary(summary);
        } catch (error) {
            message.error(`Get Data Dashboard Summary failed! ${error}`);
            console.error("Error Get Data Dashboard Summary:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='container h-screen max-w-full mx-auto'>
            <h1 className="font-bold text-start text-xl mb-5">Dashboard</h1>
            {/* <div className='flex flex-row mb-5'>
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
            </div> */}
            <Button type="primary" onClick={() => console.log("Download Report")} className="mb-5 float-end">
                Download Report
            </Button>
            <Table
                components={{}}
                bordered
                rowKey={"List-Procurement-Dashboard"}
                dataSource={pengadaanBarang}
                columns={mergedColumns}
                loading={isLoading}
                rowClassName="editable-row"
            />
        </div>
    );
};

export default DashboardVendor;