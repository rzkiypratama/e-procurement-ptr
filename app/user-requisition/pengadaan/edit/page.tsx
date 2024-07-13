"use client";
import { Button, Tabs } from "antd";
import UserReqGeneralInfo from "@/components/UserReqGeneralInfo";
import UserReqTimeline from "@/components/UserReqTimeline";
import UserReqDetailInformation from "@/components/UserReqDetailInformation";
import UserReqSyaratQualifikasi from "@/components/UserReqSyaratQualifikasi";
import Layout from '@/components/LayoutNew';
import { ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";

const { TabPane } = Tabs;

const RegisteredVendorListPage = () => {
    // const isLogin = localStorage.getItem('token')
    const items = [
        {
            key: '1',
            label: 'General Information',
            children: (
                <UserReqGeneralInfo />
            ),
        },
        {
            key: '2',
            label: 'Detail Information',
            children: (
                <UserReqDetailInformation />
            ),
        },
        {
            key: '3',
            label: 'Syarat Kualifikasi',
            children: (
                <UserReqSyaratQualifikasi />
            ),
        },
        {
            key: '4',
            label: 'Timeline',
            children: (
                <UserReqTimeline />
            ),
        },
        // {
        //     key: '5',
        //     label: 'Landasan Hukum',
        //     children: (
        //         <VendorLandasanHukum />
        //     ),
        // },
        // {
        //     key: '6',
        //     label: 'Pengurus Perusahaan',
        //     children: (
        //         <VendorPengurusPerusahaan />
        //     ),
        // },
        // {
        //     key: '7',
        //     label: 'SPT Tahunan',
        //     children: (
        //         <VendorSptTahunan />
        //     ),
        // },
        // {
        //     key: '8',
        //     label: 'Tenaga Ahli',
        //     children: (
        //         <VendorTenagaAhli />
        //     ),
        // },
        // {
        //     key: '9',
        //     label: 'Pengalaman',
        //     children: (
        //         <VendorPengalaman />
        //     ),
        // },
        // {
        //     key: '10',
        //     label: 'Attachmen Document',
        //     children: (
        //         <VendorAttachmenDoc />
        //     ),
        // },
    ];
    return (
        <Layout>
            <Link href="/user-requisition/pengadaan-barang">
            <ArrowLeftOutlined className="mb-4" /> go back
            </Link>
            <div className="container mx-auto flex flex-col content-center">
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                />
            </div>
        </Layout>
    );
};

export default RegisteredVendorListPage;