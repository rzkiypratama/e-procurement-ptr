"use client";
import { Tabs } from "antd";
import Layout from '@/components/LayoutNew';
import VendorRegisteredList from "@/components/VendorRegisteredList";

const { TabPane } = Tabs;

const RegisteredVendorListPage = () => {
	// const isLogin = localStorage.getItem('token')
	return (
		<Layout>
			<VendorRegisteredList />
		</Layout>
	);
};

export default RegisteredVendorListPage;

