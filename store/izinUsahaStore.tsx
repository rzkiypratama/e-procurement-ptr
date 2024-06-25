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
  addIzinUsaha: (izinUsaha: IzinUsaha) => void;
  editIzinUsaha: (izinUsaha: IzinUsaha) => void;
  removeIzinUsaha: (id: number) => void;
  initializeIzinUsaha: (izinUsaha: IzinUsaha[]) => void;
}

const useIzinUsahaStore = create<IzinUsahaState>((set) => ({
  izinUsaha: [],
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
}));

export default useIzinUsahaStore;