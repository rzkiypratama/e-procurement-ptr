"use client"
import { Button, Collapse, Form, Input, Select, Table, Typography } from 'antd'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'

interface IProcurementCommittee {
    committee_team: string
}

const { TextArea } = Input;
const { Search } = Input;

interface ICommittee {
    id: number
    name: string
    position: string
    jabatan: string
}

const ProcurementCommittee = () => {
    const [data, setData] = useState<ICommittee[]>([])
    const [form] = Form.useForm();

    useEffect(() => {
        const tempData = [
            {
                id: 1,
                name: "Dani Danuarta",
                position: "Kepala Bagian Pengadaan",
                jabatan: "KETUA"
            },
            {
                id: 2,
                name: "Makayla",
                position: "Staff Pengadaan I",
                jabatan: "SEKRETARIS"
            },
            {
                id: 3,
                name: "Kemand Saputra",
                position: "Staff Pengadaan II",
                jabatan: "ANGGOTA"
            },
        ]
        setData(tempData)
    }, [])

    const columns = [
        {
            title: "Nama",
            key: "name",
            dataIndex: "name"
        },
        {
            title: "Position",
            key: "position",
            dataIndex: "position"
        },
        {
            title: "Jabatan",
            key: "jabatan",
            dataIndex: "jabatan"
        },
    ]
    return (
        <div>
            <Collapse
                items={[{
                    key: 2, label: "Panitia Pemilihan",
                    children: <div>
                        <Form form={form} layout='horizontal' labelCol={{ span: 6 }} labelAlign='left' wrapperCol={{ span: 16 }}>
                            <Form.Item name={"committee_team"} label="Tim Panitia" id='committee_team'
                                required>
                                <TextArea rows={3} name="committee_team" />
                            </Form.Item>
                        </Form>
                        <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                            <div className="grid grid-cols-2 gap-4 ">
                                <p className='text-start'>Dokumen Panitia</p>
                                {/* <p className='text-start'>
                                    <Typography.Link href=''>Dokumen A.pdf</Typography.Link>
                                </p> */}
                                <input type="file" name="file" id="file" />
                            </div>
                        </div>
                        <div className='mt-16'>
                            <Search placeholder="Search" onSearch={() => { }}
                                size="large"
                                allowClear
                                enterButton
                                className='float-end mb-5'
                                style={{ width: 304 }} loading={false} />
                            <Button type='primary' className='mb-3'>Tambah Panitia</Button>
                            <Table
                                components={{}}
                                bordered
                                rowKey={(record) => record.id.toString()}
                                dataSource={data}
                                columns={columns}
                            />
                        </div>
                    </div>
                }]} />
        </div>
    )
}

export default ProcurementCommittee