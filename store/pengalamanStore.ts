import { create } from "zustand";

interface Pengalaman {
  id: number;
  namaPekerjaan: string;
  bidangPekerjaan: string;
  lokasiPekerjaan: string;
}

interface PengalamanState {
  pengalaman: Pengalaman[];
  addPengalaman: (pengalaman: Pengalaman) => void;
  editPengalaman: (pengalaman: Pengalaman) => void;
  removePengalaman: (id: number) => void;
  initializePengalaman: (pengalaman: Pengalaman[]) => void;
}

const usePengalamanStore = create<PengalamanState>((set) => ({
    pengalaman: [],
    addPengalaman: (pengalaman) =>
      set((state) => ({
        pengalaman: [...state.pengalaman, pengalaman],
      })),
    editPengalaman: (pengalaman) =>
      set((state) => ({
        pengalaman: state.pengalaman.map((item) =>
          item.id === pengalaman.id ? pengalaman : item,
        ),
      })),
    removePengalaman: (id) =>
      set((state) => ({
        pengalaman: state.pengalaman.filter((item) => item.id !== id),
      })),
    initializePengalaman: (pengalaman) =>
      set(() => ({
        pengalaman,
      })),
  }));

  export default usePengalamanStore;