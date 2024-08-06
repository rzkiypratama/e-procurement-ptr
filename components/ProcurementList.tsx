'use client'
import React, { useState, useEffect } from 'react';
import { Table, Typography, Button, Input } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";

const { Search } = Input;

interface IListProcurement {
    no: number,
    kode_rencana_umum: string,
    user: string,
    package_name: string,
    department: string,
    position: string,
    status_tenant: string,
}

const ListProcurement = () => {
    const [requestList, setListRequest] = useState<IListProcurement[]>([]);
    const router = useRouter();
    const slug = 'RU24040001'

    useEffect(() => {
        const data = [
            {
                "no": 1,
                "kode_rencana_umum": "RU24040001",
                "user": "User A",
                "package_name": "Nama Paket 1",
                "department": "IT Support",
                "position": "Head Employee",
                "status_tenant": "Aktif",
            },
            {
                "no": 1,
                "kode_rencana_umum": "RU24040002",
                "user": "User B",
                "package_name": "Nama Paket 2",
                "department": "Human Resources",
                "position": "Head Employee",
                "status_tenant": "Aktif",
            },
            {
                "no": 3,
                "kode_rencana_umum": "RU24040003",
                "user": "User C",
                "package_name": "Nama Paket 3",
                "department": "IT Support",
                "position": "Manager",
                "status_tenant": "Aktif",
            },
        ]
        setListRequest(data)
    }, [])
    const columns = [
        { title: "No", dataIndex: "no", key: "no" },
        {
            title: "Kode Rencana Umum",
            dataIndex: "kode_rencana_umum",
            key: "kode_rencana_umum",
        },
        {
            title: "User",
            dataIndex: "user",
            key: "user",
        },
        {
            title: "Nama Paket",
            dataIndex: "package_name",
            key: "package_name",
        },
        {
            title: "Divisi",
            dataIndex: "department",
            key: "department",
        },
        {
            title: "Jabatan",
            dataIndex: "position",
            key: "position",
        },
        {
            title: "Status Tenant",
            dataIndex: "status_tenant",
            key: "status_tenant",
        },
        {
            title: "Operation",
            dataIndex: "operation",
            render: (_: any, record: any) => (
                <span className="flex items-center justify-center gap-5">
                    <Typography.Link href={`/procurement/detail/${slug}`}>
                        Lihat Detail
                    </Typography.Link>
                </span>
            ),
        },
    ];

    return (
        <div>
            <h1 className="font-bold text-start text-xl mb-5"></h1>
            <Search placeholder="Search Company Name" onSearch={() => { }}
                size="large"
                allowClear
                enterButton
                className='float-end mb-5'
                style={{ width: 304 }} loading={false} />
            <Button type="primary" onClick={() => console.log("ASDASD")} icon={<DownloadOutlined />} className="mb-5" loading={false}>
                Download Excel
            </Button>
            <Table
                components={{}}
                bordered
                rowKey={(record) => record.no.toString()}
                dataSource={requestList}
                columns={columns}
                rowClassName="editable-row" />
        </div>
    )
}
export default ListProcurement;