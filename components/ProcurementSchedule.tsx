"use client"
import { Checkbox, Col, Collapse, DatePicker, Divider, Form, Input, Row, Select, Table, Typography } from 'antd'
import React, { useState, useEffect } from 'react'

const ProcurementSchedule = () => {

    const RegisterSchedule = () => {
        return (
            <div>
                <Collapse
                    items={[{
                        key: 1, label: "Jadwal Pendaftaran",
                        children: <div>
                            <Form layout='horizontal'>
                                <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                                    <Form.Item label="Tanggal Pembukaan Pendaftaran"
                                        required>
                                        <DatePicker style={{ width: '80%' }} />
                                    </Form.Item>
                                    <Form.Item label="Tanggal Penutupan Pendaftaran"
                                        required>
                                        <DatePicker style={{ width: '80%' }} />
                                    </Form.Item>
                                </div>
                            </Form>
                        </div>
                    }]
                    }
                />
            </div >
        )
    }

    const AanwijzingSchedule = () => {
        return (
            <Collapse
                items={[{
                    key: 2, label: "Jadwal Aanwijzing",
                    children: <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Aanwijzing</p>
                            <Checkbox />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Mulai Aanwijzing</p>
                            {/* <p>2024-07-23 13:00</p> */}
                            <DatePicker style={{ width: '80%' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Aanwijzing Online</p>
                            <Checkbox />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Selesai Aanwijzing</p>
                            <DatePicker style={{ width: '80%' }} />
                            {/* <p>2024-07-29 13:00</p> */}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Lokasi Aanwijzing</p>
                            <p>Online</p>
                        </div>
                    </div>
                }]} />
        )
    }

    const OfferSchedule = () => {
        return (
            <Collapse
                items={[{
                    key: 2, label: "Jadwal Penawaran",
                    children: <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Mulai Kirim Penawaran</p>
                            <DatePicker style={{ width: '80%' }} />
                            {/* <p>2024-07-23 13:00</p> */}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Akhir Kirim Penawaran</p>
                            <DatePicker style={{ width: '80%' }} />
                            {/* <p>2024-07-23 13:00</p> */}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Pembukaan Dokumen Penawaran</p>
                            {/* <p>2024-07-29 13:00</p> */}
                            <DatePicker style={{ width: '80%' }} />
                        </div>
                    </div>
                }]} />
        )
    }

    const AnnounceSchedule = () => {
        return (
            <Collapse
                items={[{
                    key: 2, label: "Jadwal Pengumuman",
                    children: <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Pengumuman</p>
                            {/* <p className='text-start'>2024-07-23 13:00</p> */}
                            <DatePicker style={{ width: '80%' }} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <p className='text-start font-bold'>Tanggal Masa Sanggahan</p>
                            {/* <p className='text-start'>2024-07-29 13:00</p> */}
                            <DatePicker style={{ width: '80%' }} />
                        </div>
                        <Form layout='horizontal' labelCol={{ span: 12 }} labelAlign='left' wrapperCol={{ span: 12 }}>
                            <Form.Item label="Masa Sanggahan" style={{ fontWeight: 'bold' }}
                                required>
                                <Select style={{ width: '80%' }}>
                                    <Select.Option key={1} value={1}>3 hari</Select.Option>
                                    <Select.Option key={2} value={2}>5 hari</Select.Option>
                                    <Select.Option key={3} value={3}>7 hari</Select.Option>
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                }]} />
        )
    }

    return (
        <div>
            <RegisterSchedule />
            <Divider orientation="left"></Divider>
            <AanwijzingSchedule />
            <Divider orientation="left"></Divider>
            <OfferSchedule />
            <Divider orientation="left"></Divider>
            <AnnounceSchedule />
        </div>
    )
}

export default ProcurementSchedule