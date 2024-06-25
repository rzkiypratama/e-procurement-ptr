import { create } from 'zustand';

interface SPTTahunan {
  id: number;
  tahun: number;
  nomorSPT: number;
  tanggal: string;
}

interface SptTahunanState {
  sptTahunan: SPTTahunan[];
  addSPTTahunan: (sptTahunan: SPTTahunan) => void;
  editSPTTahunan: (sptTahunan: SPTTahunan) => void;
  removeSPTTahunan: (id: number) => void;
  initializeSPTTahunan: (landasanHukum: SPTTahunan[]) => void;
}

const useSptTahunanStore = create<SptTahunanState>((set) => ({
  sptTahunan: [],
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
}));

export default useSptTahunanStore;