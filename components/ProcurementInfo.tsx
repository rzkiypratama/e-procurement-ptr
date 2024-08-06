"use client"
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

interface IDetailInfo {
    no: number;
    detail_qualification: string;
    unit: string;
    quantity: number;
    harga_satuan: number;
    sub_total: number;
    ppn: number;
    sub_total_ppn: number;
}

const InfoDetailProcurement = () => {
    const [data, setData] = useState<IDetailInfo[]>([])

    useEffect(() => {
        const _tempData = [
            {
                no: 1,
                detail_qualification: "Detail Qualification1 ",
                unit: "kg",
                quantity: 5,
                harga_satuan: 5000,
                ppn: 2500,
                sub_total_ppn: 27500,
                sub_total: 25000,
            },
            {
                no: 1,
                detail_qualification: "Detail Qualification1 ",
                unit: "kg",
                quantity: 5,
                harga_satuan: 5000,
                sub_total: 25000,
                sub_total_ppn: 27500,
                ppn: 2500,
            },
            {
                no: 1,
                detail_qualification: "Detail Qualification2",
                unit: "kg",
                quantity: 5,
                harga_satuan: 5000,
                sub_total: 25000,
                sub_total_ppn: 27500,
                ppn: 2500,
            },
            {
                no: 1,
                detail_qualification: "Detail Qualification3",
                unit: "kg",
                quantity: 5,
                harga_satuan: 5000,
                sub_total: 25000,
                ppn: 2500,
                sub_total_ppn: 27500
            },
        ]
        setData(_tempData)
    }, [])
    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: 'no',
        },
        {
            title: "Detail Specification",
            dataIndex: "detail_qualification",
            key: 'detail_qualification',
        },
        {
            title: "Unit",
            dataIndex: "unit",
            key: 'unit',
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: 'quantity',
        },
        {
            title: "Harga Satuan",
            dataIndex: "harga_satuan",
            key: 'harga_satuan',
        },
        {
            title: "Subtotal (Sebelum PPN)",
            dataIndex: "sub_total",
            key: 'sub_total',
        },
        {
            title: "PPN (10%)",
            dataIndex: "ppn",
            key: 'ppn',
        },
        {
            title: "Subtotal (Sesudah PPN)",
            dataIndex: "sub_total_ppn",
            key: 'sub_total_ppn',
        },
    ]
    return (
        <div>
            <Table
                rowKey={(record) => record.no.toString()}
                components={{}}
                bordered
                dataSource={data}
                columns={columns} />
        </div>
    )
}

export default InfoDetailProcurement