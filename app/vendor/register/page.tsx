"use client";
import { Tabs } from "antd";
import VendorRegister from "@/components/VendorRegistration";
import VendorIzinUsaha from "@/components/VendorIzinUsaha";
import VendorLandasanHukum from "@/components/VendorLandasanHukum";
import VendorPengurusPerusahaan from "@/components/VendorPengurusPerusahaan";
import VendorSptTahunan from "@/components/VendorSptTahunan";
import Item from "antd/es/list/Item";

const { TabPane } = Tabs;

const RegisterPage = () => {
  return (
    <div className="container mx-auto flex flex-col content-center">
      <h1 className="font-bold text-center text-5xl mb-5">Registrasi Penyedia</h1>
      <VendorRegister />
      <Tabs>
        <TabPane tab="Informasi Umum" key="1">
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
      </Tabs>
    </div>
  );
};

export default RegisterPage;
