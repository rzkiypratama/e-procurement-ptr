import React from "react";
import { Input } from "antd";

// Ini untuk Input Antd agar memiliki behavior seperti input number tapi data terkirim sebagai string

interface NumericInputProps {
  value?: number | string; // Mengizinkan value bertipe number atau string
  onChange?: (value: number | undefined) => void;
  placeholder?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numberValue = parseInt(inputValue, 10); // Parse the input value to an integer

    if (!isNaN(numberValue)) {
      onChange && onChange(numberValue); // Invoke onChange if it's defined
    } else if (inputValue === "") {
      onChange && onChange(undefined); // Handle case when input is cleared
    }
  };

  return (
    <Input
      type="number"
      value={typeof value === "number" ? String(value) : value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

export default NumericInput;