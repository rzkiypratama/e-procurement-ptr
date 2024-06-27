import { create } from 'zustand';

// Define state shape
interface VendorState {
  username: string;
  company_name: string;
  company_npwp: string;
  company_phone_number: string;
  company_email: string;
  company_fax: string;
  company_address: string;
  city_id: number;
  postal_code: number;
  vendor_type: string;
  vendor_number: string;
}

interface ContactPerson {
  contact_name: string;
  contact_email: string;
  contact_npwp: string;
  contact_identity_no: string;
  contact_phone: string;
  position_id: number;
}

interface UserState {
  user_name: string;
  email: string;
}

interface StoreState {
  vendor: VendorState;
  contactPersons: ContactPerson[];
  user: UserState;
  setVendor: (vendor: VendorState) => void;
  setContactPersons: (contactPersons: ContactPerson[]) => void;
  setUser: (user: UserState) => void;
}

// Initial state
const useStore = create<StoreState>((set) => ({
  vendor: {
    username: '',
    company_name: '',
    company_npwp: '',
    company_phone_number: '',
    company_email: '',
    company_fax: '',
    company_address: '',
    city_id: 0,
    postal_code: 0,
    vendor_type: '',
    vendor_number: '',
  },
  contactPersons: [],
  user: {
    user_name: '',
    email: '',
  },
  setVendor: (vendor) => set((state) => ({ vendor })),
  setContactPersons: (contactPersons) => set((state) => ({ contactPersons })),
  setUser: (user) => set((state) => ({ user })),
}));

export default useStore;