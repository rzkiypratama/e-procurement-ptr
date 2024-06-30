import { create } from 'zustand';

interface VendorRegisteredList {
    id: number;
    company_name: string;
    vendor_number: string;
    pic_name: string;
    company_email: string;
    company_phone_number: string;
    status: string;
    vendor_type: string;
    status_vendor: string;
}

interface VendorVerificationList {
    id: number;
    company_name: string;
    vendor_number: string;
    pic_name: string;
    company_email: string;
    company_phone_number: string;
    status: string;
    verificator: string;
    progress_verification: string;
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

interface VendorVerificationState {
    vendorVerificationList: VendorVerificationList[];
    initializeVendorVerificationList: (vendorVerificationList: VendorVerificationList[]) => void;
}

const useVendorVerificationStore = create<VendorVerificationState>((set) => ({
    vendorVerificationList: [],
    initializeVendorVerificationList: (vendorVerificationList) => set(() => ({
        vendorVerificationList,
    })),
}));

export default { useVendorRegisteredStore, useVendorVerificationStore };