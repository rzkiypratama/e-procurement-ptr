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
    <div className="container mx-auto flex flex-col content-center p-24">
      <h1 className="font-bold text-center text-5xl mb-5">layout 2</h1>
      <Tabs>
        <TabPane tab="Izin Usaha" key="1">
      <VendorIzinUsaha/>
        </TabPane>
        <TabPane tab="Landasan Hukum" key="2">
      <VendorLandasanHukum/>
        </TabPane>
        <TabPane tab="Pengurus Perusahaan" key="3">
      <VendorPengurusPerusahaan/>
        </TabPane>
        <TabPane tab="SPT Tahunan" key="4">
      <VendorSptTahunan/>
        </TabPane>
        <TabPane tab="Tenaga Ahli" key="5">
      <VendorTenagaAhli/>
        </TabPane>
        <TabPane tab="Pengalaman" key="6">
      <VendorPengalaman/>
        </TabPane>
        <TabPane tab="Attachment Document" key="7">
      <VendorAttachmenDoc/>
        </TabPane>
      </Tabs>
    </div>
    </Layout>
  );
};

export default RegisterPage;

