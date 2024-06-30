"use client";
import { Tabs } from "antd";
import VendorRegisterNew from "@/components/VendorRegisterNew";
import VendorRegister from "@/backup/VendorRegistration";
import VendorIzinUsaha from "@/components/VendorIzinUsaha2";
import VendorLandasanHukum from "@/components/VendorLandasanHukum2";
import VendorPengurusPerusahaan from "@/components/VendorPengurusPerusahaan";
import VendorSptTahunan from "@/components/VendorSptTahunan2";
import VendorTenagaAhli from "@/components/VendorTenagaAhli";
import VendorPengalaman from "@/components/VendorPengalaman";
import VendorAttachmenDoc from "@/components/VendorAttachmenDoc";
import Layout from "@/components/Layout";
import DashboardVendor from "@/components/DashboardVendor";
import VendorRegisteredList from "@/components/VendorRegisteredList";


const { TabPane } = Tabs;

const RegisterPage = () => {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col content-center p-8">
        <h1 className="font-bold text-start text-xl mb-5">Dashboard</h1>
        <VendorRegisteredList />
      </div>
    </Layout>
  );
};

export default RegisterPage;

