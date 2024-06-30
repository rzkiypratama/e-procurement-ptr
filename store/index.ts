import { create } from "zustand";

interface GeneralInfoFormValues {
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

interface ContactInfoFormValues {
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  position_id: string;
  contact_identity_no: string;
  contact_npwp: string;
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
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useFormStore = create<FormState>((set) => ({
  generalInfo: {
    company_name: "",
    company_npwp: 0,
    vendor_type: "",
    company_address: "",
    city_id: "",
    province_id: "",
    postal_code: 0,
    company_phone_number: "",
    company_fax: "",
    company_email: "",
  },
  contactInfo: {
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    position_id: "",
    contact_identity_no: "",
    contact_npwp: "",
  },
  authorization: {
    username: "",
    password: "",
  },
  setGeneralInfo: (info) => set({ generalInfo: info }),
  setContactInfo: (info) => set({ contactInfo: info }),
  setAuthorization: (info) => set({ authorization: info }),
  isFormValid: false,
  setFormValid: (isValid) => set({ isFormValid: isValid }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
