import { create } from 'zustand';

interface RegisterProfilePerusahaan {
  id: number;
  companyName: string;
  companyNPWP: string;
  companyStatus: string;
  companyAddress: string;
  companyCity: string;
  companyProvince: string;
  companyPostalCode: string;
  companyPhone: string;
  companyFax: string;
  companyEmail: string;
}

interface RegisterContactInfo {
  id: number;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactPosition: string;
  contactNPWP: string;
}

interface RegisterAuthorization {
  id: number;
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
    id: 0,
    companyName: '',
    companyNPWP: '',
    companyStatus: '',
    companyAddress: '',
    companyCity: '',
    companyProvince: '',
    companyPostalCode: '',
    companyPhone: '',
    companyFax: '',
    companyEmail: '',
  },
  registerContactInfo: [],
  registerAuthorization: {
    id: 0,
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