"use client";
import { Tabs } from "antd";
import VendorRegister from "@/components/VendorRegistration";
import VendorIzinUsaha from "@/components/VendorIzinUsaha2";
import VendorLandasanHukum from "@/components/VendorLandasanHukum2";
import VendorPengurusPerusahaan from "@/components/VendorPengurusPerusahaan";
import VendorSptTahunan from "@/components/VendorSptTahunan2";
import VendorTenagaAhli from "@/components/VendorTenagaAhli";
import VendorPengalaman from "@/components/VendorPengalaman";
import VendorAttachmenDoc from "@/components/VendorAttachmenDoc";


const { TabPane } = Tabs;

const RegisterPage = () => {
  return (
    <div className="container mx-auto flex flex-col content-center p-24">
      <h1 className="font-bold text-center text-5xl mb-5">Registrasi Penyedia</h1>
      {/* <VendorRegister /> */}
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
  );
};

export default RegisterPage;

