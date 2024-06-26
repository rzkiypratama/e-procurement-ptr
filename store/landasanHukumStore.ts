import { create } from 'zustand';

interface LandasanHukum {
  id: number;
  nomorDokumen: number;
  namaNotaris: string;
  tahunDokumen: string;
}

interface LandasanHukumState {
  landasanHukum: LandasanHukum[];
  addLandasanHukum: (landasanHukum: LandasanHukum) => void;
  editLandasanHukum: (landasanHukum: LandasanHukum) => void;
  removeLandasanHukum: (id: number) => void;
  initializeLandasanHukum: (landasanHukum: LandasanHukum[]) => void;
}

const useLandasanHukumStore = create<LandasanHukumState>((set) => ({
  landasanHukum: [],
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
}));

export default useLandasanHukumStore;