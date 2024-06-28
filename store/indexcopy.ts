import { create } from 'zustand';

interface RegisterProfilePerusahaan {
  company_name: string;
  company_npwp: number;
  vendor_type: string;
  company_address: string;
  city_id: string;
  province_id: string;
  postal_code: number;
  company_phone_number: string;
  company_fax: string;
  company_email: string;
}

interface RegisterContactInfo {
  id: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  position_id: string;
  contact_identity_no: string;
  contact_npwp: string;
}

interface RegisterAuthorization {
  username: string;
  password: string;
}

interface RegisterState {
  registerProfilePerusahaan: RegisterProfilePerusahaan;
  registerContactInfo: RegisterContactInfo[];
  registerAuthorization: RegisterAuthorization;
  
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  isFormValid: boolean;
  setFormValid: (isValid: boolean) => void;

  initializeProfilePerusahaan: (profilePerusahaan: RegisterProfilePerusahaan) => void;

  addContactInfo: (contactInfo: RegisterContactInfo) => void;
  editContactInfo: (contactInfo: RegisterContactInfo) => void;
  removeContactInfo: (id: number) => void;
  initializeContactInfo: (contactInfo: RegisterContactInfo[]) => void;

  initializeAuthorization: (authInfo: RegisterAuthorization) => void;
}

const useFormStore = create<RegisterState>((set) => ({
  registerProfilePerusahaan: {
    company_name: '',
    company_npwp: 0,
    vendor_type: '',
    company_address: '',
    city_id: '',
    province_id: '',
    company_phone_number: '',
    company_fax: '',
    company_email: '',
    postal_code: 0,
  },
  registerContactInfo: [],
  registerAuthorization: {
    username: '',
    password: '',
  },
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
  isFormValid: false,
  setFormValid: (isValid) => set({ isFormValid: isValid }),

  // Profile Perusahaan Actions
  initializeProfilePerusahaan: (profilePerusahaan) => set({ registerProfilePerusahaan: profilePerusahaan }),


  // Contact Info Actions
  addContactInfo: (contactInfo) => set((state) => ({
    registerContactInfo: [...state.registerContactInfo, contactInfo],
  })),
  editContactInfo: (contactInfo) => set((state) => ({
    registerContactInfo: state.registerContactInfo.map((item) => item.id === contactInfo.id ? contactInfo : item),
  })),
  removeContactInfo: (id) => set((state) => ({
    registerContactInfo: state.registerContactInfo.filter((item) => item.id !== id),
  })),
  initializeContactInfo: (contactInfo) => set(() => ({
    registerContactInfo: [...contactInfo],
  })),

  // Authorization Actions
  initializeAuthorization: (authInfo) => set({ registerAuthorization: authInfo }),

}));

export default useFormStore;