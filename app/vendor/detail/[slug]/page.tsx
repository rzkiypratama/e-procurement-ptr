"use client";

import DetailVendorComponents from "@/components/DetailVendor";
import Layout from "@/components/LayoutNew";

const DetailVendor = () => {
    return (
        <Layout>
            <div className="container mx-auto flex flex-col content-center">
                <DetailVendorComponents />
            </div>
        </Layout>
    )
}

export default DetailVendor