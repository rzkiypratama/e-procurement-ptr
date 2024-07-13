'use client'

import ViewDepartment from '@/components/Department';
import Layout from '@/components/LayoutNew';

const MasterDataUserReq = () => {
    return (
        // <Suspense fallback={<>Loading...</>}>
        <Layout>
            <div className="container mx-auto flex flex-col">
                <ViewDepartment />
            </div>
        </Layout>
        // </Suspense>
    )
};

export default MasterDataUserReq;