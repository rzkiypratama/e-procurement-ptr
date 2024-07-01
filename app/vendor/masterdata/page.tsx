'use client'

import { useSearchParams } from 'next/navigation'
import VendorPosition from '@/components/VendorPosition';
import VendorBusinessField from '@/components/VendorBusinessField';
import Layout from '@/components/LayoutNew';
import CurrencyData from '@/components/Currency';
import { Suspense } from 'react'

const ViewVendorPosition = () => {
    const typeParams = useSearchParams()

    const type = typeParams.get('type')

    if (type == "position") {
        return (
            <Layout>
                <div className="container mx-auto flex flex-col content-center p-8">
                    <VendorPosition />
                </div>
            </Layout>
        )
    } else if (type == "business-field") {
        return (
            <Layout>
                <div className="container mx-auto flex flex-col content-center p-8">
                    <VendorBusinessField />
                </div>
            </Layout>
        )
    } else if (type == "currency") {
        return (
            <Layout>
                <div className="container mx-auto flex flex-col content-center p-8">
                    <CurrencyData />
                </div>
            </Layout>
        )
    } else {
        return (
            <Layout>
                <div className="container mx-auto flex flex-col content-center p-8">
                    No Content Show
                </div>
            </Layout>
        )
    }
}
const MasterData = () => {
    return (
        <Suspense fallback={<>Loading...</>}>
            <ViewVendorPosition />
        </Suspense>
    )
};

export default MasterData;