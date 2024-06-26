import { create } from 'zustand';

interface PengurusPerusahaan {
  id: number;
  namaPengurus: string;
  jabatanPengurus: string;
  noKTPPengurus: number;
  npwpPengurus: number;
}
interface PengurusPerusahaanState {
  pengurusPerusahaan: PengurusPerusahaan[];
  addPengurusPerusahaan: (pengurusPerusahaan: PengurusPerusahaan) => void;
  editPengurusPerusahaan: (pengurusPerusahaan: PengurusPerusahaan) => void;
  removePengurusPerusahaan: (id: number) => void;
  initializePengurusPerusahaan: (pengurusPerusahaan: PengurusPerusahaan[]) => void;
}

const usePengurusPerusahaanStore = create<PengurusPerusahaanState>((set) => ({
  pengurusPerusahaan: [],
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
}));

export default usePengurusPerusahaanStore;