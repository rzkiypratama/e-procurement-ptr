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

interface IzinUsaha {
  id: number;
  jenisIzin: string;
  nomorIzin: number;
  tanggalIzin: Date;
  tanggalBerakhir: Date;
  instansiPemberiIzin: string;
  instansiBerlakuIzinUsaha: Date;
  bidangUsaha: string;
}

interface IzinUsahaStore {
  izinUsaha: IzinUsaha[];
  addIzinUsaha: (izin: Omit<IzinUsaha, "id">) => void;
  editIzinUsaha: (id: number, data: Partial<IzinUsaha>) => void;
}

export const useIzinUsahaStore = create<IzinUsahaStore>((set) => ({
  izinUsaha: [],
  addIzinUsaha: (izin) =>
    set((state) => ({
      izinUsaha: [
        ...state.izinUsaha,
        { id: state.izinUsaha.length + 1, ...izin },
      ],
    })),
  editIzinUsaha: (id, data) =>
    set((state) => ({
      izinUsaha: state.izinUsaha.map((item) =>
        item.id === id ? { ...item, ...data } : item
      ),
    })),
}));
interface LandasanHukumData {
  id: number;
  nomorDokumen: string;
  tanggalDokumen: Date;
  namaNotaris: string;
}

// Interface for Landasan Hukum store
interface LandasanHukumStore {
  landasanHukum: LandasanHukumData[];
  addLandasanHukum: (data: Omit<LandasanHukumData, 'id'>) => void;
  editLandasanHukum: (id: number, data: LandasanHukumData) => void;
  deleteLandasanHukum: (id: number) => void;
}

// Create Zustand store for Landasan Hukum
export const useLandasanHukumStore = create<LandasanHukumStore>((set) => ({
  landasanHukum: [],
  addLandasanHukum: (data) =>
    set((state) => ({
      landasanHukum: [...state.landasanHukum, { id: state.landasanHukum.length + 1, ...data }],
    })),
  editLandasanHukum: (id, data) =>
    set((state) => ({
      landasanHukum: state.landasanHukum.map((item) => (item.id === id ? { ...item, ...data } : item)),
    })),
  deleteLandasanHukum: (id) =>
    set((state) => ({
      landasanHukum: state.landasanHukum.filter((item) => item.id !== id),
    })),
}));
