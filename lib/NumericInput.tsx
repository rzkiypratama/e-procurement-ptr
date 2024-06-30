import React from "react";
import { InputNumber } from "antd";

// Ini untuk InputNumber Antd agar memiliki behavior seperti Input tapi data terkirim sebagai number

interface NumericInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  onBlur,
  placeholder,
}) => {
  const handleChange = (value: number | null) => {
    if (value !== null) {
      onChange && onChange(value.toString()); // Konversi ke string dan panggil onChange
    } else {
      onChange && onChange(""); // Jika input dihapus
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur && onBlur(e); // Panggil onBlur jika didefinisikan
  };

  return (
    <InputNumber
      value={value !== undefined ? parseInt(value) : undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      style={{ width: "100%" }}
    />
  );
};

export default NumericInput;