import { create } from 'zustand';

interface VendorRegisteredList {
    id: number;
    companyName: string;
    vendorNumber: string;
    pic: string;
    email: string;
    phoneNumber: string;
    status: string;
    type: string;
    statusVendor: string;
}

interface VendorRegisteredState {
    vendorRegisteredList: VendorRegisteredList[];
    initializeVendorRegisteredList: (vendorRegisteredList: VendorRegisteredList[]) => void;
}

const useVendorRegisteredStore = create<VendorRegisteredState>((set) => ({
    vendorRegisteredList: [],
    initializeVendorRegisteredList: (vendorRegisteredList) => set(() => ({
        vendorRegisteredList,
    })),
}));

export default useVendorRegisteredStore;