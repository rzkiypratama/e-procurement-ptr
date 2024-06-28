"use client";
import { Tabs } from "antd";
import VendorRegisterNew from "@/components/VendorRegisterNew";
import VendorRegister from "@/components/VendorRegistration";
import VendorIzinUsaha from "@/components/VendorIzinUsaha2";
import VendorLandasanHukum from "@/components/VendorLandasanHukum2";
import VendorPengurusPerusahaan from "@/components/VendorPengurusPerusahaan";
import VendorSptTahunan from "@/components/VendorSptTahunan2";
import VendorTenagaAhli from "@/components/VendorTenagaAhli";
import VendorPengalaman from "@/components/VendorPengalaman";
import VendorAttachmenDoc from "@/components/VendorAttachmenDoc";
import Layout from "@/components/Layout";


const { TabPane } = Tabs;

const RegisterPage = () => {
  return (
    <Layout>
    <div className="container mx-auto flex flex-col content-center">
      <h1 className="font-bold text-center text-5xl mb-5">Registrasi Lama</h1>
      <VendorRegister />
    </div>
    </Layout>
  );
};

export default RegisterPage;

