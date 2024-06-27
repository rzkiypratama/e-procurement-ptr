'use client'
import { useState } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  // Retrieve the stored value from localStorage (if available)
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  // Initialize state with the retrieved value or the initial value
  const [value, setValue] = useState<T>(initial);

  // Update localStorage with the new value whenever the state changes
  const updateValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
};

export default useLocalStorage;