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
}

interface FormState {
  generalInfo: GeneralInfoFormValues;
  contactInfo: ContactInfoFormValues;
  authorization: AuthorizationFormValues;
  setGeneralInfo: (info: GeneralInfoFormValues) => void;
  setContactInfo: (info: ContactInfoFormValues) => void;
  setAuthorization: (info: AuthorizationFormValues) => void;
  isFormValid: boolean;
  setFormValid: (isValid: boolean) => void;
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
  contactInfo: {
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactPosition: '',
    contactNPWP: '',
  },
  authorization: {
    username: '',
    password: '',
  },
  setGeneralInfo: (info) => set({ generalInfo: info }),
  setContactInfo: (info) => set({ contactInfo: info }),
  setAuthorization: (info) => set({ authorization: info }),
  isFormValid: false,
  setFormValid: (isValid) => set({ isFormValid: isValid }),
}));