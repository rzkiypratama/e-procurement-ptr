"use client";
import Layout from "@/components/LayoutNew";
import VendorVerificationList from "@/components/VendorVerification";

const VerificationPage = () => {
  return (
    <Layout>
      <div className="container mx-auto flex flex-col content-center">
        <VendorVerificationList />
      </div>
    </Layout>
  );
};

export default VerificationPage;

