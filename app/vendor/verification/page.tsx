"use client";
import { Tabs } from "antd";
import Layout from "@/components/LayoutNew";
import VendorVerificationList from "@/components/VendorVerification";


const { TabPane } = Tabs;

const VerificationPage = () => {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col content-center p-8">
        <VendorVerificationList />
      </div>
    </Layout>
  );
};

export default VerificationPage;

