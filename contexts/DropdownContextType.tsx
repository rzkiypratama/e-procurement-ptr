// contexts/DropdownContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface DropdownContextType {
  openKeys: string[];
  setOpenKeys: (keys: string[]) => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const DropdownProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  useEffect(() => {
    const storedOpenKeys = localStorage.getItem('openKeys');
    if (storedOpenKeys) {
      setOpenKeys(JSON.parse(storedOpenKeys));
    }
  }, []);

  const updateOpenKeys = (keys: string[]) => {
    setOpenKeys(keys);
    localStorage.setItem('openKeys', JSON.stringify(keys));
  };

  return (
    <DropdownContext.Provider value={{ openKeys, setOpenKeys: updateOpenKeys }}>
      {children}
    </DropdownContext.Provider>
  );
};

export const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a DropdownProvider');
  }
  return context;
};