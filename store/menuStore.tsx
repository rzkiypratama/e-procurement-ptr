import { create } from 'zustand';

interface ParentMenu {
    menu_name: string;
    urlto: string;
    keterangan: string;
    accessMenu: AccessMenu
    children?: ParentMenu[] | null
}

interface AccessMenu {
    view: boolean;
    add: boolean;
    edit: boolean;
    approve: boolean;
    ignore: boolean;
    export: boolean;
}

interface MenuState {
    menuList: ParentMenu[];
    initializeMenuList: (menuList: ParentMenu[]) => void;
}

const useMenuStore = create<MenuState>((set) => ({
    menuList: [],
    initializeMenuList: (menuList) => set(() => ({
        menuList,
    }))
}));

export default useMenuStore;