// components/InputField.tsx
// import { useState } from "react";

interface InputFieldProps {
  id: number;
  value: string;
  placeholder: string;
  onChange: (id: number, value: string) => void;
  onSubmit: (id: number) => void;
}

const InputField = ({ id, value, placeholder, onChange, onSubmit }: InputFieldProps) => {
  return (
    <div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
      />
      <button onClick={() => onSubmit(id)}>Submit</button>
    </div>
  );
};

export default InputField;