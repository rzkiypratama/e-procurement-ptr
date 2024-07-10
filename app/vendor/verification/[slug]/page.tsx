"use client";
import Layout from "@/components/LayoutNew";
import VendorVerificationDoc from "@/components/VendorVerificationDoc";
import { useParams } from "next/navigation";

const VerificationPage = () => {
    const params = useParams<{ slug: string }>()
    return (
        <Layout>
            <div className="container mx-auto flex flex-col content-center">
                <VendorVerificationDoc vendorId={params.slug} />
            </div>
        </Layout>
    );
};

export default VerificationPage;

