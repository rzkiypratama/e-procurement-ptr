import { create } from 'zustand';

interface StatusReport {
  id: number;
  remark: string;
  approved_at: string;
  approved_by: string;
  status_code: string;
  procurement_status: {
    id: number;
    status_name: string;
    code: string;
  }
}
interface DashboardMasterBudget {
  id: number;
  tahun_anggaran: string;
  department: string;
  total_pengadaan: string;
  total_anggaran_digunakan: string
}

interface DashboardStatistic {
  anggaran: number;
  pengadaan: number;
}
interface DashboardSummary {
  user_request_pengadaan_barang: number;
  user_request_pengadaan_pekerjaan_konstruksi: number;
  user_request_pengadaan_jasa_konsultasi: number;
}

interface MasterBudgetInputAnggaran {
  no: number;
  id: number;
  year: string;
  department: string,
  label: string,
  capex_opex: string,
  total: number;
  rekening: string;
  department_id: number,
  updated_by: string;
}

interface Department {
  id: number,
  department_name: string,
  department_code: string,
}


interface PengadaanBarang {
  id: number;
  kode_rencana: string;
  kode_paket: string;
  nama_paket: string;
  metode_pengadaan: string;
  jenis_pengadaan: ProcurementType;
  jenis_kontrak: string;
  // hps: string;
  status_report: string;
}

interface ProcurementType {
  id: number
  type_name: string
  code: string
}

interface GeneralInformation {
  id: number;
  procurement_type: string;
  master_budget_id: string;
  package_name: string;
  work_unit: string;
  year: string;
  product_local: string;
  sources_of_funds: string;
  capex_opex: string;
  location: string;
  total_anggaran: string;
}

interface DetailInformation {
  id: number;
  specification_name: string;
  specification_detail: string;
  unit: string;
  quantity: string;
  price: string;
  ppn: string;
  total_after_ppn: string
  total: string;
}

interface SyaratKualifikasi {
  no: number;
  id: number;
  qualification: string;
  qualification_detail: string;
}

interface DokumenKualifikasi {
  id: number;
  document_name: string;
  document: string;
  document_path: string;
}

interface UserReqTimeline {
  id: number;
  choose_method: string,
  start_utilization_date: string,
  end_utilization_date: string,
  start_contract_date: string,
  end_contract_date: string,
  start_selection_date: string,
  end_selection_date: string,
  announcement_date: string
}
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
  province_id: string;
  province: string;
  city: string;
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
  name: string;
  position_id: string;
  identity_no: string;
  npwp_no: string;
}

interface LandasanHukum {
  id: number;
  document_no: string;
  document_date: string;
  notaris_name: string;
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
  job_name: string;
  business_field_id: string;
  location: string;
}

interface SPTTahunan {
  id: number;
  year: string;
  spt_number: string;
  date: string;
}

interface TenagaAhli {
  id: number;
  name: string;
  birth_date: string;
  identity_no: string;
  npwp_no: string;
  last_education: string;
  last_experience: string;
}

interface AttachmentDoc {
  id: number;
  name: string;
  document: string;
  document_path: string;
  category: string;
  expiration_date: string;
}

interface AttachmentDocVerify {
  id: number;
  name: string;
  document: string;
  category: string;
  expiration_date: string;
  is_verified: boolean;
  document_path: string;
}

// State Interfaces
interface CenterStoreState {
  statusReport: StatusReport[];
  userReqTimeline: UserReqTimeline[];
  masterBudgetInputAnggaran: MasterBudgetInputAnggaran[];
  dashboardStatistic: DashboardStatistic;
  dashboardMasterBudget: DashboardMasterBudget[];
  data: DashboardSummary;
  syaratKualifikasi: SyaratKualifikasi[];
  dokumenKualifikasi: DokumenKualifikasi[];
  detailInformation: DetailInformation[];
  generalInformation: GeneralInformation[];
  pengadaanBarang: PengadaanBarang[];
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
  attachmentDocVerify: AttachmentDocVerify[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  setDashboardStatistic: (dashboardStatistic: DashboardStatistic) => void;
  setDashboardMasterBudget: (dashboardMasterBudget: DashboardMasterBudget[]) => void;
  setDashboardSummary: (data: DashboardSummary) => void;
  addStatusReport: (statusReport: StatusReport) => void;
  editStatusReport: (statusReport: StatusReport) => void;
  removeStatusReport: (id: number) => void;
  initializeStatusReport: (statusReport: StatusReport[]) => void;
  addUserReqTimeline: (userReqTimeline: UserReqTimeline) => void;
  editUserReqTimeline: (userReqTimeline: UserReqTimeline) => void;
  removeUserReqTimeline: (id: number) => void;
  initializeUserReqTimeline: (userReqTimeline: UserReqTimeline[]) => void;
  addMasterBudgetInputAnggaran: (masterBudgetInputAnggaran: MasterBudgetInputAnggaran) => void;
  editMasterBudgetInputAnggaran: (masterBudgetInputAnggaran: MasterBudgetInputAnggaran) => void;
  removeMasterBudgetInputAnggaran: (id: number) => void;
  initializeMasterBudgetInputAnggaran: (masterBudgetInputAnggaran: MasterBudgetInputAnggaran[]) => void;
  addSyaratKualifikasi: (syaratKualifikasi: SyaratKualifikasi) => void;
  editSyaratKualifikasi: (syaratKualifikasi: SyaratKualifikasi) => void;
  removeSyaratKualifikasi: (id: number) => void;
  initializeSyaratKualifikasi: (syaratKualifikasi: SyaratKualifikasi[]) => void;
  addDokumenKualifikasi: (dokumenKualifikasi: DokumenKualifikasi) => void;
  editDokumenKualifikasi: (dokumenKualifikasi: DokumenKualifikasi) => void;
  removeDokumenKualifikasi: (id: number) => void;
  initializeDokumenKualifikasi: (dokumenKualifikasi: DokumenKualifikasi[]) => void;
  addDetailInformation: (detailInformation: DetailInformation) => void;
  editDetailInformation: (detailInformation: DetailInformation) => void;
  removeDetailInformation: (id: number) => void;
  initializeDetailInformation: (detailInformation: DetailInformation[]) => void;
  addGeneralInformation: (generalInformation: GeneralInformation) => void;
  editGeneralInformation: (generalInformation: GeneralInformation) => void;
  removeGeneralInformation: (id: number) => void;
  initializeGeneralInformation: (generalInformation: GeneralInformation[]) => void;
  addPengadaanBarang: (pengadaanBarang: PengadaanBarang) => void;
  editPengadaanBarang: (pengadaanBarang: PengadaanBarang) => void;
  removePengadaanBarang: (id: number) => void;
  initializePengadaanBarang: (pengadaanBarang: PengadaanBarang[]) => void;
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
  statusReport: [],
  userReqTimeline: [],
  masterBudgetInputAnggaran: [],
  dashboardStatistic: {
    anggaran: 0,
    pengadaan: 0,
  },
  dashboardMasterBudget: [],
  data: {
    user_request_pengadaan_barang: 0,
    user_request_pengadaan_pekerjaan_konstruksi: 0,
    user_request_pengadaan_jasa_konsultasi: 0,
  },
  syaratKualifikasi: [],
  dokumenKualifikasi: [],
  detailInformation: [],
  generalInformation: [],
  pengadaanBarang: [],
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
  attachmentDocVerify: [],
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  setDashboardStatistic: (data) => set({ dashboardStatistic: data }),

  setDashboardMasterBudget: (dashboardMasterBudget) => set({ dashboardMasterBudget: dashboardMasterBudget }),

  setDashboardSummary: (data) => set({ data: data }),

  addStatusReport: (statusReport) => set((state) => ({
    statusReport: [...state.statusReport, statusReport],
  })),
  editStatusReport: (statusReport) => set((state) => ({
    statusReport: state.statusReport.map((item) => item.id === statusReport.id ? statusReport : item),
  })),
  removeStatusReport: (id) => set((state) => ({
    statusReport: state.statusReport.filter((item) => item.id !== id),
  })),
  initializeStatusReport: (statusReport) => set(() => ({
    statusReport: statusReport
  })),

  addUserReqTimeline: (userReqTimeline) => set((state) => ({
    userReqTimeline: [...state.userReqTimeline, userReqTimeline],
  })),
  editUserReqTimeline: (userReqTimeline) => set((state) => ({
    userReqTimeline: state.userReqTimeline.map((item) => item.id === userReqTimeline.id ? userReqTimeline : item),
  })),
  removeUserReqTimeline: (id) => set((state) => ({
    userReqTimeline: state.userReqTimeline.filter((item) => item.id !== id),
  })),
  initializeUserReqTimeline: (userReqTimeline) => set(() => ({
    userReqTimeline: userReqTimeline
  })),

  addMasterBudgetInputAnggaran: (masterBudgetInputAnggaran) => set((state) => ({
    masterBudgetInputAnggaran: [...state.masterBudgetInputAnggaran, masterBudgetInputAnggaran],
  })),
  editMasterBudgetInputAnggaran: (masterBudgetInputAnggaran) => set((state) => ({
    masterBudgetInputAnggaran: state.masterBudgetInputAnggaran.map((item) => item.id === masterBudgetInputAnggaran.id ? masterBudgetInputAnggaran : item),
  })),
  removeMasterBudgetInputAnggaran: (id) => set((state) => ({
    masterBudgetInputAnggaran: state.masterBudgetInputAnggaran.filter((item) => item.id !== id),
  })),
  initializeMasterBudgetInputAnggaran: (masterBudgetInputAnggaran) => set(() => ({
    masterBudgetInputAnggaran: masterBudgetInputAnggaran
  })),

  addDokumenKualifikasi: (dokumenKualifikasi) => set((state) => ({
    dokumenKualifikasi: [...state.dokumenKualifikasi, dokumenKualifikasi],
  })),
  editDokumenKualifikasi: (dokumenKualifikasi) => set((state) => ({
    dokumenKualifikasi: state.dokumenKualifikasi.map((item) => item.id === dokumenKualifikasi.id ? dokumenKualifikasi : item),
  })),
  removeDokumenKualifikasi: (id) => set((state) => ({
    dokumenKualifikasi: state.dokumenKualifikasi.filter((item) => item.id !== id),
  })),
  initializeDokumenKualifikasi: (dokumenKualifikasi) => set(() => ({
    dokumenKualifikasi: dokumenKualifikasi
  })),

  addSyaratKualifikasi: (syaratKualifikasi) => set((state) => ({
    syaratKualifikasi: [...state.syaratKualifikasi, syaratKualifikasi],
  })),
  editSyaratKualifikasi: (syaratKualifikasi) => set((state) => ({
    syaratKualifikasi: state.syaratKualifikasi.map((item) => item.id === syaratKualifikasi.id ? syaratKualifikasi : item),
  })),
  removeSyaratKualifikasi: (id) => set((state) => ({
    syaratKualifikasi: state.syaratKualifikasi.filter((item) => item.id !== id),
  })),
  initializeSyaratKualifikasi: (syaratKualifikasi) => set(() => ({
    syaratKualifikasi: syaratKualifikasi
  })),

  addDetailInformation: (detailInformation) => set((state) => ({
    detailInformation: [...state.detailInformation, detailInformation],
  })),
  editDetailInformation: (detailInformation) => set((state) => ({
    detailInformation: state.detailInformation.map((item) => item.id === detailInformation.id ? detailInformation : item),
  })),
  removeDetailInformation: (id) => set((state) => ({
    detailInformation: state.detailInformation.filter((item) => item.id !== id),
  })),
  initializeDetailInformation: (detailInformation) => set(() => ({
    detailInformation: detailInformation
  })),

  addGeneralInformation: (generalInformation) => set((state) => ({
    generalInformation: [...state.generalInformation, generalInformation],
  })),
  editGeneralInformation: (generalInformation) => set((state) => ({
    generalInformation: state.generalInformation.map((item) => item.id === generalInformation.id ? generalInformation : item),
  })),
  removeGeneralInformation: (id) => set((state) => ({
    generalInformation: state.generalInformation.filter((item) => item.id !== id),
  })),
  initializeGeneralInformation: (generalInformation) => set(() => ({
    generalInformation: generalInformation
  })),

  addPengadaanBarang: (pengadaanBarang) => set((state) => ({
    pengadaanBarang: [...state.pengadaanBarang, pengadaanBarang],
  })),
  editPengadaanBarang: (pengadaanBarang) => set((state) => ({
    pengadaanBarang: state.pengadaanBarang.map((item) => item.id === pengadaanBarang.id ? pengadaanBarang : item),
  })),
  removePengadaanBarang: (id) => set((state) => ({
    pengadaanBarang: state.pengadaanBarang.filter((item) => item.id !== id),
  })),
  initializePengadaanBarang: (pengadaanBarang) => set(() => ({
    pengadaanBarang: pengadaanBarang
  })),

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