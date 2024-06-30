import { create } from 'zustand';

interface DashboardSummary {
    vendorRegistered: number;
    vendorVerified: number;
}

interface VendorListSummary {
    id: number;
    companyName: string;
    name: string;
    email: string;
    phoneNumber: string;
    npwp: string
}

interface DashboardVendorState {
    data: DashboardSummary;
    vendorList: VendorListSummary[];
    setDashboardSummary: (data: DashboardSummary) => void;
    setVendorListSummary: (vendorList: VendorListSummary[]) => void;
    // loading: boolean;
    // setLoading: (loading: boolean) => void;
}

const useDashboardSummaryStore = create<DashboardVendorState>((set) => ({
    data: {
        vendorRegistered: 0,
        vendorVerified: 0,
    },
    vendorList: [],
    setDashboardSummary: (data) => set({ data: data }),
    setVendorListSummary: (vendorList) => set((state) => ({
        vendorList,
    })),
    // loading: false,
    // setLoading: (loading) => set({ loading }),
}));

export default useDashboardSummaryStore;