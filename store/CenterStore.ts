import { create } from 'zustand';

// Interfaces

interface ProfilePerusahaan {
  id: number;
  company_name: string;
  company_npwp: string;
  vendor_type: string;
  company_address: string;
  city_id: string;
  postal_code: string;
  company_phone_number: string;
  company_email: string;
  company_fax: string;
}

interface ContactPerson {
  id: number;
  contact_name: string;
  contact_email: string;
  contact_identity_no: string;
  contact_phone: string;
  contact_npwp: string;
  position_id: string;
}

interface BankAccount {
  id: number;
  bank_id: string;
  currency_id: string;
  account_number: string;
}
interface PengurusPerusahaan {
  id: number;
  namaPengurus: string;
  jabatanPengurus: string;
  noKTPPengurus: string;
  npwpPengurus: string;
}

interface LandasanHukum {
  id: number;
  nomorDokumen: string;
  namaNotaris: string;
  tahunDokumen: string;
}

interface IzinUsaha {
  id: number;
  type: string;
  permit_number: string;
  start_date: string;
  end_date: string;
  licensing_agency: string;
  vendor_business_field_id: number;
}

interface Pengalaman {
  id: number;
  namaPekerjaan: string;
  bidangPekerjaan: string;
  lokasiPekerjaan: string;
}

interface SPTTahunan {
  id: number;
  tahunSpt: string;
  nomorSPT: string;
  tanggalSpt: string;
}

interface TenagaAhli {
  id: number;
  namaTenagaAhli: string;
  tanggalLahirTenagaAhli: string;
  nomorKtpTenagaAhli: string;
  npwpTenagaAhli: string;
  pendidikanTenagaAhli: string;
  pengalamanTenagaAhli: string;
}

interface AttachmentDoc {
  id: number;
  namaAttachment: string;
  kategoriAttachment: string;
  fileAttachment: string;
}

// State Interfaces
interface CenterStoreState {
  profilePerusahaan: ProfilePerusahaan[];
  contactInfo: ContactPerson[];
  bankAccount: BankAccount[];
  pengurusPerusahaan: PengurusPerusahaan[];
  landasanHukum: LandasanHukum[];
  izinUsaha: IzinUsaha[];
  pengalaman: Pengalaman[];
  sptTahunan: SPTTahunan[];
  tenagaAhli: TenagaAhli[];
  attachmentDoc: AttachmentDoc[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  addProfilePerusahaan: (profilePerusahaan: ProfilePerusahaan) => void;
  editProfilePerusahaan: (profilePerusahaan: ProfilePerusahaan) => void;
  removeProfilePerusahaan: (id: number) => void;
  initializeProfilePerusahaan: (profilePerusahaan: ProfilePerusahaan[]) => void;
  addContactInfo: (contactInfo: ContactPerson) => void;
  editContactInfo: (contactInfo: ContactPerson) => void;
  removeContactInfo: (id: number) => void;
  initializeContactInfo: (contactInfo: ContactPerson[]) => void;
  addBankAccount: (bankAccount: BankAccount) => void;
  editBankAccount: (bankAccount: BankAccount) => void;
  removeBankAccount: (id: number) => void;
  initializeBankAccount: (bankAccount: BankAccount[]) => void;
  addPengurusPerusahaan: (pengurusPerusahaan: PengurusPerusahaan) => void;
  editPengurusPerusahaan: (pengurusPerusahaan: PengurusPerusahaan) => void;
  removePengurusPerusahaan: (id: number) => void;
  initializePengurusPerusahaan: (pengurusPerusahaan: PengurusPerusahaan[]) => void;
  addLandasanHukum: (landasanHukum: LandasanHukum) => void;
  editLandasanHukum: (landasanHukum: LandasanHukum) => void;
  removeLandasanHukum: (id: number) => void;
  initializeLandasanHukum: (landasanHukum: LandasanHukum[]) => void;
  addIzinUsaha: (izinUsaha: IzinUsaha) => void;
  editIzinUsaha: (izinUsaha: IzinUsaha) => void;
  removeIzinUsaha: (id: number) => void;
  initializeIzinUsaha: (izinUsaha: IzinUsaha[]) => void;
  addPengalaman: (pengalaman: Pengalaman) => void;
  editPengalaman: (pengalaman: Pengalaman) => void;
  removePengalaman: (id: number) => void;
  initializePengalaman: (pengalaman: Pengalaman[]) => void;
  addSPTTahunan: (sptTahunan: SPTTahunan) => void;
  editSPTTahunan: (sptTahunan: SPTTahunan) => void;
  removeSPTTahunan: (id: number) => void;
  initializeSPTTahunan: (sptTahunan: SPTTahunan[]) => void;
  addTenagaAhli: (tenagaAhli: TenagaAhli) => void;
  editTenagaAhli: (tenagaAhli: TenagaAhli) => void;
  removeTenagaAhli: (id: number) => void;
  initializeTenagaAhli: (tenagaAhli: TenagaAhli[]) => void;
  addAttachment: (attachmentDoc: AttachmentDoc) => void;
  editAttachment: (attachmentDoc: AttachmentDoc) => void;
  removeAttachment: (id: number) => void;
  initializeAttachment: (attachmentDoc: AttachmentDoc[]) => void;
}

// Create Zustand Store
const useCenterStore = create<CenterStoreState>((set) => ({
  profilePerusahaan: [],
  contactInfo: [],
  bankAccount: [],
  pengurusPerusahaan: [],
  landasanHukum: [],
  izinUsaha: [],
  pengalaman: [],
  sptTahunan: [],
  tenagaAhli: [],
  attachmentDoc: [],
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  addProfilePerusahaan: (profilePerusahaan) => set((state) => ({
    profilePerusahaan: [...state.profilePerusahaan, profilePerusahaan],
  })),
  editProfilePerusahaan: (profilePerusahaan) => set((state) => ({
    profilePerusahaan: state.profilePerusahaan.map((item) => item.id === profilePerusahaan.id ? profilePerusahaan : item),
  })),
  removeProfilePerusahaan: (id) => set((state) => ({
    profilePerusahaan: state.profilePerusahaan.filter((item) => item.id !== id),
  })),
  initializeProfilePerusahaan: (profilePerusahaan) => set(() => ({
    profilePerusahaan: profilePerusahaan
  })),

  addContactInfo: (contactInfo) => set((state) => ({
    contactInfo: [...state.contactInfo, contactInfo],
  })),
  editContactInfo: (contactInfo) => set((state) => ({
    contactInfo: state.contactInfo.map((item) => item.id === contactInfo.id ? contactInfo : item),
  })),
  removeContactInfo: (id) => set((state) => ({
    contactInfo: state.contactInfo.filter((item) => item.id !== id),
  })),
  initializeContactInfo: (contactInfo) => set(() => ({
    contactInfo,
  })),

  addBankAccount: (bankAccount) => set((state) => ({
    bankAccount: [...state.bankAccount, bankAccount],
  })),
  editBankAccount: (bankAccount) => set((state) => ({
    bankAccount: state.bankAccount.map((item) => item.id === bankAccount.id ? bankAccount : item),
  })),
  removeBankAccount: (id) => set((state) => ({
    bankAccount: state.bankAccount.filter((item) => item.id !== id),
  })),
  initializeBankAccount: (bankAccount) => set(() => ({
    bankAccount,
  })),

  addPengurusPerusahaan: (pengurusPerusahaan) => set((state) => ({
    pengurusPerusahaan: [...state.pengurusPerusahaan, pengurusPerusahaan],
  })),
  editPengurusPerusahaan: (pengurusPerusahaan) => set((state) => ({
    pengurusPerusahaan: state.pengurusPerusahaan.map((item) => item.id === pengurusPerusahaan.id ? pengurusPerusahaan : item),
  })),
  removePengurusPerusahaan: (id) => set((state) => ({
    pengurusPerusahaan: state.pengurusPerusahaan.filter((item) => item.id !== id),
  })),
  initializePengurusPerusahaan: (pengurusPerusahaan) => set(() => ({
    pengurusPerusahaan,
  })),

  addLandasanHukum: (landasanHukum) => set((state) => ({
    landasanHukum: [...state.landasanHukum, landasanHukum],
  })),
  editLandasanHukum: (landasanHukum) => set((state) => ({
    landasanHukum: state.landasanHukum.map((item) => item.id === landasanHukum.id ? landasanHukum : item),
  })),
  removeLandasanHukum: (id) => set((state) => ({
    landasanHukum: state.landasanHukum.filter((item) => item.id !== id),
  })),
  initializeLandasanHukum: (landasanHukum) => set(() => ({
    landasanHukum,
  })),

  addIzinUsaha: (izinUsaha) => set((state) => ({
    izinUsaha: [...state.izinUsaha, izinUsaha],
  })),
  editIzinUsaha: (izinUsaha) => set((state) => ({
    izinUsaha: state.izinUsaha.map((item) => item.id === izinUsaha.id ? izinUsaha : item),
  })),
  removeIzinUsaha: (id) => set((state) => ({
    izinUsaha: state.izinUsaha.filter((item) => item.id !== id),
  })),
  initializeIzinUsaha: (izinUsaha) => set(() => ({
    izinUsaha,
  })),

  addPengalaman: (pengalaman) => set((state) => ({
    pengalaman: [...state.pengalaman, pengalaman],
  })),
  editPengalaman: (pengalaman) => set((state) => ({
    pengalaman: state.pengalaman.map((item) => item.id === pengalaman.id ? pengalaman : item),
  })),
  removePengalaman: (id) => set((state) => ({
    pengalaman: state.pengalaman.filter((item) => item.id !== id),
  })),
  initializePengalaman: (pengalaman) => set(() => ({
    pengalaman,
  })),

  addSPTTahunan: (sptTahunan) => set((state) => ({
    sptTahunan: [...state.sptTahunan, sptTahunan],
  })),
  editSPTTahunan: (sptTahunan) => set((state) => ({
    sptTahunan: state.sptTahunan.map((item) => item.id === sptTahunan.id ? sptTahunan : item),
  })),
  removeSPTTahunan: (id) => set((state) => ({
    sptTahunan: state.sptTahunan.filter((item) => item.id !== id),
  })),
  initializeSPTTahunan: (sptTahunan) => set(() => ({
    sptTahunan,
  })),

  addTenagaAhli: (tenagaAhli) => set((state) => ({
    tenagaAhli: [...state.tenagaAhli, tenagaAhli],
  })),
  editTenagaAhli: (tenagaAhli) => set((state) => ({
    tenagaAhli: state.tenagaAhli.map((item) => item.id === tenagaAhli.id ? tenagaAhli : item),
  })),
  removeTenagaAhli: (id) => set((state) => ({
    tenagaAhli: state.tenagaAhli.filter((item) => item.id !== id),
  })),
  initializeTenagaAhli: (tenagaAhli) => set(() => ({
    tenagaAhli,
  })),

  addAttachment: (attachmentDoc) => set((state) => ({
    attachmentDoc: [...state.attachmentDoc, attachmentDoc],
  })),
  editAttachment: (attachmentDoc) => set((state) => ({
    attachmentDoc: state.attachmentDoc.map((item) => item.id === attachmentDoc.id ? attachmentDoc : item),
  })),
  removeAttachment: (id) => set((state) => ({
    attachmentDoc: state.attachmentDoc.filter((item) => item.id !== id),
})),
initializeAttachment: (attachmentDoc) => set(() => ({
attachmentDoc,
})),
}));

export default useCenterStore;