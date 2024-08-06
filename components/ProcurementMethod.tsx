"use client"
import { Collapse, Divider, Form, Input, Radio, RadioChangeEvent, Select } from 'antd'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import ProcurementCommittee from './ProcurementCommittee'

interface IProcurementMethod {
    procurement_method: string
    // selection_committee: string
    participant_qualification: string
    additional_information: string
}

const { TextArea } = Input;

const ProcurementMethod = () => {
    const [form] = Form.useForm();

    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        formik.setFieldValue('participant_qualification', e.target.value)
    };

    const formik = useFormik({
        initialValues: {
            procurement_method: "Pemilihan Terbuka",
            // selection_committee: "",
            participant_qualification: "",
            additional_information: "",
        },
        onSubmit: (value) => {

        }
    })

    return (
        <div>
            <Collapse
                items={[{
                    key: 1, label: "Metode Pengadaan",
                    children: <div>
                        <Form form={form} layout='horizontal' labelCol={{ span: 6 }} labelAlign='left' wrapperCol={{ span: 16 }}>
                            <Form.Item name={"procurement_method"} label="Metode Pengadaan" id='procurement_method'
                                required
                                initialValue={"Pemilihan Terbuka"}>
                                <Select
                                    id="procurement_method"
                                    onChange={(value) => formik.setFieldValue("status_code", value)}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.procurement_method}>
                                    <Select.Option key={1} value={"Pemilihan Terbuka"}>
                                        {"Pemilihan Terbuka"}
                                    </Select.Option>
                                    <Select.Option key={1} value={"Pemilihan Tertutup"}>
                                        {"Pemilihan Tertutup"}
                                    </Select.Option>
                                    <Select.Option key={1} value={"Penunjukkan Langsung"}>
                                        {"Penunjukkan Langsung"}
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                            {/* <Form.Item name={"selection_committee"} label="Panitia Pemilihan" id='procurement_method'
                                required>
                                <TextArea rows={3} name='selection_committee' />
                            </Form.Item> */}
                            <Form.Item name={"participant_qualification"} label="Kualifikasi Peserta" id='participant_qualification'
                                required>
                                <Radio.Group onChange={onChange} value={formik.values.participant_qualification} name='participant_qualification'>
                                    <Radio value={"1"}>Mikro</Radio>
                                    <Radio value={"2"}>Kecil</Radio>
                                    <Radio value={"3"}>Menengah</Radio>
                                    <Radio value={"4"}>Besar</Radio>
                                    <Radio value={"5"}>Perorangan</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item name={"additional_information"} label={"Keterangan Tambahan"} id='additional_information'
                                required>
                                <TextArea rows={3} />
                            </Form.Item>
                        </Form>
                    </div>
                }]}
            />
            <Divider orientation="left"></Divider>
            <ProcurementCommittee />
        </div >
    )
}

export default ProcurementMethod