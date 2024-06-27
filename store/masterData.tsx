import { create } from 'zustand';

interface MasterData {
    id: number;
    name: string;
    status: string;
}

interface MasterDataState {
    masterDatas: MasterData[];
    addMasterData: (masterDatas: MasterData) => void;
    editMasterData: (masterDatas: MasterData) => void;
    removeMasterData: (id: number) => void;
    initializeMasterData: (masterDatas: MasterData[]) => void;
}

const useMasterDataStore = create<MasterDataState>((set) => ({
    masterDatas: [],
    addMasterData: (masterDatas) => set((state) => ({
        masterDatas: [...state.masterDatas, masterDatas],
    })),
    editMasterData: (masterDatas) => set((state) => ({
        masterDatas: state.masterDatas.map((item) => item.id === masterDatas.id ? masterDatas : item),
    })),
    removeMasterData: (id) => set((state) => ({
        masterDatas: state.masterDatas.filter((item) => item.id !== id),
    })),
    initializeMasterData: (masterDatas) => set(() => ({
        masterDatas,
    })),
}));

export default useMasterDataStore;