import { create } from 'zustand';

interface GeneralInfoFormValues {
  companyName: string;
  companyNPWP: string;
  status: string;
  companyAddress: string;
  city: string;
  province: string;
  postalCode: string;
  companyPhone: string;
  companyFax: string;
  companyEmail: string;
}

interface ContactInfoFormValues {
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactPosition: string;
  contactNPWP: string;
}

interface AuthorizationFormValues {
  username: string;
  password: string;
  confirmpassord: string;
}

interface FormState {
  generalInfo: GeneralInfoFormValues;
  contactInfo: ContactInfoFormValues[];
  authorization: AuthorizationFormValues;
  setGeneralInfo: (info: GeneralInfoFormValues) => void;
  setContactInfo: (info: ContactInfoFormValues[]) => void;
  setAuthorization: (info: AuthorizationFormValues) => void;
  isFormValid: boolean;
  setFormValid: (isValid: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useFormStore = create<FormState>((set) => ({
  generalInfo: {
    companyName: '',
    companyNPWP: '',
    status: '',
    companyAddress: '',
    city: '',
    province: '',
    postalCode: '',
    companyPhone: '',
    companyFax: '',
    companyEmail: '',
  },
  contactInfo: [],
  authorization: {
    username: '',
    password: '',
    confirmpassord: ''
  },
  setGeneralInfo: (info) => set({ generalInfo: info }),
  setContactInfo: (info) => set({ contactInfo: info }),
  setAuthorization: (info) => set({ authorization: info }),
  isFormValid: false,
  setFormValid: (isValid) => set({ isFormValid: isValid }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
