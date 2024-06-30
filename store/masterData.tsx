import { create } from 'zustand';

interface MasterData {
    name: string;
    status: boolean;
}

interface MasterDataList {
    id: number;
    name: string;
    statusName: string;
    status: boolean;
}

interface MasterDataState {
    masterData: MasterData;
    masterDataList: MasterDataList[];
    setMasterData: (masterData: MasterData) => void;
    isFormValid: boolean;
    setFormValid: (isValid: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    initializeMasterDataList: (masterDataList: MasterDataList[]) => void;
    addMasterDataList: (masterDataList: MasterDataList) => void;
    removeItem: (index: number) => void;
}

const useMasterDataStore = create<MasterDataState>((set) => ({
    masterData: {
        name: "",
        status: false,
    },
    masterDataList: [],
    setMasterData: (masterData) => set({ masterData: masterData }),
    isFormValid: false,
    setFormValid: (isValid) => set({ isFormValid: isValid }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    initializeMasterDataList: (masterDataList) => set((state) => ({
        masterDataList,
    })),
    addMasterDataList: (masterDataList) => set((state) => ({
        masterDataList: [...state.masterDataList, masterDataList],
    })),
    removeItem: (selectedIndex) => set((state) => ({
        masterDataList: state.masterDataList.filter((ele, index) => index !== selectedIndex)
    }))
}));

export default useMasterDataStore;