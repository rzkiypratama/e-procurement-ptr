import { create } from 'zustand';

interface IzinUsaha {
  id: number;
  jenisIzin: string;
  nomorIzin: number;
  tanggalIzin: string;
  tanggalBerakhir: string;
  instansiPemberiIzin: string;
  instansiBerlakuIzinUsaha: string;
  bidangUsaha: string;
}

interface IzinUsahaState {
  izinUsaha: IzinUsaha[];
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  addIzinUsaha: (izinUsaha: IzinUsaha) => void;
  editIzinUsaha: (izinUsaha: IzinUsaha) => void;
  removeIzinUsaha: (id: number) => void;
  initializeIzinUsaha: (izinUsaha: IzinUsaha[]) => void;
}

const useIzinUsahaStore = create<IzinUsahaState>((set) => ({
  izinUsaha: [],
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  addIzinUsaha: (izinUsaha) => set((state) => ({
    izinUsaha: [...state.izinUsaha, izinUsaha],
    isLoading: false,
  })),
  editIzinUsaha: (izinUsaha) => set((state) => ({
    izinUsaha: state.izinUsaha.map((item) => item.id === izinUsaha.id ? izinUsaha : item),
    isLoading: false,
  })),
  removeIzinUsaha: (id) => set((state) => ({
    izinUsaha: state.izinUsaha.filter((item) => item.id !== id),
    isLoading: false,
  })),
  initializeIzinUsaha: (izinUsaha) => set(() => ({
    izinUsaha,
    isLoading: false,
  })),
}));

export default useIzinUsahaStore;