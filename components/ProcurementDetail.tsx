"use client"
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { useParams } from "next/navigation";

const style: React.CSSProperties = { padding: '8px 0' };

interface IBudgetType {
    no_rek: string;
    budget_type: string;
}

const DetailProcurement = () => {
    const params = useParams<{ slug: string }>()
    const [budgetList, setListBudget] = useState<IBudgetType[]>([]);
    useEffect(() => {
        const data = [
            {
                "no_rek": "123456789",
                "budget_type": "Rekening A",
            },
            {
                "no_rek": "987654321",
                "budget_type": "Rekening B",
            },
            {
                "no_rek": "0987980800",
                "budget_type": "Rekening C",
            },
        ]
        setListBudget(data)
    }, [])
    const columns = [
        {
            title: "Nomor Rekening",
            dataIndex: "no_rek",
            key: "no_rek",
        },
        {
            title: "Jenis Anggaran",
            dataIndex: "budget_type",
            key: "budget_type",
        },
    ];
    return (
        <div className='mt-5'>
            <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4 ">
                    <p className='text-start font-bold'>Kode Rencana Umum</p>
                    <p className='text-start'>: RU24040001</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>User</p>
                    <p className='text-start'>: User A</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Department</p>
                    <p className='text-start'>: IT Support</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Tanggal Pembuatan</p>
                    <p className='text-start'>: 23-07-2024 09:00:00</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Kode Paket Pengadaan</p>
                    <p className='text-start'>: MLM</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Jenis Pengadaan</p>
                    <p className='text-start'>: Kontruksi</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Durasi Pengerjaan</p>
                    <p className='text-start'>: 2 Bulan</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Nama Paket</p>
                    <p className='text-start'>: Paket A</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Deskripsi Pekerjaan</p>
                    <p className='text-start'>: Ini pengadaan konstruksi infrastructure IT</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Mata Uang</p>
                    <p className='text-start'>: IDR</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className='text-start font-bold'>Jenis Mata Uang</p>
                    <p className='text-start'>: Single Currency (IDR)</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
                <p className='text-start font-bold'>Detail Mata Anggaran</p>
                <Table className='col-span-3'
                    rowKey={(record) => record.no_rek.toString()}
                    components={{}}
                    bordered
                    dataSource={budgetList}
                    columns={columns} />
            </div>
        </div>
    )
}

export default DetailProcurement