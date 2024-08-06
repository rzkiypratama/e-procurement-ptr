"use client";
import Layout from "@/components/LayoutNew";
import ProcurementAttachment from "@/components/ProcurementAttachment";
import ProcurementAttendVendorList from "@/components/ProcurementAttendVendorList";
import DetailProcurement from "@/components/ProcurementDetail";
import InfoDetailProcurement from "@/components/ProcurementInfo";
import ProcurementMethod from "@/components/ProcurementMethod";
import ProcurementSchedule from "@/components/ProcurementSchedule";
import { Tabs } from 'antd';

const DetailVendor = () => {
    const items = [
        {
            key: '1',
            label: 'General Information',
            children: (
                <DetailProcurement />
            ),
        },
        {
            key: '2',
            label: 'Detail Information',
            children: (
                <InfoDetailProcurement />
            ),
        },
        {
            key: '3',
            label: 'Lampiran',
            children: (
                <ProcurementAttachment />
            ),
        },
        {
            key: '4',
            label: 'Metode Pengadaan',
            children: (
                <ProcurementMethod />
            ),
        },
        {
            key: '6',
            label: 'Jadwal Pengadaan',
            children: (
                <ProcurementSchedule />
            ),
        },
        {
            key: '7',
            label: 'Daftar Vendor Yang Hadir',
            children: (
                <ProcurementAttendVendorList />
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
    )
}

export default DetailVendor