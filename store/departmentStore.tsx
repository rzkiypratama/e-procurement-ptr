import { create } from 'zustand';

interface Department {
    id: number;
    department_name: string;
    department_code: string;
}

interface DepartmentState {
    department: Department;
    departmentList: Department[];
    initializeDepartmentList: (department: Department[]) => void;
    addDepartmentList: (department: Department) => void;
    removeItem: (index: number) => void;
}

const useDepartmentStore = create<DepartmentState>((set) => ({
    department: {
        id: 0,
        department_name: "",
        department_code: "",
    },
    departmentList: [],
    initializeDepartmentList: (departmentList) => set((state) => ({
        departmentList,
    })),
    addDepartmentList: (departmentList) => set((state) => ({
        departmentList: [...state.departmentList, departmentList],
    })),
    removeItem: (selectedIndex) => set((state) => ({
        departmentList: state.departmentList.filter((ele, index) => index !== selectedIndex)
    }))
}));

export default useDepartmentStore;