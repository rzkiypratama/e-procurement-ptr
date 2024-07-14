"use client";
import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Modal,
    message,
    Spin,
    Flex
} from "antd";
import axios from "axios";

import { LeftOutlined } from '@ant-design/icons';
import { getCookie } from 'cookies-next'
import { useParams } from "next/navigation";
import Layout from '@/components/LayoutNew';
import { useRouter } from 'next/navigation';

interface DetailCompany {
    company_name: string;
    company_npwp: string;
    vendor_type: string;
    company_address: string;
    city_id: number;
    city: City
    province_id: number;
    postal_code: string;
    company_phone_number: string;
    company_fax: string;
    company_email: string;
}

interface City {
    id: number,
    name: string,
    province: Province,
}

interface Province {
    id: number,
    name: string,
}

const DetailVendorComponents = () => {
    const router = useRouter();
    const params = useParams<{ slug: string }>()
    const token = getCookie("token")

    const [detail, setDetail] = useState<DetailCompany>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const [form] = Form.useForm();

    // const formik = useFormik({
    //     initialValues: {
    //         ...registerProfilePerusahaan
    //     },
    //     onSubmit: (values) => { }
    // })

    useEffect(() => {
        // Initialize data if needed
        GetDetailVendor()
    }, []);

    const GetDetailVendor = async () => {
        setIsLoading(true)
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/verifikator/vendor/${params.slug}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log("Response from API:", response.data.data);
            let detail: DetailCompany = await response.data.data
            setDetail(detail);
            console.log(detail)
        } catch (error) {
            message.error(`Get Data Vendor Registered failed! ${error}`);
            console.error("Error Get Data Vendor Registered:", error);
        } finally {
            setIsLoading(false)
        }
    }

    return (
        isLoading ? <div className="h-96 content-center place-content-center">
            <Flex gap="small" vertical>
                <Spin tip="Loading" size="large"><div></div>
                </Spin>
            </Flex>
        </div> :
            <div>
                <div className="flex mb-5">
                    <Button type="text" shape="circle" size={"large"} onClick={() => router.back()}>
                        <LeftOutlined style={{ fontSize: '24px' }} />
                    </Button>
                    <h1 className="font-bold text-start text-xl ms-3 content-center mb-1">Detail Vendor</h1>
                </div>
                <Form layout="vertical">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item
                            label="Nama Perusahaan">
                            <Input
                                id="company_name"
                                name="company_name"
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }}
                                value={detail?.company_name} />
                        </Form.Item>
                        <Form.Item
                            label="NPWP Perusahaan">
                            <Input
                                id="company_npwp"
                                name="company_npwp"
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }}
                                value={detail?.company_npwp} />
                        </Form.Item>
                        <Form.Item
                            label="Status">
                            <Input
                                id="vendor_type"
                                name="vendor_type"
                                value={detail?.vendor_type}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Alamat Perusahaan">
                            <Input
                                id="company_address"
                                name="company_address"
                                value={detail?.company_address}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                        <Form.Item
                            label="Kota"
                            required
                            hasFeedback>
                            <Input
                                id="city"
                                name="city"
                                value={detail?.city.name}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                        <Form.Item
                            label="Provinsi">
                            <Input
                                id="province"
                                name="province"
                                value={detail?.city.province.name}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                        <Form.Item
                            label="Kode POS">
                            <Input
                                id="postal_code"
                                placeholder="Input postal code"
                                value={detail?.postal_code} className="text-black"
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                        <Form.Item
                            label="Nomor Telepon Perusahaan">
                            <Input
                                id="company_phone_number"
                                name="company_phone_number"
                                value={detail?.company_phone_number}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                        <Form.Item
                            label="Nomor Fax Perusahaan">
                            <Input
                                id="company_fax"
                                name="company_fax"
                                value={detail?.company_fax}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                        <Form.Item
                            label="Email Perusahaan">
                            <Input
                                id="company_email"
                                name="company_email"
                                value={detail?.company_email}
                                readOnly={true}
                                disabled={true}
                                style={{ color: "black" }} />
                        </Form.Item>
                    </div>
                </Form>
            </div>
    )
}

export default DetailVendorComponents