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

interface AttachmentDocVerify {
    id: number;
    name: string;
    document: string;
    category: string;
    expiration_date: string;
    is_verified: boolean;
    document_path: string;
    verified_by: String;
    verified_at: String;
}

interface Links {
    first: String,
    last: String,
    prev: String | null,
    next: String | null,
}

interface MetaLink {
    url: String | null,
    label: String | null,
    active: String | null,
}

interface Meta {
    current_page: number,
    from: number,
    last_page: number,
    links: MetaLink[]
    path: String
    per_page: number
    to: number
    total: number
}

interface PaginateVendorRegistered {
    data: VendorRegisteredList[]
    links: Links
    meta: Meta
}

interface PaginateVendorVerification {
    data: VendorVerificationList[]
    links: Links
    meta: Meta
}

// interface Paginate {
//     data: VendorRegisteredList[]
//     links: Links
//     meta: Meta
// }

interface VendorRegisteredState {
    paginateVendorRegistered: PaginateVendorRegistered;
    initializeVendorRegisteredList: (paginateVendorRegistered: PaginateVendorRegistered) => void;
}

const useVendorRegisteredStore = create<VendorRegisteredState>((set) => ({
    paginateVendorRegistered: {
        data: [],
        links: {
            first: "",
            last: "",
            prev: null,
            next: null,
        },
        meta: {
            current_page: 0,
            from: 0,
            last_page: 0,
            links: [],
            path: "",
            per_page: 0,
            to: 0,
            total: 0,
        }
    },
    initializeVendorRegisteredList: (paginateVendorRegistered) => set({ paginateVendorRegistered: paginateVendorRegistered }),
}));

interface VendorVerificationState {
    paginateVendorVerification: PaginateVendorVerification
    initializeVendorVerificationList: (paginateVendorVerification: PaginateVendorVerification) => void;
}

const useVendorVerificationStore = create<VendorVerificationState>((set) => ({
    paginateVendorVerification: {
        data: [],
        links: {
            first: "",
            last: "",
            prev: null,
            next: null,
        },
        meta: {
            current_page: 0,
            from: 0,
            last_page: 0,
            links: [],
            path: "",
            per_page: 0,
            to: 0,
            total: 0,
        }
    },
    initializeVendorVerificationList: (paginateVendorVerification) => set(() => ({
        paginateVendorVerification,
    })),
}));

interface AttachmentDocVerifyState {
    attachmentDocsVerify: AttachmentDocVerify[];
    initializeAttachmentDocVerify: (attachmentDocsVerify: AttachmentDocVerify[]) => void;
}

const useAttachmentDocVerifyStore = create<AttachmentDocVerifyState>((set) => ({
    attachmentDocsVerify: [],
    initializeAttachmentDocVerify: (attachmentDocsVerify) => set(() => ({
        attachmentDocsVerify,
    })),
}));

export default { useVendorRegisteredStore, useVendorVerificationStore, useAttachmentDocVerifyStore };