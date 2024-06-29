import { create } from 'zustand';

interface Currency {
    code: string;
    name: string;
    status: boolean;
}

interface CurrencyList {
    id: number;
    code: string;
    name: string;
    statusName: string;
    status: boolean;
}

interface CurrencyState {
    currencyData: Currency;
    currencyDataList: CurrencyList[];
    setCurrency: (currencyData: Currency) => void;
    isFormValid: boolean;
    setFormValid: (isValid: boolean) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    initializeCurrencyList: (currencyDataList: CurrencyList[]) => void;
    addCurrencyList: (currencyDataList: CurrencyList) => void;
    removeItem: (index: number) => void;
}

const useCurrencyStore = create<CurrencyState>((set) => ({
    currencyData: {
        code: "",
        name: "",
        status: false,
    },
    currencyDataList: [],
    setCurrency: (currencyData) => set({ currencyData: currencyData }),
    isFormValid: false,
    setFormValid: (isValid) => set({ isFormValid: isValid }),
    loading: false,
    setLoading: (loading) => set({ loading }),
    initializeCurrencyList: (currencyDataList) => set((state) => ({
        currencyDataList,
    })),
    addCurrencyList: (currencyDataList) => set((state) => ({
        currencyDataList: [...state.currencyDataList, currencyDataList],
    })),
    removeItem: (selectedIndex) => set((state) => ({
        currencyDataList: state.currencyDataList.filter((ele, index) => index !== selectedIndex)
    }))
}));

export default useCurrencyStore;