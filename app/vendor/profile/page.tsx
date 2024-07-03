"use client";
import { Tabs } from "antd";
import VendorProfilePerusahaan from "@/components/VendorProfileUsaha";
import VendorIzinUsaha from "@/components/VendorIzinUsaha2";
import VendorLandasanHukum from "@/components/VendorLandasanHukum2";
import VendorPengurusPerusahaan from "@/components/VendorPengurusPerusahaan";
import VendorSptTahunan from "@/components/VendorSptTahunan2";
import VendorTenagaAhli from "@/components/VendorTenagaAhli";
import VendorPengalaman from "@/components/VendorPengalaman";
import VendorAttachmenDoc from "@/components/VendorAttachmenDoc";
import VendorContactPerson from "@/components/VendorContactPerson";
import VendorBankAccount from "@/backup/VendorBankAccount";
import Layout from '@/components/LayoutNew';
import VendorRegisteredList from "@/components/VendorRegisteredList";

const { TabPane } = Tabs;

const RegisteredVendorListPage = () => {
    // const isLogin = localStorage.getItem('token')
    const items = [
        {
            key: '1',
            label: 'Profile Perusahaan',
            children: (
                <VendorProfilePerusahaan />
            ),
        },
        {
            key: '2',
            label: 'Contact Info',
            children: (
                <VendorContactPerson />
            ),
        },
        {
            key: '3',
            label: 'Bank Account',
            children: (
                <VendorBankAccount />
            ),
        },
        {
            key: '4',
            label: 'Izin Usaha',
            children: (
                <VendorIzinUsaha />
            ),
        },
        {
            key: '5',
            label: 'Landasan Hukum',
            children: (
                <VendorLandasanHukum />
            ),
        },
        {
            key: '6',
            label: 'Pengurus Perusahaan',
            children: (
                <VendorPengurusPerusahaan />
            ),
        },
        {
            key: '7',
            label: 'SPT Tahunan',
            children: (
                <VendorSptTahunan />
            ),
        },
        {
            key: '8',
            label: 'Tenaga Ahli',
            children: (
                <VendorTenagaAhli />
            ),
        },
        {
            key: '9',
            label: 'Pengalaman',
            children: (
                <VendorPengalaman />
            ),
        },
        {
            key: '10',
            label: 'Attachmen Document',
            children: (
                <VendorAttachmenDoc />
            ),
        },
    ];
    return (
        <Layout>
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

