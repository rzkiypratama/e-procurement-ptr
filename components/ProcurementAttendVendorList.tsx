"use client"
import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

interface IProcurementAttachment {
    no: number,
    category: string,
    document_name: string,
    file: string,
    type: string,
}

const ProcurementAttachment = () => {
    const [attachmentData, setDataAttachment] = useState<IProcurementAttachment[]>([])
    useEffect(() => {
        const data = [
            {
                no: 1,
                category: "Dokumen Spesifikasi Teknis",
                document_name: "Dokumen A",
                file: "Open File",
                type: "Dokumen Vendor"
            },
            {
                no: 2,
                category: "Pengadaan",
                document_name: "Dokumen B",
                file: "Open File",
                type: "Dokumen Internal"
            },
            {
                no: 3,
                category: "Pendukung",
                document_name: "Dokumen C",
                file: "Open File",
                type: "Dokumen Internal"
            },
        ]
        setDataAttachment(data)
    })

    const columns = [
        {
            title: "No",
            dataIndex: "no",
            key: "no",
        },
        {
            title: "Nama Vendor",
            dataIndex: "vendor_name",
            key: "vendor_name",
        },
        {
            title: "Klasifikasi",
            dataIndex: "classification",
            key: "classification",
        },
        {
            title: "Vendor",
            dataIndex: "vendor",
            key: "vendor",
        },
        {
            title: "Hadir",
            dataIndex: "hadir",
            key: "hadir",
        },
    ]
    return (
        <div>
            <Table
                components={{}}
                columns={columns}
                dataSource={attachmentData}
                rowKey={(record) => record.no.toString()}
                bordered
            />
        </div>
    )
}

export default ProcurementAttachment