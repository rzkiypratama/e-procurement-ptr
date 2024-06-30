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


const { TabPane } = Tabs;

const RegisterPage = () => {
	return (
		<div className="container mx-auto flex flex-col content-center px-64 py-16">
			<h1 className="font-bold text-center text-5xl mb-10">Registrasi Vendor</h1>
			<VendorRegisterNew />
		</div>
	);
};

export default RegisterPage;

