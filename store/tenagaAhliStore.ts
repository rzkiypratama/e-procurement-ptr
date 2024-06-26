import { create } from "zustand";

interface TenagaAhli {
  id: number;
  namaTenagaAhli: string;
  tanggalLahirTenagaAhli: string;
  nomorKtpTenagaAhli: number;
  npwpTenagaAhli: number;
  pendidikanTenagaAhli: string;
  pengalamanTenagaAhli: string;
}

interface TenagaAhliState {
  tenagaAhli: TenagaAhli[];
  addTenagaAhli: (tenagaAhli: TenagaAhli) => void;
  editTenagaAhli: (tenagaAhli: TenagaAhli) => void;
  removeTenagaAhli: (id: number) => void;
  initializeTenagaAhli: (tenagaAhli: TenagaAhli[]) => void;
}

const useTenagaAhliStore = create<TenagaAhliState>((set) => ({
  tenagaAhli: [],
  addTenagaAhli: (tenagaAhli) =>
    set((state) => ({
      tenagaAhli: [...state.tenagaAhli, tenagaAhli],
    })),
  editTenagaAhli: (tenagaAhli) =>
    set((state) => ({
      tenagaAhli: state.tenagaAhli.map((item) =>
        item.id === tenagaAhli.id ? tenagaAhli : item,
      ),
    })),
  removeTenagaAhli: (id) =>
    set((state) => ({
      tenagaAhli: state.tenagaAhli.filter((item) => item.id !== id),
    })),
  initializeTenagaAhli: (tenagaAhli) =>
    set(() => ({
      tenagaAhli,
    })),
}));

export default useTenagaAhliStore;
